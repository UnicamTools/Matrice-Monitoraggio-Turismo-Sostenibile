import React, { useState, useMemo } from 'react';
import { IndicatorRecord, MunicipalityName, MUNICIPALITIES } from '../types';
import {
  CONTEXT_ANALYSIS_SECTIONS,
  INTERVENTION_PERSPECTIVES,
  DIMENSIONS,
  getAllCalculableIndicators,
  getCalculableIndicatorByCode,
} from '../data/matrixData';
import { evaluateIndicatorStatus, evaluateProgrammingTarget, formatValueWithUnit, getAllAvailableYears } from '../utils/calculator';
import { IntermunicipalComparison } from './IntermunicipalComparison';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ReferenceLine,
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
} from 'recharts';
import {
  TrendingUp,
  Calendar,
  Layers,
  ArrowUpRight,
  ArrowDownRight,
  Clock,
  Filter,
  Trash2,
  Target,
  Compass,
  Activity,
  Building2,
  Scale,
  Sparkles,
  AlertCircle,
  Info,
  Plus,
} from 'lucide-react';

interface TrendDashboardProps {
  records: IndicatorRecord[];
  selectedYear: number;
  availableYears?: number[];
  onDeleteRecord: (id: string) => void;
  onSelectIndicatorForCalculation: (code: string) => void;
  selectedMunicipality: MunicipalityName;
  setSelectedMunicipality: (municipality: MunicipalityName) => void;
  onOpenAddYearModal?: () => void;
}

export const TrendDashboard: React.FC<TrendDashboardProps> = ({
  records,
  selectedYear,
  availableYears,
  onDeleteRecord,
  onSelectIndicatorForCalculation,
  selectedMunicipality,
  setSelectedMunicipality,
  onOpenAddYearModal,
}) => {
  // View mode switcher: 'single' = Risultati Separati Ente | 'comparison' = Grafici di Confronto Intercomunale
  const [dashboardViewMode, setDashboardViewMode] = useState<'single' | 'comparison'>('single');

  // Unified Macro Structure Switcher: 'context' | 'interventions' (default 'context')
  const [macroSection, setMacroSection] = useState<'context' | 'interventions'>('context');

  // Chart indicator selection
  const [activeMetricFilter, setActiveMetricFilter] = useState<string>('CTX-1');

  // Table filters
  const [contextDimensionFilter, setContextDimensionFilter] = useState<string>('all');
  const [interventionDirectionFilter, setInterventionDirectionFilter] = useState<string>('all');

  const currentMunInfo =
    MUNICIPALITIES.find((m) => m.name === selectedMunicipality) || MUNICIPALITIES[0];

  // Records filtered strictly for the active municipality
  const activeMunRecords = useMemo(() => {
    return records.filter(
      (r) =>
        r.municipality === selectedMunicipality ||
        (!r.municipality && selectedMunicipality === 'Comune di Montecassiano')
    );
  }, [records, selectedMunicipality]);

  const allCalculables = useMemo(() => getAllCalculableIndicators(), []);

  // Unified helper to switch macro section across the entire dashboard
  const handleSwitchMacroSection = (section: 'context' | 'interventions') => {
    setMacroSection(section);
    if (section === 'context') {
      if (!activeMetricFilter.startsWith('CTX-')) {
        setActiveMetricFilter('CTX-1');
      }
    } else {
      if (activeMetricFilter.startsWith('CTX-')) {
        const firstOutput = allCalculables.find((c) => c.level === 'output');
        setActiveMetricFilter(firstOutput?.code || 'TCOE');
      }
    }
  };

  const isContext = macroSection === 'context';
  const radarType = macroSection;
  const comparativeTableSection = macroSection;
  const chartMetricGroup = macroSection === 'context' ? 'context' : 'output';

  // Full sorted list of years available in the system
  const effectiveAvailableYears = useMemo(() => {
    if (availableYears && availableYears.length > 0) {
      return availableYears;
    }
    return getAllAvailableYears(records);
  }, [availableYears, records]);

  const yearsList = effectiveAvailableYears;

  const minAvailableYear = effectiveAvailableYears[0] ?? 2023;
  const maxAvailableYear = effectiveAvailableYears[effectiveAvailableYears.length - 1] ?? 2027;

  // Time interval filter state for the chart
  const [trendStartYear, setTrendStartYear] = useState<number>(() => minAvailableYear);
  const [trendEndYear, setTrendEndYear] = useState<number>(() => maxAvailableYear);

  // Filtered years according to chosen interval
  const chartFilteredYears = useMemo(() => {
    const start = Math.min(trendStartYear, trendEndYear);
    const end = Math.max(trendStartYear, trendEndYear);
    const filtered = effectiveAvailableYears.filter((yr) => yr >= start && yr <= end);
    return filtered.length > 0 ? filtered : effectiveAvailableYears;
  }, [effectiveAvailableYears, trendStartYear, trendEndYear]);

  // Compute multi-year trend data for line chart (filtered for selected municipality and chosen time interval)
  const timeSeriesData = useMemo(() => {
    return chartFilteredYears.map((yr) => {
      const yearRecords = activeMunRecords.filter((r) => r.year === yr);
      const dataObj: Record<string, any> = { year: yr.toString() };

      allCalculables.forEach((calc) => {
        const matching = yearRecords.filter((r) => r.code === calc.code);
        if (matching.length > 0) {
          const validRecs = matching.filter((r) => !r.isNotAvailable && r.calculatedValue !== null);
          if (validRecs.length > 0) {
            const avg = validRecs.reduce((acc, curr) => acc + (curr.calculatedValue ?? 0), 0) / validRecs.length;
            dataObj[calc.code] = Math.round(avg * 100) / 100;
          } else {
            // Marked as n.d.
            dataObj[calc.code] = null;
          }
        } else {
          // Not recorded in this year
          dataObj[calc.code] = null;
        }
      });

      return dataObj;
    });
  }, [chartFilteredYears, activeMunRecords, allCalculables]);

  // Track years where active metric is missing or explicitly marked n.d.
  const missingYearsForActiveMetric = useMemo(() => {
    return timeSeriesData
      .filter((d) => d[activeMetricFilter] === null || d[activeMetricFilter] === undefined)
      .map((d) => d.year);
  }, [timeSeriesData, activeMetricFilter]);

  // Selected year statistics for active municipality
  const currentYearRecords = useMemo(() => {
    return activeMunRecords.filter((r) => r.year === selectedYear);
  }, [activeMunRecords, selectedYear]);

  // 1. Radar data: 4 Dimensioni di Analisi di Contesto (calcolato SOLO su indicatori di contesto con target impostati dall'utente - VIOLA)
  const contextDimensionsRadarData = useMemo(() => {
    return CONTEXT_ANALYSIS_SECTIONS.map((sec) => {
      let totalGoodRatio = 0;
      let count = 0;

      sec.contextIndicators.forEach((ci) => {
        const rec = currentYearRecords.find((r) => r.code === ci.code);
        if (
          rec &&
          !rec.isNotAvailable &&
          rec.calculatedValue !== null &&
          rec.targetValue !== undefined &&
          rec.targetValue !== null &&
          rec.targetValue > 0
        ) {
          count++;
          const score = rec.calculatedValue;
          const direction = rec.targetDirection || 'higher-is-better';
          let ratio = 50;
          if (direction === 'higher-is-better') {
            ratio = Math.min(100, Math.max(0, (score / rec.targetValue) * 100));
          } else {
            ratio = Math.min(100, Math.max(0, (rec.targetValue / Math.max(0.01, score)) * 100));
          }
          totalGoodRatio += ratio;
        }
      });

      const avgScore = count > 0 ? Math.round(totalGoodRatio / count) : 0;

      return {
        key: `Dimensione ${sec.number}`,
        shortKey: `Dim. ${sec.number}`,
        name: `Dimensione ${sec.number}: ${sec.title.split(':')[1]?.trim() || sec.title}`,
        title: sec.title.split(':')[1]?.trim() || sec.title,
        punteggio: avgScore,
        count,
      };
    });
  }, [currentYearRecords]);

  // 2. Radar data: 4 Direzioni di Intervento (calcolato SOLO su indicatori di output con target impostati dall'utente - VERDE)
  const interventionDirectionsRadarData = useMemo(() => {
    return INTERVENTION_PERSPECTIVES.map((dir, idx) => {
      const dirOutputList = allCalculables.filter(
        (c) => c.level === 'output' && c.dimensionId === `dim${idx + 1}`
      );

      let totalGoodRatio = 0;
      let count = 0;

      dirOutputList.forEach((out) => {
        const rec = currentYearRecords.find((r) => r.code === out.code);
        if (
          rec &&
          !rec.isNotAvailable &&
          rec.calculatedValue !== null &&
          rec.targetValue !== undefined &&
          rec.targetValue !== null &&
          rec.targetValue > 0
        ) {
          count++;
          const score = rec.calculatedValue;
          const direction = rec.targetDirection || 'higher-is-better';
          let ratio = 50;
          if (direction === 'higher-is-better') {
            ratio = Math.min(100, Math.max(0, (score / rec.targetValue) * 100));
          } else {
            ratio = Math.min(100, Math.max(0, (rec.targetValue / Math.max(0.01, score)) * 100));
          }
          totalGoodRatio += ratio;
        }
      });

      const avgScore = count > 0 ? Math.round(totalGoodRatio / count) : 0;

      return {
        key: `Direzione ${dir.number}`,
        shortKey: `Dir. ${dir.number}`,
        name: `Direzione ${dir.number}: ${dir.title.split(':')[1]?.trim() || dir.title}`,
        title: dir.title.split(':')[1]?.trim() || dir.title,
        punteggio: avgScore,
        count,
      };
    });
  }, [currentYearRecords, allCalculables]);

  // Context Indicators Table Rows (Focalizzata sulle 4 Dimensioni di Analisi - VIOLA)
  const contextTableRows = useMemo(() => {
    const prevYear = selectedYear - 1;
    const prevYearRecords = activeMunRecords.filter((r) => r.year === prevYear);

    const contextCalculables = allCalculables.filter((c) => c.level === 'context');

    return contextCalculables
      .filter((calc) => {
        if (contextDimensionFilter !== 'all' && calc.dimensionId !== contextDimensionFilter) {
          return false;
        }
        return true;
      })
      .map((calc) => {
        const currentRecs = currentYearRecords.filter((r) => r.code === calc.code);
        const prevRecs = prevYearRecords.filter((r) => r.code === calc.code);

        const currentValidRecs = currentRecs.filter((r) => !r.isNotAvailable && r.calculatedValue !== null);
        const prevValidRecs = prevRecs.filter((r) => !r.isNotAvailable && r.calculatedValue !== null);

        const currentVal =
          currentValidRecs.length > 0
            ? currentValidRecs.reduce((a, b) => a + (b.calculatedValue ?? 0), 0) / currentValidRecs.length
            : null;

        const prevVal =
          prevValidRecs.length > 0
            ? prevValidRecs.reduce((a, b) => a + (b.calculatedValue ?? 0), 0) / prevValidRecs.length
            : null;

        const isCurrentNd = currentRecs.length === 0 || currentRecs.some((r) => r.isNotAvailable || r.calculatedValue === null);
        const isPrevNd = prevRecs.length === 0 || prevRecs.some((r) => r.isNotAvailable || r.calculatedValue === null);

        let diff: number | null = null;
        let pctChange: number | null = null;

        if (currentVal !== null && prevVal !== null && prevVal !== 0) {
          diff = currentVal - prevVal;
          pctChange = (diff / prevVal) * 100;
        }

        const firstRec = currentRecs[0];
        const status =
          currentVal !== null
            ? firstRec?.targetValue !== undefined && firstRec?.targetValue !== null
              ? evaluateProgrammingTarget(
                  currentVal,
                  firstRec.targetValue,
                  firstRec.targetDirection,
                  firstRec.baselineValue,
                  'context'
                )
              : evaluateIndicatorStatus(currentVal, undefined, 'context')
            : null;

        const dim = DIMENSIONS.find((d) => d.id === calc.dimensionId);

        return {
          calc,
          dimensionName: dim ? `Dim. ${dim.number}: ${dim.title}` : '',
          currentVal,
          prevVal,
          isCurrentNd,
          isPrevNd,
          diff,
          pctChange,
          status,
          firstRec,
          recordId: currentRecs[0]?.id,
        };
      });
  }, [allCalculables, currentYearRecords, activeMunRecords, selectedYear, contextDimensionFilter]);

  // Output Indicators Table Rows (Focalizzata sulle 4 Direzioni di Intervento - VERDE)
  const outputTableRows = useMemo(() => {
    const prevYear = selectedYear - 1;
    const prevYearRecords = activeMunRecords.filter((r) => r.year === prevYear);

    const outputCalculables = allCalculables.filter((c) => c.level === 'output');

    return outputCalculables
      .filter((calc) => {
        if (interventionDirectionFilter !== 'all') {
          // Map dir1->dim1, dir2->dim2, dir3->dim3, dir4->dim4
          const targetDimId = interventionDirectionFilter.replace('dir', 'dim');
          if (calc.dimensionId !== targetDimId) return false;
        }
        return true;
      })
      .map((calc) => {
        const currentRecs = currentYearRecords.filter((r) => r.code === calc.code);
        const prevRecs = prevYearRecords.filter((r) => r.code === calc.code);

        const currentValidRecs = currentRecs.filter((r) => !r.isNotAvailable && r.calculatedValue !== null);
        const prevValidRecs = prevRecs.filter((r) => !r.isNotAvailable && r.calculatedValue !== null);

        const currentVal =
          currentValidRecs.length > 0
            ? currentValidRecs.reduce((a, b) => a + (b.calculatedValue ?? 0), 0) / currentValidRecs.length
            : null;

        const prevVal =
          prevValidRecs.length > 0
            ? prevValidRecs.reduce((a, b) => a + (b.calculatedValue ?? 0), 0) / prevValidRecs.length
            : null;

        const isCurrentNd = currentRecs.length === 0 || currentRecs.some((r) => r.isNotAvailable || r.calculatedValue === null);
        const isPrevNd = prevRecs.length === 0 || prevRecs.some((r) => r.isNotAvailable || r.calculatedValue === null);

        let diff: number | null = null;
        let pctChange: number | null = null;

        if (currentVal !== null && prevVal !== null && prevVal !== 0) {
          diff = currentVal - prevVal;
          pctChange = (diff / prevVal) * 100;
        }

        const outFirstRec = currentRecs[0];
        const status =
          currentVal !== null
            ? outFirstRec?.targetValue !== undefined && outFirstRec?.targetValue !== null
              ? evaluateProgrammingTarget(
                  currentVal,
                  outFirstRec.targetValue,
                  outFirstRec.targetDirection,
                  outFirstRec.baselineValue,
                  'output'
                )
              : evaluateIndicatorStatus(currentVal, undefined, 'output')
            : null;

        return {
          calc,
          currentVal,
          prevVal,
          isCurrentNd,
          isPrevNd,
          diff,
          pctChange,
          status,
          firstRec: outFirstRec,
          recordId: currentRecs[0]?.id,
        };
      });
  }, [allCalculables, currentYearRecords, activeMunRecords, selectedYear, interventionDirectionFilter]);

  // Active calculable info for line chart
  const activeCalculableObj = useMemo(() => {
    return getCalculableIndicatorByCode(activeMetricFilter);
  }, [activeMetricFilter]);

  // Active indicator user target (if defined by user in current or latest year for this municipality)
  const activeUserTarget = useMemo(() => {
    const currentRec = currentYearRecords.find((r) => r.code === activeMetricFilter);
    if (currentRec && currentRec.targetValue !== undefined && currentRec.targetValue !== null) {
      return currentRec.targetValue;
    }
    const anyRecWithTarget = [...activeMunRecords].reverse().find(
      (r) => r.code === activeMetricFilter && r.targetValue !== undefined && r.targetValue !== null
    );
    return anyRecWithTarget ? anyRecWithTarget.targetValue : undefined;
  }, [currentYearRecords, activeMunRecords, activeMetricFilter]);

  return (
    <div className="space-y-8">
      {/* SEZIONE SWITCHER PRINCIPALE: RISULTATI SEPARATI PER ENTE vs GRAFICI DI CONFRONTO INTERCOMUNALE */}
      <div className="rounded-2xl border border-zinc-200 bg-white p-4 sm:p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-900 space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-black text-amber-600 dark:text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
                <Activity className="h-4 w-4" />
                <span>Modulo di Valutazione Prestazioni &amp; Trend Storico</span>
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-zinc-900 dark:text-zinc-100 mt-0.5">
              Monitoraggio, Trend &amp; Valutazione
            </h2>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
              Visualizza i risultati analizzando i dati separatamente per singolo comune o esplora i grafici di confronto intercomunale.
            </p>
          </div>

          {/* View Mode Toggle Buttons */}
          <div className="flex items-center p-1 rounded-xl bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 shrink-0">
            <button
              type="button"
              onClick={() => setDashboardViewMode('single')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                dashboardViewMode === 'single'
                  ? 'bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 shadow-sm ring-1 ring-zinc-200 dark:ring-zinc-700'
                  : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200'
              }`}
            >
              <Building2 className="h-4 w-4 text-amber-600" />
              <span>Risultati Singolo Ente</span>
            </button>

            <button
              type="button"
              onClick={() => setDashboardViewMode('comparison')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                dashboardViewMode === 'comparison'
                  ? 'bg-amber-600 text-white shadow-sm ring-1 ring-amber-500'
                  : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200'
              }`}
            >
              <Scale className="h-4 w-4" />
              <span>Grafici di Confronto (3 Comuni)</span>
            </button>
          </div>
        </div>

        {/* Municipality Selector Bar when in 'single' view mode */}
        {dashboardViewMode === 'single' && (
          <div className="pt-3 border-t border-zinc-100 dark:border-zinc-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2 text-xs">
              <span className="text-zinc-500 dark:text-zinc-400">Utente / Ente in analisi:</span>
              <span
                className="font-extrabold px-2.5 py-1 rounded-lg border flex items-center gap-1.5"
                style={{
                  backgroundColor: `${currentMunInfo.colorHex}15`,
                  borderColor: `${currentMunInfo.colorHex}40`,
                  color: currentMunInfo.colorHex,
                }}
              >
                <span className="w-2 h-2 rounded-full" style={{ backgroundColor: currentMunInfo.colorHex }} />
                <span>{selectedMunicipality}</span>
              </span>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs text-zinc-400 hidden sm:inline">Passa a:</span>
              {MUNICIPALITIES.map((mun) => {
                const isSel = selectedMunicipality === mun.name;
                return (
                  <button
                    key={mun.id}
                    onClick={() => setSelectedMunicipality(mun.name)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                      isSel
                        ? 'ring-2 shadow-xs bg-white dark:bg-zinc-900'
                        : 'bg-zinc-50 dark:bg-zinc-800/60 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 border border-zinc-200 dark:border-zinc-700'
                    }`}
                    style={{
                      borderColor: isSel ? mun.colorHex : undefined,
                      color: isSel ? (mun.textHex || mun.colorHex) : undefined,
                    }}
                  >
                    <span className="w-2 h-2 rounded-full" style={{ backgroundColor: mun.colorHex }} />
                    <span>{mun.shortName}</span>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Macro Structure Switcher (Analisi di Contesto vs Prospettive di Intervento) */}
        <div className="pt-3 border-t border-zinc-100 dark:border-zinc-800 grid grid-cols-1 sm:grid-cols-2 gap-3">
          <button
            type="button"
            id="btn-trend-macro-context"
            onClick={() => handleSwitchMacroSection('context')}
            className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer ${
              macroSection === 'context'
                ? 'bg-purple-700 text-white border-purple-700 shadow-sm ring-2 ring-purple-600/30 dark:ring-purple-400/30'
                : 'bg-purple-50/70 dark:bg-purple-950/30 text-purple-950 dark:text-purple-200 border-purple-200 dark:border-purple-800/60 hover:bg-purple-100/70 dark:hover:bg-purple-900/40'
            }`}
          >
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-xs sm:text-sm font-extrabold uppercase tracking-wider flex items-center gap-2">
                <Layers className="h-4 w-4" />
                <span>1. Analisi di Contesto</span>
              </span>
              <span
                className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full ${
                  macroSection === 'context'
                    ? 'bg-purple-900 text-purple-100'
                    : 'bg-purple-100 text-purple-800 dark:bg-purple-900/60 dark:text-purple-300'
                }`}
              >
                15 Indicatori
              </span>
            </div>
            <p className="text-xs opacity-85 leading-tight">
              4 Dimensioni di analisi e 15 indicatori di contesto diagnostici (CTX-1...CTX-15).
            </p>
          </button>

          <button
            type="button"
            id="btn-trend-macro-intervention"
            onClick={() => handleSwitchMacroSection('interventions')}
            className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer ${
              macroSection === 'interventions'
                ? 'bg-emerald-700 text-white border-emerald-700 shadow-sm ring-2 ring-emerald-600/30 dark:ring-emerald-400/30'
                : 'bg-emerald-50/70 dark:bg-emerald-950/30 text-emerald-950 dark:text-emerald-200 border-emerald-200 dark:border-emerald-800/60 hover:bg-emerald-100/70 dark:hover:bg-emerald-900/40'
            }`}
          >
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-xs sm:text-sm font-extrabold uppercase tracking-wider flex items-center gap-2">
                <Compass className="h-4 w-4" />
                <span>2. Prospettive di Intervento</span>
              </span>
              <span
                className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full ${
                  macroSection === 'interventions'
                    ? 'bg-emerald-900 text-emerald-100'
                    : 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/60 dark:text-emerald-300'
                }`}
              >
                43 Output
              </span>
            </div>
            <p className="text-xs opacity-85 leading-tight">
              4 Direzioni strategiche, Assi d&apos;intervento, Azioni e Indicatori di Output.
            </p>
          </button>
        </div>
      </div>

      {/* RENDER VIEW: GRAFICI DI CONFRONTO INTERCOMUNALE */}
      {dashboardViewMode === 'comparison' ? (
        <IntermunicipalComparison
          records={records}
          selectedYear={selectedYear}
          availableYears={effectiveAvailableYears}
          macroSection={macroSection}
          onSelectIndicatorForCalculation={onSelectIndicatorForCalculation}
          onSelectMunicipality={(m) => {
            setSelectedMunicipality(m);
            setDashboardViewMode('single');
          }}
          onOpenAddYearModal={onOpenAddYearModal}
        />
      ) : (
        <>
          {/* BLOCCO PRINCIPALE: ANDAMENTO STORICO (SX) E SINTESI PRESTAZIONI (DX) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* SX: ANDAMENTO STORICO (7 COLONNE) */}
        <div className={`lg:col-span-7 rounded-2xl border-2 p-6 shadow-sm flex flex-col justify-between space-y-4 ${
          isContext
            ? 'border-purple-300 bg-white dark:border-purple-800 dark:bg-zinc-900'
            : 'border-emerald-300 bg-white dark:border-emerald-800 dark:bg-zinc-900'
        }`}>
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-zinc-100 dark:border-zinc-800 pb-3">
              <div>
                <div className="flex items-center gap-2">
                  <span className={`text-xs font-extrabold uppercase tracking-wider flex items-center gap-1 ${
                    isContext
                      ? 'text-purple-700 dark:text-purple-400'
                      : 'text-emerald-700 dark:text-emerald-400'
                  }`}>
                    <TrendingUp className="h-4 w-4" />
                    <span>
                      {isContext
                        ? '1. Analisi di Contesto (4 Dimensioni)'
                        : '2. Prospettive di Intervento (4 Direzioni)'}
                    </span>
                  </span>
                </div>
                <h3 className="text-base font-black text-zinc-900 dark:text-zinc-100">
                  Serie Temporale Multi-Anno ({isContext ? 'Analisi di Contesto' : 'Prospettive di Intervento'})
                </h3>
              </div>
            </div>

            {/* Metric Selector Dropdown with high-contrast color styling */}
            <div className="flex items-center gap-2">
              <span className={`text-xs font-bold whitespace-nowrap ${
                isContext
                  ? 'text-purple-900 dark:text-purple-300'
                  : 'text-emerald-900 dark:text-emerald-300'
              }`}>
                Seleziona Indicatore:
              </span>
              <select
                value={activeMetricFilter}
                onChange={(e) => {
                  const newCode = e.target.value;
                  setActiveMetricFilter(newCode);
                }}
                className={`w-full rounded-xl border px-3 py-2 text-xs font-bold focus:outline-none ${
                  isContext
                    ? 'border-purple-300 bg-purple-50/70 text-purple-950 focus:ring-2 focus:ring-purple-500 dark:border-purple-700 dark:bg-purple-950/40 dark:text-purple-100'
                    : 'border-emerald-300 bg-emerald-50/70 text-emerald-950 focus:ring-2 focus:ring-emerald-500 dark:border-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-100'
                }`}
              >
              {isContext ? (
                <optgroup label="🟣 1. Indicatori di Contesto (Analisi di Contesto - 4 Dimensioni)">
                  {allCalculables
                    .filter((c) => c.level === 'context')
                    .map((calc) => (
                      <option key={calc.code} value={calc.code}>
                        {calc.name} ({calc.unit})
                      </option>
                    ))}
                </optgroup>
              ) : (
                <optgroup label="🟢 2. Indicatori di Output (Prospettive di Intervento - 4 Direzioni)">
                  {allCalculables
                    .filter((c) => c.level === 'output')
                    .map((calc) => (
                      <option key={calc.code} value={calc.code}>
                        [{calc.code}] {calc.name} ({calc.unit})
                      </option>
                    ))}
                </optgroup>
              )}
            </select>
          </div>

          {/* Time Interval Control Bar for the Chart */}
          <div className="rounded-xl border border-zinc-200 dark:border-zinc-700/80 bg-zinc-50/90 dark:bg-zinc-800/60 p-3 space-y-2.5">
            <div className="flex items-center gap-1.5 font-bold text-zinc-800 dark:text-zinc-200 text-xs">
              <Clock className="h-4 w-4 text-amber-600 dark:text-amber-400 shrink-0" />
              <span>Intervallo Temporale Grafico:</span>
              <span className="font-mono px-2 py-0.5 rounded bg-amber-100 dark:bg-amber-950/60 text-amber-900 dark:text-amber-200 font-extrabold text-[11px] border border-amber-200 dark:border-amber-800">
                {chartFilteredYears.length} {chartFilteredYears.length === 1 ? 'anno' : 'anni'} ({trendStartYear} - {trendEndYear})
              </span>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-2.5">
              {/* Da / A Selectors */}
              <div className="flex items-center gap-2 text-xs">
                <div className="flex items-center gap-1.5 bg-white dark:bg-zinc-900 px-2.5 py-1.5 rounded-lg border border-zinc-200 dark:border-zinc-700 shadow-2xs">
                  <span className="font-semibold text-zinc-500">Da:</span>
                  <select
                    value={trendStartYear}
                    onChange={(e) => {
                      const newStart = Number(e.target.value);
                      setTrendStartYear(newStart);
                      if (newStart > trendEndYear) setTrendEndYear(newStart);
                    }}
                    className="bg-transparent font-bold font-mono text-zinc-900 dark:text-zinc-100 focus:outline-none cursor-pointer"
                  >
                    {effectiveAvailableYears.map((yr) => (
                      <option key={yr} value={yr} className="bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100">
                        {yr}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="flex items-center gap-1.5 bg-white dark:bg-zinc-900 px-2.5 py-1.5 rounded-lg border border-zinc-200 dark:border-zinc-700 shadow-2xs">
                  <span className="font-semibold text-zinc-500">A:</span>
                  <select
                    value={trendEndYear}
                    onChange={(e) => {
                      const newEnd = Number(e.target.value);
                      setTrendEndYear(newEnd);
                      if (newEnd < trendStartYear) setTrendStartYear(newEnd);
                    }}
                    className="bg-transparent font-bold font-mono text-zinc-900 dark:text-zinc-100 focus:outline-none cursor-pointer"
                  >
                    {effectiveAvailableYears.map((yr) => (
                      <option key={yr} value={yr} className="bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100">
                        {yr}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Quick Presets */}
              <div className="flex flex-wrap items-center gap-1.5 text-[11px]">
                <span className="text-zinc-400 hidden md:inline">Preset:</span>
                <button
                  type="button"
                  onClick={() => {
                    setTrendStartYear(minAvailableYear);
                    setTrendEndYear(maxAvailableYear);
                  }}
                  className={`px-2.5 py-1 rounded-lg font-bold border transition-colors cursor-pointer ${
                    trendStartYear === minAvailableYear && trendEndYear === maxAvailableYear
                      ? 'bg-amber-600 text-white border-amber-600 shadow-2xs'
                      : 'bg-white dark:bg-zinc-900 text-zinc-600 dark:text-zinc-400 border-zinc-200 dark:border-zinc-700 hover:bg-zinc-100 dark:hover:bg-zinc-800'
                  }`}
                >
                  Tutti ({minAvailableYear}-{maxAvailableYear})
                </button>

                {effectiveAvailableYears.length >= 3 && (
                  <button
                    type="button"
                    onClick={() => {
                      const end = maxAvailableYear;
                      const start = effectiveAvailableYears[Math.max(0, effectiveAvailableYears.length - 3)];
                      setTrendStartYear(start);
                      setTrendEndYear(end);
                    }}
                    className={`px-2.5 py-1 rounded-lg font-bold border transition-colors cursor-pointer ${
                      trendEndYear === maxAvailableYear &&
                      trendStartYear === effectiveAvailableYears[Math.max(0, effectiveAvailableYears.length - 3)] &&
                      !(trendStartYear === minAvailableYear && trendEndYear === maxAvailableYear)
                        ? 'bg-amber-600 text-white border-amber-600 shadow-2xs'
                        : 'bg-white dark:bg-zinc-900 text-zinc-600 dark:text-zinc-400 border-zinc-200 dark:border-zinc-700 hover:bg-zinc-100 dark:hover:bg-zinc-800'
                    }`}
                  >
                    Ultimi 3 anni
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Area / Line Chart with rich gradient */}
          <div className="h-68 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={timeSeriesData} margin={{ top: 10, right: 30, left: 10, bottom: 5 }}>
                <defs>
                  <linearGradient id="purpleChartGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#9333ea" stopOpacity={0.45} />
                    <stop offset="95%" stopColor="#c084fc" stopOpacity={0.02} />
                  </linearGradient>
                  <linearGradient id="emeraldChartGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#059669" stopOpacity={0.45} />
                    <stop offset="95%" stopColor="#34d399" stopOpacity={0.02} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="year" stroke="#6b7280" fontSize={12} fontVariant="bold" />
                <YAxis stroke="#6b7280" fontSize={12} />
                <Tooltip
                  content={({ active, payload, label }) => {
                    if (active && label) {
                      const entry = payload && payload.length > 0 ? payload[0] : null;
                      const rawVal = entry ? (entry.value as number | null | undefined) : null;
                      const isNd = rawVal === null || rawVal === undefined || isNaN(rawVal);
                      return (
                        <div className="rounded-xl border border-zinc-700 bg-zinc-900/95 backdrop-blur-md p-3 shadow-xl text-xs space-y-1.5 text-white">
                          <div className="font-bold border-b border-zinc-700 pb-1 flex items-center justify-between gap-4">
                            <span className="text-zinc-400">Rilevazione:</span>
                            <span className="font-black text-amber-400 font-mono">Anno {label}</span>
                          </div>
                          <div className="text-[11px] text-zinc-300 font-medium truncate max-w-[240px]">
                            {activeCalculableObj?.name || 'Valore'}
                          </div>
                          <div className="flex items-center justify-between gap-4 pt-0.5">
                            <span className="text-zinc-400">Valore:</span>
                            {isNd ? (
                              <span className="px-2 py-0.5 rounded font-black font-mono text-xs bg-amber-500/20 border border-amber-500/50 text-amber-300">
                                n.d. (Dato non disponibile)
                              </span>
                            ) : (
                              <span className="font-black font-mono text-sm text-emerald-400">
                                {formatValueWithUnit(rawVal, activeCalculableObj?.unit || '')}
                              </span>
                            )}
                          </div>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Legend />
                {missingYearsForActiveMetric.map((yr) => (
                  <ReferenceLine
                    key={`nd-ref-${yr}`}
                    x={yr}
                    stroke="#f59e0b"
                    strokeDasharray="4 4"
                    strokeWidth={1.5}
                    label={{
                      value: 'n.d.',
                      fill: '#d97706',
                      fontSize: 11,
                      fontWeight: 700,
                      position: 'insideTop',
                    }}
                  />
                ))}
                {activeUserTarget !== undefined && (
                  <ReferenceLine
                    y={activeUserTarget}
                    stroke={isContext ? '#7e22ce' : '#047857'}
                    strokeDasharray="4 4"
                    strokeWidth={1.5}
                    label={{
                      value: `Target Utente: ${activeUserTarget} ${activeCalculableObj?.unit || ''}`,
                      fill: isContext ? '#9333ea' : '#059669',
                      fontSize: 11,
                      position: 'top',
                    }}
                  />
                )}
                <Area
                  type="monotone"
                  connectNulls={false}
                  dataKey={activeMetricFilter}
                  name={activeCalculableObj?.name || 'Valore'}
                  stroke={isContext ? '#9333ea' : '#059669'}
                  strokeWidth={3.5}
                  fill={isContext ? 'url(#purpleChartGradient)' : 'url(#emeraldChartGradient)'}
                  dot={{
                    r: 6,
                    fill: isContext ? '#9333ea' : '#059669',
                    stroke: '#ffffff',
                    strokeWidth: 2,
                  }}
                  activeDot={{
                    r: 8,
                    fill: isContext ? '#c084fc' : '#6ee7b7',
                    stroke: isContext ? '#581c87' : '#064e3b',
                    strokeWidth: 2.5,
                  }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Mini-tracker per anno con evidenziazione chiara dei dati disponibili e dei dati n.d. */}
          <div className="space-y-2 pt-2.5 border-t border-zinc-100 dark:border-zinc-800 text-xs">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-zinc-500 dark:text-zinc-400 flex items-center gap-1.5">
                <Info className="h-3.5 w-3.5" />
                Stato serie storica:
              </span>
              {missingYearsForActiveMetric.length > 0 && (
                <span className="text-[11px] text-amber-700 dark:text-amber-400 font-semibold flex items-center gap-1">
                  <AlertCircle className="h-3.5 w-3.5 text-amber-600 shrink-0" />
                  <span>Dati non rilevati contrassegnati come &quot;n.d.&quot;</span>
                </span>
              )}
            </div>

            {/* Riquadri dei 5 anni distribuiti orizzontalmente in un'unica riga */}
            <div className="grid grid-cols-5 gap-2 w-full">
              {timeSeriesData.map((d) => {
                const val = d[activeMetricFilter];
                const isNd = val === null || val === undefined;
                return (
                  <div
                    key={d.year}
                    className={`flex flex-col sm:flex-row items-center justify-center sm:justify-between gap-1 px-2.5 py-1.5 rounded-lg border text-xs font-semibold ${
                      isNd
                        ? 'bg-amber-50 border-amber-300 text-amber-900 dark:bg-amber-950/40 dark:border-amber-700 dark:text-amber-300'
                        : isContext
                        ? 'bg-purple-50 border-purple-200 text-purple-950 dark:bg-purple-950/40 dark:border-purple-800 dark:text-purple-200'
                        : 'bg-emerald-50 border-emerald-200 text-emerald-950 dark:bg-emerald-950/40 dark:border-emerald-800 dark:text-emerald-200'
                    }`}
                  >
                    <span className="font-mono font-bold text-[11px] text-zinc-500 dark:text-zinc-400">{d.year}:</span>
                    {isNd ? (
                      <span className="font-black text-amber-700 dark:text-amber-300 bg-amber-200/70 dark:bg-amber-900/60 px-1.5 py-0.2 rounded text-[11px]">
                        n.d.
                      </span>
                    ) : (
                      <span className="font-bold font-mono text-[11px] truncate">
                        {formatValueWithUnit(val, activeCalculableObj?.unit || '')}
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
          </div>

          {/* Active indicator summary card */}
          {activeCalculableObj && (
            <div className={`p-4 rounded-2xl border-2 mt-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
              activeCalculableObj.level === 'context'
                ? 'bg-purple-50/90 border-purple-300 text-purple-950 dark:bg-purple-950/40 dark:border-purple-800 dark:text-purple-100'
                : 'bg-emerald-50/90 border-emerald-300 text-emerald-950 dark:bg-emerald-950/40 dark:border-emerald-800 dark:text-emerald-100'
            }`}>
              <div>
                <div className="flex items-center gap-2">
                  <span className={`px-2.5 py-0.5 rounded-md text-[10px] uppercase font-black text-white ${
                    activeCalculableObj.level === 'context' ? 'bg-purple-700' : 'bg-emerald-700'
                  }`}>
                    {activeCalculableObj.level === 'context' ? '🟣 Analisi di contesto' : '🟢 Prospettive di intervento'}
                  </span>
                  <span className="font-extrabold text-sm">{activeCalculableObj.name}</span>
                </div>
                <p className="text-xs opacity-85 mt-1.5 leading-relaxed">
                  {activeCalculableObj.description}
                </p>
                <div className="text-[11px] font-mono opacity-80 mt-1">
                  Formula: {activeCalculableObj.formulaDisplay}
                </div>
              </div>

              <button
                onClick={() => onSelectIndicatorForCalculation(activeCalculableObj.code)}
                className={`px-3.5 py-2 rounded-xl text-white font-bold text-xs transition-colors shrink-0 cursor-pointer shadow-xs ${
                  activeCalculableObj.level === 'context'
                    ? 'bg-purple-700 hover:bg-purple-800'
                    : 'bg-emerald-700 hover:bg-emerald-800'
                }`}
              >
                Ricalcola nel Modulo
              </button>
            </div>
          )}
        </div>

        {/* DX: SINTESI PRESTAZIONI (5 COLONNE) */}
        <div className="lg:col-span-5 rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900 flex flex-col justify-between space-y-4">
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-zinc-100 dark:border-zinc-800 pb-3">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-extrabold uppercase tracking-wider text-amber-600 dark:text-amber-400 flex items-center gap-1">
                    <Target className="h-4 w-4" />
                    <span>Raggiungimento Obiettivi</span>
                  </span>
                </div>
                <h3 className="text-base font-black text-zinc-900 dark:text-zinc-100">
                  Sintesi Prestazioni
                </h3>
              </div>
            </div>

            {/* Subtitle with active scope tag */}
            <div className={`p-2.5 rounded-xl border text-xs font-bold flex items-center justify-between ${
              radarType === 'context'
                ? 'bg-purple-50 border-purple-200 text-purple-900 dark:bg-purple-950/30 dark:border-purple-800 dark:text-purple-200'
                : 'bg-emerald-50 border-emerald-200 text-emerald-900 dark:bg-emerald-950/30 dark:border-emerald-800 dark:text-emerald-200'
            }`}>
              <span className="flex items-center gap-1.5">
                {radarType === 'context' ? (
                  <>
                    <Layers className="h-4 w-4 text-purple-700 dark:text-purple-400" />
                    <span>4 Dimensioni di Analisi (Indicatori di Contesto)</span>
                  </>
                ) : (
                  <>
                    <Compass className="h-4 w-4 text-emerald-700 dark:text-emerald-400" />
                    <span>4 Direzioni di Intervento (Indicatori di Output)</span>
                  </>
                )}
              </span>
              <span className="font-mono text-[11px] font-extrabold">Anno {selectedYear}</span>
            </div>

            {/* Radar Chart */}
            <div className="h-58 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart
                  cx="50%"
                  cy="50%"
                  outerRadius="68%"
                  data={radarType === 'context' ? contextDimensionsRadarData : interventionDirectionsRadarData}
                >
                  <PolarGrid stroke="#e5e7eb" />
                  <PolarAngleAxis dataKey="key" stroke="#6b7280" fontSize={11} />
                  <PolarRadiusAxis angle={30} domain={[0, 100]} stroke="#9ca3af" fontSize={10} />
                  <Radar
                    name={radarType === 'context' ? 'Punteggio Dimensione' : 'Avanzamento Direzione'}
                    dataKey="punteggio"
                    stroke={radarType === 'context' ? '#9333ea' : '#059669'}
                    fill={radarType === 'context' ? '#9333ea' : '#059669'}
                    fillOpacity={0.4}
                  />
                </RadarChart>
              </ResponsiveContainer>
            </div>

            {/* 4 Score Breakdown Cards (Dimensione / Direzione per esteso) */}
            <div className="grid grid-cols-2 gap-2.5 text-xs">
              {(radarType === 'context' ? contextDimensionsRadarData : interventionDirectionsRadarData).map((item) => (
                <div
                  key={item.key}
                  className={`p-3 rounded-xl border flex items-center justify-between gap-2 ${
                    radarType === 'context'
                      ? 'bg-purple-50/70 border-purple-200/90 text-purple-950 dark:bg-purple-950/30 dark:border-purple-800/80 dark:text-purple-100'
                      : 'bg-emerald-50/70 border-emerald-200/90 text-emerald-950 dark:bg-emerald-950/30 dark:border-emerald-800/80 dark:text-emerald-100'
                  }`}
                >
                  <div className="min-w-0 flex-1">
                    <div className="font-black text-xs">
                      {item.key}
                    </div>
                    <div className="text-[11px] opacity-80 truncate font-medium" title={item.title}>
                      {item.title}
                    </div>
                  </div>
                  <span className="font-black font-mono text-xs px-2.5 py-1 rounded-lg bg-white dark:bg-zinc-800 shadow-xs shrink-0">
                    {item.punteggio}%
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Riquadro quantitativo Target raggiunti (in basso nello spazio bianco, allineato al riquadro dell'indicatore nel pannello a fianco) */}
          <div className={`p-4 rounded-2xl border-2 mt-4 flex flex-col justify-between gap-2.5 ${
            radarType === 'context'
              ? 'bg-purple-50/90 border-purple-300 text-purple-950 dark:bg-purple-950/40 dark:border-purple-800 dark:text-purple-100'
              : 'bg-emerald-50/90 border-emerald-300 text-emerald-950 dark:bg-emerald-950/40 dark:border-emerald-800 dark:text-emerald-100'
          }`}>
            <div className="flex items-center justify-between text-xs font-bold">
              <span className="flex items-center gap-1.5 uppercase tracking-wider text-[11px]">
                {radarType === 'context' ? (
                  <>
                    <Layers className="h-4 w-4 text-purple-700 dark:text-purple-400" />
                    <span>Target Analisi di Contesto</span>
                  </>
                ) : (
                  <>
                    <Compass className="h-4 w-4 text-emerald-700 dark:text-emerald-400" />
                    <span>Target Prospettive di Intervento</span>
                  </>
                )}
              </span>
              <span className={`px-2 py-0.5 rounded text-[10px] font-black uppercase text-white ${
                radarType === 'context' ? 'bg-purple-700' : 'bg-emerald-700'
              }`}>
                {radarType === 'context' ? '4 Dimensioni' : '4 Direzioni'}
              </span>
            </div>

            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-black font-mono">
                {radarType === 'context'
                  ? contextTableRows.filter((r) => r.status?.isTargetMet).length
                  : outputTableRows.filter((r) => r.status?.isTargetMet).length}
              </span>
              <span className={`text-sm font-bold ${
                radarType === 'context'
                  ? 'text-purple-700 dark:text-purple-300'
                  : 'text-emerald-700 dark:text-emerald-300'
              }`}>
                /{' '}
                {radarType === 'context'
                  ? contextTableRows.filter((r) => r.status?.isTargetSet).length
                  : outputTableRows.filter((r) => r.status?.isTargetSet).length}{' '}
                target raggiunti
              </span>
            </div>

            <p className={`text-[11px] leading-tight opacity-85 ${
              radarType === 'context'
                ? 'text-purple-800 dark:text-purple-200'
                : 'text-emerald-800 dark:text-emerald-200'
            }`}>
              {radarType === 'context'
                ? `${contextTableRows.filter((r) => r.currentVal !== null).length} indicatori rilevati (target configurabili liberamente dall'utente)`
                : `${outputTableRows.filter((r) => r.currentVal !== null).length} indicatori calcolati (target configurabili liberamente dall'utente)`}
            </p>
          </div>
        </div>
      </div>

      {/* SEZIONE: QUADRO COMPARATIVO INDICATORI CON SWITCHER (CONTESTO vs INTERVENTI) */}
      <div className={`rounded-2xl border-2 shadow-sm space-y-4 overflow-hidden transition-colors ${
        comparativeTableSection === 'context'
          ? 'border-purple-300 dark:border-purple-800 bg-white dark:bg-zinc-900'
          : 'border-emerald-300 dark:border-emerald-800 bg-white dark:bg-zinc-900'
      }`}>
        {/* Header with Switcher & Filters */}
        <div className={`p-5 border-b flex flex-col lg:flex-row lg:items-center justify-between gap-4 transition-colors ${
          comparativeTableSection === 'context'
            ? 'bg-purple-100/70 dark:bg-purple-950/50 border-purple-200 dark:border-purple-800'
            : 'bg-emerald-100/70 dark:bg-emerald-950/50 border-emerald-200 dark:border-emerald-800'
        }`}>
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-xl text-white text-xs font-black uppercase tracking-wide shadow-xs ${
                comparativeTableSection === 'context' ? 'bg-purple-700' : 'bg-emerald-700'
              }`}>
                {comparativeTableSection === 'context' ? (
                  <>
                    <Layers className="h-4 w-4" />
                    <span>1. Analisi di Contesto</span>
                  </>
                ) : (
                  <>
                    <Compass className="h-4 w-4" />
                    <span>2. Prospettive di Intervento</span>
                  </>
                )}
              </span>
              <span className={`text-xs font-bold ${
                comparativeTableSection === 'context'
                  ? 'text-purple-900 dark:text-purple-300'
                  : 'text-emerald-900 dark:text-emerald-300'
              }`}>
                {comparativeTableSection === 'context'
                  ? `${contextTableRows.length} Indicatori di Contesto`
                  : `${outputTableRows.length} Indicatori di Output`}
              </span>
            </div>
            <h3 className={`text-lg font-black ${
              comparativeTableSection === 'context'
                ? 'text-purple-950 dark:text-purple-100'
                : 'text-emerald-950 dark:text-emerald-100'
            }`}>
              {comparativeTableSection === 'context'
                ? `Quadro Comparativo Indicatori di Contesto per Dimensione di Analisi (${selectedYear} vs ${selectedYear - 1})`
                : `Quadro Comparativo Indicatori di Output per Direzione di Intervento (${selectedYear} vs ${selectedYear - 1})`}
            </h3>
            <p className="text-xs text-zinc-600 dark:text-zinc-300">
              {comparativeTableSection === 'context'
                ? 'Monitoraggio dello stato del profilo turistico-ambientale del Comune, articolato sulle 4 Dimensioni di analisi.'
                : 'Linee strategiche e avanzamento degli interventi operativi sul campo, estratte criticamente dal quadro complessivo.'}
            </p>
          </div>

          {/* Controls: Filter Dropdown */}
          <div className="flex items-center gap-3 shrink-0">
            {/* Filter by Dimension or Direction */}
            {comparativeTableSection === 'context' ? (
              <div className="flex items-center gap-2">
                <Filter className="h-4 w-4 text-purple-700 dark:text-purple-400" />
                <select
                  value={contextDimensionFilter}
                  onChange={(e) => setContextDimensionFilter(e.target.value)}
                  className="rounded-xl border border-purple-300 bg-white px-3 py-1.5 text-xs font-bold text-purple-950 dark:border-purple-700 dark:bg-zinc-800 dark:text-purple-100 focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  <option value="all">Tutte le 4 Dimensioni di Analisi</option>
                  {CONTEXT_ANALYSIS_SECTIONS.map((sec) => (
                    <option key={sec.id} value={sec.id}>
                      Dim. {sec.number}: {sec.title.split(':')[1]?.trim() || sec.title}
                    </option>
                  ))}
                </select>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Filter className="h-4 w-4 text-emerald-700 dark:text-emerald-400" />
                <select
                  value={interventionDirectionFilter}
                  onChange={(e) => setInterventionDirectionFilter(e.target.value)}
                  className="rounded-xl border border-emerald-300 bg-white px-3 py-1.5 text-xs font-bold text-emerald-950 dark:border-emerald-700 dark:bg-zinc-800 dark:text-emerald-100 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                >
                  <option value="all">Tutte le 4 Direzioni di Intervento</option>
                  {INTERVENTION_PERSPECTIVES.map((dir) => (
                    <option key={dir.id} value={dir.id}>
                      Dir. {dir.number}: {dir.title.split(':')[1]?.trim() || dir.title}
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>
        </div>

        {/* Table Content */}
        {comparativeTableSection === 'context' ? (
          <div className="overflow-x-auto p-2">
            <table className="w-full text-left text-xs border-collapse">
              <thead className="bg-purple-50/70 dark:bg-purple-950/30 text-purple-950 dark:text-purple-200 font-extrabold uppercase border-b border-purple-200 dark:border-purple-800">
                <tr>
                  <th className="p-3 w-20">Codice</th>
                  <th className="p-3">Dimensione di Analisi</th>
                  <th className="p-3">Indicatore di Contesto</th>
                  <th className="p-3 text-right">Valore {selectedYear - 1}</th>
                  <th className="p-3 text-right">Valore {selectedYear}</th>
                  <th className="p-3 text-right">Variazione YoY</th>
                  <th className="p-3 text-center">Stato Soglia</th>
                  <th className="p-3 text-center">Azioni</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800">
                {contextTableRows.map((row) => {
                  const { calc, dimensionName, currentVal, prevVal, pctChange, status, firstRec, recordId } = row;

                  return (
                    <tr
                      key={calc.code}
                      className="hover:bg-purple-50/40 dark:hover:bg-purple-950/20 transition-colors"
                    >
                      <td className="p-3 font-mono font-bold text-purple-700 dark:text-purple-400">
                        {calc.code}
                      </td>
                      <td className="p-3 text-[11px] font-semibold text-zinc-600 dark:text-zinc-300">
                        {dimensionName}
                      </td>
                      <td className="p-3 font-bold text-zinc-900 dark:text-zinc-100">
                        {calc.name} <span className="font-normal text-zinc-400">({calc.unit})</span>
                      </td>
                      <td className="p-3 text-right font-mono text-zinc-500 dark:text-zinc-400">
                        {prevVal !== null ? (
                          formatValueWithUnit(prevVal, calc.unit)
                        ) : (
                          <span className="text-amber-700 dark:text-amber-400 font-bold bg-amber-50 dark:bg-amber-950/40 px-1.5 py-0.5 rounded text-[11px] border border-amber-200 dark:border-amber-800/60">
                            n.d.
                          </span>
                        )}
                      </td>
                      <td className="p-3 text-right font-mono font-bold text-purple-950 dark:text-purple-100">
                        {currentVal !== null ? (
                          formatValueWithUnit(currentVal, calc.unit)
                        ) : (
                          <span className="text-amber-700 dark:text-amber-400 font-bold bg-amber-50 dark:bg-amber-950/40 px-1.5 py-0.5 rounded text-[11px] border border-amber-200 dark:border-amber-800/60">
                            n.d.
                          </span>
                        )}
                      </td>
                      <td className="p-3 text-right font-mono font-bold">
                        {pctChange !== null ? (
                          <span
                            className={`inline-flex items-center gap-0.5 px-2 py-0.5 rounded ${
                              pctChange >= 0
                                ? 'bg-purple-100 text-purple-800 dark:bg-purple-950 dark:text-purple-300'
                                : 'bg-zinc-100 text-zinc-800 dark:bg-zinc-800 dark:text-zinc-300'
                            }`}
                          >
                            {pctChange >= 0 ? (
                              <ArrowUpRight className="h-3 w-3" />
                            ) : (
                              <ArrowDownRight className="h-3 w-3" />
                            )}
                            {pctChange >= 0 ? '+' : ''}
                            {pctChange.toFixed(1)}%
                          </span>
                        ) : (
                          <span className="text-zinc-400 font-normal">n.d.</span>
                        )}
                      </td>
                      <td className="p-3 text-center">
                        {status ? (
                          status.isTargetSet && firstRec?.targetValue !== undefined && firstRec?.targetValue !== null ? (
                            <div className="flex flex-col items-center gap-0.5">
                              <span className={`inline-block px-2.5 py-0.5 rounded text-[11px] font-bold border ${status.badge}`}>
                                {status.label}
                              </span>
                              <span className="text-[10px] text-zinc-500 font-medium">
                                Target: {firstRec.targetDirection === 'higher-is-better' ? '≥' : '≤'} {firstRec.targetValue} {calc.unit} ({status.progressPercent}%)
                              </span>
                            </div>
                          ) : (
                            <span className="inline-block px-2 py-0.5 rounded text-[10px] font-medium border border-zinc-200 bg-zinc-50 text-zinc-500 dark:border-zinc-800 dark:bg-zinc-800/60 dark:text-zinc-400">
                              Target non impostato
                            </span>
                          )
                        ) : (
                          <span className="inline-block px-2 py-0.5 rounded text-[10px] font-bold border border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-800/60 dark:bg-amber-950/40 dark:text-amber-300">
                            n.d. (non disponibile)
                          </span>
                        )}
                      </td>
                      <td className="p-3 text-center space-x-1 whitespace-nowrap">
                        <button
                          onClick={() => onSelectIndicatorForCalculation(calc.code)}
                          className="px-2.5 py-1 rounded-lg bg-purple-700 text-white hover:bg-purple-800 font-bold text-[11px] cursor-pointer shadow-xs"
                        >
                          Calcola
                        </button>
                        {recordId && (
                          <button
                            onClick={() => onDeleteRecord(recordId)}
                            className="p-1 rounded text-zinc-400 hover:bg-rose-100 hover:text-rose-600 dark:hover:bg-rose-950 cursor-pointer"
                            title="Elimina rilevazione"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="overflow-x-auto p-2">
            <table className="w-full text-left text-xs border-collapse">
              <thead className="bg-emerald-50/70 dark:bg-emerald-950/30 text-emerald-950 dark:text-emerald-200 font-extrabold uppercase border-b border-emerald-200 dark:border-emerald-800">
                <tr>
                  <th className="p-3 w-20">Codice</th>
                  <th className="p-3">Direzione di Intervento</th>
                  <th className="p-3">Intervento Specifico &amp; Indicatore di Output</th>
                  <th className="p-3 text-right">Valore {selectedYear - 1}</th>
                  <th className="p-3 text-right">Valore {selectedYear}</th>
                  <th className="p-3 text-right">Variazione YoY</th>
                  <th className="p-3 text-center">Stato Target</th>
                  <th className="p-3 text-center">Azioni</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800">
                {outputTableRows.map((row) => {
                  const { calc, currentVal, prevVal, pctChange, status, firstRec, recordId } = row;

                  return (
                    <tr
                      key={calc.code}
                      className="hover:bg-emerald-50/40 dark:hover:bg-emerald-950/20 transition-colors"
                    >
                      <td className="p-3 font-mono font-bold text-emerald-700 dark:text-emerald-400">
                        {calc.code}
                      </td>
                      <td className="p-3 text-[11px] font-semibold text-zinc-600 dark:text-zinc-300">
                        {calc.direzioneTitle || `Direzione ${calc.dimensionId?.replace('dim', '')}`}
                      </td>
                      <td className="p-3">
                        <div className="font-bold text-zinc-900 dark:text-zinc-100">
                          {calc.name} <span className="font-normal text-zinc-400">({calc.unit})</span>
                        </div>
                        {calc.interventionTitle && (
                          <div className="text-[11px] text-emerald-800 dark:text-emerald-300">
                            {calc.interventionTitle}
                          </div>
                        )}
                      </td>
                      <td className="p-3 text-right font-mono text-zinc-500 dark:text-zinc-400">
                        {prevVal !== null ? (
                          formatValueWithUnit(prevVal, calc.unit)
                        ) : (
                          <span className="text-amber-700 dark:text-amber-400 font-bold bg-amber-50 dark:bg-amber-950/40 px-1.5 py-0.5 rounded text-[11px] border border-amber-200 dark:border-amber-800/60">
                            n.d.
                          </span>
                        )}
                      </td>
                      <td className="p-3 text-right font-mono font-bold text-emerald-950 dark:text-emerald-100">
                        {currentVal !== null ? (
                          formatValueWithUnit(currentVal, calc.unit)
                        ) : (
                          <span className="text-amber-700 dark:text-amber-400 font-bold bg-amber-50 dark:bg-amber-950/40 px-1.5 py-0.5 rounded text-[11px] border border-amber-200 dark:border-amber-800/60">
                            n.d.
                          </span>
                        )}
                      </td>
                      <td className="p-3 text-right font-mono font-bold">
                        {pctChange !== null ? (
                          <span
                            className={`inline-flex items-center gap-0.5 px-2 py-0.5 rounded ${
                              pctChange >= 0
                                ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                                : 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300'
                            }`}
                          >
                            {pctChange >= 0 ? (
                              <ArrowUpRight className="h-3 w-3" />
                            ) : (
                              <ArrowDownRight className="h-3 w-3" />
                            )}
                            {pctChange >= 0 ? '+' : ''}
                            {pctChange.toFixed(1)}%
                          </span>
                        ) : (
                          <span className="text-zinc-400 font-normal">n.d.</span>
                        )}
                      </td>
                      <td className="p-3 text-center">
                        {status ? (
                          status.isTargetSet && firstRec?.targetValue !== undefined && firstRec?.targetValue !== null ? (
                            <div className="flex flex-col items-center gap-0.5">
                              <span className={`inline-block px-2.5 py-0.5 rounded text-[11px] font-bold border ${status.badge}`}>
                                {status.label}
                              </span>
                              <span className="text-[10px] text-zinc-500 font-medium">
                                Target: {firstRec.targetDirection === 'higher-is-better' ? '≥' : '≤'} {firstRec.targetValue} {calc.unit} ({status.progressPercent}%)
                              </span>
                            </div>
                          ) : (
                            <span className="inline-block px-2 py-0.5 rounded text-[10px] font-medium border border-zinc-200 bg-zinc-50 text-zinc-500 dark:border-zinc-800 dark:bg-zinc-800/60 dark:text-zinc-400">
                              Target non impostato
                            </span>
                          )
                        ) : (
                          <span className="inline-block px-2 py-0.5 rounded text-[10px] font-bold border border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-800/60 dark:bg-amber-950/40 dark:text-amber-300">
                            n.d. (non disponibile)
                          </span>
                        )}
                      </td>
                      <td className="p-3 text-center space-x-1 whitespace-nowrap">
                        <button
                          onClick={() => onSelectIndicatorForCalculation(calc.code)}
                          className="px-2.5 py-1 rounded-lg bg-emerald-700 text-white hover:bg-emerald-800 font-bold text-[11px] cursor-pointer shadow-xs"
                        >
                          Calcola
                        </button>
                        {recordId && (
                          <button
                            onClick={() => onDeleteRecord(recordId)}
                            className="p-1 rounded text-zinc-400 hover:bg-rose-100 hover:text-rose-600 dark:hover:bg-rose-950 cursor-pointer"
                            title="Elimina rilevazione"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
        </>
      )}
    </div>
  );
};
