import React, { useRef, useState, useMemo } from 'react';
import { IndicatorRecord, MunicipalityName, MUNICIPALITIES } from '../types';
import { INITIAL_SAMPLE_RECORDS } from '../data/sampleHistory';
import {
  CONTEXT_INDICATORS,
  DIMENSIONS,
  getAllCalculableIndicators,
  getCalculableIndicatorByCode,
} from '../data/matrixData';
import {
  evaluateIndicatorStatus,
  formatValueWithUnit,
  loadDemoBaselineFromStorage,
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
  AreaChart,
  Area,
} from 'recharts';
import {
  Download,
  Upload,
  RefreshCw,
  FileSpreadsheet,
  FileText,
  CheckCircle2,
  AlertTriangle,
  Building,
  Printer,
  Sparkles,
  Building2,
  Filter,
  Copy,
  Check,
  Database,
  FileDown,
  TrendingUp,
  BarChart2,
  Layers,
  ArrowUpRight,
  ArrowDownRight,
  Globe,
  Activity,
  CheckCircle,
} from 'lucide-react';
import { generatePdfReport } from '../utils/pdfGenerator';

interface DataManagementProps {
  records: IndicatorRecord[];
  onImportRecords: (records: IndicatorRecord[]) => void;
  onResetToDemo: () => void;
  selectedYear: number;
  setSelectedYear?: (year: number) => void;
  availableYears?: number[];
  onAddYear?: (year: number) => { success: boolean; message: string };
  onRemoveYear?: (year: number) => { success: boolean; message: string };
  selectedMunicipality: MunicipalityName;
  setSelectedMunicipality?: (municipality: MunicipalityName) => void;
  onOpenAddYearModal?: () => void;
}

export const DataManagement: React.FC<DataManagementProps> = ({
  records,
  onImportRecords,
  onResetToDemo,
  selectedYear,
  setSelectedYear,
  availableYears = [2023, 2024, 2025, 2026, 2027],
  onAddYear,
  onRemoveYear,
  selectedMunicipality,
  setSelectedMunicipality,
  onOpenAddYearModal,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [notification, setNotification] = useState<string>('');
  const [showReportModal, setShowReportModal] = useState<boolean>(false);
  const [exportScope, setExportScope] = useState<'current' | 'all'>('current');
  const [reportScope, setReportScope] = useState<'current' | 'all'>('current');
  const [copied, setCopied] = useState<boolean>(false);
  const [isGeneratingPdf, setIsGeneratingPdf] = useState<boolean>(false);

  // States for interactive report preview charts
  const [previewChartMetric, setPreviewChartMetric] = useState<string>('CTX-1');
  const [previewChartType, setPreviewChartType] = useState<'line' | 'bar'>('line');

  // Multi-year coverage across all available years
  const effectiveYears = useMemo(() => {
    if (availableYears && availableYears.length > 0) {
      return [...availableYears].sort((a, b) => a - b);
    }
    const set = new Set<number>([2023, 2024, 2025, 2026, 2027]);
    records.forEach((r) => {
      if (r.year && !isNaN(r.year) && r.year >= 2000 && r.year <= 2100) {
        set.add(r.year);
      }
    });
    return Array.from(set).sort((a, b) => a - b);
  }, [availableYears, records]);

  const minYear = effectiveYears[0] ?? 2023;
  const maxYear = effectiveYears[effectiveYears.length - 1] ?? 2027;

  const allCalculables = useMemo(() => getAllCalculableIndicators(), []);
  const activeCalculable = useMemo(() => {
    return getCalculableIndicatorByCode(previewChartMetric) || allCalculables[0];
  }, [previewChartMetric, allCalculables]);

  const demoBaseline = useMemo(() => loadDemoBaselineFromStorage(), [records]);
  const demoCount =
    demoBaseline && demoBaseline.length >= INITIAL_SAMPLE_RECORDS.length
      ? demoBaseline.length
      : INITIAL_SAMPLE_RECORDS.length;

  const handleCopyJSON = () => {
    try {
      navigator.clipboard.writeText(JSON.stringify(records, null, 2)).then(() => {
        setCopied(true);
        setNotification(`JSON di ${records.length} rilevazioni copiato negli appunti!`);
        setTimeout(() => setCopied(false), 2500);
        setTimeout(() => setNotification(''), 3000);
      });
    } catch {
      setNotification('Impossibile accedere agli appunti del browser.');
      setTimeout(() => setNotification(''), 3000);
    }
  };

  const currentMunInfo =
    MUNICIPALITIES.find((m) => m.name === selectedMunicipality) || MUNICIPALITIES[0];

  // Records to export based on selected scope
  const exportRecords = useMemo(() => {
    if (exportScope === 'all') return records;
    return records.filter(
      (r) =>
        r.municipality === selectedMunicipality ||
        (!r.municipality && selectedMunicipality === 'Comune di Montecassiano')
    );
  }, [records, exportScope, selectedMunicipality]);

  // Records for report
  const reportRecords = useMemo(() => {
    if (reportScope === 'all') return records;
    return records.filter(
      (r) =>
        r.municipality === selectedMunicipality ||
        (!r.municipality && selectedMunicipality === 'Comune di Montecassiano')
    );
  }, [records, reportScope, selectedMunicipality]);

  // Comparative & Single-Entity Time Series Data for Preview Chart
  const previewChartData = useMemo(() => {
    return effectiveYears.map((yr) => {
      const recsInYear = records.filter((r) => r.year === yr && r.code === previewChartMetric);

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

      const singleRec = recsInYear.find(
        (r) =>
          r.municipality === selectedMunicipality ||
          (!r.municipality && selectedMunicipality === 'Comune di Montecassiano')
      );
      const singleVal =
        singleRec && !singleRec.isNotAvailable && singleRec.calculatedValue !== null
          ? singleRec.calculatedValue
          : null;

      return {
        year: String(yr),
        yearNum: yr,
        Montecassiano: valCassiano,
        Montefano: valFano,
        Montelupone: valLupone,
        Media: avg,
        valore: singleVal,
        target: singleRec?.targetValue ?? null,
        unit: singleRec?.unit || activeCalculable?.unit || '',
      };
    });
  }, [effectiveYears, records, previewChartMetric, selectedMunicipality, activeCalculable]);

  // Download PDF Report
  const handleDownloadPdf = () => {
    setIsGeneratingPdf(true);
    try {
      generatePdfReport({
        records: reportScope === 'all' ? records : reportRecords,
        selectedYear,
        reportScope,
        selectedMunicipality,
        availableYears: effectiveYears,
      });
      const scopeLabel =
        reportScope === 'all' ? 'Tutti i 3 Comuni (Integrato)' : selectedMunicipality;
      setNotification(`Report PDF per ${scopeLabel} (Anno ${selectedYear}) generato con successo!`);
      setTimeout(() => setNotification(''), 4000);
    } catch (err) {
      console.error('Errore durante la generazione del PDF:', err);
      setNotification('Si è verificato un errore durante la generazione del file PDF.');
      setTimeout(() => setNotification(''), 4000);
    } finally {
      setIsGeneratingPdf(false);
    }
  };

  // Export JSON
  const handleExportJSON = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(exportRecords, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    const scopeSlug = exportScope === 'all' ? 'tutti_i_comuni' : currentMunInfo.shortName.toLowerCase();
    downloadAnchor.setAttribute('download', `matrice_sostenibilita_${scopeSlug}_${selectedYear}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();

    setNotification(`File JSON esportato (${exportRecords.length} record per ${exportScope === 'all' ? 'tutti i comuni' : currentMunInfo.shortName})!`);
    setTimeout(() => setNotification(''), 3000);
  };

  // Export CSV
  const handleExportCSV = () => {
    if (exportRecords.length === 0) {
      alert('Nessun dato da esportare per i criteri selezionati!');
      return;
    }

    const headers = ['ID', 'Anno', 'Codice Indicatore', 'Valore Calcolato', 'Non Disponibile (n.d.)', 'Comune', 'Target', 'Direzione Target', 'Timestamp', 'Note'];
    const rows = exportRecords.map((r) => [
      r.id,
      r.year,
      r.code,
      r.isNotAvailable || r.calculatedValue === null ? '"n.d."' : r.calculatedValue,
      r.isNotAvailable ? '"Sì"' : '"No"',
      `"${r.municipality || 'Comune di Montecassiano'}"`,
      r.targetValue !== undefined ? r.targetValue : '',
      `"${r.targetDirection || ''}"`,
      r.timestamp,
      `"${(r.notes || '').replace(/"/g, '""')}"`,
    ]);

    const csvContent =
      'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    const scopeSlug = exportScope === 'all' ? 'tutti_i_comuni' : currentMunInfo.shortName.toLowerCase();
    link.setAttribute('download', `matrice_sostenibilita_${scopeSlug}_${selectedYear}.csv`);
    document.body.appendChild(link);
    link.click();
    link.remove();

    setNotification(`File CSV esportato (${exportRecords.length} record per ${exportScope === 'all' ? 'tutti i comuni' : currentMunInfo.shortName})!`);
    setTimeout(() => setNotification(''), 3000);
  };

  // Import JSON File
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target?.result as string);
        if (Array.isArray(parsed)) {
          // Normalize any records missing municipality to current selected
          const normalized = parsed.map((r) => ({
            ...r,
            municipality: r.municipality || selectedMunicipality,
          }));
          onImportRecords(normalized);
          setNotification(`Importati con successo ${normalized.length} record!`);
          setTimeout(() => setNotification(''), 3000);
        } else {
          alert('Il file JSON deve contenere un array di rilevazioni valide.');
        }
      } catch {
        alert('Errore nel caricamento del file JSON. Formato non valido.');
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner / Pannello Iniziale */}
      <div className="rounded-2xl border border-zinc-200 bg-white p-6 sm:p-7 shadow-sm dark:border-zinc-800 dark:bg-zinc-900 space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-black text-amber-600 dark:text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
                <FileSpreadsheet className="h-4 w-4" />
                <span>Modulo di Esportazione, Importazione &amp; Report</span>
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-zinc-900 dark:text-zinc-100 tracking-tight mt-0.5">
              Gestione Dati, Export e Reportistica
            </h2>
          </div>

          {/* Scelta Ambito del Report con lo stesso stile del Modulo di Valutazione Prestazioni & Trend */}
          <div className="flex items-center p-1 rounded-xl bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 shrink-0 self-start md:self-auto">
            <button
              type="button"
              onClick={() => setReportScope('current')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                reportScope === 'current'
                  ? 'bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 shadow-sm ring-1 ring-zinc-200 dark:ring-zinc-700'
                  : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200'
              }`}
              title="Genera il report per il singolo comune selezionato in basso"
            >
              <Building className="h-4 w-4 text-amber-600" />
              <span>Risultati Singolo Ente</span>
            </button>

            <button
              type="button"
              onClick={() => setReportScope('all')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                reportScope === 'all'
                  ? 'bg-amber-600 text-white shadow-sm ring-1 ring-amber-500'
                  : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200'
              }`}
              title="Genera il report integrato per tutti i 3 Comuni (Montecassiano, Montefano, Montelupone)"
            >
              <Globe className="h-4 w-4" />
              <span>Report Integrato (3 Comuni)</span>
            </button>
          </div>
        </div>

        <p className="text-xs text-zinc-500 dark:text-zinc-400">
          Esporta i calcoli effettuati, importa dataset esistenti o genera un report sintetico per la giunta ed il piano strategico del turismo.
        </p>

        {/* Tasti Anteprima Report e Scarica PDF al posto dei tasti macro */}
        <div className="pt-2 border-t border-zinc-200/80 dark:border-zinc-800/80 grid grid-cols-1 sm:grid-cols-2 gap-3">
          <button
            type="button"
            onClick={() => setShowReportModal(true)}
            className="py-3 px-4 rounded-xl border border-amber-500 bg-amber-600 text-white hover:bg-amber-700 shadow-sm shadow-amber-600/30 ring-1 ring-amber-500 font-black text-xs sm:text-sm uppercase tracking-wider transition-all cursor-pointer flex items-center justify-center gap-2"
            title="Apri l'anteprima a schermo del report completo di grafici e indicatori"
          >
            <FileText className="h-4 w-4 shrink-0" />
            <span>
              Anteprima Report ({reportScope === 'all' ? '3 Comuni' : currentMunInfo.shortName} • {selectedYear})
            </span>
          </button>

          <button
            type="button"
            onClick={handleDownloadPdf}
            disabled={isGeneratingPdf}
            className="py-3 px-4 rounded-xl border border-amber-500 bg-amber-600 text-white hover:bg-amber-700 shadow-sm shadow-amber-600/30 ring-1 ring-amber-500 font-black text-xs sm:text-sm uppercase tracking-wider transition-all cursor-pointer flex items-center justify-center gap-2 disabled:opacity-50"
            title={`Scarica il report in PDF per ${reportScope === 'all' ? 'tutti i 3 Comuni' : selectedMunicipality}`}
          >
            <FileDown className="h-4 w-4 shrink-0 text-white" />
            <span>
              {isGeneratingPdf
                ? 'Generazione in corso...'
                : `Scarica PDF (${reportScope === 'all' ? '3 Comuni' : currentMunInfo.shortName} • ${selectedYear})`}
            </span>
          </button>
        </div>

        {notification && (
          <div className="p-3 rounded-xl bg-amber-100 text-amber-900 text-xs font-bold border border-amber-300 dark:bg-amber-950 dark:text-amber-200 dark:border-amber-800 flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 text-amber-600 shrink-0" />
            <span>{notification}</span>
          </div>
        )}
      </div>

      {/* Grid Options */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Export Box */}
        <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900 space-y-4">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-amber-100 dark:bg-amber-950/60 flex items-center justify-center text-amber-600">
              <Download className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-100">
                Esporta Dati
              </h3>
              <p className="text-xs text-zinc-500">Salva in locale tutte le rilevazioni</p>
            </div>
          </div>

          {/* Scope Selector for Export */}
          <div className="p-2 rounded-xl bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 space-y-1.5 text-xs">
            <span className="text-[11px] font-bold text-zinc-500 block">Ambito di esportazione:</span>
            <div className="grid grid-cols-2 gap-1.5">
              <button
                type="button"
                onClick={() => setExportScope('current')}
                className={`py-1.5 px-2 rounded-lg text-left text-[11px] font-bold transition-all ${
                  exportScope === 'current'
                    ? 'bg-white dark:bg-zinc-900 text-amber-700 dark:text-amber-300 shadow-xs border border-amber-300'
                    : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900'
                }`}
              >
                Solo {currentMunInfo.shortName}
              </button>
              <button
                type="button"
                onClick={() => setExportScope('all')}
                className={`py-1.5 px-2 rounded-lg text-left text-[11px] font-bold transition-all ${
                  exportScope === 'all'
                    ? 'bg-white dark:bg-zinc-900 text-amber-700 dark:text-amber-300 shadow-xs border border-amber-300'
                    : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900'
                }`}
              >
                Tutti i 3 Comuni
              </button>
            </div>
          </div>

          <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
            Record selezionati per il download: <strong>{exportRecords.length}</strong> (su {records.length} complessivi). Formato JSON o CSV per fogli elettronici.
          </p>

          <div className="flex flex-col gap-2 pt-2">
            <button
              onClick={handleExportJSON}
              className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-950 dark:bg-amber-950/40 dark:hover:bg-amber-900/60 dark:text-amber-200 font-bold text-xs border-2 border-amber-500 shadow-sm transition-colors cursor-pointer"
            >
              <Download className="h-4 w-4 text-amber-700 dark:text-amber-400" />
              <span>Esporta in JSON</span>
            </button>

            <button
              onClick={handleExportCSV}
              className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-950 dark:bg-amber-950/40 dark:hover:bg-amber-900/60 dark:text-amber-200 font-bold text-xs border-2 border-amber-500 shadow-sm transition-colors cursor-pointer"
            >
              <FileSpreadsheet className="h-4 w-4 text-amber-700 dark:text-amber-400" />
              <span>Esporta in CSV (Excel)</span>
            </button>
          </div>
        </div>

        {/* Import Box */}
        <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900 space-y-4">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-amber-100 dark:bg-amber-950/60 flex items-center justify-center text-amber-600">
              <Upload className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-100">
                Importa Dataset
              </h3>
              <p className="text-xs text-zinc-500">Carica rilevazioni salvate in precedenza</p>
            </div>
          </div>

          <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
            Ripristina un backup JSON precedentemente esportato o importato da un altro utente della giunta comunale. I record senza comune assegnato saranno associati a {selectedMunicipality}.
          </p>

          <input
            type="file"
            accept=".json"
            ref={fileInputRef}
            onChange={handleFileUpload}
            className="hidden"
          />

          <div className="pt-2">
            <button
              onClick={() => fileInputRef.current?.click()}
              className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-950 dark:bg-amber-950/40 dark:hover:bg-amber-900/60 dark:text-amber-200 font-bold text-xs border-2 border-amber-500 shadow-sm transition-colors cursor-pointer"
            >
              <Upload className="h-4 w-4 text-amber-700 dark:text-amber-400" />
              <span>Seleziona File JSON</span>
            </button>
          </div>
        </div>

        {/* Reset & Initial Data Box */}
        <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900 space-y-4">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-amber-100 dark:bg-amber-950/60 flex items-center justify-center text-amber-600">
              <Database className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
                <span>Dataset Iniziale</span>
                <span className="text-xs px-2 py-0.5 rounded-full bg-amber-100 dark:bg-amber-900/60 text-amber-800 dark:text-amber-300 font-extrabold">
                  {demoCount} Rilevazioni
                </span>
              </h3>
              <p className="text-xs text-zinc-500">Archivio storico e benchmarking di riferimento</p>
            </div>
          </div>

          <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
            Le rilevazioni storiche ({records.length} attive in memoria) costituiscono la base per il benchmarking multi-comunale (Montecassiano, Montefano, Montelupone). Quando un utente fa il reset dei calcoli o ripristina la configurazione di fabbrica, ritroverà queste {demoCount} rilevazioni.
          </p>

          <div className="flex flex-col gap-2 pt-2">
            <button
              onClick={() => {
                if (
                  confirm(
                    `Sei sicuro di voler ripristinare il dataset iniziale (${demoCount} rilevazioni)? Tutte le nuove modifiche temporanee non esportate verranno sostituite con la serie storica iniziale.`
                  )
                ) {
                  onResetToDemo();
                  setNotification(`Dataset Iniziale ripristinato (${demoCount} rilevazioni caricate)!`);
                  setTimeout(() => setNotification(''), 3500);
                }
              }}
              className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-950 dark:bg-amber-950/40 dark:hover:bg-amber-900/60 dark:text-amber-200 font-bold text-xs border-2 border-amber-500 shadow-sm transition-colors cursor-pointer"
            >
              <RefreshCw className="h-4 w-4 text-amber-700 dark:text-amber-400" />
              <span>Ripristina Dataset Iniziale ({demoCount} Rilevazioni)</span>
            </button>

            <button
              onClick={handleCopyJSON}
              className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-950 dark:bg-amber-950/40 dark:hover:bg-amber-900/60 dark:text-amber-200 font-bold text-xs border-2 border-amber-500 shadow-sm transition-colors cursor-pointer"
            >
              {copied ? <Check className="h-4 w-4 text-emerald-600 dark:text-emerald-400" /> : <Copy className="h-4 w-4 text-amber-700 dark:text-amber-400" />}
              <span>{copied ? 'JSON Copiato!' : `Copia JSON (${records.length} record) negli appunti`}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Summary Report Modal */}
      {showReportModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-xs p-4 overflow-y-auto">
          <div className="w-full max-w-5xl max-h-[92vh] overflow-y-auto rounded-2xl bg-white dark:bg-zinc-900 p-6 sm:p-8 shadow-2xl border border-zinc-200 dark:border-zinc-800 space-y-6">
            {/* Header del Modal */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-zinc-200 dark:border-zinc-800 pb-4">
              <div className="flex items-center gap-3">
                <div className="h-11 w-11 rounded-xl bg-amber-600 text-white flex items-center justify-center shrink-0 shadow-sm">
                  <Building className="h-6 w-6" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-black text-amber-600 dark:text-amber-400 uppercase tracking-wider">
                      {reportScope === 'all' ? 'Report Integrato Territoriale (3 Comuni)' : selectedMunicipality}
                    </span>
                    <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300">
                      Anno {selectedYear}
                    </span>
                  </div>
                  <h3 className="text-lg sm:text-xl font-black text-zinc-900 dark:text-zinc-100">
                    Report di Sostenibilità Turistica &amp; Trend Multiannuale
                  </h3>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400">
                    Documento ufficiale con grafici di serie storica ({minYear}–{maxYear}) e matrice di monitoraggio
                  </p>
                </div>
              </div>

              {/* Controlli Ambito e Azioni nel Modal */}
              <div className="flex flex-wrap items-center gap-2">
                {/* Switch Ambito */}
                <div className="flex items-center rounded-lg border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 p-0.5 text-xs shadow-2xs">
                  <button
                    type="button"
                    onClick={() => setReportScope('current')}
                    className={`px-3 py-1.5 rounded-md font-bold transition-colors cursor-pointer ${
                      reportScope === 'current'
                        ? 'bg-white dark:bg-zinc-900 text-amber-600 font-black shadow-xs'
                        : 'text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100'
                    }`}
                  >
                    🏛️ Singolo Ente
                  </button>
                  <button
                    type="button"
                    onClick={() => setReportScope('all')}
                    className={`px-3 py-1.5 rounded-md font-bold transition-colors cursor-pointer ${
                      reportScope === 'all'
                        ? 'bg-white dark:bg-zinc-900 text-amber-600 font-black shadow-xs'
                        : 'text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100'
                    }`}
                  >
                    🌐 Tutti i 3 Comuni
                  </button>
                </div>

                {reportScope === 'current' && (
                  <div className="flex items-center gap-1">
                    {MUNICIPALITIES.map((mun) => (
                      <button
                        key={mun.id}
                        type="button"
                        onClick={() => setSelectedMunicipality?.(mun.name)}
                        className={`px-2 py-1 text-[11px] rounded-md border font-bold transition-all cursor-pointer ${
                          selectedMunicipality === mun.name
                            ? 'border-amber-500 bg-amber-100 text-amber-900 dark:bg-amber-900/40 dark:text-amber-200 shadow-2xs'
                            : 'border-zinc-200 dark:border-zinc-700 text-zinc-500 hover:text-zinc-900'
                        }`}
                      >
                        {mun.shortName}
                      </button>
                    ))}
                  </div>
                )}

                {/* Selettore Anno Riferimento */}
                {setSelectedYear && (
                  <div className="flex items-center gap-1 text-xs">
                    <span className="text-zinc-400 font-semibold">Anno:</span>
                    <select
                      value={selectedYear}
                      onChange={(e) => setSelectedYear(Number(e.target.value))}
                      className="rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 px-2 py-1 text-xs font-bold text-zinc-800 dark:text-zinc-200 cursor-pointer shadow-2xs"
                    >
                      {effectiveYears.map((yr) => (
                        <option key={yr} value={yr}>
                          {yr}
                        </option>
                      ))}
                    </select>
                  </div>
                )}

                <button
                  type="button"
                  onClick={handleDownloadPdf}
                  disabled={isGeneratingPdf}
                  className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-amber-600 text-white font-bold text-xs shadow-sm hover:bg-amber-700 transition-colors cursor-pointer ring-1 ring-amber-500 disabled:opacity-50"
                  title="Scarica il documento completo in formato PDF sul dispositivo"
                >
                  <FileDown className="h-4 w-4" />
                  <span>{isGeneratingPdf ? 'Generazione...' : 'Scarica PDF'}</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    try {
                      window.print();
                    } catch {
                      handleDownloadPdf();
                    }
                  }}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-zinc-100 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200 hover:bg-zinc-200 dark:hover:bg-zinc-700 border border-zinc-300 dark:border-zinc-700 text-xs font-semibold cursor-pointer"
                  title="Stampa con la stampante di sistema"
                >
                  <Printer className="h-4 w-4" />
                  <span>Stampa</span>
                </button>
                <button
                  type="button"
                  onClick={() => setShowReportModal(false)}
                  className="px-3 py-1.5 rounded-lg border border-zinc-300 dark:border-zinc-700 text-xs font-semibold cursor-pointer hover:bg-zinc-100 dark:hover:bg-zinc-800"
                >
                  Chiudi
                </button>
              </div>
            </div>

            {/* Printable content body */}
            <div className="space-y-6 text-sm text-zinc-800 dark:text-zinc-200">
              {/* Box Sintesi Esecutiva */}
              <div className="p-4 rounded-xl bg-amber-50/70 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 space-y-2">
                <h4 className="font-bold text-amber-950 dark:text-amber-200 flex items-center gap-1.5">
                  <Sparkles className="h-4 w-4 text-amber-600" />
                  <span>
                    Sintesi Esecutiva — {reportScope === 'all' ? 'Tutti i 3 Comuni (Montecassiano, Montefano, Montelupone)' : selectedMunicipality}
                  </span>
                </h4>
                <p className="text-xs text-zinc-600 dark:text-zinc-300 leading-relaxed">
                  Nell&apos;anno {selectedYear}, per l&apos;ambito selezionato ({reportScope === 'all' ? 'Montecassiano, Montefano, Montelupone' : selectedMunicipality}) sono registrati{' '}
                  <strong>{reportRecords.filter((r) => r.year === selectedYear).length}</strong> calcoli
                  ufficiali per gli indicatori della matrice. Si evidenzia l&apos;attuazione delle azioni di rigenerazione urbana, destagionalizzazione, accoglienza diffusa e transizione ecologica del territorio.
                </p>
              </div>

              {/* Sezione Grafici & Serie Storica con copertura di tutte le annualità */}
              <div className="p-5 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/50 space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-zinc-200 dark:border-zinc-800">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-black text-amber-600 dark:text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
                        <TrendingUp className="h-4 w-4" />
                        <span>Andamento Temporale Indicatori</span>
                      </span>
                      <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300 border border-amber-300 dark:border-amber-800">
                        Copertura Completa: Anni {minYear}–{maxYear}
                      </span>
                    </div>
                    <h4 className="text-base font-bold text-zinc-900 dark:text-zinc-100 mt-0.5">
                      Grafico di Evoluzione Multiannuale
                    </h4>
                    <p className="text-xs text-zinc-500 dark:text-zinc-400">
                      Visualizza il trend storico su tutte le annualità censite ({effectiveYears.join(', ')}) per{' '}
                      <span className="font-semibold text-zinc-700 dark:text-zinc-300">
                        {reportScope === 'all' ? 'tutti i 3 Comuni dell’aggregazione' : selectedMunicipality}
                      </span>.
                    </p>
                  </div>

                  {/* Switch tipo di grafico (Linee vs Barre) */}
                  <div className="flex items-center rounded-lg border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 p-0.5 text-xs self-start sm:self-auto shadow-2xs">
                    <button
                      type="button"
                      onClick={() => setPreviewChartType('line')}
                      className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md font-semibold transition-colors cursor-pointer ${
                        previewChartType === 'line'
                          ? 'bg-amber-600 text-white shadow-xs'
                          : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100'
                      }`}
                      title="Grafico a linee di tendenza"
                    >
                      <TrendingUp className="h-3.5 w-3.5" />
                      <span>Linee</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setPreviewChartType('bar')}
                      className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md font-semibold transition-colors cursor-pointer ${
                        previewChartType === 'bar'
                          ? 'bg-amber-600 text-white shadow-xs'
                          : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100'
                      }`}
                      title="Grafico a barre comparative"
                    >
                      <BarChart2 className="h-3.5 w-3.5" />
                      <span>Barre</span>
                    </button>
                  </div>
                </div>

                {/* Selezione Indicatore dal Menù a tendina con gruppi Contesto e Output */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3 rounded-xl bg-zinc-100/80 dark:bg-zinc-800/80 border border-zinc-200 dark:border-zinc-700">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-zinc-700 dark:text-zinc-300">
                      Seleziona Indicatore per il Grafico Multiannuale:
                    </span>
                  </div>
                  <div className="w-full sm:w-auto">
                    <select
                      value={previewChartMetric}
                      onChange={(e) => setPreviewChartMetric(e.target.value)}
                      className={`w-full sm:w-96 rounded-xl border border-zinc-300 bg-white px-3 py-2 text-xs font-bold text-zinc-900 focus:outline-none dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100 cursor-pointer shadow-xs ${
                        activeCalculable.level === 'context'
                          ? 'focus:border-purple-500 focus:ring-1 focus:ring-purple-500'
                          : 'focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500'
                      }`}
                    >
                      {/* Context Indicators */}
                      <optgroup label="🟣 1. Indicatori di Contesto (Analisi di Contesto: 4 Dimensioni)">
                        {CONTEXT_INDICATORS.map((ctx) => (
                          <option key={ctx.code} value={ctx.code}>
                            {ctx.number}. {ctx.name} ({ctx.unit})
                          </option>
                        ))}
                      </optgroup>

                      {/* Output Indicators */}
                      <optgroup label="🟢 2. Indicatori di Output (Prospettive di Intervento: 4 Direzioni)">
                        {allCalculables
                          .filter((ind) => ind.level === 'output')
                          .map((out) => (
                            <option key={out.code} value={out.code}>
                              [{out.code}] {out.name} ({out.unit})
                            </option>
                          ))}
                      </optgroup>
                    </select>
                  </div>
                </div>

                {/* Banner Indicatore Attivo */}
                <div className="p-3 rounded-xl bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-amber-100 dark:bg-amber-950/70 text-amber-800 dark:text-amber-300">
                        {previewChartMetric}
                      </span>
                      <h5 className="font-bold text-sm text-zinc-900 dark:text-zinc-100">
                        {activeCalculable.name}
                      </h5>
                    </div>
                    {activeCalculable.description && (
                      <p className="text-[11px] text-zinc-500 dark:text-zinc-400 mt-0.5">
                        {activeCalculable.description}
                      </p>
                    )}
                  </div>
                  <div className="text-right shrink-0">
                    <span className="text-[11px] font-bold text-zinc-400 uppercase block">Unità di misura</span>
                    <span className="text-xs font-extrabold text-zinc-800 dark:text-zinc-200">
                      {activeCalculable.unit || 'Valore numerico'}
                    </span>
                  </div>
                </div>

                {/* Render Grafico Recharts */}
                <div className="h-64 sm:h-72 w-full pt-2">
                  <ResponsiveContainer width="100%" height="100%">
                    {reportScope === 'all' ? (
                      previewChartType === 'line' ? (
                        <LineChart data={previewChartData} margin={{ top: 10, right: 20, left: 0, bottom: 5 }}>
                          <CartesianGrid strokeDasharray="3 3" stroke="#e4e4e7" />
                          <XAxis dataKey="year" stroke="#71717a" fontSize={11} tickLine={false} />
                          <YAxis stroke="#71717a" fontSize={11} tickLine={false} />
                          <Tooltip
                            contentStyle={{
                              backgroundColor: '#18181b',
                              borderColor: '#27272a',
                              borderRadius: '0.75rem',
                              color: '#fafafa',
                              fontSize: '12px',
                            }}
                          />
                          <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '8px' }} />
                          <Line
                            type="monotone"
                            dataKey="Montecassiano"
                            name="Montecassiano"
                            stroke="#2563EB"
                            strokeWidth={2.5}
                            dot={{ r: 4, fill: '#2563EB' }}
                            activeDot={{ r: 6 }}
                          />
                          <Line
                            type="monotone"
                            dataKey="Montefano"
                            name="Montefano"
                            stroke="#D97706"
                            strokeWidth={2.5}
                            dot={{ r: 4, fill: '#D97706' }}
                            activeDot={{ r: 6 }}
                          />
                          <Line
                            type="monotone"
                            dataKey="Montelupone"
                            name="Montelupone"
                            stroke="#E11D48"
                            strokeWidth={2.5}
                            dot={{ r: 4, fill: '#E11D48' }}
                            activeDot={{ r: 6 }}
                          />
                          <Line
                            type="monotone"
                            dataKey="Media"
                            name="Media Territoriale"
                            stroke="#71717A"
                            strokeWidth={1.5}
                            strokeDasharray="3 3"
                            dot={false}
                          />
                        </LineChart>
                      ) : (
                        <BarChart data={previewChartData} margin={{ top: 10, right: 20, left: 0, bottom: 5 }}>
                          <CartesianGrid strokeDasharray="3 3" stroke="#e4e4e7" />
                          <XAxis dataKey="year" stroke="#71717a" fontSize={11} tickLine={false} />
                          <YAxis stroke="#71717a" fontSize={11} tickLine={false} />
                          <Tooltip
                            contentStyle={{
                              backgroundColor: '#18181b',
                              borderColor: '#27272a',
                              borderRadius: '0.75rem',
                              color: '#fafafa',
                              fontSize: '12px',
                            }}
                          />
                          <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '8px' }} />
                          <Bar dataKey="Montecassiano" name="Montecassiano" fill="#2563EB" radius={[4, 4, 0, 0]} />
                          <Bar dataKey="Montefano" name="Montefano" fill="#D97706" radius={[4, 4, 0, 0]} />
                          <Bar dataKey="Montelupone" name="Montelupone" fill="#E11D48" radius={[4, 4, 0, 0]} />
                        </BarChart>
                      )
                    ) : previewChartType === 'line' ? (
                      <AreaChart data={previewChartData} margin={{ top: 10, right: 20, left: 0, bottom: 5 }}>
                        <defs>
                          <linearGradient id="colorMunMetric" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor={currentMunInfo.colorHex} stopOpacity={0.35} />
                            <stop offset="95%" stopColor={currentMunInfo.colorHex} stopOpacity={0.0} />
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="#e4e4e7" />
                        <XAxis dataKey="year" stroke="#71717a" fontSize={11} tickLine={false} />
                        <YAxis stroke="#71717a" fontSize={11} tickLine={false} />
                        <Tooltip
                          contentStyle={{
                            backgroundColor: '#18181b',
                            borderColor: '#27272a',
                            borderRadius: '0.75rem',
                            color: '#fafafa',
                            fontSize: '12px',
                          }}
                          formatter={(value: any) => [`${value} ${activeCalculable.unit || ''}`, currentMunInfo.shortName]}
                        />
                        <Area
                          type="monotone"
                          dataKey="valore"
                          name={currentMunInfo.shortName}
                          stroke={currentMunInfo.colorHex}
                          strokeWidth={3}
                          fillOpacity={1}
                          fill="url(#colorMunMetric)"
                          dot={{ r: 4, fill: currentMunInfo.colorHex }}
                          activeDot={{ r: 6 }}
                        />
                        {previewChartData.some((d) => d.target !== null) && (
                          <ReferenceLine
                            y={previewChartData.find((d) => d.target !== null)?.target ?? undefined}
                            stroke="#10b981"
                            strokeDasharray="4 4"
                            label={{ value: 'Target', fill: '#10b981', fontSize: 10 }}
                          />
                        )}
                      </AreaChart>
                    ) : (
                      <BarChart data={previewChartData} margin={{ top: 10, right: 20, left: 0, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#e4e4e7" />
                        <XAxis dataKey="year" stroke="#71717a" fontSize={11} tickLine={false} />
                        <YAxis stroke="#71717a" fontSize={11} tickLine={false} />
                        <Tooltip
                          contentStyle={{
                            backgroundColor: '#18181b',
                            borderColor: '#27272a',
                            borderRadius: '0.75rem',
                            color: '#fafafa',
                            fontSize: '12px',
                          }}
                          formatter={(value: any) => [`${value} ${activeCalculable.unit || ''}`, currentMunInfo.shortName]}
                        />
                        <Bar
                          dataKey="valore"
                          name={currentMunInfo.shortName}
                          fill={currentMunInfo.colorHex}
                          radius={[5, 5, 0, 0]}
                        />
                      </BarChart>
                    )}
                  </ResponsiveContainer>
                </div>

                {/* Tabella Comparativa o Badge Annuali */}
                {reportScope === 'all' ? (
                  <div className="overflow-x-auto rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-800">
                    <table className="w-full text-xs text-left">
                      <thead className="bg-zinc-100 dark:bg-zinc-900/80 text-zinc-600 dark:text-zinc-400 font-bold border-b border-zinc-200 dark:border-zinc-800">
                        <tr>
                          <th className="py-2 px-3">Comune / Ambito</th>
                          {effectiveYears.map((yr) => (
                            <th
                              key={yr}
                              className={`py-2 px-3 text-center ${
                                yr === selectedYear ? 'text-amber-600 dark:text-amber-400 bg-amber-50/70 dark:bg-amber-950/40 font-black' : ''
                              }`}
                            >
                              {yr} {yr === selectedYear && '★'}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800 font-medium">
                        <tr>
                          <td className="py-2 px-3 flex items-center gap-1.5 font-bold text-blue-600 dark:text-blue-400">
                            <span className="w-2 h-2 rounded-full bg-blue-600"></span>
                            Montecassiano
                          </td>
                          {previewChartData.map((d) => (
                            <td key={d.year} className="py-2 px-3 text-center font-mono">
                              {d.Montecassiano !== null ? `${d.Montecassiano} ${activeCalculable.unit || ''}` : 'n.d.'}
                            </td>
                          ))}
                        </tr>
                        <tr>
                          <td className="py-2 px-3 flex items-center gap-1.5 font-bold text-amber-600 dark:text-amber-400">
                            <span className="w-2 h-2 rounded-full bg-amber-600"></span>
                            Montefano
                          </td>
                          {previewChartData.map((d) => (
                            <td key={d.year} className="py-2 px-3 text-center font-mono">
                              {d.Montefano !== null ? `${d.Montefano} ${activeCalculable.unit || ''}` : 'n.d.'}
                            </td>
                          ))}
                        </tr>
                        <tr>
                          <td className="py-2 px-3 flex items-center gap-1.5 font-bold text-rose-600 dark:text-rose-400">
                            <span className="w-2 h-2 rounded-full bg-rose-600"></span>
                            Montelupone
                          </td>
                          {previewChartData.map((d) => (
                            <td key={d.year} className="py-2 px-3 text-center font-mono">
                              {d.Montelupone !== null ? `${d.Montelupone} ${activeCalculable.unit || ''}` : 'n.d.'}
                            </td>
                          ))}
                        </tr>
                        <tr className="bg-zinc-50/60 dark:bg-zinc-900/40 font-bold text-zinc-700 dark:text-zinc-300">
                          <td className="py-2 px-3 flex items-center gap-1.5">
                            <span className="w-2 h-2 rounded-full bg-zinc-400"></span>
                            Media Territoriale
                          </td>
                          {previewChartData.map((d) => (
                            <td key={d.year} className="py-2 px-3 text-center font-mono">
                              {d.Media !== null ? `${d.Media} ${activeCalculable.unit || ''}` : 'n.d.'}
                            </td>
                          ))}
                        </tr>
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                    {previewChartData.map((d) => {
                      const isCurrent = d.yearNum === selectedYear;
                      return (
                        <div
                          key={d.year}
                          className={`p-2.5 rounded-xl border text-center transition-all ${
                            isCurrent
                              ? 'border-amber-500 bg-amber-50/80 dark:bg-amber-950/40 shadow-xs ring-1 ring-amber-400'
                              : 'border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800'
                          }`}
                        >
                          <div className="text-[11px] font-bold text-zinc-500 dark:text-zinc-400 flex items-center justify-center gap-1">
                            <span>Anno {d.year}</span>
                            {isCurrent && <span className="text-amber-600 text-[10px] font-black">★ Attivo</span>}
                          </div>
                          <div className="text-sm font-extrabold font-mono text-zinc-900 dark:text-zinc-100 mt-1">
                            {d.valore !== null ? `${d.valore} ${activeCalculable.unit || ''}` : <span className="text-amber-600">n.d.</span>}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Detailed Matrix Breakdown for active year */}
              <div className="space-y-4">
                <h4 className="font-bold text-base text-zinc-900 dark:text-zinc-100 border-b pb-2 border-zinc-100 dark:border-zinc-800">
                  Dettaglio Rilevazioni per Dimensione (Analisi di Contesto 🟣 / Prospettive Intervento 🟢)
                </h4>

                {DIMENSIONS.map((dim) => {
                  const filtered = reportRecords.filter(
                    (r) =>
                      r.year === selectedYear &&
                      CONTEXT_INDICATORS.some(
                        (ci) =>
                          ci.dimensionId === dim.id &&
                          (ci.code === r.code || ci.outputIndicators.some((o) => o.code === r.code))
                      )
                  );
                  // Deduplicate in case a record matches multiple context links
                  const dimRecordsMap = new Map<string, IndicatorRecord>();
                  filtered.forEach((r) => {
                    const key = `${r.municipality || 'comune'}-${r.year}-${r.code}`;
                    if (!dimRecordsMap.has(key)) {
                      dimRecordsMap.set(key, r);
                    }
                  });
                  const dimRecords = Array.from(dimRecordsMap.values());

                  return (
                    <div key={dim.id} className="space-y-2">
                      <div className="flex items-center justify-between text-xs font-bold text-zinc-900 dark:text-zinc-100 bg-zinc-100 dark:bg-zinc-800 p-2.5 rounded-lg border border-zinc-200 dark:border-zinc-700">
                        <span>
                          Dimensione {dim.number}: {dim.title}
                        </span>
                        <span className="font-mono">{dimRecords.length} rilevazioni</span>
                      </div>

                      {dimRecords.length === 0 ? (
                        <p className="text-xs text-zinc-400 italic pl-2">
                          Nessuna rilevazione registrata per questa dimensione nell&apos;anno {selectedYear}.
                        </p>
                      ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pl-2">
                          {dimRecords.map((r, rIdx) => {
                            const isContext = r.code.startsWith('CTX');
                            return (
                              <div
                                key={`${r.id || `${r.code}-${r.municipality || ''}`}-${rIdx}`}
                                className={`p-2.5 rounded-lg border flex items-center justify-between text-xs ${
                                  isContext
                                    ? 'border-purple-200 bg-purple-50/50 dark:border-purple-900 dark:bg-purple-950/20'
                                    : 'border-emerald-200 bg-emerald-50/50 dark:border-emerald-900 dark:bg-emerald-950/20'
                                }`}
                              >
                                <div>
                                  <div className="flex items-center gap-1.5">
                                    <span className={`font-mono font-bold ${
                                      isContext ? 'text-purple-700 dark:text-purple-400' : 'text-emerald-700 dark:text-emerald-400'
                                    }`}>
                                      [{r.code}]
                                    </span>
                                    {reportScope === 'all' && r.municipality && (
                                      <span className="text-[10px] font-bold text-zinc-500 bg-zinc-100 dark:bg-zinc-800 px-1.5 py-0.2 rounded">
                                        {r.municipality.replace('Comune di ', '')}
                                      </span>
                                    )}
                                  </div>
                                  <div className="font-semibold text-zinc-900 dark:text-zinc-100 mt-0.5">
                                    {r.isNotAvailable || r.calculatedValue === null ? (
                                      <span className="font-mono font-bold text-amber-600 dark:text-amber-400">n.d. (non disponibile)</span>
                                    ) : (
                                      `${r.calculatedValue} ${r.unit}`
                                    )}
                                  </div>
                                  {r.targetValue !== undefined && (
                                    <span className="text-[10px] text-zinc-500">
                                      (Obj: {r.targetValue} {r.progressPercentage !== undefined ? `• ${r.progressPercentage}%` : ''})
                                    </span>
                                  )}
                                </div>
                                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                                  isContext ? 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300' : 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-300'
                                }`}>
                                  {isContext ? 'Contesto' : 'Output'}
                                </span>
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

