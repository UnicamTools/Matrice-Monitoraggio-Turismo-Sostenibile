import React from 'react';
import {
  Table,
  Calculator,
  TrendingUp,
  FileSpreadsheet,
  Calendar,
  Layers,
  CheckCircle2,
  HelpCircle,
  Building2,
  ChevronDown,
} from 'lucide-react';
import { MunicipalityName, MUNICIPALITIES } from '../types';

interface NavbarProps {
  activeTab: 'matrix' | 'calculator' | 'trend' | 'data';
  setActiveTab: (tab: 'matrix' | 'calculator' | 'trend' | 'data') => void;
  selectedYear: number;
  setSelectedYear: (year: number) => void;
  availableYears: number[];
  totalRecordsCount: number;
  selectedMunicipality: MunicipalityName;
  setSelectedMunicipality: (municipality: MunicipalityName) => void;
  onOpenHelpModal: () => void;
  onOpenAddYearModal: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  selectedYear,
  setSelectedYear,
  availableYears,
  totalRecordsCount,
  selectedMunicipality,
  setSelectedMunicipality,
  onOpenHelpModal,
  onOpenAddYearModal,
}) => {
  const currentMunInfo =
    MUNICIPALITIES.find((m) => m.name === selectedMunicipality) || MUNICIPALITIES[0];

  return (
    <header className="sticky top-0 z-30 border-b border-zinc-200 bg-white/95 backdrop-blur-md dark:border-zinc-800 dark:bg-zinc-900/95 shadow-xs">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-3 py-3 md:flex-row md:items-center md:justify-between">
          {/* Logo & Title */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-amber-600 text-white shadow-sm shadow-amber-500/20">
                <Layers className="h-5 w-5" />
              </div>
              <div>
                <h1 className="text-base sm:text-lg font-bold tracking-tight text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
                  Matrice Monitoraggio Turismo Sostenibile
                </h1>
                <p className="text-xs text-zinc-500 dark:text-zinc-400 hidden sm:block">
                  Montecassiano · Montefano · Montelupone — Calcolo indicatori e monitoraggio
                </p>
              </div>
            </div>

            {/* Help & Info button mobile */}
            <button
              onClick={onOpenHelpModal}
              className="md:hidden flex h-9 w-9 items-center justify-center rounded-lg border border-zinc-200 text-zinc-600 hover:bg-zinc-50 dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-800"
              title="Guida all'Uso"
            >
              <HelpCircle className="h-4 w-4" />
            </button>
          </div>

          {/* Right Controls: Utente / Comune Selector + Year + Stats */}
          <div className="flex flex-wrap items-center justify-between md:justify-end gap-2.5 border-t md:border-t-0 pt-2.5 md:pt-0 border-zinc-100 dark:border-zinc-800">
            {/* Selettore Utente / Comune con sotto-etichetta colorata del Comune */}
            <div className="flex items-center gap-2 bg-amber-50/90 dark:bg-amber-950/40 px-2.5 sm:px-3 py-1.5 rounded-xl border border-amber-200 dark:border-amber-800/60 shadow-2xs">
              <div className="flex items-center gap-1.5">
                <Building2 className="h-4 w-4 text-amber-600 dark:text-amber-400" />
                <span className="text-xs font-bold text-amber-900 dark:text-amber-200 hidden sm:inline">
                  Utente / Ente:
                </span>
              </div>
              {/* Sotto-etichetta interna colorata con il colore specifico del Comune */}
              <div
                className="relative inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-lg border transition-all duration-150"
                style={{
                  backgroundColor: `${currentMunInfo.colorHex}18`,
                  borderColor: `${currentMunInfo.colorHex}55`,
                }}
              >
                <span
                  className="w-2 h-2 rounded-full shrink-0 shadow-xs"
                  style={{ backgroundColor: currentMunInfo.colorHex }}
                />
                <div className="relative inline-block pr-4">
                  <select
                    value={selectedMunicipality}
                    onChange={(e) => setSelectedMunicipality(e.target.value as MunicipalityName)}
                    className="bg-transparent text-xs sm:text-sm font-black pr-1 focus:outline-none cursor-pointer"
                    style={{ color: currentMunInfo.textHex || currentMunInfo.colorHex }}
                    title="Seleziona Utente / Ente"
                  >
                    {MUNICIPALITIES.map((mun) => (
                      <option
                        key={mun.id}
                        value={mun.name}
                        className="text-zinc-900 bg-white dark:bg-zinc-900 dark:text-zinc-100 font-bold"
                      >
                        {mun.name}
                      </option>
                    ))}
                  </select>
                  <ChevronDown
                    className="pointer-events-none absolute right-0 top-1/2 -translate-y-1/2 h-3.5 w-3.5"
                    style={{ color: currentMunInfo.textHex || currentMunInfo.colorHex }}
                  />
                </div>
              </div>
            </div>

            {/* Selettore Anno con opzione integrata in fondo per aggiungere annualità */}
            <div className="flex items-center gap-2 bg-amber-50/90 dark:bg-amber-950/40 px-3 py-1.5 rounded-xl border border-amber-200 dark:border-amber-800/60">
              <Calendar className="h-4 w-4 text-amber-600 dark:text-amber-400" />
              <span className="text-xs font-bold text-amber-900 dark:text-amber-200">Anno:</span>
              <div className="relative inline-block">
                <select
                  value={selectedYear}
                  onChange={(e) => {
                    if (e.target.value === 'ADD_NEW_YEAR') {
                      onOpenAddYearModal();
                    } else {
                      setSelectedYear(Number(e.target.value));
                    }
                  }}
                  className="bg-transparent text-xs sm:text-sm font-black text-amber-950 dark:text-amber-100 pr-5 focus:outline-none cursor-pointer"
                >
                  {availableYears.map((yr) => (
                    <option
                      key={yr}
                      value={yr}
                      className="text-zinc-900 bg-white dark:bg-zinc-900 dark:text-zinc-100 font-bold"
                    >
                      {yr}
                    </option>
                  ))}
                  <option
                    value="ADD_NEW_YEAR"
                    className="font-bold text-amber-800 dark:text-amber-300 bg-amber-50 dark:bg-zinc-900"
                  >
                    + Aggiungi nuova annualità...
                  </option>
                </select>
                <ChevronDown className="pointer-events-none absolute right-0 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-amber-600 dark:text-amber-400" />
              </div>
            </div>

            {/* Total Records Counter */}
            <div className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-100/70 dark:bg-amber-950/50 border border-amber-200 dark:border-amber-800/60 text-amber-900 dark:text-amber-200 text-xs font-bold">
              <CheckCircle2 className="h-3.5 w-3.5 text-amber-600 dark:text-amber-400" />
              <span>
                <strong>{totalRecordsCount}</strong> Rilevazioni
              </span>
            </div>

            <button
              onClick={onOpenHelpModal}
              className="hidden md:flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-xl border border-zinc-200 hover:bg-amber-50 hover:text-amber-900 text-zinc-700 dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-800 transition-colors"
            >
              <HelpCircle className="h-3.5 w-3.5 text-amber-600" />
              <span>Guida</span>
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <nav className="flex space-x-1 sm:space-x-2 border-t border-zinc-100 dark:border-zinc-800/80 pt-2 overflow-x-auto pb-2 scrollbar-none">
          <button
            onClick={() => setActiveTab('matrix')}
            className={`flex items-center gap-2 px-3 sm:px-4 py-2 text-xs sm:text-sm font-bold rounded-lg transition-all whitespace-nowrap cursor-pointer ${
              activeTab === 'matrix'
                ? 'bg-amber-600 text-white shadow-sm shadow-amber-600/30 ring-1 ring-amber-500'
                : 'text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-zinc-200'
            }`}
          >
            <Table className="h-4 w-4" />
            <span>Matrice Logica</span>
          </button>

          <button
            onClick={() => setActiveTab('calculator')}
            className={`flex items-center gap-2 px-3 sm:px-4 py-2 text-xs sm:text-sm font-bold rounded-lg transition-all whitespace-nowrap cursor-pointer ${
              activeTab === 'calculator'
                ? 'bg-amber-600 text-white shadow-sm shadow-amber-600/30 ring-1 ring-amber-500'
                : 'text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-zinc-200'
            }`}
          >
            <Calculator className="h-4 w-4" />
            <span>Calcolatore Indicatori</span>
          </button>

          <button
            onClick={() => setActiveTab('trend')}
            className={`flex items-center gap-2 px-3 sm:px-4 py-2 text-xs sm:text-sm font-bold rounded-lg transition-all whitespace-nowrap cursor-pointer ${
              activeTab === 'trend'
                ? 'bg-amber-600 text-white shadow-sm shadow-amber-600/30 ring-1 ring-amber-500'
                : 'text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-zinc-200'
            }`}
          >
            <TrendingUp className="h-4 w-4" />
            <span>Monitoraggio & Trend</span>
          </button>

          <button
            onClick={() => setActiveTab('data')}
            className={`flex items-center gap-2 px-3 sm:px-4 py-2 text-xs sm:text-sm font-bold rounded-lg transition-all whitespace-nowrap cursor-pointer ${
              activeTab === 'data'
                ? 'bg-amber-600 text-white shadow-sm shadow-amber-600/30 ring-1 ring-amber-500'
                : 'text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-zinc-200'
            }`}
          >
            <FileSpreadsheet className="h-4 w-4" />
            <span>Gestione Dati & Report</span>
          </button>
        </nav>
      </div>
    </header>
  );
};
