export type DimensionId = 'dim1' | 'dim2' | 'dim3' | 'dim4';
export type IndicatorLevel = 'context' | 'output'; // Contesto vs Output

export type MunicipalityName =
  | 'Comune di Montecassiano'
  | 'Comune di Montefano'
  | 'Comune di Montelupone';

export interface MunicipalityInfo {
  id: string;
  name: MunicipalityName;
  shortName: string;
  color: string;
  colorHex: string;
  textHex: string;
  onColorText: string;
  bgLight: string;
  borderLight: string;
  badgeBg: string;
  badgeBorder: string;
  badgeText: string;
  description: string;
  appBgHex: string;
  appBgDarkHex: string;
  appBgClass: string;
}

export const MUNICIPALITIES: MunicipalityInfo[] = [
  {
    id: 'montecassiano',
    name: 'Comune di Montecassiano',
    shortName: 'Montecassiano',
    color: 'blue',
    colorHex: '#2563eb',
    textHex: '#1d4ed8',
    onColorText: '#ffffff',
    bgLight: 'bg-blue-50 dark:bg-blue-950/40',
    borderLight: 'border-blue-200 dark:border-blue-800',
    badgeBg: 'bg-blue-100 dark:bg-blue-950/60',
    badgeBorder: 'border-blue-300 dark:border-blue-800',
    badgeText: 'text-blue-800 dark:text-blue-300',
    description: 'Borgo medievale fortificato, Terzieri e turismo esperienziale',
    appBgHex: '#e8f1fc',
    appBgDarkHex: '#0c1626',
    appBgClass: 'bg-municipality-montecassiano',
  },
  {
    id: 'montefano',
    name: 'Comune di Montefano',
    shortName: 'Montefano',
    color: 'yellow',
    colorHex: '#eab308',
    textHex: '#854d0e',
    onColorText: '#1c1917',
    bgLight: 'bg-yellow-50 dark:bg-yellow-950/40',
    borderLight: 'border-yellow-300 dark:border-yellow-700',
    badgeBg: 'bg-yellow-100 dark:bg-yellow-950/60',
    badgeBorder: 'border-yellow-300 dark:border-yellow-700',
    badgeText: 'text-yellow-900 dark:text-yellow-200',
    description: 'Cultura, Teatro storico La Rondinella, enogastronomia e paesaggio',
    appBgHex: '#fef7dc',
    appBgDarkHex: '#1d1708',
    appBgClass: 'bg-municipality-montefano',
  },
  {
    id: 'montelupone',
    name: 'Comune di Montelupone',
    shortName: 'Montelupone',
    color: 'red',
    colorHex: '#dc2626',
    textHex: '#b91c1c',
    onColorText: '#ffffff',
    bgLight: 'bg-red-50 dark:bg-red-950/40',
    borderLight: 'border-red-200 dark:border-red-800',
    badgeBg: 'bg-red-100 dark:bg-red-950/60',
    badgeBorder: 'border-red-300 dark:border-red-800',
    badgeText: 'text-red-800 dark:text-red-300',
    description: 'Uno dei Borghi più belli d’Italia, Bandiera Arancione, biodiversità',
    appBgHex: '#fde8e8',
    appBgDarkHex: '#210c10',
    appBgClass: 'bg-municipality-montelupone',
  },
];

export interface OutputIndicatorParam {
  key: string;
  label: string;
  description?: string;
  defaultValue: number;
  unit?: string;
}

export type IndicatorParam = OutputIndicatorParam;

export interface TargetThreshold {
  good: number;
  warning: number;
  direction: 'higher-is-better' | 'lower-is-better';
}

export interface OutputIndicator {
  code: string; // e.g. 'TCOE', 'TRUV', 'IAC'
  name: string; // e.g. 'Tasso di Crescita dell'Offerta Eventi'
  level?: 'output'; // Output
  unit: string; // e.g. '%', 'num', 'kW/posto letto', 'persone/evento'
  description: string;
  formulaDisplay: string; // Printable string of formula
  params: OutputIndicatorParam[];
  calculate: (params: Record<string, number>) => number;
  targetThreshold?: TargetThreshold;
  notes?: string;
  contextCode?: string; // Links back to parent Context Indicator code (e.g., 'CTX-1')
}

export interface ContextIndicator {
  id: string; // e.g. 'ind1', 'ind2'
  code: string; // e.g. 'CTX-1', 'CTX-2' ... 'CTX-15'
  number: number; // 1 to 15
  name: string; // e.g. 'Arrivi turistici annui (A)'
  level?: 'context'; // Context
  dimensionId: DimensionId;
  objective: string;
  strategy: string;
  action: string;
  unit: string;
  description: string;
  formulaDisplay: string;
  params: OutputIndicatorParam[];
  calculate: (params: Record<string, number>) => number;
  targetThreshold?: TargetThreshold;
  outputIndicators: OutputIndicator[];
}

export interface CalculableIndicator {
  code: string;
  name: string;
  level: IndicatorLevel; // 'context' or 'output'
  dimensionId: DimensionId;
  unit: string;
  description: string;
  formulaDisplay: string;
  params: OutputIndicatorParam[];
  calculate: (params: Record<string, number>) => number;
  targetThreshold?: TargetThreshold;
  // Context indicator specifics
  objective?: string;
  strategy?: string;
  action?: string;
  outputIndicators?: OutputIndicator[];
  parentContextCode?: string;
  parentContextName?: string;
  interventionTitle?: string;
  direzioneTitle?: string;
}

export interface InterventoSpecifico {
  id: string;
  code: string;
  title: string;
  outputIndicators: OutputIndicator[];
}

export interface AzioneData {
  id: string;
  code: string;
  title: string;
  interventi: InterventoSpecifico[];
}

export interface DimensionCardData {
  id: DimensionId;
  number: number;
  profiloTitle: string;
  dimensionTitle: string;
  contextIndicatorsSubtitle: string;
  contextIndicators: ContextIndicator[];
  lineeStrategicheTitle: string;
  direzioneTitle: string;
  asseTitle: string;
  azioniSubtitle: string;
  azioni: AzioneData[];
}

export interface ContextAnalysisSection {
  id: DimensionId;
  number: number;
  title: string;
  description: string;
  color: string;
  badgeBg: string;
  contextIndicators: ContextIndicator[];
}

export interface InterventionPerspective {
  id: string;
  number: number;
  title: string;
  asseTitle: string;
  description: string;
  color: string;
  badgeBg: string;
  azioni: AzioneData[];
}


export interface IndicatorRecord {
  id: string;
  code: string; // Indicator code (e.g. 'CTX-1' or 'TCOE')
  indicatorName: string;
  indicatorLevel: IndicatorLevel; // 'context' or 'output'
  dimensionId: DimensionId;
  year: number;
  calculatedValue: number | null;
  unit: string;
  paramsUsed: Record<string, number>;
  timestamp: string; // ISO date string
  notes?: string;
  municipality?: MunicipalityName;
  isNotAvailable?: boolean; // Contrassegnato come "n.d." (Dato non disponibile)
  // Custom editable programming objective & progress
  targetValue?: number;
  targetDirection?: 'higher-is-better' | 'lower-is-better';
  baselineValue?: number;
  progressPercentage?: number;
}

export interface YearlyDataSummary {
  year: number;
  records: Record<string, number>; // code -> value
}

