import React, { useState, useEffect, useMemo } from 'react';
import {
  CONTEXT_INDICATORS,
  DIMENSIONS,
  getAllCalculableIndicators,
  getCalculableIndicatorByCode,
} from '../data/matrixData';
import { CalculableIndicator, IndicatorRecord, MunicipalityName, MUNICIPALITIES } from '../types';
import { evaluateProgrammingTarget, formatValueWithUnit } from '../utils/calculator';
import {
  getSharedParamDefinition,
  getSharedParamCurrentValue,
  getOtherIndicatorsForParam,
} from '../utils/sharedVariables';
import {
  Calculator,
  Save,
  CheckCircle2,
  RotateCcw,
  Sparkles,
  Sliders,
  Building2,
  FileText,
  Target,
  ArrowRight,
  Layers,
  Compass,
  Zap,
  Info,
  MapPin,
  Bike,
  Hotel,
  ExternalLink,
  Edit3,
  AlertCircle,
  Link2,
  Plus,
  Trash2,
  Calendar,
  ListChecks,
  Bus,
} from 'lucide-react';
import { InteractiveMapEmbed } from './InteractiveMapEmbed';

interface IndicatorCalculatorProps {
  selectedOutputCode: string;
  setSelectedOutputCode: (code: string) => void;
  selectedYear: number;
  setSelectedYear?: (year: number) => void;
  availableYears?: number[];
  onSaveRecord: (record: IndicatorRecord) => void;
  onSyncSharedParam?: (
    municipality: MunicipalityName,
    year: number,
    paramKey: string,
    newValue: number
  ) => void;
  records?: IndicatorRecord[];
  selectedMunicipality: MunicipalityName;
  setSelectedMunicipality: (municipality: MunicipalityName) => void;
  onOpenAddYearModal?: () => void;
}

export const IndicatorCalculator: React.FC<IndicatorCalculatorProps> = ({
  selectedOutputCode,
  setSelectedOutputCode,
  selectedYear,
  setSelectedYear,
  availableYears = [2023, 2024, 2025, 2026, 2027],
  onSaveRecord,
  onSyncSharedParam,
  records,
  selectedMunicipality,
  setSelectedMunicipality,
  onOpenAddYearModal,
}) => {
  const allCalculableList = useMemo(() => getAllCalculableIndicators(), []);

  // Unique list of 43 Output Indicators without redundancies
  const outputIndicatorsList = useMemo(() => {
    return allCalculableList.filter((ind) => ind.level === 'output');
  }, [allCalculableList]);

  // Find active calculable indicator
  const activeIndicator: CalculableIndicator = useMemo(() => {
    const found = getCalculableIndicatorByCode(selectedOutputCode);
    if (found) return found;
    return allCalculableList[0];
  }, [selectedOutputCode, allCalculableList]);

  // Output indicators influencing active context indicator
  const contextOutputIndicators = useMemo(() => {
    if (activeIndicator.level !== 'context') return [];
    if (
      activeIndicator.code === 'CTX-1' ||
      activeIndicator.code === 'CTX-2' ||
      activeIndicator.code === 'CTX-3' ||
      activeIndicator.code === 'CTX-4' ||
      activeIndicator.code === 'CTX-5' ||
      activeIndicator.name.includes('Intensità turistica')
    ) {
      const allowedCodes = [
        'TCOE', 'TCOI', 'ISPR', 'IERT', 'TRUV', 'ICS', 'IVS', 'SPD',
        'IDS', 'ICSM', 'IALV', 'TOEI', 'TOEO', 'TDE', 'IPSW', 'INDI', 'TUIP'
      ];
      const sourceList =
        activeIndicator.outputIndicators && activeIndicator.outputIndicators.length > 0
          ? activeIndicator.outputIndicators
          : outputIndicatorsList;
      return sourceList.filter((o) => allowedCodes.includes(o.code));
    }
    if (activeIndicator.code === 'CTX-6' || activeIndicator.name.includes('Stagionalità')) {
      const allowedCodes = ['TOEI', 'TOEO', 'TDE', 'IPSW', 'INDI', 'TUIP'];
      const sourceList =
        activeIndicator.outputIndicators && activeIndicator.outputIndicators.length > 0
          ? activeIndicator.outputIndicators
          : outputIndicatorsList;
      return sourceList.filter((o) => allowedCodes.includes(o.code));
    }
    if (activeIndicator.code === 'CTX-7' || activeIndicator.name.includes('Rifiuti prodotti dal turismo')) {
      const allowedCodes = ['TFEC', 'TFKE', 'TST', 'IAC', 'IDAP', 'TPCA'];
      const sourceList =
        activeIndicator.outputIndicators && activeIndicator.outputIndicators.length > 0
          ? activeIndicator.outputIndicators
          : outputIndicatorsList;
      return sourceList.filter((o) => allowedCodes.includes(o.code));
    }
    if (activeIndicator.code === 'CTX-8' || activeIndicator.name.includes('Consumo idrico')) {
      const allowedCodes = ['TFRI', 'TDRF', 'TDRAG'];
      const sourceList =
        activeIndicator.outputIndicators && activeIndicator.outputIndicators.length > 0
          ? activeIndicator.outputIndicators
          : outputIndicatorsList;
      return sourceList.filter((o) => allowedCodes.includes(o.code));
    }
    if (activeIndicator.code === 'CTX-9' || activeIndicator.name.includes('Intensità energetica')) {
      const allowedCodes = ['TFTE', 'TPR', 'PRPL', 'TPCT', 'TIEA', 'TIEP'];
      const sourceList =
        activeIndicator.outputIndicators && activeIndicator.outputIndicators.length > 0
          ? activeIndicator.outputIndicators
          : outputIndicatorsList;
      return sourceList.filter((o) => allowedCodes.includes(o.code));
    }
    if (
      activeIndicator.code === 'CTX-10' ||
      activeIndicator.name.includes('Posti letto totali') ||
      activeIndicator.code === 'CTX-11' ||
      activeIndicator.name.includes('agriturismi')
    ) {
      const allowedCodes = ['TIFTA', 'IOT', 'TBPIG', 'TNIG'];
      const sourceList =
        activeIndicator.outputIndicators && activeIndicator.outputIndicators.length > 0
          ? activeIndicator.outputIndicators
          : outputIndicatorsList;
      return sourceList.filter((o) => allowedCodes.includes(o.code));
    }
    if (
      activeIndicator.code === 'CTX-12' ||
      activeIndicator.name.includes('cicloturistica') ||
      activeIndicator.code === 'CTX-13' ||
      activeIndicator.name.includes('Punti di ricarica')
    ) {
      const allowedCodes = ['TCIC', 'DMD', 'IDPRE', 'IDPMH', 'IDEMH', 'IMS'];
      const sourceList =
        activeIndicator.outputIndicators && activeIndicator.outputIndicators.length > 0
          ? activeIndicator.outputIndicators
          : outputIndicatorsList;
      return sourceList.filter((o) => allowedCodes.includes(o.code));
    }
    if (
      activeIndicator.code === 'CTX-14' ||
      activeIndicator.name.includes('popolazione residente a 5 anni') ||
      activeIndicator.code === 'CTX-15' ||
      activeIndicator.name.includes('Densità imprenditoriale')
    ) {
      const allowedCodes = ['TIFTA', 'IOT', 'TBPIG', 'TNIG'];
      const sourceList =
        activeIndicator.outputIndicators && activeIndicator.outputIndicators.length > 0
          ? activeIndicator.outputIndicators
          : outputIndicatorsList;
      return sourceList.filter((o) => allowedCodes.includes(o.code));
    }
    return activeIndicator.outputIndicators || [];
  }, [activeIndicator, outputIndicatorsList]);

  const currentDimension = DIMENSIONS.find((d) => d.id === activeIndicator.dimensionId);

  // Local state for dynamic input parameters
  const [paramValues, setParamValues] = useState<Record<string, number>>({});
  const [notes, setNotes] = useState('');
  const [saveSuccessMessage, setSaveSuccessMessage] = useState('');
  const [isNotAvailable, setIsNotAvailable] = useState<boolean>(() => activeIndicator.level === 'output');

  // User-defined Programming Target & Baseline state (no suggested pre-set defaults)
  const [customTarget, setCustomTarget] = useState<number | undefined>(undefined);
  const [targetDirection, setTargetDirection] = useState<'higher-is-better' | 'lower-is-better'>('higher-is-better');
  const [baselineValue, setBaselineValue] = useState<number | undefined>(undefined);

  // State for IAC CAM Events calculation assistant (Si, Ai, Gi)
  const [camEvents, setCamEvents] = useState<Array<{ id: string; name: string; si: number; ai: number; gi: number }>>([
    { id: 'ev-1', name: "Festival dell'Artigianato e Borgo Sostenibile", si: 12, ai: 15, gi: 4 },
    { id: 'ev-2', name: 'Fiera Enogastronomica Tipica Marchigiana', si: 8, ai: 12, gi: 3 },
    { id: 'ev-3', name: 'Notte della Musica e Tradizioni Popolari', si: 6, ai: 12, gi: 2 },
  ]);
  const [appliedCamFeedback, setAppliedCamFeedback] = useState<boolean>(false);

  // State for IMS Mobility Services calculation assistant (Voce 1: Eventi)
  const [imsEvents, setImsEvents] = useState<Array<{ id: string; name: string; connections: number }>>([
    { id: 'ims-ev-1', name: 'Festa Medievale / Rievocazione Storica', connections: 8 },
    { id: 'ims-ev-2', name: 'Fiera Enogastronomica e Mercato Tipico', connections: 6 },
    { id: 'ims-ev-3', name: 'Notte Bianca nel Borgo', connections: 6 },
    { id: 'ims-ev-4', name: "Festival Culturale / Rassegna d'Estate", connections: 4 },
  ]);
  const [appliedImsFeedback, setAppliedImsFeedback] = useState<boolean>(false);

  // Check if a record already exists for active indicator, year, and selected municipality
  const existingRecordForCurrent = useMemo(() => {
    return records?.find(
      (r) =>
        r.code === activeIndicator.code &&
        r.year === selectedYear &&
        (r.municipality === selectedMunicipality ||
          (!r.municipality && selectedMunicipality === 'Comune di Montecassiano'))
    );
  }, [records, activeIndicator.code, selectedYear, selectedMunicipality]);

  // Initialize parameter values & target when active indicator, year, or municipality changes
  useEffect(() => {
    if (activeIndicator) {
      setSaveSuccessMessage('');

      const initial: Record<string, number> = {};
      activeIndicator.params.forEach((p) => {
        const sharedDef = getSharedParamDefinition(p.key);
        let valFromRecord: number | undefined = undefined;

        if (existingRecordForCurrent?.paramsUsed) {
          if (typeof existingRecordForCurrent.paramsUsed[p.key] === 'number') {
            valFromRecord = existingRecordForCurrent.paramsUsed[p.key];
          } else if (sharedDef) {
            for (const lk of sharedDef.legacyKeys) {
              if (typeof existingRecordForCurrent.paramsUsed[lk] === 'number') {
                valFromRecord = existingRecordForCurrent.paramsUsed[lk];
                break;
              }
            }
          }
        }

        if (valFromRecord !== undefined) {
          initial[p.key] = valFromRecord;
        } else {
          // Check if shared parameter value is already set in another record for this municipality & year
          const sharedVal = records
            ? getSharedParamCurrentValue(records, selectedMunicipality, selectedYear, p.key, p.defaultValue)
            : p.defaultValue;
          initial[p.key] = sharedVal ?? p.defaultValue;
        }
      });
      setParamValues(initial);

      if (existingRecordForCurrent) {
        setIsNotAvailable(Boolean(existingRecordForCurrent.isNotAvailable || existingRecordForCurrent.calculatedValue === null));
        setNotes(existingRecordForCurrent.notes || '');

        if (existingRecordForCurrent.targetValue !== undefined && existingRecordForCurrent.targetValue !== null) {
          setCustomTarget(existingRecordForCurrent.targetValue);
          setTargetDirection(existingRecordForCurrent.targetDirection || 'higher-is-better');
          setBaselineValue(existingRecordForCurrent.baselineValue);
        } else {
          setCustomTarget(undefined);
          setTargetDirection('higher-is-better');
          setBaselineValue(undefined);
        }
      } else {
        // No saved record for this municipality yet (output indicators default to n.d.)
        setIsNotAvailable(activeIndicator.level === 'output');
        setNotes('');
        setCustomTarget(undefined);
        setTargetDirection('higher-is-better');
        setBaselineValue(undefined);
      }
    }
  }, [
    activeIndicator.code,
    selectedYear,
    selectedMunicipality,
    existingRecordForCurrent?.id,
    existingRecordForCurrent?.timestamp,
  ]);

  // Calculate live value
  const calculatedValue = useMemo(() => {
    if (!activeIndicator) return 0;
    try {
      const val = activeIndicator.calculate(paramValues);
      return isNaN(val) || !isFinite(val) ? 0 : val;
    } catch {
      return 0;
    }
  }, [activeIndicator, paramValues]);

  // Live Programming Target Evaluation based on manually entered objective
  const programmingEval = useMemo(() => {
    if (isNotAvailable) {
      return evaluateProgrammingTarget(
        null,
        customTarget,
        targetDirection,
        baselineValue,
        activeIndicator.level
      );
    }
    return evaluateProgrammingTarget(
      calculatedValue,
      customTarget,
      targetDirection,
      baselineValue,
      activeIndicator.level
    );
  }, [isNotAvailable, calculatedValue, customTarget, targetDirection, baselineValue, activeIndicator.level]);

  // Handle parameter value change with auto-synchronization for shared parameters
  const handleParamChange = (key: string, value: number) => {
    const cleanVal = value < 0 ? 0 : value;
    setParamValues((prev) => ({
      ...prev,
      [key]: cleanVal,
    }));

    // Sincronizzazione automatica se è una variabile/parametro condiviso
    const sharedDef = getSharedParamDefinition(key);
    if (sharedDef && onSyncSharedParam) {
      onSyncSharedParam(selectedMunicipality, selectedYear, sharedDef.key, cleanVal);
    }
  };

  // Preset scenarios
  const applyPresetScenario = (multiplier: number) => {
    if (isNotAvailable) {
      setIsNotAvailable(false);
    }
    const updated: Record<string, number> = {};
    activeIndicator.params.forEach((p) => {
      updated[p.key] = Math.round(p.defaultValue * multiplier * 10) / 10;
    });
    setParamValues(updated);
  };

  // Reset to default parameters
  const handleReset = () => {
    setIsNotAvailable(activeIndicator.level === 'output');
    const initial: Record<string, number> = {};
    activeIndicator.params.forEach((p) => {
      initial[p.key] = p.defaultValue;
    });
    setParamValues(initial);
  };

  // Save record to monitoring history
  const handleSave = () => {
    const hasTarget = !isNotAvailable && customTarget !== undefined && !isNaN(customTarget);
    const newRecord: IndicatorRecord = {
      id: existingRecordForCurrent?.id || `rec-${selectedMunicipality.toLowerCase().replace(/[^a-z0-9]/g, '')}-${selectedYear}-${activeIndicator.code}-${Date.now()}`,
      code: activeIndicator.code,
      indicatorName: activeIndicator.name,
      indicatorLevel: activeIndicator.level,
      dimensionId: activeIndicator.dimensionId,
      year: selectedYear,
      calculatedValue: isNotAvailable ? null : Math.round(calculatedValue * 100) / 100,
      unit: activeIndicator.unit,
      paramsUsed: { ...paramValues },
      timestamp: new Date().toISOString(),
      municipality: selectedMunicipality,
      isNotAvailable: isNotAvailable,
      notes: notes.trim() || undefined,
      targetValue: hasTarget ? customTarget : undefined,
      targetDirection: hasTarget ? targetDirection : undefined,
      baselineValue: hasTarget ? (baselineValue ?? 0) : undefined,
      progressPercentage: hasTarget && programmingEval.progressPercent !== null ? programmingEval.progressPercent : undefined,
    };

    onSaveRecord(newRecord);
    setSaveSuccessMessage(
      isNotAvailable
        ? `Rilevazione contrassegnata come "n.d." (Dato non disponibile) per ${selectedMunicipality} (Anno ${selectedYear})! [${activeIndicator.code}: n.d.]`
        : hasTarget && programmingEval.progressPercent !== null
        ? `Calcolo registrato per ${selectedMunicipality} (Anno ${selectedYear})! [${activeIndicator.code}: ${formatValueWithUnit(
            calculatedValue,
            activeIndicator.unit
          )} - Target: ${customTarget} ${activeIndicator.unit}, Avanzamento: ${programmingEval.progressPercent}%]`
        : `Calcolo registrato per ${selectedMunicipality} (Anno ${selectedYear})! [${activeIndicator.code}: ${formatValueWithUnit(
            calculatedValue,
            activeIndicator.unit
          )}]`
    );

    setTimeout(() => {
      setSaveSuccessMessage('');
    }, 4500);
  };

  const activeMunInfo =
    MUNICIPALITIES.find((m) => m.name === selectedMunicipality) || MUNICIPALITIES[0];

  return (
    <div className="space-y-6">
      {/* PANNELLO INIZIALE UNIFICATO: INTRODUZIONE SEZIONE & SELEZIONE UTENTE / ENTE */}
      <div className="rounded-2xl border border-zinc-200 bg-white p-4 sm:p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-900 space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-black text-amber-600 dark:text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
                <Calculator className="h-4 w-4" />
                <span>Modulo di Calcolo Parametrico &amp; Rilevazione</span>
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-zinc-900 dark:text-zinc-100 mt-0.5">
              Calcolatore degli Indicatori
            </h2>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
              Inserisci i parametri numerici di input, calcola il valore dell&apos;indicatore e registra le rilevazioni storiche per il comune attivo.
            </p>
          </div>

          {/* Selector Dropdown with 2 Levels (Peculiarità Sezione Calcolatore) */}
          <div className="w-full md:w-auto shrink-0">
            <label className="block text-xs font-semibold text-zinc-500 dark:text-zinc-400 mb-1">
              Seleziona Indicatore da Calcolare:
            </label>
            <select
              value={activeIndicator.code}
              onChange={(e) => setSelectedOutputCode(e.target.value)}
              className={`w-full md:w-84 rounded-xl border px-3 py-2 text-xs font-bold focus:outline-none cursor-pointer shadow-xs transition-all ${
                activeIndicator.level === 'context'
                  ? 'border-purple-300 bg-purple-50/80 text-purple-950 focus:border-purple-600 focus:ring-2 focus:ring-purple-400/30 dark:border-purple-700 dark:bg-purple-950/60 dark:text-purple-100'
                  : 'border-emerald-300 bg-emerald-50/80 text-emerald-950 focus:border-emerald-600 focus:ring-2 focus:ring-emerald-400/30 dark:border-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-100'
              }`}
            >
              {/* Context Indicators with Purple Background */}
              <optgroup
                label="🟣 1. ANALISI DI CONTESTO (15 Indicatori di Contesto)"
                style={{ backgroundColor: '#f3e8ff', color: '#581c87', fontWeight: 'bold' }}
              >
                {CONTEXT_INDICATORS.map((ctx) => (
                  <option
                    key={ctx.code}
                    value={ctx.code}
                    style={{ backgroundColor: '#faf5ff', color: '#3b0764' }}
                  >
                    {ctx.number}. {ctx.name} ({ctx.unit})
                  </option>
                ))}
              </optgroup>

              {/* Output Indicators with Green Background */}
              <optgroup
                label="🟢 2. PROSPETTIVE DI INTERVENTO (43 Indicatori di Output)"
                style={{ backgroundColor: '#d1fae5', color: '#065f46', fontWeight: 'bold' }}
              >
                {outputIndicatorsList.map((out) => (
                  <option
                    key={out.code}
                    value={out.code}
                    style={{ backgroundColor: '#ecfdf5', color: '#064e3b' }}
                  >
                    [{out.code}] {out.name} ({out.unit})
                  </option>
                ))}
              </optgroup>
            </select>
          </div>
        </div>

        {/* Macro Structure Switcher (Analisi di Contesto vs Prospettive di Intervento) */}
        <div className="pt-3 border-t border-zinc-100 dark:border-zinc-800 grid grid-cols-1 sm:grid-cols-2 gap-3">
          <button
            type="button"
            id="btn-calc-macro-context"
            onClick={() => {
              if (activeIndicator.level !== 'context') {
                setSelectedOutputCode(CONTEXT_INDICATORS[0].code);
              }
            }}
            className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer ${
              activeIndicator.level === 'context'
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
                  activeIndicator.level === 'context'
                    ? 'bg-purple-900 text-purple-100'
                    : 'bg-purple-100 text-purple-800 dark:bg-purple-900/60 dark:text-purple-300'
                }`}
              >
                {CONTEXT_INDICATORS.length} Indicatori
              </span>
            </div>
            <p className="text-xs opacity-85 leading-tight">
              4 Dimensioni di analisi e 15 indicatori di contesto diagnostici (CTX-1...CTX-15).
            </p>
          </button>

          <button
            type="button"
            id="btn-calc-macro-intervention"
            onClick={() => {
              if (activeIndicator.level !== 'output') {
                setSelectedOutputCode(outputIndicatorsList[0]?.code || 'TCOE');
              }
            }}
            className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer ${
              activeIndicator.level === 'output'
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
                  activeIndicator.level === 'output'
                    ? 'bg-emerald-900 text-emerald-100'
                    : 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/60 dark:text-emerald-300'
                }`}
              >
                {outputIndicatorsList.length} Output
              </span>
            </div>
            <p className="text-xs opacity-85 leading-tight">
              4 Direzioni strategiche, Assi d&apos;intervento, Azioni e Indicatori di Output.
            </p>
          </button>
        </div>
      </div>

      {/* Card Dettaglio Indicatore e Formula di Calcolo */}
      <div className={`rounded-2xl border-2 p-5 sm:p-6 space-y-4 shadow-sm ${
        activeIndicator.level === 'context'
          ? 'bg-purple-100 border-purple-300 dark:bg-purple-950 dark:border-purple-800'
          : 'bg-emerald-100 border-emerald-300 dark:bg-emerald-950 dark:border-emerald-800'
      }`}>
        <div className="space-y-3">
          <div className="flex flex-wrap items-center gap-2">
            {/* Level Pill */}
            <span className={`inline-flex items-center gap-1.5 font-mono text-xs font-bold px-2.5 py-1 rounded-md border ${
              activeIndicator.level === 'context'
                ? 'bg-purple-600 text-white border-purple-700 shadow-xs'
                : 'bg-emerald-600 text-white border-emerald-700 shadow-xs'
            }`}>
              {activeIndicator.level === 'context' ? (
                <>
                  <Layers className="h-3.5 w-3.5" />
                  <span>Indicatore di Contesto</span>
                </>
              ) : (
                <>
                  <Zap className="h-3.5 w-3.5" />
                  <span>Indicatore di Output degli interventi</span>
                </>
              )}
            </span>

            {activeIndicator.level === 'output' && (
              <span className="font-mono text-xs font-bold text-zinc-800 bg-white px-2 py-1 rounded border border-zinc-200 dark:bg-zinc-800 dark:text-zinc-200 dark:border-zinc-700">
                {activeIndicator.code}
              </span>
            )}

            <h3 className="text-base font-bold text-zinc-900 dark:text-zinc-100">
              {activeIndicator.name}
            </h3>
          </div>

          {/* Unica etichetta: Dimensione/Direzione + Profilo Comunale/Intervento */}
          {activeIndicator.level === 'context' ? (
            <div className="flex items-start sm:items-center gap-2.5 text-xs py-2 px-3 rounded-xl bg-purple-200/90 dark:bg-purple-900/70 text-purple-950 dark:text-purple-100 border border-purple-300 dark:border-purple-700 shadow-xs">
              <Info className="h-4 w-4 shrink-0 text-purple-700 dark:text-purple-300 mt-0.5 sm:mt-0" />
              <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
                <span className="font-extrabold uppercase tracking-wide px-2 py-0.5 rounded bg-purple-300/80 dark:bg-purple-800 text-purple-950 dark:text-purple-100 text-[11px] border border-purple-400/50 dark:border-purple-600">
                  Dimensione {currentDimension?.number}: {currentDimension?.title}
                </span>
                <span className="text-purple-950 dark:text-purple-200 font-medium">
                  <strong>Profilo Comunale:</strong> Questo indicatore descrive il profilo del Comune dal punto di vista delle performance legate al turismo
                </span>
              </div>
            </div>
          ) : (
            <div className="flex items-start sm:items-center gap-2.5 text-xs py-2 px-3 rounded-xl bg-emerald-200/90 dark:bg-emerald-900/70 text-emerald-950 dark:text-emerald-100 border border-emerald-300 dark:border-emerald-700 shadow-xs">
              <Target className="h-4 w-4 shrink-0 text-emerald-700 dark:text-emerald-300 mt-0.5 sm:mt-0" />
              <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
                <span className="font-extrabold uppercase tracking-wide px-2 py-0.5 rounded bg-emerald-300/80 dark:bg-emerald-800 text-emerald-950 dark:text-emerald-100 text-[11px] border border-emerald-400/50 dark:border-emerald-600">
                  {activeIndicator.direzioneTitle || (currentDimension ? `Direzione Dimensione ${currentDimension.number}` : '')}
                </span>
                <span className="text-emerald-950 dark:text-emerald-200 font-medium">
                  <strong>Indicatore mirato all&apos;intervento:</strong> {activeIndicator.interventionTitle || activeIndicator.parentContextName}
                </span>
              </div>
            </div>
          )}
        </div>

        <p className="text-xs text-zinc-700 dark:text-zinc-300 leading-relaxed font-normal">
          {activeIndicator.description}
        </p>

          {/* Formula Display */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-2 text-xs font-mono bg-white/90 dark:bg-zinc-900/90 p-2.5 rounded-lg border border-zinc-200/80 dark:border-zinc-800">
            <span className={`font-bold ${
              activeIndicator.level === 'context'
                ? 'text-purple-700 dark:text-purple-400'
                : 'text-emerald-700 dark:text-emerald-400'
            }`}>
              Formula di Calcolo:
            </span>
            <code className="text-zinc-800 dark:text-zinc-200">
              {activeIndicator.formulaDisplay}
            </code>
          </div>

          {/* Sezione Mappa interattiva per l'indicatore 12 (Km di rete cicloturistica fruibile) */}
          {(activeIndicator.code === 'CTX-12' || activeIndicator.name.includes('rete cicloturistica')) && (
            <InteractiveMapEmbed
              embedUrl="https://umap.openstreetmap.fr/it/map/mappa-piste-ciclabili-esistenti-e-potenziali-fonte_1451728"
              mapTitle="Mappa Piste Ciclabili esistenti e potenziali"
              sourceLabel="Fonte dati: Regione Marche"
              externalUrl="https://umap.openstreetmap.fr/it/map/mappa-piste-ciclabili-esistenti-e-potenziali-fonte_1451728"
              actionTitle="traccia le piste ciclabili sulla mappa"
              icon={<Bike className="h-4 w-4 text-purple-600 dark:text-purple-400" />}
            />
          )}

          {/* Sezione Mappa interattiva per l'indicatore 13 (Punti di ricarica per mobilità elettrica) */}
          {(activeIndicator.code === 'CTX-13' || activeIndicator.name.includes('Punti di ricarica')) && (
            <InteractiveMapEmbed
              embedUrl="https://umap.openstreetmap.fr/it/map/mappa-infrastrutture-di-ricarica-elettrica-fonte-d_1449604"
              mapTitle="Mappa Infrastrutture di ricarica elettrica"
              sourceLabel="Fonte dati: MASE"
              externalUrl="https://umap.openstreetmap.fr/it/map/mappa-infrastrutture-di-ricarica-elettrica-fonte-d_1449604"
              actionTitle="inserisci punti di ricarica sulla mappa"
              icon={<MapPin className="h-4 w-4 text-purple-600 dark:text-purple-400" />}
            />
          )}

          {/* Sezione Mappa interattiva per l'indicatore 11 (Incidenza degli agriturismi) */}
          {(activeIndicator.code === 'CTX-11' || activeIndicator.name.includes('agriturismi')) && (
            <InteractiveMapEmbed
              embedUrl="https://umap.openstreetmap.fr/it/map/mappa-strutture-ricettive-fonte-dati-letsmarcheit_1449567"
              mapTitle="Mappa Strutture Ricettive"
              sourceLabel="Fonte dati: letsmarche.it"
              externalUrl="https://umap.openstreetmap.fr/it/map/mappa-strutture-ricettive-fonte-dati-letsmarcheit_1449567"
              actionTitle="inserisci le strutture ricettive sulla mappa"
              icon={<Hotel className="h-4 w-4 text-purple-600 dark:text-purple-400" />}
            />
          )}
      </div>

      {/* Main Calculation Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Input Parameters Form (7 cols) */}
        <div className={`lg:col-span-7 rounded-2xl border-2 p-6 shadow-sm space-y-6 bg-white dark:bg-zinc-900 ${
          activeIndicator.level === 'context'
            ? 'border-purple-300 dark:border-purple-800'
            : 'border-emerald-300 dark:border-emerald-800'
        }`}>
          <div className="flex items-center justify-between border-b border-zinc-100 dark:border-zinc-800 pb-3">
            <div className="flex items-center gap-2">
              <Sliders className={`h-5 w-5 ${
                activeIndicator.level === 'context' ? 'text-purple-600' : 'text-emerald-600'
              }`} />
              <h3 className="text-base font-bold text-zinc-900 dark:text-zinc-100">
                Variabili & Parametri di Input
              </h3>
            </div>

            {/* Scenario buttons */}
            <div className="flex items-center gap-1.5 text-xs">
              <button
                disabled={isNotAvailable}
                onClick={() => applyPresetScenario(0.8)}
                className="px-2 py-1 rounded bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 font-medium cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
                title="Riduci le variabili del 20%"
              >
                -20%
              </button>
              <button
                onClick={handleReset}
                className="flex items-center gap-1 px-2 py-1 rounded bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 font-medium cursor-pointer"
                title="Ripristina valori predefiniti"
              >
                <RotateCcw className="h-3 w-3" />
                Reset
              </button>
              <button
                disabled={isNotAvailable}
                onClick={() => applyPresetScenario(1.25)}
                className={`px-2 py-1 rounded font-medium cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed ${
                  activeIndicator.level === 'context'
                    ? 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300'
                    : 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-300'
                }`}
                title="Aumenta le variabili del 25%"
              >
                +25% Target
              </button>
            </div>
          </div>

          {/* Opzione Dato non disponibile ("n.d.") */}
          <div className={`p-4 rounded-xl border transition-all ${
            isNotAvailable
              ? 'bg-amber-50/90 border-amber-300 dark:bg-amber-950/40 dark:border-amber-700'
              : 'bg-zinc-50/80 border-zinc-200 dark:bg-zinc-800/40 dark:border-zinc-800'
          }`}>
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-start gap-3">
                <div className={`p-2 rounded-lg shrink-0 ${
                  isNotAvailable
                    ? 'bg-amber-100 text-amber-800 dark:bg-amber-900/60 dark:text-amber-200'
                    : 'bg-zinc-200 text-zinc-600 dark:bg-zinc-700 dark:text-zinc-300'
                }`}>
                  <AlertCircle className="h-5 w-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs sm:text-sm font-bold text-zinc-900 dark:text-zinc-100">
                      Indica come &quot;n.d.&quot; (Dato non disponibile)
                    </span>
                    {isNotAvailable && (
                      <span className="px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider bg-amber-200 text-amber-900 dark:bg-amber-900/80 dark:text-amber-200">
                        Attivo: n.d.
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] text-zinc-500 dark:text-zinc-400 mt-0.5 leading-snug">
                    Seleziona se per <strong>{activeMunInfo.shortName}</strong> il dato o la fonte non è disponibile per l&apos;anno {selectedYear}. Nei grafici di monitoraggio e nelle tabelle comparative verrà visualizzato e segnalato come <strong>&quot;n.d.&quot;</strong>.
                  </p>
                </div>
              </div>

              <label className="relative inline-flex items-center cursor-pointer shrink-0" title="Contrassegna come n.d.">
                <input
                  type="checkbox"
                  checked={isNotAvailable}
                  onChange={(e) => setIsNotAvailable(e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-zinc-300 peer-focus:outline-none rounded-full peer dark:bg-zinc-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-zinc-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-zinc-600 peer-checked:bg-amber-600"></div>
              </label>
            </div>
          </div>

          {/* Dynamic input fields */}
          {isNotAvailable ? (
            <div className="py-2 px-1">
              <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
                L&apos;indicatore [{activeIndicator.code}] è contrassegnato come non disponibile per {activeMunInfo.shortName} nell&apos;anno {selectedYear} per mancanza di dati o perché in attesa di essere compilato.
              </p>
            </div>
          ) : (
            <div className="space-y-5">
              {/* Assistente interattivo Eventi CAM per IAC */}
              {activeIndicator.code === 'IAC' && (
                <div className="rounded-xl border border-emerald-300 dark:border-emerald-800 bg-emerald-50/40 dark:bg-emerald-950/20 p-4 space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-emerald-200 dark:border-emerald-800/60 pb-3">
                    <div className="flex items-center gap-2">
                      <ListChecks className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                      <div>
                        <h4 className="text-sm font-bold text-zinc-900 dark:text-zinc-100">
                          Assistente Eventi CAM — Calcolo Analitico delle Sommatorie
                        </h4>
                        <p className="text-xs text-zinc-600 dark:text-zinc-400">
                          Formula: <span className="font-mono font-semibold text-emerald-700 dark:text-emerald-300">IAC = [ Σ (Si · Gi) / Σ (Ai · Gi) ] × 100</span>
                        </p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        setCamEvents((prev) => [
                          ...prev,
                          {
                            id: `ev-${Date.now()}`,
                            name: `Nuovo Evento ${prev.length + 1}`,
                            si: 5,
                            ai: 10,
                            gi: 2,
                          },
                        ]);
                      }}
                      className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold shadow-xs transition-colors self-start sm:self-auto cursor-pointer"
                    >
                      <Plus className="h-3.5 w-3.5" />
                      <span>Aggiungi Evento (i)</span>
                    </button>
                  </div>

                  {/* Descrizione parametri analitici */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-2.5 text-xs bg-white/70 dark:bg-zinc-900/60 p-2.5 rounded-lg border border-emerald-200/70 dark:border-emerald-800/40">
                    <div>
                      <span className="font-bold text-zinc-800 dark:text-zinc-200">i = 1 ... n :</span>
                      <span className="text-zinc-600 dark:text-zinc-400 ml-1">Eventi organizzati/patrocinati nell&apos;anno t ({camEvents.length} eventi inseriti)</span>
                    </div>
                    <div>
                      <span className="font-bold text-emerald-700 dark:text-emerald-400">Si & Ai :</span>
                      <span className="text-zinc-600 dark:text-zinc-400 ml-1">Criteri CAM Soddisfatti (Si) e Applicabili (Ai)</span>
                    </div>
                    <div>
                      <span className="font-bold text-teal-700 dark:text-teal-400">Gi :</span>
                      <span className="text-zinc-600 dark:text-zinc-400 ml-1">Giorni di durata effettiva dell&apos;evento i</span>
                    </div>
                  </div>

                  {/* Tabella eventi */}
                  <div className="overflow-x-auto">
                    <table className="w-full text-xs text-left">
                      <thead className="text-[11px] uppercase tracking-wider text-zinc-600 dark:text-zinc-400 border-b border-emerald-200/80 dark:border-emerald-800/60 bg-emerald-100/50 dark:bg-emerald-900/30">
                        <tr>
                          <th className="py-2 px-2.5 rounded-l-lg">Evento (i)</th>
                          <th className="py-2 px-2 text-center" title="Criteri CAM Soddisfatti">Si (Soddisfatti)</th>
                          <th className="py-2 px-2 text-center" title="Criteri CAM Applicabili">Ai (Applicabili)</th>
                          <th className="py-2 px-2 text-center" title="Giorni di durata effettiva">Gi (Giorni)</th>
                          <th className="py-2 px-2 text-right font-mono text-emerald-800 dark:text-emerald-300">Si · Gi</th>
                          <th className="py-2 px-2 text-right font-mono text-zinc-800 dark:text-zinc-300">Ai · Gi</th>
                          <th className="py-2 px-2 text-center rounded-r-lg">Azione</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-emerald-100 dark:divide-emerald-900/40">
                        {camEvents.map((ev, idx) => {
                          const prodSi = (Number(ev.si) || 0) * (Number(ev.gi) || 0);
                          const prodAi = (Number(ev.ai) || 0) * (Number(ev.gi) || 0);
                          return (
                            <tr key={ev.id} className="hover:bg-emerald-50/50 dark:hover:bg-emerald-950/30 transition-colors">
                              <td className="py-2 px-2.5 font-medium text-zinc-900 dark:text-zinc-100">
                                <input
                                  type="text"
                                  value={ev.name}
                                  onChange={(e) => {
                                    const val = e.target.value;
                                    setCamEvents((prev) => prev.map((item) => (item.id === ev.id ? { ...item, name: val } : item)));
                                  }}
                                  className="w-full min-w-[140px] px-2 py-1 text-xs rounded border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:border-emerald-500"
                                  placeholder={`Evento ${idx + 1}`}
                                />
                              </td>
                              <td className="py-2 px-2 text-center">
                                <input
                                  type="number"
                                  min="0"
                                  value={ev.si}
                                  onChange={(e) => {
                                    const val = Math.max(0, Number(e.target.value));
                                    setCamEvents((prev) => prev.map((item) => (item.id === ev.id ? { ...item, si: val } : item)));
                                  }}
                                  className="w-16 px-1.5 py-1 text-xs text-center rounded border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 font-semibold text-emerald-700 dark:text-emerald-400"
                                />
                              </td>
                              <td className="py-2 px-2 text-center">
                                <input
                                  type="number"
                                  min="1"
                                  value={ev.ai}
                                  onChange={(e) => {
                                    const val = Math.max(1, Number(e.target.value));
                                    setCamEvents((prev) => prev.map((item) => (item.id === ev.id ? { ...item, ai: val } : item)));
                                  }}
                                  className="w-16 px-1.5 py-1 text-xs text-center rounded border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 font-semibold text-zinc-800 dark:text-zinc-200"
                                />
                              </td>
                              <td className="py-2 px-2 text-center">
                                <input
                                  type="number"
                                  min="1"
                                  value={ev.gi}
                                  onChange={(e) => {
                                    const val = Math.max(1, Number(e.target.value));
                                    setCamEvents((prev) => prev.map((item) => (item.id === ev.id ? { ...item, gi: val } : item)));
                                  }}
                                  className="w-16 px-1.5 py-1 text-xs text-center rounded border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 font-semibold text-teal-700 dark:text-teal-400"
                                />
                              </td>
                              <td className="py-2 px-2 text-right font-mono font-bold text-emerald-700 dark:text-emerald-300">
                                {prodSi}
                              </td>
                              <td className="py-2 px-2 text-right font-mono font-bold text-zinc-700 dark:text-zinc-300">
                                {prodAi}
                              </td>
                              <td className="py-2 px-2 text-center">
                                {camEvents.length > 1 && (
                                  <button
                                    type="button"
                                    onClick={() => setCamEvents((prev) => prev.filter((item) => item.id !== ev.id))}
                                    className="p-1 rounded text-zinc-400 hover:text-red-500 transition-colors cursor-pointer"
                                    title="Rimuovi evento"
                                  >
                                    <Trash2 className="h-3.5 w-3.5" />
                                  </button>
                                )}
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                      {/* Totali sommatorie */}
                      <tfoot>
                        <tr className="bg-emerald-100/60 dark:bg-emerald-950/60 font-bold text-zinc-900 dark:text-zinc-100 border-t-2 border-emerald-300 dark:border-emerald-700">
                          <td className="py-2.5 px-2.5 rounded-l-lg">
                            Totali Sommatorie (n = {camEvents.length} eventi)
                          </td>
                          <td colSpan={3} className="py-2.5 px-2 text-center text-[11px] text-zinc-600 dark:text-zinc-400">
                            Σ (Si · Gi) e Σ (Ai · Gi)
                          </td>
                          <td className="py-2.5 px-2 text-right font-mono text-emerald-800 dark:text-emerald-300 text-sm">
                            {camEvents.reduce((acc, ev) => acc + (Number(ev.si) || 0) * (Number(ev.gi) || 0), 0)}
                          </td>
                          <td className="py-2.5 px-2 text-right font-mono text-zinc-900 dark:text-zinc-100 text-sm">
                            {camEvents.reduce((acc, ev) => acc + (Number(ev.ai) || 0) * (Number(ev.gi) || 0), 0)}
                          </td>
                          <td className="py-2.5 px-2 text-center rounded-r-lg font-mono text-emerald-700 dark:text-emerald-400">
                            {(() => {
                              const num = camEvents.reduce((acc, ev) => acc + (Number(ev.si) || 0) * (Number(ev.gi) || 0), 0);
                              const den = camEvents.reduce((acc, ev) => acc + (Number(ev.ai) || 0) * (Number(ev.gi) || 0), 0);
                              return den > 0 ? `${((num / den) * 100).toFixed(1)}%` : '0%';
                            })()}
                          </td>
                        </tr>
                      </tfoot>
                    </table>
                  </div>

                  {/* Pulsante applica totali */}
                  <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                    <p className="text-xs text-zinc-600 dark:text-zinc-400">
                      I totali calcolati possono essere trasferiti direttamente nei parametri sottostanti o digitati a mano.
                    </p>
                    <button
                      type="button"
                      onClick={() => {
                        const totalNum = camEvents.reduce((acc, ev) => acc + (Number(ev.si) || 0) * (Number(ev.gi) || 0), 0);
                        const totalDen = camEvents.reduce((acc, ev) => acc + (Number(ev.ai) || 0) * (Number(ev.gi) || 0), 0);
                        handleParamChange('somma_soddisfatti_giorni', totalNum);
                        handleParamChange('somma_applicabili_giorni', totalDen);
                        setAppliedCamFeedback(true);
                        setTimeout(() => setAppliedCamFeedback(false), 3000);
                      }}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold shadow-sm transition-all cursor-pointer"
                    >
                      <CheckCircle2 className="h-4 w-4" />
                      <span>Applica Totali ai Parametri del Calcolatore</span>
                    </button>
                  </div>

                  {appliedCamFeedback && (
                    <div className="flex items-center gap-2 p-2 rounded-lg bg-emerald-100 dark:bg-emerald-900/50 text-emerald-800 dark:text-emerald-200 text-xs font-medium animate-fadeIn">
                      <CheckCircle2 className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                      <span>Totali delle sommatorie trasferiti con successo nei parametri numerici di calcolo!</span>
                    </div>
                  )}
                </div>
              )}

              {/* Assistente interattivo Voci di Mobilità per IMS */}
              {activeIndicator.code === 'IMS' && (
                <div className="rounded-xl border border-emerald-300 dark:border-emerald-800 bg-emerald-50/40 dark:bg-emerald-950/20 p-4 space-y-5">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-emerald-200 dark:border-emerald-800/60 pb-3">
                    <div className="flex items-center gap-2">
                      <Bus className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                      <div>
                        <h4 className="text-sm font-bold text-zinc-900 dark:text-zinc-100">
                          IMS — Struttura a Due Voci dei Servizi di Mobilità
                        </h4>
                        <p className="text-xs text-zinc-600 dark:text-zinc-400">
                          Articolato in: <strong className="text-emerald-700 dark:text-emerald-300">1. Servizi in occasione degli eventi</strong> e <strong className="text-emerald-800 dark:text-emerald-200">2. Servizi in regime ordinario</strong>
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* VOCE 1: Servizi in occasione degli eventi */}
                  <div className="space-y-3 rounded-lg border border-emerald-200 dark:border-emerald-900/60 bg-white/70 dark:bg-zinc-900/60 p-3.5">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-emerald-100 dark:border-emerald-900/40 pb-2.5">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="px-2 py-0.5 rounded text-[11px] font-bold uppercase tracking-wider bg-emerald-100 dark:bg-emerald-900/60 text-emerald-800 dark:text-emerald-300">
                            Voce 1
                          </span>
                          <h5 className="text-sm font-bold text-zinc-900 dark:text-zinc-100">
                            Servizi di mobilità in occasione degli eventi
                          </h5>
                        </div>
                        <p className="text-xs text-zinc-600 dark:text-zinc-400 mt-0.5">
                          Formula: <span className="font-mono font-semibold text-emerald-700 dark:text-emerald-300">(Numero di collegamenti per evento 1 + ... + evento N) / Numero di eventi</span>
                        </p>
                      </div>

                      <button
                        type="button"
                        onClick={() => {
                          setImsEvents((prev) => [
                            ...prev,
                            {
                              id: `ims-ev-${Date.now()}`,
                              name: `Nuovo Evento ${prev.length + 1}`,
                              connections: 4,
                            },
                          ]);
                        }}
                        className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold shadow-xs transition-colors self-start sm:self-auto cursor-pointer"
                      >
                        <Plus className="h-3.5 w-3.5" />
                        <span>Aggiungi Evento</span>
                      </button>
                    </div>

                    {/* Tabella eventi */}
                    <div className="overflow-x-auto">
                      <table className="w-full text-xs text-left">
                        <thead className="text-[11px] uppercase tracking-wider text-zinc-600 dark:text-zinc-400 border-b border-emerald-200/80 dark:border-emerald-800/60 bg-emerald-100/50 dark:bg-emerald-900/30">
                          <tr>
                            <th className="py-2 px-2.5 rounded-l-lg">Evento</th>
                            <th className="py-2 px-2 text-center" title="Numero di collegamenti attivati per l'evento">
                              Numero di collegamenti per evento
                            </th>
                            <th className="py-2 px-2 text-center rounded-r-lg w-16">Azione</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-emerald-100 dark:divide-emerald-900/40">
                          {imsEvents.map((ev, idx) => (
                            <tr key={ev.id} className="hover:bg-emerald-50/50 dark:hover:bg-emerald-950/30 transition-colors">
                              <td className="py-2 px-2.5 font-medium text-zinc-900 dark:text-zinc-100">
                                <input
                                  type="text"
                                  value={ev.name}
                                  onChange={(e) => {
                                    const val = e.target.value;
                                    setImsEvents((prev) =>
                                      prev.map((item) => (item.id === ev.id ? { ...item, name: val } : item))
                                    );
                                  }}
                                  className="w-full min-w-[180px] px-2 py-1 text-xs rounded border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:border-emerald-500"
                                  placeholder={`Evento ${idx + 1}`}
                                />
                              </td>
                              <td className="py-2 px-2 text-center">
                                <input
                                  type="number"
                                  min="0"
                                  value={ev.connections}
                                  onChange={(e) => {
                                    const val = Math.max(0, Number(e.target.value) || 0);
                                    setImsEvents((prev) =>
                                      prev.map((item) => (item.id === ev.id ? { ...item, connections: val } : item))
                                    );
                                  }}
                                  className="w-24 text-center px-2 py-1 text-xs rounded border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:border-emerald-500"
                                />
                              </td>
                              <td className="py-2 px-2 text-center">
                                {imsEvents.length > 1 && (
                                  <button
                                    type="button"
                                    onClick={() => setImsEvents((prev) => prev.filter((item) => item.id !== ev.id))}
                                    className="p-1 rounded text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950/40 cursor-pointer"
                                    title="Rimuovi evento"
                                  >
                                    <Trash2 className="h-3.5 w-3.5" />
                                  </button>
                                )}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                        <tfoot className="font-bold border-t-2 border-emerald-200 dark:border-emerald-800 bg-emerald-100/60 dark:bg-emerald-900/40 text-zinc-900 dark:text-zinc-100">
                          <tr>
                            <td className="py-2 px-2.5 rounded-l-lg">
                              Totali Voce 1 (n = {imsEvents.length} eventi)
                            </td>
                            <td className="py-2 px-2 text-center font-mono text-emerald-800 dark:text-emerald-300">
                              Somma collegamenti = {imsEvents.reduce((acc, ev) => acc + (Number(ev.connections) || 0), 0)}
                            </td>
                            <td className="py-2 px-2 text-center rounded-r-lg font-mono text-emerald-700 dark:text-emerald-400">
                              Media: {imsEvents.length > 0
                                ? (imsEvents.reduce((acc, ev) => acc + (Number(ev.connections) || 0), 0) / imsEvents.length).toFixed(2)
                                : '0'}
                            </td>
                          </tr>
                        </tfoot>
                      </table>
                    </div>

                    <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
                      <p className="text-xs text-zinc-600 dark:text-zinc-400">
                        La media calcolata per la Voce 1 è di{' '}
                        <strong className="text-emerald-700 dark:text-emerald-300 font-mono">
                          {imsEvents.length > 0
                            ? (imsEvents.reduce((acc, ev) => acc + (Number(ev.connections) || 0), 0) / imsEvents.length).toFixed(2)
                            : 0}{' '}
                          collegamenti/evento
                        </strong>.
                      </p>
                      <button
                        type="button"
                        onClick={() => {
                          const totalConnections = imsEvents.reduce((acc, ev) => acc + (Number(ev.connections) || 0), 0);
                          const totalEvents = imsEvents.length;
                          handleParamChange('somma_collegamenti_eventi', totalConnections);
                          handleParamChange('numero_eventi', totalEvents);
                          setAppliedImsFeedback(true);
                          setTimeout(() => setAppliedImsFeedback(false), 3000);
                        }}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold shadow-xs transition-all cursor-pointer"
                      >
                        <CheckCircle2 className="h-4 w-4" />
                        <span>Applica Totali a Parametri Voce 1</span>
                      </button>
                    </div>

                    {appliedImsFeedback && (
                      <div className="flex items-center gap-2 p-2 rounded-lg bg-emerald-100 dark:bg-emerald-900/50 text-emerald-800 dark:text-emerald-200 text-xs font-medium animate-fadeIn">
                        <CheckCircle2 className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                        <span>Valori della Voce 1 (Eventi) applicati con successo ai parametri di calcolo!</span>
                      </div>
                    )}
                  </div>

                  {/* VOCE 2: Servizi in regime ordinario */}
                  <div className="space-y-3 rounded-lg border border-emerald-200 dark:border-emerald-900/60 bg-white/70 dark:bg-zinc-900/60 p-3.5">
                    <div className="border-b border-emerald-100 dark:border-emerald-900/40 pb-2">
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-0.5 rounded text-[11px] font-bold uppercase tracking-wider bg-emerald-100 dark:bg-emerald-900/60 text-emerald-800 dark:text-emerald-300">
                          Voce 2
                        </span>
                        <h5 className="text-sm font-bold text-zinc-900 dark:text-zinc-100">
                          Servizi di mobilità in regime ordinario
                        </h5>
                      </div>
                      <p className="text-xs text-zinc-600 dark:text-zinc-400 mt-0.5">
                        Collegamenti giornalieri attivati per il servizio di navette di raggiungimento del centro storico suddivisi in due sotto-voci:
                      </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
                      {/* Sotto-voce Infrasettimanale */}
                      <div className="p-3 rounded-lg border border-emerald-100 dark:border-emerald-900/40 bg-emerald-50/40 dark:bg-emerald-950/20 space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-emerald-950 dark:text-emerald-200">
                            Sotto-voce: Periodo infrasettimanale
                          </span>
                          <span className="text-xs font-mono font-bold text-emerald-700 dark:text-emerald-300">
                            {paramValues['collegamenti_giornalieri_infrasettimanali'] ?? 8} collegamenti/giorno
                          </span>
                        </div>
                        <p className="text-[11px] text-zinc-600 dark:text-zinc-400 leading-relaxed">
                          Formula: Numero di collegamenti giornalieri attivati per il servizio di navette di raggiungimento del centro storico nel periodo infrasettimanale.
                        </p>
                      </div>

                      {/* Sotto-voce Weekend */}
                      <div className="p-3 rounded-lg border border-emerald-100 dark:border-emerald-900/40 bg-emerald-50/40 dark:bg-emerald-950/20 space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-emerald-950 dark:text-emerald-200">
                            Sotto-voce: Weekend
                          </span>
                          <span className="text-xs font-mono font-bold text-emerald-700 dark:text-emerald-300">
                            {paramValues['collegamenti_giornalieri_weekend'] ?? 16} collegamenti/giorno
                          </span>
                        </div>
                        <p className="text-[11px] text-zinc-600 dark:text-zinc-400 leading-relaxed">
                          Formula: Numero di collegamenti giornalieri attivati per il servizio di navette di raggiungimento del centro storico nei weekend.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeIndicator.params.map((param) => {
                const currentVal = paramValues[param.key] ?? param.defaultValue;
                const maxRange = Math.max(param.defaultValue * 3, 50, currentVal * 1.5);
                const sharedDef = getSharedParamDefinition(param.key);
                const otherCodes = sharedDef
                  ? getOtherIndicatorsForParam(param.key, activeIndicator.code)
                  : [];

                return (
                  <div
                    key={param.key}
                    className={`space-y-2 p-3.5 rounded-xl border transition-all ${
                      sharedDef
                        ? activeIndicator.level === 'context'
                          ? 'bg-purple-50/40 dark:bg-purple-950/20 border-purple-200/70 dark:border-purple-800/50'
                          : 'bg-emerald-50/40 dark:bg-emerald-950/20 border-emerald-200/70 dark:border-emerald-800/50'
                        : 'bg-zinc-50/60 dark:bg-zinc-800/40 border-zinc-200/80 dark:border-zinc-800'
                    }`}
                  >
                    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                      <div className="space-y-1">
                        <label className="text-base font-bold text-zinc-900 dark:text-zinc-100 flex flex-wrap items-center gap-1.5">
                          <span>{param.label}</span>
                          {param.unit && (
                            <span className="text-xs font-medium text-zinc-500 dark:text-zinc-400">
                              ({param.unit})
                            </span>
                          )}
                        </label>
                      </div>

                      <div className="flex items-center gap-1.5 self-end sm:self-auto shrink-0">
                        <input
                          type="number"
                          min="0"
                          step="any"
                          value={currentVal}
                          onChange={(e) => handleParamChange(param.key, Number(e.target.value))}
                          className={`w-32 rounded-lg border border-zinc-300 bg-white px-2.5 py-1.5 text-right text-sm font-bold text-zinc-900 focus:outline-none dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100 ${
                            activeIndicator.level === 'context'
                              ? 'focus:border-purple-500 focus:ring-1 focus:ring-purple-500'
                              : 'focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500'
                          }`}
                        />
                      </div>
                    </div>

                    {/* Range slider */}
                    <input
                      type="range"
                      min="0"
                      max={maxRange}
                      step={param.defaultValue > 100 ? '1' : '0.1'}
                      value={currentVal}
                      onChange={(e) => handleParamChange(param.key, Number(e.target.value))}
                      className={`w-full cursor-pointer h-1.5 bg-zinc-200 rounded-lg dark:bg-zinc-700 ${
                        activeIndicator.level === 'context'
                          ? 'accent-purple-600'
                          : 'accent-emerald-600'
                      }`}
                    />

                    {/* Badge informativo sotto la barra scorrevole */}
                    {sharedDef && (
                      <div
                        className={`flex items-center flex-wrap gap-1.5 text-xs font-medium px-2.5 py-1.5 rounded-lg border w-fit ${
                          activeIndicator.level === 'context'
                            ? 'text-purple-800 dark:text-purple-300 bg-purple-100/80 dark:bg-purple-950/50 border-purple-200 dark:border-purple-800/60'
                            : 'text-emerald-800 dark:text-emerald-300 bg-emerald-100/80 dark:bg-emerald-950/50 border-emerald-200 dark:border-emerald-800/60'
                        }`}
                      >
                        <Link2
                          className={`h-3.5 w-3.5 shrink-0 ${
                            activeIndicator.level === 'context'
                              ? 'text-purple-600 dark:text-purple-400'
                              : 'text-emerald-600 dark:text-emerald-400'
                          }`}
                        />
                        <span>
                          Variabile condivisa
                          {otherCodes.length > 0 && (
                            <>
                              {' '}con{' '}
                              <span
                                className={`font-bold underline ${
                                  activeIndicator.level === 'context'
                                    ? 'decoration-purple-400'
                                    : 'decoration-emerald-400'
                                }`}
                              >
                                {otherCodes.join(', ')}
                              </span>
                            </>
                          )}
                          : sincronizzata per {activeMunInfo.shortName} ({selectedYear})
                        </span>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}

          {/* Sezione Note e Pulsante Salva Rilevazione (collocato immediatamente sotto i parametri o l'indicazione n.d.) */}
          <div className="pt-4 border-t border-zinc-200 dark:border-zinc-800 space-y-3">
            <div>
              <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1 flex items-center gap-1">
                <FileText className="h-3.5 w-3.5 text-amber-600" />
                Note, Fonti Dati o Riferimenti Delibera ({activeMunInfo.shortName}, {selectedYear}):
              </label>
              <input
                type="text"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder={`Es. Dati estratti da ISTAT / Ufficio Tecnico ${activeMunInfo.shortName}, delibera n. 14...`}
                className="w-full text-xs rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 p-2.5 text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 focus:border-amber-500 focus:outline-none"
              />
            </div>

            {saveSuccessMessage && (
              <div className="flex items-center gap-2 p-3 rounded-xl bg-amber-100 text-amber-900 text-xs font-bold border border-amber-300 dark:bg-amber-950 dark:text-amber-200 dark:border-amber-800 animate-fade-in">
                <CheckCircle2 className="h-4 w-4 shrink-0 text-amber-600" />
                <span>{saveSuccessMessage}</span>
              </div>
            )}

            <button
              id="btn-save-indicator-record"
              onClick={handleSave}
              className="w-full flex items-center justify-center gap-2 py-3.5 px-4 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-sm shadow-md shadow-amber-600/25 transition-all hover:scale-[1.01] active:scale-[0.99] cursor-pointer ring-1 ring-amber-500"
            >
              <Save className="h-4 w-4" />
              <span>
                {isNotAvailable
                  ? `Salva Rilevazione come "n.d." per ${activeMunInfo.shortName} (${selectedYear})`
                  : `Salva Rilevazione per ${activeMunInfo.shortName} (${selectedYear})`}
              </span>
            </button>
          </div>

          {/* Sub-list of Level 2 Indicators if Level 1 is active */}
          {activeIndicator.level === 'context' && contextOutputIndicators && contextOutputIndicators.length > 0 && (
            <div className="border-t border-zinc-100 dark:border-zinc-800 pt-4 space-y-2">
              <span className="text-xs font-bold text-zinc-700 dark:text-zinc-300 flex items-center gap-1.5">
                <Zap className="h-3.5 w-3.5 text-emerald-600" />
                Indicatori di Output che influiscono su questo Contesto:
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {contextOutputIndicators.map((out) => (
                  <button
                    key={out.code}
                    onClick={() => setSelectedOutputCode(out.code)}
                    className="flex items-center justify-between p-2.5 rounded-lg border border-zinc-200 bg-zinc-50 hover:bg-emerald-50 hover:border-emerald-300 dark:border-zinc-800 dark:bg-zinc-800 dark:hover:bg-emerald-950/40 text-left transition-colors cursor-pointer group"
                  >
                    <div>
                      {out.name.startsWith(out.code) ? (
                        <span className="text-xs text-zinc-800 dark:text-zinc-200 font-medium group-hover:text-emerald-800 dark:group-hover:text-emerald-300">
                          {out.name}
                        </span>
                      ) : (
                        <div>
                          <span className="font-mono text-[11px] font-bold text-emerald-700 dark:text-emerald-400">
                            [{out.code}]
                          </span>{' '}
                          <span className="text-xs text-zinc-800 dark:text-zinc-200 font-medium group-hover:text-emerald-800 dark:group-hover:text-emerald-300">
                            {out.name}
                          </span>
                        </div>
                      )}
                    </div>
                    <ArrowRight className="h-3.5 w-3.5 text-zinc-400 group-hover:text-emerald-600 shrink-0 ml-2" />
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right: Live Result Card & Target Evaluation (5 cols) */}
        <div className="lg:col-span-5 flex flex-col rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900 space-y-6">
          <div className="space-y-6">
            <div className="flex items-center justify-between border-b border-zinc-100 dark:border-zinc-800 pb-3">
              <h3 className="text-base font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-amber-500" />
                Risultato Calcolato
              </h3>
              <span className="text-xs font-semibold px-2 py-0.5 rounded bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300">
                Anno {selectedYear}
              </span>
            </div>

            {/* Big Score Box */}
            <div className="rounded-2xl bg-gradient-to-br from-zinc-900 to-zinc-800 p-6 text-white shadow-lg space-y-3 dark:from-zinc-950 dark:to-zinc-900 border border-zinc-800">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-zinc-400 uppercase tracking-widest">
                  Valore Calcolato{activeIndicator.level === 'output' ? ` (${activeIndicator.code})` : ''}
                </span>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider ${
                  activeIndicator.level === 'context' ? 'bg-purple-900 text-purple-200' : 'bg-emerald-900 text-emerald-200'
                }`}>
                  {activeIndicator.level === 'context' ? 'Analisi di Contesto' : 'Prospettiva Intervento'}
                </span>
              </div>

              <div className="flex items-baseline gap-2">
                {isNotAvailable ? (
                  <div className="flex items-baseline gap-2">
                    <span className="text-4xl sm:text-5xl font-black tracking-tight text-amber-400">
                      n.d.
                    </span>
                    <span className="text-xs font-semibold text-zinc-400">
                      ({activeIndicator.unit})
                    </span>
                  </div>
                ) : (
                  <span className={`text-4xl sm:text-5xl font-black tracking-tight ${
                    activeIndicator.level === 'context' ? 'text-purple-300' : 'text-emerald-400'
                  }`}>
                    {formatValueWithUnit(calculatedValue, activeIndicator.unit)}
                  </span>
                )}
              </div>

              {/* Status Badge */}
              <div className="pt-2 flex items-center gap-2">
                {isNotAvailable ? (
                  <span className="px-3 py-1 rounded-full text-xs font-bold border border-amber-400/80 bg-amber-950/80 text-amber-200 flex items-center gap-1.5">
                    <AlertCircle className="h-3.5 w-3.5 text-amber-400" />
                    <span>Segnalato come n.d. (Dato non disponibile)</span>
                  </span>
                ) : programmingEval.isTargetSet && programmingEval.progressPercent !== null ? (
                  <span className={`px-3 py-1 rounded-full text-xs font-bold border ${programmingEval.badge}`}>
                    {programmingEval.label} ({programmingEval.progressPercent}%)
                  </span>
                ) : (
                  <span className="px-3 py-1 rounded-full text-xs font-semibold border border-zinc-200 dark:border-zinc-700 bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400">
                    Target non impostato (definisci liberamente sotto)
                  </span>
                )}
              </div>
            </div>

            {/* Editable Programming Target & Progress Computation Box */}
            <div className={`rounded-xl border p-4 space-y-4 ${
              activeIndicator.level === 'context'
                ? 'border-purple-200 bg-purple-50/40 dark:border-purple-900/50 dark:bg-purple-950/20'
                : 'border-emerald-200 bg-emerald-50/40 dark:border-emerald-900/50 dark:bg-emerald-950/20'
            }`}>
              <div className="flex items-center justify-between border-b border-zinc-200/60 dark:border-zinc-800 pb-2">
                <div className="flex items-center gap-1.5 text-xs font-bold text-zinc-900 dark:text-zinc-100">
                  <Target className={`h-4 w-4 ${
                    activeIndicator.level === 'context' ? 'text-purple-600' : 'text-emerald-600'
                  }`} />
                  <span>Obiettivo di Programmazione (Impostato dall&apos;utente)</span>
                </div>
                {customTarget !== undefined && (
                  <button
                    type="button"
                    onClick={() => {
                      setCustomTarget(undefined);
                      setBaselineValue(undefined);
                    }}
                    title="Rimuovi target impostato per questo indicatore"
                    className="text-[10px] font-semibold text-rose-600 hover:text-rose-800 dark:text-rose-400 dark:hover:text-rose-300 underline cursor-pointer"
                  >
                    Rimuovi target
                  </button>
                )}
              </div>

              {/* Editable Fields Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* 1. Target Value Input */}
                <div className="sm:col-span-2">
                  <label className="block text-[11px] font-bold text-zinc-700 dark:text-zinc-300 mb-1 flex items-center justify-between">
                    <span>Valore Obiettivo Programmato (Target):</span>
                    <span className="text-[10px] text-zinc-500 font-normal">Unità: {activeIndicator.unit}</span>
                  </label>
                  <div className="relative flex items-center">
                    <input
                      type="number"
                      step="any"
                      value={customTarget !== undefined && !isNaN(customTarget) ? customTarget : ''}
                      onChange={(e) => {
                        const val = e.target.value;
                        if (val === '') {
                          setCustomTarget(undefined);
                        } else {
                          const num = parseFloat(val);
                          setCustomTarget(isNaN(num) ? undefined : num);
                        }
                      }}
                      placeholder="Nessun target impostato (inserisci valore desiderato)..."
                      className={`w-full rounded-lg border bg-white px-3 py-2 text-sm font-black text-zinc-900 focus:outline-none dark:bg-zinc-900 dark:text-zinc-100 ${
                        activeIndicator.level === 'context'
                          ? 'border-purple-300 focus:border-purple-600 focus:ring-1 focus:ring-purple-600 dark:border-purple-800'
                          : 'border-emerald-300 focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 dark:border-emerald-800'
                      }`}
                    />
                    <span className="absolute right-3 text-xs font-bold text-zinc-500">
                      {activeIndicator.unit}
                    </span>
                  </div>
                </div>

                {/* 2. Target Direction Criteria */}
                <div>
                  <label className="block text-[11px] font-bold text-zinc-700 dark:text-zinc-300 mb-1">
                    Criterio di Raggiungimento:
                  </label>
                  <select
                    value={targetDirection}
                    onChange={(e) => setTargetDirection(e.target.value as 'higher-is-better' | 'lower-is-better')}
                    className="w-full rounded-lg border border-zinc-300 bg-white px-2.5 py-1.5 text-xs font-semibold text-zinc-900 focus:outline-none dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100 cursor-pointer"
                  >
                    <option value="higher-is-better">≥ Incremento (Crescita attesa)</option>
                    <option value="lower-is-better">≤ Contenimento (Soglia massima)</option>
                  </select>
                </div>

                {/* 3. Baseline / Valore Iniziale */}
                <div>
                  <label className="block text-[11px] font-bold text-zinc-700 dark:text-zinc-300 mb-1">
                    Valore Base / Partenza (opzionale):
                  </label>
                  <input
                    type="number"
                    step="any"
                    value={baselineValue !== undefined && !isNaN(baselineValue) ? baselineValue : ''}
                    onChange={(e) => {
                      const val = e.target.value;
                      if (val === '') {
                        setBaselineValue(undefined);
                      } else {
                        const num = parseFloat(val);
                        setBaselineValue(isNaN(num) ? undefined : num);
                      }
                    }}
                    placeholder="Opzionale (es. 0)"
                    className="w-full rounded-lg border border-zinc-300 bg-white px-2.5 py-1.5 text-xs font-semibold text-zinc-900 focus:outline-none dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100"
                  />
                </div>
              </div>

              {/* Progress & Target Advance Bar Box */}
              {programmingEval.isTargetSet && programmingEval.progressPercent !== null && customTarget !== undefined ? (
                <div className="rounded-xl border border-zinc-200/80 bg-white p-3.5 shadow-2xs dark:border-zinc-800 dark:bg-zinc-900 space-y-2.5">
                  <div className="flex items-center justify-between text-xs font-bold">
                    <span className="text-zinc-700 dark:text-zinc-300">
                      Avanzamento verso l&apos;Obiettivo di Programmazione:
                    </span>
                    <span className={`text-sm font-black ${
                      activeIndicator.level === 'context'
                        ? 'text-purple-700 dark:text-purple-300'
                        : 'text-emerald-700 dark:text-emerald-300'
                    }`}>
                      {programmingEval.progressPercent}%
                    </span>
                  </div>

                  {/* Progress Bar Visualizer */}
                  <div className={`w-full rounded-full h-3 relative overflow-hidden border ${
                    activeIndicator.level === 'context'
                      ? 'bg-purple-100/70 border-purple-200 dark:bg-purple-950/40 dark:border-purple-800'
                      : 'bg-emerald-100/70 border-emerald-200 dark:bg-emerald-950/40 dark:border-emerald-800'
                  }`}>
                    <div
                      className={`h-full transition-all duration-500 rounded-full ${
                        activeIndicator.level === 'context'
                          ? 'bg-gradient-to-r from-purple-500 to-purple-700'
                          : 'bg-gradient-to-r from-emerald-500 to-emerald-600'
                      }`}
                      style={{ width: `${Math.min(100, Math.max(0, programmingEval.progressPercent))}%` }}
                    />
                  </div>

                  {/* Scostamento e Dettaglio */}
                  <div className="flex flex-wrap items-center justify-between gap-2 text-[11px] text-zinc-600 dark:text-zinc-400 pt-1">
                    <span>
                      Scostamento:{' '}
                      <strong className={
                        activeIndicator.level === 'context'
                          ? 'text-purple-700 dark:text-purple-300'
                          : 'text-emerald-700 dark:text-emerald-300'
                      }>
                        {programmingEval.deltaToTarget !== null && programmingEval.deltaToTarget >= 0 ? '+' : ''}
                        {formatValueWithUnit(programmingEval.deltaToTarget ?? 0, activeIndicator.unit)}
                      </strong>
                    </span>
                    <span>
                      Obiettivo Programmato: <strong>{targetDirection === 'higher-is-better' ? '≥ ' : '≤ '}{formatValueWithUnit(customTarget, activeIndicator.unit)}</strong>
                    </span>
                  </div>
                </div>
              ) : (
                <div className="rounded-xl border border-dashed border-zinc-300 dark:border-zinc-700 bg-white/50 dark:bg-zinc-900/50 p-3.5 text-center space-y-1">
                  <div className="text-xs font-bold text-zinc-700 dark:text-zinc-300">
                    Nessun target impostato per questo indicatore
                  </div>
                  <p className="text-[11px] text-zinc-500 dark:text-zinc-400">
                    Inserisci un valore obiettivo nel campo sopra per visualizzare l&apos;avanzamento percentuale e lo scostamento.
                  </p>
                </div>
              )}
            </div>

            {/* Objective Context Card */}
            {activeIndicator.objective && (
              <div className={`space-y-2 text-xs p-3.5 rounded-xl border ${
                activeIndicator.level === 'context'
                  ? 'bg-purple-50/50 text-purple-900 dark:bg-purple-950/20 dark:text-purple-200 border-purple-100 dark:border-purple-900/40'
                  : 'bg-emerald-50/50 text-emerald-900 dark:bg-emerald-950/20 dark:text-emerald-200 border-emerald-100 dark:border-emerald-900/40'
              }`}>
                <span className={`font-bold ${
                  activeIndicator.level === 'context' ? 'text-purple-800 dark:text-purple-300' : 'text-emerald-800 dark:text-emerald-300'
                }`}>
                  Obiettivo Strategico Correlato:
                </span>
                <p className="text-zinc-700 dark:text-zinc-300 leading-relaxed">
                  {activeIndicator.objective}
                </p>
              </div>
            )}
          </div>

          {/* Status riepilogativo di registrazione */}
          <div className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50/80 dark:bg-zinc-800/40 p-3.5 flex items-center justify-between text-xs">
            <div className="flex items-center gap-2 text-zinc-600 dark:text-zinc-400">
              <Info className="h-4 w-4 text-amber-600 shrink-0" />
              <span>
                {existingRecordForCurrent
                  ? `Rilevazione registrata per ${activeMunInfo.shortName} (${selectedYear}).`
                  : `Nuova rilevazione per ${activeMunInfo.shortName} (${selectedYear}).`}
              </span>
            </div>
            <span className="text-[11px] font-semibold text-amber-700 dark:text-amber-400">
              Salvataggio nel pannello parametri 👈
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
