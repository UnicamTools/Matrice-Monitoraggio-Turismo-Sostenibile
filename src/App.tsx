import React, { useState, useEffect, useMemo } from 'react';
import { Navbar } from './components/Navbar';
import { MatrixExplorer } from './components/MatrixExplorer';
import { IndicatorCalculator } from './components/IndicatorCalculator';
import { TrendDashboard } from './components/TrendDashboard';
import { DataManagement } from './components/DataManagement';
import { HelpModal } from './components/HelpModal';
import { AddYearModal } from './components/AddYearModal';
import { PrivacyBannerAndModal } from './components/PrivacyBannerAndModal';
import { ShieldCheck } from 'lucide-react';
import { IndicatorRecord, MunicipalityName, MUNICIPALITIES } from './types';
import { INITIAL_SAMPLE_RECORDS } from './data/sampleHistory';
import { getAllCalculableIndicators } from './data/matrixData';
import {
  getSharedParamDefinition,
  SHARED_PARAM_DEFINITIONS,
  syncRecordsWithSharedParam,
} from './utils/sharedVariables';
import {
  loadRecordsFromStorage,
  saveRecordsToStorage,
  loadActiveMunicipality,
  saveActiveMunicipality,
  saveDemoBaselineToStorage,
  loadDemoBaselineFromStorage,
  loadCustomYearsFromStorage,
  saveCustomYearsToStorage,
  getAllAvailableYears,
  BASELINE_YEARS,
} from './utils/calculator';

export default function App() {
  const [activeTab, setActiveTab] = useState<'matrix' | 'calculator' | 'trend' | 'data'>('matrix');
  const [selectedOutputCode, setSelectedOutputCode] = useState<string>('CTX-1');
  const [selectedYear, setSelectedYear] = useState<number>(2026);
  const [isHelpOpen, setIsHelpOpen] = useState<boolean>(false);
  const [isAddYearModalOpen, setIsAddYearModalOpen] = useState<boolean>(false);
  const [isPrivacyModalOpen, setIsPrivacyModalOpen] = useState<boolean>(false);

  // Custom years added by the user beyond baseline
  const [customYears, setCustomYears] = useState<number[]>(() => loadCustomYearsFromStorage());

  // Active municipality state (Montecassiano, Montefano, Montelupone)
  const [selectedMunicipality, setSelectedMunicipality] = useState<MunicipalityName>(() => {
    return loadActiveMunicipality();
  });

  const handleSelectMunicipality = (m: MunicipalityName) => {
    setSelectedMunicipality(m);
    saveActiveMunicipality(m);
  };

  // Initialize records from storage or pristine baseline, preserved across Remixes and renames
  const [records, setRecords] = useState<IndicatorRecord[]>(() => {
    const loaded = loadRecordsFromStorage();
    if (loaded && loaded.length > 0) {
      const existingKeys = new Set(
        loaded.map(
          (r) => `${r.municipality || 'Comune di Montecassiano'}-${r.year}-${r.code}`
        )
      );
      const missingFromBaseline = INITIAL_SAMPLE_RECORDS.filter(
        (base) =>
          !existingKeys.has(
            `${base.municipality || 'Comune di Montecassiano'}-${base.year}-${base.code}`
          )
      );
      if (missingFromBaseline.length > 0) {
        return [...loaded, ...missingFromBaseline];
      }
      return loaded;
    }
    return INITIAL_SAMPLE_RECORDS;
  });

  // Dynamically derive all available years from baseline (2023..2027), records, and custom user years
  const availableYears = useMemo(() => {
    return getAllAvailableYears(records, customYears);
  }, [records, customYears]);

  // Handler to add a new future year
  const handleAddYear = (newYear: number) => {
    if (!newYear || isNaN(newYear) || newYear < 2000 || newYear > 2100) return;
    if (!customYears.includes(newYear) && !BASELINE_YEARS.includes(newYear)) {
      const updated = [...customYears, newYear].sort((a, b) => a - b);
      setCustomYears(updated);
      saveCustomYearsToStorage(updated);
    }
    setSelectedYear(newYear);
  };

  // Handler to remove a custom year if it has no associated records
  const handleRemoveYear = (yearToRemove: number) => {
    if (BASELINE_YEARS.includes(yearToRemove)) return;
    const hasRecords = records.some((r) => r.year === yearToRemove);
    if (hasRecords) return;
    const updated = customYears.filter((y) => y !== yearToRemove);
    setCustomYears(updated);
    saveCustomYearsToStorage(updated);
    if (selectedYear === yearToRemove) {
      setSelectedYear(2026);
    }
  };

  // Save records to localStorage
  useEffect(() => {
    saveRecordsToStorage(records);
  }, [records]);

  // Navigate to calculator tab with preselected output code
  const handleSelectIndicatorForCalculation = (code: string) => {
    setSelectedOutputCode(code);
    setActiveTab('calculator');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Synchronize shared parameters across all records for a municipality and year
  const handleSyncSharedParam = (
    municipality: MunicipalityName,
    year: number,
    paramKey: string,
    newValue: number
  ) => {
    setRecords((prev) => {
      const calcMap = Object.fromEntries(
        getAllCalculableIndicators().map((ind) => [ind.code, ind.calculate])
      );
      const { updatedRecords } = syncRecordsWithSharedParam(
        prev,
        municipality,
        year,
        paramKey,
        newValue,
        calcMap
      );
      return updatedRecords;
    });
  };

  // Add or update record scoped to municipality, code and year
  const handleSaveRecord = (newRecord: IndicatorRecord) => {
    setRecords((prev) => {
      // replace if same code, year and municipality, or append
      const existingIdx = prev.findIndex(
        (r) =>
          r.code === newRecord.code &&
          r.year === newRecord.year &&
          (r.municipality === newRecord.municipality ||
            (!r.municipality && newRecord.municipality === 'Comune di Montecassiano'))
      );
      let baseRecords: IndicatorRecord[];
      if (existingIdx >= 0) {
        baseRecords = [...prev];
        baseRecords[existingIdx] = newRecord;
      } else {
        baseRecords = [newRecord, ...prev];
      }

      // If record is not 'n.d.', propagate all shared parameters used to other indicators
      if (!newRecord.isNotAvailable && newRecord.paramsUsed) {
        const calcMap = Object.fromEntries(
          getAllCalculableIndicators().map((ind) => [ind.code, ind.calculate])
        );

        const recordMun: MunicipalityName =
          newRecord.municipality || 'Comune di Montecassiano';

        let synchronized = baseRecords;
        for (const [key, val] of Object.entries(newRecord.paramsUsed)) {
          if (typeof val === 'number' && getSharedParamDefinition(key)) {
            const res = syncRecordsWithSharedParam(
              synchronized,
              recordMun,
              newRecord.year,
              key,
              val,
              calcMap
            );
            synchronized = res.updatedRecords;
          }
        }

        // Also check if this record is itself a direct indicator (CTX-1, CTX-2, CTX-14)
        const directDef = Object.values(SHARED_PARAM_DEFINITIONS).find(
          (d) => d.directIndicatorCode === newRecord.code
        );
        if (directDef && typeof newRecord.calculatedValue === 'number') {
          const res = syncRecordsWithSharedParam(
            synchronized,
            recordMun,
            newRecord.year,
            directDef.key,
            newRecord.calculatedValue,
            calcMap
          );
          synchronized = res.updatedRecords;
        }

        return synchronized;
      }

      return baseRecords;
    });
  };

  // Delete record by ID
  const handleDeleteRecord = (id: string) => {
    setRecords((prev) => prev.filter((r) => r.id !== id));
  };

  // Import external records
  const handleImportRecords = (newRecords: IndicatorRecord[]) => {
    setRecords(newRecords);
    saveRecordsToStorage(newRecords);
  };

  // Reset to initial dataset (all 870 observations for Montecassiano, Montefano, Montelupone)
  const handleResetToDemo = () => {
    setRecords(INITIAL_SAMPLE_RECORDS);
    saveRecordsToStorage(INITIAL_SAMPLE_RECORDS);
    saveDemoBaselineToStorage(INITIAL_SAMPLE_RECORDS);
  };

  // Municipality info for active background color
  const currentMun =
    MUNICIPALITIES.find((m) => m.name === selectedMunicipality) || MUNICIPALITIES[0];

  // Synchronize document body background for seamless overscroll
  useEffect(() => {
    const isDark =
      typeof window !== 'undefined' &&
      (document.documentElement.classList.contains('dark') ||
        window.matchMedia('(prefers-color-scheme: dark)').matches);
    document.body.style.backgroundColor = isDark
      ? currentMun.appBgDarkHex
      : currentMun.appBgHex;
  }, [currentMun]);

  return (
    <div
      className={`min-h-screen font-sans text-zinc-900 dark:text-zinc-100 flex flex-col selection:bg-amber-500 selection:text-white transition-colors duration-300 ${currentMun.appBgClass}`}
    >
      {/* Navbar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        selectedYear={selectedYear}
        setSelectedYear={setSelectedYear}
        availableYears={availableYears}
        totalRecordsCount={records.length}
        selectedMunicipality={selectedMunicipality}
        setSelectedMunicipality={handleSelectMunicipality}
        onOpenHelpModal={() => setIsHelpOpen(true)}
        onOpenAddYearModal={() => setIsAddYearModalOpen(true)}
      />

      {/* Main Content Body */}
      <main className="flex-1 mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 py-6">
        {activeTab === 'matrix' && (
          <MatrixExplorer
            onSelectIndicatorForCalculation={handleSelectIndicatorForCalculation}
          />
        )}

        {activeTab === 'calculator' && (
          <IndicatorCalculator
            selectedOutputCode={selectedOutputCode}
            setSelectedOutputCode={setSelectedOutputCode}
            selectedYear={selectedYear}
            setSelectedYear={setSelectedYear}
            availableYears={availableYears}
            onSaveRecord={handleSaveRecord}
            onSyncSharedParam={handleSyncSharedParam}
            records={records}
            selectedMunicipality={selectedMunicipality}
            setSelectedMunicipality={handleSelectMunicipality}
            onOpenAddYearModal={() => setIsAddYearModalOpen(true)}
          />
        )}

        {activeTab === 'trend' && (
          <TrendDashboard
            records={records}
            selectedYear={selectedYear}
            availableYears={availableYears}
            onDeleteRecord={handleDeleteRecord}
            onSelectIndicatorForCalculation={handleSelectIndicatorForCalculation}
            selectedMunicipality={selectedMunicipality}
            setSelectedMunicipality={handleSelectMunicipality}
            onOpenAddYearModal={() => setIsAddYearModalOpen(true)}
          />
        )}

        {activeTab === 'data' && (
          <DataManagement
            records={records}
            onImportRecords={handleImportRecords}
            onResetToDemo={handleResetToDemo}
            selectedYear={selectedYear}
            setSelectedYear={setSelectedYear}
            availableYears={availableYears}
            onAddYear={handleAddYear}
            onRemoveYear={handleRemoveYear}
            selectedMunicipality={selectedMunicipality}
            setSelectedMunicipality={handleSelectMunicipality}
            onOpenAddYearModal={() => setIsAddYearModalOpen(true)}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-zinc-200 bg-white py-6 dark:border-zinc-800 dark:bg-zinc-900 mt-auto">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-zinc-500 dark:text-zinc-400">
          <div>
            <span className="font-bold text-zinc-800 dark:text-zinc-200">
              Matrice di Monitoraggio del Turismo Sostenibile
            </span>{' '}
            — Montecassiano · Montefano · Montelupone
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <span>Sistema di monitoraggio temporale e benchmarking intercomunale</span>
            <span className="hidden sm:inline text-zinc-300 dark:text-zinc-700">|</span>
            <button
              type="button"
              id="footer-privacy-btn"
              onClick={() => setIsPrivacyModalOpen(true)}
              className="inline-flex items-center gap-1 font-semibold text-emerald-700 hover:text-emerald-800 dark:text-emerald-400 dark:hover:text-emerald-300 hover:underline cursor-pointer"
            >
              <ShieldCheck className="h-3.5 w-3.5" />
              <span>Informativa Privacy & Risorse Esterne (PA)</span>
            </button>
          </div>
        </div>
      </footer>

      {/* Help Modal */}
      <HelpModal isOpen={isHelpOpen} onClose={() => setIsHelpOpen(false)} />

      {/* Add Year Modal */}
      <AddYearModal
        isOpen={isAddYearModalOpen}
        onClose={() => setIsAddYearModalOpen(false)}
        onAddYear={handleAddYear}
        availableYears={availableYears}
      />

      {/* Privacy Banner & Modal conforme PA */}
      <PrivacyBannerAndModal
        isModalOpen={isPrivacyModalOpen}
        setIsModalOpen={setIsPrivacyModalOpen}
      />
    </div>
  );
}
