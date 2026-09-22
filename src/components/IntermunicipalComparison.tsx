import React, { useState, useMemo } from 'react';
import { IndicatorRecord, MunicipalityName, MUNICIPALITIES } from '../types';
import {
  DIMENSIONS,
  CONTEXT_ANALYSIS_SECTIONS,
  INTERVENTION_PERSPECTIVES,
  getAllCalculableIndicators,
  getCalculableIndicatorByCode,
} from '../data/matrixData';
import {
  formatValueWithUnit,
  evaluateProgrammingTarget,
  evaluateIndicatorStatus,
  getAllAvailableYears,
} from '../utils/calculator';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  BarChart,
  Bar,
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
  Building2,
  TrendingUp,
  BarChart2,
  Table,
  Filter,
  CheckCircle2,
  ArrowRight,
  Calculator,
  Compass,
  Activity,
  Layers,
  Search,
  Scale,
  Clock,
  Plus,
} from 'lucide-react';

interface IntermunicipalComparisonProps {
  records: IndicatorRecord[];
  selectedYear: number;
  availableYears?: number[];
  macroSection?: 'context' | 'interventions';
  onSelectIndicatorForCalculation: (code: string) => void;
  onSelectMunicipality: (municipality: MunicipalityName) => void;
  onOpenAddYearModal?: () => void;
}

export const IntermunicipalComparison: React.FC<IntermunicipalComparisonProps> = ({
  records,
  selectedYear,
  availableYears,
  macroSection = 'context',
  onSelectIndicatorForCalculation,
  onSelectMunicipality,
  onOpenAddYearModal,
}) => {
  const isContext = macroSection === 'context';

  const allCalculables = useMemo(() => getAllCalculableIndicators(), []);

  // Chart metric selection initialized based on macroSection
  const [activeMetricCode, setActiveMetricCode] = useState<string>(() =>
    macroSection === 'interventions' ? 'TCOE' : 'CTX-1'
  );
  const [chartType, setChartType] = useState<'line' | 'bar'>('line');
  const [tableSearch, setTableSearch] = useState('');
  const [tableDimensionFilter, setTableDimensionFilter] = useState<string>('all');

  // Synchronize activeMetricCode and reset filters when macroSection changes
  React.useEffect(() => {
    if (macroSection === 'interventions') {
      if (activeMetricCode.startsWith('CTX-')) {
        const firstOutput = allCalculables.find((c) => c.level === 'output');
        if (firstOutput) {
          setActiveMetricCode(firstOutput.code);
        }
      }
    } else {
      if (!activeMetricCode.startsWith('CTX-')) {
        setActiveMetricCode('CTX-1');
      }
    }
    setTableDimensionFilter('all');
  }, [macroSection, allCalculables]);

  // Filtered calculables for dropdown strictly according to macroSection
  const filteredCalculablesForChart = useMemo(() => {
    if (macroSection === 'interventions') {
      return allCalculables.filter((c) => c.level === 'output');
    }
    return allCalculables.filter((c) => c.level === 'context');
  }, [allCalculables, macroSection]);

  const activeCalculableObj = useMemo(() => {
    const found = getCalculableIndicatorByCode(activeMetricCode);
    if (found && ((isContext && found.level === 'context') || (!isContext && found.level === 'output'))) {
      return found;
    }
    return filteredCalculablesForChart[0] || allCalculables[0];
  }, [activeMetricCode, allCalculables, isContext, filteredCalculablesForChart]);

  // Unique sorted years
  const effectiveAvailableYears = useMemo(() => {
    if (availableYears && availableYears.length > 0) {
      return availableYears;
    }
    return getAllAvailableYears(records);
  }, [availableYears, records]);

  const minAvailableYear = effectiveAvailableYears[0] ?? 2023;
  const maxAvailableYear = effectiveAvailableYears[effectiveAvailableYears.length - 1] ?? 2027;

  const [compStartYear, setCompStartYear] = useState<number>(() => minAvailableYear);
  const [compEndYear, setCompEndYear] = useState<number>(() => maxAvailableYear);

  // Keep interval valid
  const filteredCompYears = useMemo(() => {
    const start = Math.min(compStartYear, compEndYear);
    const end = Math.max(compStartYear, compEndYear);
    const filtered = effectiveAvailableYears.filter((yr) => yr >= start && yr <= end);
    return filtered.length > 0 ? filtered : effectiveAvailableYears;
  }, [effectiveAvailableYears, compStartYear, compEndYear]);

  // Comparative time-series data for the active metric across the 3 municipalities
  const timeSeriesComparisonData = useMemo(() => {
    return filteredCompYears.map((yr) => {
      const recsInYear = records.filter((r) => r.year === yr && r.code === activeMetricCode);

      const montecassianoRec = recsInYear.find(
        (r) => r.municipality === 'Comune di Montecassiano' || !r.municipality
      );
      const montefanoRec = recsInYear.find((r) => r.municipality === 'Comune di Montefano');
      const monteluponeRec = recsInYear.find((r) => r.municipality === 'Comune di Montelupone');

      const valCassiano =
        montecassianoRec && !montecassianoRec.isNotAvailable && montecassianoRec.calculatedValue !== null
          ? montecassianoRec.calculatedValue
          : null;
      const valFano =
        montefanoRec && !montefanoRec.isNotAvailable && montefanoRec.calculatedValue !== null
          ? montefanoRec.calculatedValue
          : null;
      const valLupone =
        monteluponeRec && !monteluponeRec.isNotAvailable && monteluponeRec.calculatedValue !== null
          ? monteluponeRec.calculatedValue
          : null;

      const validVals = [valCassiano, valFano, valLupone].filter((v): v is number => v !== null);
      const avg =
        validVals.length > 0
          ? Math.round((validVals.reduce((a, b) => a + b, 0) / validVals.length) * 100) / 100
          : null;

      return {
        year: yr.toString(),
        yearNum: yr,
        Montecassiano: valCassiano,
        Montefano: valFano,
        Montelupone: valLupone,
        MediaTerritoriale: avg,
      };
    });
  }, [availableYears, records, activeMetricCode]);

  // Comparative Radar 1: 4 Dimensioni di Contesto per Montecassiano, Montefano, Montelupone
  const contextRadarComparisonData = useMemo(() => {
    const currentYearRecs = records.filter((r) => r.year === selectedYear);

    return CONTEXT_ANALYSIS_SECTIONS.map((sec) => {
      const getMunScore = (munName: MunicipalityName) => {
        let totalRatio = 0;
        let count = 0;

        sec.contextIndicators.forEach((ci) => {
          const rec = currentYearRecs.find(
            (r) =>
              r.code === ci.code &&
              (r.municipality === munName ||
                (!r.municipality && munName === 'Comune di Montecassiano'))
          );
          if (rec && !rec.isNotAvailable && rec.calculatedValue !== null) {
            count++;
            const score = rec.calculatedValue;
            if (rec.targetValue && rec.targetValue > 0) {
              const direction = rec.targetDirection || 'higher-is-better';
              let ratio = 50;
              if (direction === 'higher-is-better') {
                ratio = Math.min(100, Math.max(0, (score / rec.targetValue) * 100));
              } else {
                ratio = Math.min(100, Math.max(0, (rec.targetValue / Math.max(0.01, score)) * 100));
              }
              totalRatio += ratio;
            } else {
              totalRatio += 65;
            }
          }
        });

        return count > 0 ? Math.round(totalRatio / count) : 0;
      };

      return {
        dimension: `Dim. ${sec.number}`,
        fullTitle: `Dim. ${sec.number}: ${sec.title.split(':')[1]?.trim() || sec.title}`,
        Montecassiano: getMunScore('Comune di Montecassiano'),
        Montefano: getMunScore('Comune di Montefano'),
        Montelupone: getMunScore('Comune di Montelupone'),
      };
    });
  }, [records, selectedYear]);

  // Comparative Radar 2: 4 Direzioni di Intervento (Output) per i 3 Comuni
  const interventionRadarComparisonData = useMemo(() => {
    const currentYearRecs = records.filter((r) => r.year === selectedYear);

    return INTERVENTION_PERSPECTIVES.map((dir, idx) => {
      const dirOutputs = allCalculables.filter(
        (c) => c.level === 'output' && c.dimensionId === `dim${idx + 1}`
      );

      const getMunScore = (munName: MunicipalityName) => {
        let totalRatio = 0;
        let count = 0;

        dirOutputs.forEach((out) => {
          const rec = currentYearRecs.find(
            (r) =>
              r.code === out.code &&
              (r.municipality === munName ||
                (!r.municipality && munName === 'Comune di Montecassiano'))
          );
          if (rec && !rec.isNotAvailable && rec.calculatedValue !== null) {
            count++;
            const score = rec.calculatedValue;
            if (rec.targetValue && rec.targetValue > 0) {
              const direction = rec.targetDirection || 'higher-is-better';
              let ratio = 50;
              if (direction === 'higher-is-better') {
                ratio = Math.min(100, Math.max(0, (score / rec.targetValue) * 100));
              } else {
                ratio = Math.min(100, Math.max(0, (rec.targetValue / Math.max(0.01, score)) * 100));
              }
              totalRatio += ratio;
            } else {
              totalRatio += 60;
            }
          }
        });

        return count > 0 ? Math.round(totalRatio / count) : 0;
      };

      return {
        direction: `Dir. ${dir.number}`,
        fullTitle: `Dir. ${dir.number}: ${dir.title.split(':')[1]?.trim() || dir.title}`,
        Montecassiano: getMunScore('Comune di Montecassiano'),
        Montefano: getMunScore('Comune di Montefano'),
        Montelupone: getMunScore('Comune di Montelupone'),
      };
    });
  }, [records, selectedYear, allCalculables]);

  // Synoptic Comparison Table Rows for selectedYear
  const synopticRows = useMemo(() => {
    const currentYearRecs = records.filter((r) => r.year === selectedYear);
    const targetLevel = isContext ? 'context' : 'output';

    return allCalculables
      .filter((calc) => {
        if (calc.level !== targetLevel) return false;
        if (tableDimensionFilter !== 'all' && calc.dimensionId !== tableDimensionFilter) return false;
        if (tableSearch.trim()) {
          const q = tableSearch.toLowerCase();
          return (
            calc.code.toLowerCase().includes(q) ||
            calc.name.toLowerCase().includes(q) ||
            calc.unit.toLowerCase().includes(q)
          );
        }
        return true;
      })
      .map((calc) => {
        const montecassianoRec = currentYearRecs.find(
          (r) =>
            r.code === calc.code &&
            (r.municipality === 'Comune di Montecassiano' || !r.municipality)
        );
        const montefanoRec = currentYearRecs.find(
          (r) => r.code === calc.code && r.municipality === 'Comune di Montefano'
        );
        const monteluponeRec = currentYearRecs.find(
          (r) => r.code === calc.code && r.municipality === 'Comune di Montelupone'
        );

        const valCassiano =
          montecassianoRec && !montecassianoRec.isNotAvailable && montecassianoRec.calculatedValue !== null
            ? montecassianoRec.calculatedValue
            : null;
        const valFano =
          montefanoRec && !montefanoRec.isNotAvailable && montefanoRec.calculatedValue !== null
            ? montefanoRec.calculatedValue
            : null;
        const valLupone =
          monteluponeRec && !monteluponeRec.isNotAvailable && monteluponeRec.calculatedValue !== null
            ? monteluponeRec.calculatedValue
            : null;

        const validVals = [valCassiano, valFano, valLupone].filter((v): v is number => v !== null);
        const avg =
          validVals.length > 0
            ? Math.round((validVals.reduce((a, b) => a + b, 0) / validVals.length) * 100) / 100
            : null;

        const evalRecord = (rec?: IndicatorRecord) => {
          if (!rec || rec.isNotAvailable || rec.calculatedValue === null) return null;
          return rec.targetValue !== undefined && rec.targetValue !== null
            ? evaluateProgrammingTarget(
                rec.calculatedValue,
                rec.targetValue,
                rec.targetDirection,
                rec.baselineValue,
                calc.level
              )
            : evaluateIndicatorStatus(rec.calculatedValue, undefined, calc.level);
        };

        const statusCassiano = evalRecord(montecassianoRec);
        const statusFano = evalRecord(montefanoRec);
        const statusLupone = evalRecord(monteluponeRec);

        return {
          calc,
          valCassiano,
          valFano,
          valLupone,
          avg,
          statusCassiano,
          statusFano,
          statusLupone,
          montecassianoRec,
          montefanoRec,
          monteluponeRec,
        };
      });
  }, [allCalculables, records, selectedYear, isContext, tableDimensionFilter, tableSearch]);

  // Selected year municipality stats summary cards
  const municipalStats = useMemo(() => {
    const currentYearRecs = records.filter((r) => r.year === selectedYear);
    const targetLevel = isContext ? 'context' : 'output';

    return MUNICIPALITIES.map((mun) => {
      const munRecs = currentYearRecs.filter(
        (r) =>
          (r.municipality === mun.name ||
            (!r.municipality && mun.name === 'Comune di Montecassiano')) &&
          r.indicatorLevel === targetLevel
      );
      const measuredCount = munRecs.length;
      const withTarget = munRecs.filter((r) => r.targetValue !== undefined && r.targetValue !== null);
      const targetMetCount = withTarget.filter((r) => {
        const evalRes = evaluateProgrammingTarget(
          r.calculatedValue,
          r.targetValue!,
          r.targetDirection,
          r.baselineValue,
          r.indicatorLevel
        );
        return evalRes.isTargetMet;
      }).length;

      const arrivalsRec = munRecs.find((r) => r.code === 'CTX-1');
      const arrivals = arrivalsRec ? arrivalsRec.calculatedValue : null;

      const bedsRec = munRecs.find((r) => r.code === 'CTX-2');
      const beds = bedsRec ? bedsRec.calculatedValue : null;

      return {
        ...mun,
        measuredCount,
        withTargetCount: withTarget.length,
        targetMetCount,
        arrivals,
        beds,
      };
    });
  }, [records, selectedYear, isContext]);

  return (
    <div className="space-y-8 animate-fade-in">
      {/* 1. Header & Overview of Comparative Dashboard */}
      <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900 space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-zinc-100 dark:border-zinc-800 pb-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-xs font-black text-amber-600 dark:text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
                <Scale className="h-4 w-4" />
                <span>Modulo di Benchmark &amp; Confronto Intercomunale</span>
              </span>
            </div>
            <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-100">
              Confronto Sinottico: Montecassiano · Montefano · Montelupone
            </h2>
            <p className="text-xs text-zinc-500 dark:text-zinc-400">
              Analisi incrociata e benchmarking delle performance turistiche per l&apos;anno {selectedYear} e trend pluriennale.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {MUNICIPALITIES.map((m) => (
              <button
                key={m.id}
                onClick={() => onSelectMunicipality(m.name)}
                className="flex items-center gap-2 px-3 py-1.5 rounded-xl border text-xs font-bold transition-all hover:scale-[1.02] cursor-pointer"
                style={{
                  backgroundColor: `${m.colorHex}12`,
                  borderColor: `${m.colorHex}40`,
                  color: m.textHex || m.colorHex,
                }}
                title={`Passa alla vista dettagliata di ${m.name}`}
              >
                <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: m.colorHex }} />
                <span>{m.shortName}</span>
                <ArrowRight className="h-3 w-3 opacity-60" />
              </button>
            ))}
          </div>
        </div>

        {/* 3 Overview Cards for each Municipality */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {municipalStats.map((stat) => (
            <div
              key={stat.id}
              className="p-4 rounded-xl border relative overflow-hidden bg-white dark:bg-zinc-900 space-y-3"
              style={{
                borderColor: `${stat.colorHex}40`,
                boxShadow: `0 2px 10px ${stat.colorHex}10`,
              }}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span
                    className="w-3 h-3 rounded-full shrink-0"
                    style={{ backgroundColor: stat.colorHex }}
                  />
                  <h3 className="text-sm font-extrabold text-zinc-900 dark:text-zinc-100">
                    {stat.name}
                  </h3>
                </div>
                <span
                  className="text-[10px] font-bold px-2 py-0.5 rounded-full"
                  style={{
                    backgroundColor: `${stat.colorHex}20`,
                    color: stat.textHex || stat.colorHex,
                  }}
                >
                  Anno {selectedYear}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="p-2.5 rounded-lg bg-zinc-50 dark:bg-zinc-800/60 border border-zinc-100 dark:border-zinc-800">
                  <span className="text-[11px] text-zinc-500 dark:text-zinc-400 block">
                    {isContext ? 'Contesto Rilevati' : 'Output Rilevati'}
                  </span>
                  <span className="text-base font-black text-zinc-900 dark:text-zinc-100">
                    {stat.measuredCount}
                    <span className="text-xs font-normal text-zinc-500"> / {isContext ? 15 : 43}</span>
                  </span>
                </div>

                <div className="p-2.5 rounded-lg bg-zinc-50 dark:bg-zinc-800/60 border border-zinc-100 dark:border-zinc-800">
                  <span className="text-[11px] text-zinc-500 dark:text-zinc-400 block">
                    Target Raggiunti
                  </span>
                  <span className="text-base font-black text-emerald-600 dark:text-emerald-400">
                    {stat.targetMetCount}
                    <span className="text-xs font-normal text-zinc-500"> / {stat.withTargetCount}</span>
                  </span>
                </div>
              </div>

              <div className="pt-1">
                <button
                  onClick={() => onSelectMunicipality(stat.name)}
                  className="w-full text-center text-xs font-bold py-1.5 rounded-lg border transition-colors hover:bg-zinc-100 dark:hover:bg-zinc-800"
                  style={{ color: stat.textHex || stat.colorHex, borderColor: `${stat.colorHex}40` }}
                >
                  Analizza dati singoli di {stat.shortName} →
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 2. Multi-Municipality Comparative Time-Series Chart */}
      <div
        className={`rounded-2xl border-2 p-6 shadow-sm space-y-5 transition-all ${
          isContext
            ? 'border-purple-300 bg-white dark:border-purple-800 dark:bg-zinc-900'
            : 'border-emerald-300 bg-white dark:border-emerald-800 dark:bg-zinc-900'
        }`}
      >
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-zinc-100 dark:border-zinc-800 pb-4">
          <div>
            <div className="flex items-center gap-2">
              <span
                className={`text-xs font-black uppercase tracking-wider flex items-center gap-1.5 ${
                  isContext ? 'text-purple-700 dark:text-purple-400' : 'text-emerald-700 dark:text-emerald-400'
                }`}
              >
                <TrendingUp className="h-4 w-4" />
                <span>
                  {isContext ? 'PILASTRO 1: ANALISI DI CONTESTO' : 'PILASTRO 2: PROSPETTIVE DI INTERVENTO'}
                  {' — SERIE STORICA COMPARATIVA (2023 - 2026)'}
                </span>
              </span>
            </div>
            <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-100">
              Confronto Pluriennale per Indicatore ({isContext ? 'Contesto' : 'Output'})
            </h3>
            <p className="text-xs text-zinc-500 dark:text-zinc-400">
              {isContext
                ? "Visualizza l'evoluzione temporale dei 3 Comuni per i 15 indicatori di contesto diagnostici."
                : "Visualizza l'evoluzione temporale dei 3 Comuni per i 43 indicatori di output collegati alle azioni strategiche."}
            </p>
          </div>

          {/* Controls: Active Pillar Badge, Metric Selector & Chart Type Toggle */}
          <div className="flex flex-wrap items-center gap-2.5">
            {/* Active Pillar Badge */}
            <div
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-black tracking-wide ${
                isContext
                  ? 'bg-purple-100 text-purple-900 border-purple-200 dark:bg-purple-950/70 dark:text-purple-200 dark:border-purple-800'
                  : 'bg-emerald-100 text-emerald-900 border-emerald-200 dark:bg-emerald-950/70 dark:text-emerald-200 dark:border-emerald-800'
              }`}
            >
              <span
                className={`w-2 h-2 rounded-full ${isContext ? 'bg-purple-600' : 'bg-emerald-600'}`}
              />
              <span>{isContext ? '15 Indicatori di Contesto' : '43 Indicatori di Output'}</span>
            </div>

            {/* Indicator Dropdown */}
            <select
              value={activeMetricCode}
              onChange={(e) => setActiveMetricCode(e.target.value)}
              className={`text-xs font-bold rounded-lg border px-3 py-1.5 focus:outline-none max-w-xs shadow-xs transition-colors ${
                isContext
                  ? 'border-purple-300 bg-purple-50/70 text-purple-950 focus:ring-1 focus:ring-purple-500 dark:border-purple-700 dark:bg-purple-950/40 dark:text-purple-100'
                  : 'border-emerald-300 bg-emerald-50/70 text-emerald-950 focus:ring-1 focus:ring-emerald-500 dark:border-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-100'
              }`}
            >
              {filteredCalculablesForChart.map((c) => (
                <option key={c.code} value={c.code}>
                  [{c.code}] {c.name} ({c.unit})
                </option>
              ))}
            </select>

            {/* Chart Type Toggle */}
            <div className="flex items-center rounded-lg border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 p-0.5 text-xs">
              <button
                onClick={() => setChartType('line')}
                className={`p-1.5 rounded-md ${
                  chartType === 'line'
                    ? 'bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 shadow-xs'
                    : 'text-zinc-500 hover:text-zinc-900'
                }`}
                title="Grafico a Linee"
              >
                <TrendingUp className="h-4 w-4" />
              </button>
              <button
                onClick={() => setChartType('bar')}
                className={`p-1.5 rounded-md ${
                  chartType === 'bar'
                    ? 'bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 shadow-xs'
                    : 'text-zinc-500 hover:text-zinc-900'
                }`}
                title="Grafico a Barre Raggruppate"
              >
                <BarChart2 className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Selected Indicator Banner */}
        <div
          className={`p-3 rounded-xl border flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs ${
            activeCalculableObj.level === 'context'
              ? 'bg-purple-50/60 dark:bg-purple-950/20 border-purple-200 dark:border-purple-900/40 text-purple-900 dark:text-purple-200'
              : 'bg-emerald-50/60 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-900/40 text-emerald-900 dark:text-emerald-200'
          }`}
        >
          <div className="flex items-center gap-2">
            <span
              className={`px-2 py-0.5 rounded text-[10px] font-black uppercase text-white ${
                activeCalculableObj.level === 'context' ? 'bg-purple-600' : 'bg-emerald-600'
              }`}
            >
              {activeCalculableObj.level === 'context' ? 'Contesto' : 'Output'}
            </span>
            <span className="font-extrabold text-sm">
              [{activeCalculableObj.code}] {activeCalculableObj.name}
            </span>
          </div>
          <div className="flex items-center gap-4 text-xs">
            <span>
              Unità di misura: <strong>{activeCalculableObj.unit}</strong>
            </span>
            <button
              onClick={() => onSelectIndicatorForCalculation(activeCalculableObj.code)}
              className="flex items-center gap-1 font-bold text-amber-700 dark:text-amber-300 hover:underline cursor-pointer"
            >
              <Calculator className="h-3.5 w-3.5" />
              <span>Calcola nel simulatore</span>
            </button>
          </div>
        </div>

        {/* Time Interval Control Bar for Comparison Chart */}
        <div className="rounded-xl border border-zinc-200 dark:border-zinc-700/80 bg-zinc-50/90 dark:bg-zinc-800/60 p-3 space-y-2.5">
          <div className="flex items-center gap-1.5 font-bold text-zinc-800 dark:text-zinc-200 text-xs">
            <Clock className="h-4 w-4 text-amber-600 dark:text-amber-400 shrink-0" />
            <span>Intervallo Temporale Confronto:</span>
            <span className="font-mono px-2 py-0.5 rounded bg-amber-100 dark:bg-amber-950/60 text-amber-900 dark:text-amber-200 font-extrabold text-[11px] border border-amber-200 dark:border-amber-800">
              {filteredCompYears.length} {filteredCompYears.length === 1 ? 'anno' : 'anni'} ({compStartYear} - {compEndYear})
            </span>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-2.5">
            {/* Da / A Selectors */}
            <div className="flex items-center gap-2 text-xs">
              <div className="flex items-center gap-1.5 bg-white dark:bg-zinc-900 px-2.5 py-1.5 rounded-lg border border-zinc-200 dark:border-zinc-700 shadow-2xs">
                <span className="font-semibold text-zinc-500">Da:</span>
                <select
                  value={compStartYear}
                  onChange={(e) => {
                    const newStart = Number(e.target.value);
                    setCompStartYear(newStart);
                    if (newStart > compEndYear) setCompEndYear(newStart);
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
                  value={compEndYear}
                  onChange={(e) => {
                    const newEnd = Number(e.target.value);
                    setCompEndYear(newEnd);
                    if (newEnd < compStartYear) setCompStartYear(newEnd);
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
                  setCompStartYear(minAvailableYear);
                  setCompEndYear(maxAvailableYear);
                }}
                className={`px-2.5 py-1 rounded-lg font-bold border transition-colors cursor-pointer ${
                  compStartYear === minAvailableYear && compEndYear === maxAvailableYear
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
                    setCompStartYear(start);
                    setCompEndYear(end);
                  }}
                  className={`px-2.5 py-1 rounded-lg font-bold border transition-colors cursor-pointer ${
                    compEndYear === maxAvailableYear &&
                    compStartYear === effectiveAvailableYears[Math.max(0, effectiveAvailableYears.length - 3)] &&
                    !(compStartYear === minAvailableYear && compEndYear === maxAvailableYear)
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

        {/* Chart Canvas */}
        <div className="h-72 w-full pt-2">
          <ResponsiveContainer width="100%" height="100%">
            {chartType === 'line' ? (
              <LineChart
                data={timeSeriesComparisonData}
                margin={{ top: 10, right: 20, left: 0, bottom: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#e4e4e7" opacity={0.6} />
                <XAxis dataKey="year" stroke="#71717a" fontSize={12} tickLine={false} />
                <YAxis stroke="#71717a" fontSize={12} tickLine={false} domain={['auto', 'auto']} />
                <Tooltip
                  content={({ active, payload, label }) => {
                    if (active && payload && payload.length) {
                      return (
                        <div className="rounded-xl border border-zinc-200 bg-white/95 backdrop-blur-md p-3 shadow-lg dark:border-zinc-800 dark:bg-zinc-900/95 text-xs space-y-1.5">
                          <div className="font-bold text-zinc-900 dark:text-zinc-100 border-b pb-1">
                            Anno: {label} — {activeCalculableObj.code}
                          </div>
                          {payload.map((entry: any) => (
                            <div
                              key={entry.name}
                              className="flex items-center justify-between gap-4"
                              style={{ color: entry.color }}
                            >
                              <span className="font-semibold">{entry.name}:</span>
                              <span className="font-black">
                                {entry.value !== null && entry.value !== undefined
                                  ? `${entry.value} ${activeCalculableObj.unit}`
                                  : 'n.d. (Dato non disponibile)'}
                              </span>
                            </div>
                          ))}
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Legend
                  wrapperStyle={{ paddingTop: 12, fontSize: 12 }}
                  formatter={(value) => (
                    <span className="font-semibold text-zinc-700 dark:text-zinc-300">{value}</span>
                  )}
                />
                <Line
                  type="monotone"
                  dataKey="Montecassiano"
                  name="Comune di Montecassiano"
                  stroke="#2563eb"
                  strokeWidth={2.5}
                  dot={{ r: 4, fill: '#2563eb' }}
                  activeDot={{ r: 6 }}
                  connectNulls={false}
                />
                <Line
                  type="monotone"
                  dataKey="Montefano"
                  name="Comune di Montefano"
                  stroke="#eab308"
                  strokeWidth={2.5}
                  dot={{ r: 4, fill: '#eab308' }}
                  activeDot={{ r: 6 }}
                  connectNulls={false}
                />
                <Line
                  type="monotone"
                  dataKey="Montelupone"
                  name="Comune di Montelupone"
                  stroke="#dc2626"
                  strokeWidth={2.5}
                  dot={{ r: 4, fill: '#dc2626' }}
                  activeDot={{ r: 6 }}
                  connectNulls={false}
                />
                <Line
                  type="monotone"
                  dataKey="MediaTerritoriale"
                  name="Media Territoriale (Benchmark)"
                  stroke="#71717a"
                  strokeDasharray="4 4"
                  strokeWidth={2}
                  dot={false}
                  connectNulls={false}
                />
              </LineChart>
            ) : (
              <BarChart
                data={timeSeriesComparisonData}
                margin={{ top: 10, right: 20, left: 0, bottom: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#e4e4e7" opacity={0.6} />
                <XAxis dataKey="year" stroke="#71717a" fontSize={12} tickLine={false} />
                <YAxis stroke="#71717a" fontSize={12} tickLine={false} domain={['auto', 'auto']} />
                <Tooltip
                  content={({ active, payload, label }) => {
                    if (active && payload && payload.length) {
                      return (
                        <div className="rounded-xl border border-zinc-200 bg-white/95 backdrop-blur-md p-3 shadow-lg dark:border-zinc-800 dark:bg-zinc-900/95 text-xs space-y-1.5">
                          <div className="font-bold text-zinc-900 dark:text-zinc-100 border-b pb-1">
                            Anno: {label} — {activeCalculableObj.code}
                          </div>
                          {payload.map((entry: any) => (
                            <div
                              key={entry.name}
                              className="flex items-center justify-between gap-4"
                              style={{ color: entry.color }}
                            >
                              <span className="font-semibold">{entry.name}:</span>
                              <span className="font-black">
                                {entry.value !== null && entry.value !== undefined
                                  ? `${entry.value} ${activeCalculableObj.unit}`
                                  : 'n.d. (Dato non disponibile)'}
                              </span>
                            </div>
                          ))}
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Legend
                  wrapperStyle={{ paddingTop: 12, fontSize: 12 }}
                  formatter={(value) => (
                    <span className="font-semibold text-zinc-700 dark:text-zinc-300">{value}</span>
                  )}
                />
                <Bar dataKey="Montecassiano" name="Comune di Montecassiano" fill="#2563eb" radius={[4, 4, 0, 0]} />
                <Bar dataKey="Montefano" name="Comune di Montefano" fill="#eab308" radius={[4, 4, 0, 0]} />
                <Bar dataKey="Montelupone" name="Comune di Montelupone" fill="#dc2626" radius={[4, 4, 0, 0]} />
              </BarChart>
            )}
          </ResponsiveContainer>
        </div>
      </div>

      {/* 3. Dual Comparative Radar Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Radar 1: Contesto (4 Dimensioni) */}
        <div
          className={`rounded-2xl border-2 p-5 shadow-sm space-y-3 transition-all ${
            isContext
              ? 'border-purple-400 bg-white dark:border-purple-800 dark:bg-zinc-900 ring-2 ring-purple-400/20'
              : 'border-zinc-200 bg-white/70 dark:border-zinc-800 dark:bg-zinc-900/70 opacity-90'
          }`}
        >
          <div className="flex items-center justify-between border-b border-zinc-100 dark:border-zinc-800 pb-2.5">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-purple-600" />
              <h3 className="text-sm font-bold text-zinc-900 dark:text-zinc-100">
                Radar di Contesto (4 Dimensioni) — Anno {selectedYear}
              </h3>
            </div>
            <span className="text-[10px] font-bold uppercase text-purple-700 bg-purple-100 dark:bg-purple-950/60 dark:text-purple-300 px-2 py-0.5 rounded-md">
              Score % Avanzamento
            </span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart data={contextRadarComparisonData}>
                <PolarGrid stroke="#e4e4e7" />
                <PolarAngleAxis dataKey="dimension" stroke="#52525b" fontSize={11} />
                <PolarRadiusAxis angle={30} domain={[0, 100]} stroke="#a1a1aa" fontSize={9} />
                <Tooltip
                  formatter={(val: any, name: any) => [`${val}%`, name]}
                  contentStyle={{
                    backgroundColor: 'rgba(255,255,255,0.95)',
                    borderRadius: '12px',
                    fontSize: '11px',
                  }}
                />
                <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '6px' }} />
                <Radar
                  name="Montecassiano"
                  dataKey="Montecassiano"
                  stroke="#2563eb"
                  fill="#2563eb"
                  fillOpacity={0.25}
                />
                <Radar
                  name="Montefano"
                  dataKey="Montefano"
                  stroke="#eab308"
                  fill="#eab308"
                  fillOpacity={0.25}
                />
                <Radar
                  name="Montelupone"
                  dataKey="Montelupone"
                  stroke="#dc2626"
                  fill="#dc2626"
                  fillOpacity={0.25}
                />
              </RadarChart>
            </ResponsiveContainer>
          </div>
          <p className="text-[11px] text-zinc-500 dark:text-zinc-400 text-center">
            Punteggio calcolato sulla base del rispetto degli standard e target programmati per le 4 dimensioni di contesto.
          </p>
        </div>

        {/* Radar 2: Direzioni di Intervento (4 Direzioni) */}
        <div
          className={`rounded-2xl border-2 p-5 shadow-sm space-y-3 transition-all ${
            !isContext
              ? 'border-emerald-400 bg-white dark:border-emerald-800 dark:bg-zinc-900 ring-2 ring-emerald-400/20'
              : 'border-zinc-200 bg-white/70 dark:border-zinc-800 dark:bg-zinc-900/70 opacity-90'
          }`}
        >
          <div className="flex items-center justify-between border-b border-zinc-100 dark:border-zinc-800 pb-2.5">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-600" />
              <h3 className="text-sm font-bold text-zinc-900 dark:text-zinc-100">
                Radar Prospettive di Intervento (4 Direzioni) — Anno {selectedYear}
              </h3>
            </div>
            <span className="text-[10px] font-bold uppercase text-emerald-700 bg-emerald-100 dark:bg-emerald-950/60 dark:text-emerald-300 px-2 py-0.5 rounded-md">
              Score % Output
            </span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart data={interventionRadarComparisonData}>
                <PolarGrid stroke="#e4e4e7" />
                <PolarAngleAxis dataKey="direction" stroke="#52525b" fontSize={11} />
                <PolarRadiusAxis angle={30} domain={[0, 100]} stroke="#a1a1aa" fontSize={9} />
                <Tooltip
                  formatter={(val: any, name: any) => [`${val}%`, name]}
                  contentStyle={{
                    backgroundColor: 'rgba(255,255,255,0.95)',
                    borderRadius: '12px',
                    fontSize: '11px',
                  }}
                />
                <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '6px' }} />
                <Radar
                  name="Montecassiano"
                  dataKey="Montecassiano"
                  stroke="#2563eb"
                  fill="#2563eb"
                  fillOpacity={0.25}
                />
                <Radar
                  name="Montefano"
                  dataKey="Montefano"
                  stroke="#eab308"
                  fill="#eab308"
                  fillOpacity={0.25}
                />
                <Radar
                  name="Montelupone"
                  dataKey="Montelupone"
                  stroke="#dc2626"
                  fill="#dc2626"
                  fillOpacity={0.25}
                />
              </RadarChart>
            </ResponsiveContainer>
          </div>
          <p className="text-[11px] text-zinc-500 dark:text-zinc-400 text-center">
            Confronto sull&apos;attuazione delle azioni e interventi operativi pianificati dai tre comuni.
          </p>
        </div>
      </div>

      {/* 4. Synoptic Intermunicipal Comparison Table */}
      <div
        className={`rounded-2xl border-2 p-6 shadow-sm space-y-4 transition-all ${
          isContext
            ? 'border-purple-300 bg-white dark:border-purple-800 dark:bg-zinc-900'
            : 'border-emerald-300 bg-white dark:border-emerald-800 dark:bg-zinc-900'
        }`}
      >
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-zinc-100 dark:border-zinc-800 pb-4">
          <div>
            <div className="flex items-center gap-2">
              <span
                className={`text-xs font-black uppercase tracking-wider flex items-center gap-1.5 ${
                  isContext ? 'text-purple-700 dark:text-purple-400' : 'text-emerald-700 dark:text-emerald-400'
                }`}
              >
                <Table className="h-4 w-4" />
                <span>
                  {isContext ? 'PILASTRO 1: ANALISI DI CONTESTO' : 'PILASTRO 2: PROSPETTIVE DI INTERVENTO'}
                  {' — TABELLA SINOTTICA INTERCOMUNALE'}
                </span>
              </span>
            </div>
            <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-100">
              Confronto Dettagliato Indicatori per l&apos;Anno {selectedYear} ({isContext ? 'Contesto' : 'Output'})
            </h3>
            <p className="text-xs text-zinc-500 dark:text-zinc-400">
              {isContext
                ? 'Confronto dei 15 indicatori di contesto per le 4 dimensioni diagnostiche.'
                : 'Confronto dei 43 indicatori di output collegati alle 4 direzioni strategiche di intervento.'}
            </p>
          </div>

          {/* Search and Filters */}
          <div className="flex flex-wrap items-center gap-2.5">
            <div className="relative">
              <Search className="h-3.5 w-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-zinc-400" />
              <input
                type="text"
                value={tableSearch}
                onChange={(e) => setTableSearch(e.target.value)}
                placeholder="Cerca indicatore..."
                className="text-xs rounded-lg border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 pl-8 pr-3 py-1.5 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-1 focus:ring-amber-500 w-40 sm:w-48"
              />
            </div>

            {/* Active Pillar Badge */}
            <div
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-black tracking-wide ${
                isContext
                  ? 'bg-purple-100 text-purple-900 border-purple-200 dark:bg-purple-950/70 dark:text-purple-200 dark:border-purple-800'
                  : 'bg-emerald-100 text-emerald-900 border-emerald-200 dark:bg-emerald-950/70 dark:text-emerald-200 dark:border-emerald-800'
              }`}
            >
              <span
                className={`w-2 h-2 rounded-full ${isContext ? 'bg-purple-600' : 'bg-emerald-600'}`}
              />
              <span>{isContext ? '15 Contesto' : '43 Output'}</span>
            </div>

            {/* Dimension/Direction Filter */}
            <select
              value={tableDimensionFilter}
              onChange={(e) => setTableDimensionFilter(e.target.value)}
              className={`text-xs font-semibold rounded-lg border px-2.5 py-1.5 focus:outline-none transition-colors ${
                isContext
                  ? 'border-purple-300 bg-purple-50/70 text-purple-950 focus:ring-1 focus:ring-purple-500 dark:border-purple-700 dark:bg-purple-950/40 dark:text-purple-100'
                  : 'border-emerald-300 bg-emerald-50/70 text-emerald-950 focus:ring-1 focus:ring-emerald-500 dark:border-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-100'
              }`}
            >
              {isContext ? (
                <>
                  <option value="all">Tutte le 4 Dimensioni di Analisi</option>
                  {DIMENSIONS.map((d) => (
                    <option key={d.id} value={d.id}>
                      Dim. {d.number}: {d.title}
                    </option>
                  ))}
                </>
              ) : (
                <>
                  <option value="all">Tutte le 4 Direzioni di Intervento</option>
                  <option value="dim1">Dir. 1: Riequilibrio e destagionalizzazione dei flussi</option>
                  <option value="dim2">Dir. 2: Mitigazione dell&apos;impronta ecologica turistica</option>
                  <option value="dim3">Dir. 3: Incremento mobilità dolce e accessibilità</option>
                  <option value="dim4">Dir. 4: Tutela resilienza demografica e valorizzazione locale</option>
                </>
              )}
            </select>
          </div>
        </div>

        {/* Table Content */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-zinc-200 dark:border-zinc-800 bg-zinc-50/80 dark:bg-zinc-800/60 text-zinc-600 dark:text-zinc-400">
                <th className="py-3 px-3 font-bold">Indicatore</th>
                <th className="py-3 px-3 font-bold text-center text-blue-700 dark:text-blue-400">
                  <div className="flex items-center justify-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-blue-600" />
                    <span>Montecassiano</span>
                  </div>
                </th>
                <th className="py-3 px-3 font-bold text-center text-yellow-800 dark:text-yellow-300">
                  <div className="flex items-center justify-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-yellow-500" />
                    <span>Montefano</span>
                  </div>
                </th>
                <th className="py-3 px-3 font-bold text-center text-red-700 dark:text-red-400">
                  <div className="flex items-center justify-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-red-600" />
                    <span>Montelupone</span>
                  </div>
                </th>
                <th className="py-3 px-3 font-bold text-center text-zinc-700 dark:text-zinc-300">
                  Media Territoriale
                </th>
                <th className="py-3 px-3 font-bold text-right">Azione</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800/60">
              {synopticRows.map(
                ({
                  calc,
                  valCassiano,
                  valFano,
                  valLupone,
                  avg,
                  statusCassiano,
                  statusFano,
                  statusLupone,
                }) => {
                  const isContext = calc.level === 'context';

                  return (
                    <tr
                      key={calc.code}
                      className="hover:bg-zinc-50/80 dark:hover:bg-zinc-800/40 transition-colors"
                    >
                      <td className="py-3 px-3">
                        <div className="flex items-start gap-2">
                          <span
                            className={`px-1.5 py-0.5 rounded text-[10px] font-black uppercase text-white shrink-0 mt-0.5 ${
                              isContext ? 'bg-purple-600' : 'bg-emerald-600'
                            }`}
                          >
                            {calc.code}
                          </span>
                          <div>
                            <span className="font-bold text-zinc-900 dark:text-zinc-100">
                              {calc.name}
                            </span>
                            <span className="text-[11px] text-zinc-500 dark:text-zinc-400 block">
                              Unità: {calc.unit}
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* Montecassiano */}
                      <td className="py-3 px-3 text-center">
                        {valCassiano !== null ? (
                          <div className="inline-flex flex-col items-center">
                            <span className="font-extrabold text-zinc-900 dark:text-zinc-100">
                              {formatValueWithUnit(valCassiano, calc.unit)}
                            </span>
                            {statusCassiano && (
                              <span
                                className="text-[10px] font-bold px-1.5 py-0.2 rounded"
                                style={{
                                  backgroundColor: `${statusCassiano.color}15`,
                                  color: statusCassiano.color,
                                }}
                              >
                                {statusCassiano.label}
                              </span>
                            )}
                          </div>
                        ) : (
                          <span className="inline-block px-2 py-0.5 rounded text-[11px] font-bold border border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-800/60 dark:bg-amber-950/40 dark:text-amber-300">
                            n.d.
                          </span>
                        )}
                      </td>

                      {/* Montefano */}
                      <td className="py-3 px-3 text-center">
                        {valFano !== null ? (
                          <div className="inline-flex flex-col items-center">
                            <span className="font-extrabold text-zinc-900 dark:text-zinc-100">
                              {formatValueWithUnit(valFano, calc.unit)}
                            </span>
                            {statusFano && (
                              <span
                                className="text-[10px] font-bold px-1.5 py-0.2 rounded"
                                style={{
                                  backgroundColor: `${statusFano.color}15`,
                                  color: statusFano.color,
                                }}
                              >
                                {statusFano.label}
                              </span>
                            )}
                          </div>
                        ) : (
                          <span className="inline-block px-2 py-0.5 rounded text-[11px] font-bold border border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-800/60 dark:bg-amber-950/40 dark:text-amber-300">
                            n.d.
                          </span>
                        )}
                      </td>

                      {/* Montelupone */}
                      <td className="py-3 px-3 text-center">
                        {valLupone !== null ? (
                          <div className="inline-flex flex-col items-center">
                            <span className="font-extrabold text-zinc-900 dark:text-zinc-100">
                              {formatValueWithUnit(valLupone, calc.unit)}
                            </span>
                            {statusLupone && (
                              <span
                                className="text-[10px] font-bold px-1.5 py-0.2 rounded"
                                style={{
                                  backgroundColor: `${statusLupone.color}15`,
                                  color: statusLupone.color,
                                }}
                              >
                                {statusLupone.label}
                              </span>
                            )}
                          </div>
                        ) : (
                          <span className="inline-block px-2 py-0.5 rounded text-[11px] font-bold border border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-800/60 dark:bg-amber-950/40 dark:text-amber-300">
                            n.d.
                          </span>
                        )}
                      </td>

                      {/* Media */}
                      <td className="py-3 px-3 text-center font-bold text-zinc-700 dark:text-zinc-300">
                        {avg !== null ? (
                          <span className="bg-zinc-100 dark:bg-zinc-800 px-2 py-1 rounded-md">
                            {formatValueWithUnit(avg, calc.unit)}
                          </span>
                        ) : (
                          <span className="text-zinc-400">—</span>
                        )}
                      </td>

                      {/* Action */}
                      <td className="py-3 px-3 text-right">
                        <button
                          onClick={() => onSelectIndicatorForCalculation(calc.code)}
                          className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-700 dark:text-amber-300 hover:text-amber-900 dark:hover:text-amber-100 bg-amber-50 hover:bg-amber-100 dark:bg-amber-950/40 dark:hover:bg-amber-900/60 px-2.5 py-1 rounded-lg transition-colors cursor-pointer"
                        >
                          <Calculator className="h-3 w-3" />
                          <span>Calcola</span>
                        </button>
                      </td>
                    </tr>
                  );
                }
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
