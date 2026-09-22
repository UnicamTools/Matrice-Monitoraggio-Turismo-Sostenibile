import { OutputIndicator, IndicatorRecord, MunicipalityName, DimensionId } from '../types';

export interface ProgrammingTargetEvaluation {
  status: 'good' | 'warning' | 'alert' | 'none';
  label: string;
  color: string;
  badge: string;
  progressPercent: number | null;
  deltaToTarget: number | null;
  isTargetMet: boolean;
  isTargetSet: boolean;
}

export function evaluateProgrammingTarget(
  value: number | null | undefined,
  targetValue?: number | null,
  direction: 'higher-is-better' | 'lower-is-better' = 'higher-is-better',
  baselineValue?: number | null,
  level: 'context' | 'output' = 'output'
): ProgrammingTargetEvaluation {
  // If value is missing / n.d.
  if (value === null || value === undefined || isNaN(value)) {
    return {
      status: 'none',
      label: 'n.d. (Dato non disponibile)',
      color: 'text-zinc-500 dark:text-zinc-400',
      badge: 'bg-zinc-100 text-zinc-600 border-zinc-200 dark:bg-zinc-800 dark:text-zinc-400 dark:border-zinc-700',
      progressPercent: null,
      deltaToTarget: null,
      isTargetMet: false,
      isTargetSet: false,
    };
  }

  const isContext = level === 'context';
  const goodColor = isContext
    ? 'text-purple-600 dark:text-purple-400'
    : 'text-emerald-600 dark:text-emerald-400';
  const goodBadge = isContext
    ? 'bg-purple-100 text-purple-800 border-purple-300 dark:bg-purple-950 dark:text-purple-300 dark:border-purple-800'
    : 'bg-emerald-100 text-emerald-800 border-emerald-300 dark:bg-emerald-950 dark:text-emerald-300 dark:border-emerald-800';

  // If no target has been set by the user
  if (targetValue === undefined || targetValue === null || isNaN(targetValue)) {
    return {
      status: 'none',
      label: 'Target non impostato',
      color: 'text-zinc-500 dark:text-zinc-400',
      badge: 'bg-zinc-100 text-zinc-600 border-zinc-200 dark:bg-zinc-800 dark:text-zinc-400 dark:border-zinc-700',
      progressPercent: null,
      deltaToTarget: null,
      isTargetMet: false,
      isTargetSet: false,
    };
  }

  const base = baselineValue ?? 0;
  const delta = value - targetValue;

  if (direction === 'higher-is-better') {
    let progress = 0;
    if (base !== 0 && targetValue !== base && targetValue > base) {
      progress = ((value - base) / (targetValue - base)) * 100;
    } else if (targetValue > 0) {
      progress = (value / targetValue) * 100;
    } else {
      progress = value >= targetValue ? 100 : 0;
    }

    const clampedProgress = Math.max(0, Math.round(progress * 10) / 10);
    const isTargetMet = value >= targetValue;

    if (isTargetMet) {
      return {
        status: 'good',
        label: 'Obiettivo Raggiunto / Superato',
        color: goodColor,
        badge: goodBadge,
        progressPercent: clampedProgress,
        deltaToTarget: Math.round(delta * 100) / 100,
        isTargetMet: true,
        isTargetSet: true,
      };
    } else if (clampedProgress >= 60) {
      return {
        status: 'warning',
        label: 'In Corso di Raggiungimento',
        color: 'text-amber-600 dark:text-amber-400',
        badge: 'bg-amber-100 text-amber-800 border-amber-300 dark:bg-amber-950 dark:text-amber-300 dark:border-amber-800',
        progressPercent: clampedProgress,
        deltaToTarget: Math.round(delta * 100) / 100,
        isTargetMet: false,
        isTargetSet: true,
      };
    } else {
      return {
        status: 'alert',
        label: "Sotto l'Obiettivo di Programmazione",
        color: 'text-rose-600 dark:text-rose-400',
        badge: 'bg-rose-100 text-rose-800 border-rose-300 dark:bg-rose-950 dark:text-rose-300 dark:border-rose-800',
        progressPercent: clampedProgress,
        deltaToTarget: Math.round(delta * 100) / 100,
        isTargetMet: false,
        isTargetSet: true,
      };
    }
  } else {
    // lower-is-better
    const isTargetMet = value <= targetValue;
    let progress = 100;
    if (value <= targetValue) {
      progress = 100;
    } else if (targetValue > 0) {
      const overPct = ((value - targetValue) / targetValue) * 100;
      progress = Math.max(0, Math.round((100 - overPct) * 10) / 10);
    } else {
      progress = 0;
    }

    if (isTargetMet) {
      return {
        status: 'good',
        label: 'Obiettivo Rispettato (Entro il Limite)',
        color: goodColor,
        badge: goodBadge,
        progressPercent: progress,
        deltaToTarget: Math.round(delta * 100) / 100,
        isTargetMet: true,
        isTargetSet: true,
      };
    } else if (progress >= 60) {
      return {
        status: 'warning',
        label: 'Lieve Scostamento dal Limite',
        color: 'text-amber-600 dark:text-amber-400',
        badge: 'bg-amber-100 text-amber-800 border-amber-300 dark:bg-amber-950 dark:text-amber-300 dark:border-amber-800',
        progressPercent: progress,
        deltaToTarget: Math.round(delta * 100) / 100,
        isTargetMet: false,
        isTargetSet: true,
      };
    } else {
      return {
        status: 'alert',
        label: "Supera l'Obiettivo di Soglia Massima",
        color: 'text-rose-600 dark:text-rose-400',
        badge: 'bg-rose-100 text-rose-800 border-rose-300 dark:bg-rose-950 dark:text-rose-300 dark:border-rose-800',
        progressPercent: progress,
        deltaToTarget: Math.round(delta * 100) / 100,
        isTargetMet: false,
        isTargetSet: true,
      };
    }
  }
}

export function evaluateIndicatorStatus(
  value: number | null | undefined,
  threshold?: OutputIndicator['targetThreshold'],
  level: 'context' | 'output' = 'output'
): { status: 'good' | 'warning' | 'alert' | 'none'; label: string; color: string; badge: string } {
  if (value === null || value === undefined || isNaN(value)) {
    return {
      status: 'none',
      label: 'n.d. (Dato non disponibile)',
      color: 'text-zinc-500 dark:text-zinc-400',
      badge: 'bg-zinc-100 text-zinc-600 border-zinc-200 dark:bg-zinc-800 dark:text-zinc-400 dark:border-zinc-700',
    };
  }

  if (!threshold) {
    return {
      status: 'none',
      label: 'Target non impostato',
      color: 'text-zinc-500 dark:text-zinc-400',
      badge: 'bg-zinc-100 text-zinc-600 border-zinc-200 dark:bg-zinc-800 dark:text-zinc-400 dark:border-zinc-700',
    };
  }

  const isContext = level === 'context';
  const goodColor = isContext
    ? 'text-purple-600 dark:text-purple-400'
    : 'text-emerald-600 dark:text-emerald-400';
  const goodBadge = isContext
    ? 'bg-purple-100 text-purple-800 border-purple-300 dark:bg-purple-950 dark:text-purple-300 dark:border-purple-800'
    : 'bg-emerald-100 text-emerald-800 border-emerald-300 dark:bg-emerald-950 dark:text-emerald-300 dark:border-emerald-800';

  const { good, warning, direction } = threshold;

  if (direction === 'higher-is-better') {
    if (value >= good) {
      return {
        status: 'good',
        label: 'Ottimo (In Target)',
        color: goodColor,
        badge: goodBadge,
      };
    } else if (value >= warning) {
      return {
        status: 'warning',
        label: 'In Progresso',
        color: 'text-amber-600 dark:text-amber-400',
        badge: 'bg-amber-100 text-amber-800 border-amber-300 dark:bg-amber-950 dark:text-amber-300 dark:border-amber-800',
      };
    } else {
      return {
        status: 'alert',
        label: 'Sotto Soglia',
        color: 'text-rose-600 dark:text-rose-400',
        badge: 'bg-rose-100 text-rose-800 border-rose-300 dark:bg-rose-950 dark:text-rose-300 dark:border-rose-800',
      };
    }
  } else {
    // lower-is-better
    if (value <= good) {
      return {
        status: 'good',
        label: 'Ottimo (In Target)',
        color: goodColor,
        badge: goodBadge,
      };
    } else if (value <= warning) {
      return {
        status: 'warning',
        label: 'In Progresso',
        color: 'text-amber-600 dark:text-amber-400',
        badge: 'bg-amber-100 text-amber-800 border-amber-300 dark:bg-amber-950 dark:text-amber-300 dark:border-amber-800',
      };
    } else {
      return {
        status: 'alert',
        label: 'Supera Soglia Sostenibilità',
        color: 'text-rose-600 dark:text-rose-400',
        badge: 'bg-rose-100 text-rose-800 border-rose-300 dark:bg-rose-950 dark:text-rose-300 dark:border-rose-800',
      };
    }
  }
}

export function formatValueWithUnit(
  value: number | null | undefined,
  unit: string,
  isNotAvailable?: boolean
): string {
  if (isNotAvailable || value === null || value === undefined || isNaN(value) || !isFinite(value)) {
    return 'n.d.';
  }
  let formatted = value.toLocaleString('it-IT', {
    maximumFractionDigits: 2,
    minimumFractionDigits: 0,
  });

  if (unit === '%') return `${formatted}%`;
  return `${formatted} ${unit}`;
}

const STORAGE_KEY = 'matrice_sostenibilita_records_v6';
const ACTIVE_MUNICIPALITY_KEY = 'matrice_active_municipality';

export function getStoredActiveMunicipality(): MunicipalityName {
  try {
    const saved = localStorage.getItem(ACTIVE_MUNICIPALITY_KEY);
    if (
      saved === 'Comune di Montecassiano' ||
      saved === 'Comune di Montefano' ||
      saved === 'Comune di Montelupone'
    ) {
      return saved;
    }
  } catch {
    // fallback
  }
  return 'Comune di Montecassiano';
}

export function saveActiveMunicipalityToStorage(name: MunicipalityName): void {
  try {
    localStorage.setItem(ACTIVE_MUNICIPALITY_KEY, name);
  } catch {
    // ignore
  }
}

export const loadActiveMunicipality = getStoredActiveMunicipality;
export const saveActiveMunicipality = saveActiveMunicipalityToStorage;

function migrateRecordNames(records: IndicatorRecord[]): IndicatorRecord[] {
  const updated = records.map((r) => {
    // Migration of Context Indicators to new canonical numbers & dimensions
    if (r.indicatorName?.includes('Intensità turistica') || r.code === 'CTX-5') {
      r = {
        ...r,
        code: 'CTX-5',
        indicatorName: '5. Intensità turistica (IT)',
        dimensionId: 'dim2' as DimensionId,
      };
    } else if (r.indicatorName?.includes('Stagionalità turistica') || r.code === 'CTX-6') {
      r = {
        ...r,
        code: 'CTX-6',
        indicatorName: '6. Stagionalità turistica (ST)',
        dimensionId: 'dim2' as DimensionId,
      };
    } else if (r.indicatorName?.includes('Posti letto totali') || ((r.code === 'CTX-14' || r.code === 'CTX-10') && r.paramsUsed && 'totale_posti_letto_censiti_anno_t' in r.paramsUsed)) {
      r = {
        ...r,
        id: r.id.replace(/-ctx-14-/i, '-ctx-10-'),
        code: 'CTX-10',
        indicatorName: '10. Posti letto totali disponibili (PL)',
        dimensionId: 'dim3' as DimensionId,
      };
    } else if (r.indicatorName?.includes('agriturismi') || ((r.code === 'CTX-15' || r.code === 'CTX-11') && r.paramsUsed && ('posti_letto_agriturismo_censiti_anno_t' in r.paramsUsed || 'agriturismi' in r.paramsUsed))) {
      r = {
        ...r,
        id: r.id.replace(/-ctx-15-/i, '-ctx-11-'),
        code: 'CTX-11',
        indicatorName: '11. Incidenza degli agriturismi (%Agri)',
        dimensionId: 'dim3' as DimensionId,
      };
    } else if (r.indicatorName?.includes('cicloturistica') || ((r.code === 'CTX-10' || r.code === 'CTX-12') && r.paramsUsed && ('km_piste_ciclabili_fruibili_anno_t' in r.paramsUsed || 'km_ciclabili' in r.paramsUsed))) {
      r = {
        ...r,
        id: r.id.replace(/-ctx-10-/i, '-ctx-12-'),
        code: 'CTX-12',
        indicatorName: '12. Km di rete cicloturistica fruibile (KC)',
        dimensionId: 'dim3' as DimensionId,
      };
    } else if (r.indicatorName?.includes('ricarica per mobilità elettrica') || ((r.code === 'CTX-11' || r.code === 'CTX-13') && r.paramsUsed && ('numero_punti_ricarica_elettrica_attivi_anno_t' in r.paramsUsed || 'punti_ricarica' in r.paramsUsed))) {
      r = {
        ...r,
        id: r.id.replace(/-ctx-11-/i, '-ctx-13-'),
        code: 'CTX-13',
        indicatorName: '13. Punti di ricarica per mobilità elettrica (PR)',
        dimensionId: 'dim3' as DimensionId,
      };
    } else if (r.indicatorName?.includes('popolazione residente a 5 anni') || ((r.code === 'CTX-12' || r.code === 'CTX-14') && r.paramsUsed && 'totale_popolazione_residente_anno_t_5' in r.paramsUsed)) {
      r = {
        ...r,
        id: r.id.replace(/-ctx-12-/i, '-ctx-14-'),
        code: 'CTX-14',
        indicatorName: '14. Variazione della popolazione residente a 5 anni (ΔR)',
        dimensionId: 'dim4' as DimensionId,
      };
    } else if (r.indicatorName?.includes('imprenditoriale turistica') || ((r.code === 'CTX-13' || r.code === 'CTX-15') && r.paramsUsed && 'imprese_turistiche_attive_anno_t' in r.paramsUsed)) {
      r = {
        ...r,
        id: r.id.replace(/-ctx-13-/i, '-ctx-15-'),
        code: 'CTX-15',
        indicatorName: '15. Densità imprenditoriale turistica (DT)',
        dimensionId: 'dim4' as DimensionId,
      };
    }

    if (r.code === 'TFKE' && r.indicatorName.includes('Indice di Fornitura di Kit Ecologico')) {
      return { ...r, indicatorName: 'TFKE - Tasso di Fornitura di Kit Ecologico (%)' };
    }
    // Only migrate old legacy IDAP to IAC if it explicitly referred to CAM
    if (r.code === 'IDAP' && (r.indicatorName.includes('CAM') || r.indicatorName.includes('Copertura'))) {
      return {
        ...r,
        id: r.id.replace(/-idap$/, '-iac'),
        code: 'IAC',
        indicatorName: 'IAC - Indice Annuale di Copertura CAM (%)',
        unit: '%',
      };
    }
    if (r.code === 'IDAP-2' || (r.id && r.id.endsWith('-idap2'))) {
      return {
        ...r,
        id: r.id.replace(/-idap2$/, '-idap'),
        code: 'IDAP',
        indicatorName: "IDAP - Indice di dotazione di Dispositivi per l'Acqua Potabile (Numero/mq di suolo pubblico)",
        unit: 'dispositivi/10k mq',
      };
    }
    // If an IAC record actually contains IDAP parameters, unit, or name, restore it to IDAP
    if (
      r.code === 'IAC' &&
      (r.unit === 'dispositivi/10k mq' ||
        r.indicatorName.includes('Dispositivi') ||
        (r.paramsUsed && ('dispositivi' in r.paramsUsed || 'mq_suolo' in r.paramsUsed)))
    ) {
      return {
        ...r,
        id: r.id.replace(/-iac$/, '-idap'),
        code: 'IDAP',
        indicatorName: "IDAP - Indice di dotazione di Dispositivi per l'Acqua Potabile (Numero/mq di suolo pubblico)",
        unit: 'dispositivi/10k mq',
        dimensionId: 'dim2' as DimensionId,
      };
    }
    if (r.code === 'TPCA' && r.paramsUsed && ('volontari' in r.paramsUsed || 'residenti' in r.paramsUsed)) {
      const newParams: Record<string, number> = {
        sup_suolo_curata_cittadini_anno_t: typeof r.paramsUsed.volontari === 'number' ? r.paramsUsed.volontari : 2500,
        sup_totale_suolo_pubblico: typeof r.paramsUsed.residenti === 'number' ? 50000 : 50000,
      };
      return {
        ...r,
        paramsUsed: newParams,
        calculatedValue: newParams.sup_totale_suolo_pubblico
          ? Math.round((newParams.sup_suolo_curata_cittadini_anno_t / newParams.sup_totale_suolo_pubblico) * 10000) / 100
          : 0,
      };
    }
    if (r.code === 'TPCT' && r.paramsUsed && ('strutture_cer' in r.paramsUsed || 'strutture_tot' in r.paramsUsed)) {
      const newParams: Record<string, number> = {
        posti_letto_strutture_membri_cer_anno_t: typeof r.paramsUsed.strutture_cer === 'number' ? r.paramsUsed.strutture_cer : 130,
        totale_posti_letto_censiti_anno_t: typeof r.paramsUsed.strutture_tot === 'number' ? r.paramsUsed.strutture_tot : 650,
      };
      return {
        ...r,
        paramsUsed: newParams,
        calculatedValue: newParams.totale_posti_letto_censiti_anno_t
          ? Math.round((newParams.posti_letto_strutture_membri_cer_anno_t / newParams.totale_posti_letto_censiti_anno_t) * 10000) / 100
          : 0,
      };
    }
    if (r.code === 'TIEA' && r.paramsUsed && 'strutture_attivi' in r.paramsUsed) {
      const newParams: Record<string, number> = {
        richieste_incentivo_erogate_anno_t: typeof r.paramsUsed.strutture_attivi === 'number' ? r.paramsUsed.strutture_attivi : 16,
        strutture_tot: typeof r.paramsUsed.strutture_tot === 'number' ? r.paramsUsed.strutture_tot : 35,
      };
      return {
        ...r,
        paramsUsed: newParams,
        calculatedValue: newParams.strutture_tot
          ? Math.round((newParams.richieste_incentivo_erogate_anno_t / newParams.strutture_tot) * 10000) / 100
          : 0,
      };
    }
    if (r.code === 'TIEP' && r.paramsUsed && 'strutture_passivi' in r.paramsUsed) {
      const newParams: Record<string, number> = {
        interventi_interfacce_climatiche_anno_t: typeof r.paramsUsed.strutture_passivi === 'number' ? r.paramsUsed.strutture_passivi : 11,
        strutture_tot: typeof r.paramsUsed.strutture_tot === 'number' ? r.paramsUsed.strutture_tot : 35,
      };
      return {
        ...r,
        paramsUsed: newParams,
        calculatedValue: newParams.strutture_tot
          ? Math.round((newParams.interventi_interfacce_climatiche_anno_t / newParams.strutture_tot) * 10000) / 100
          : 0,
      };
    }
    if (r.code === 'IDPRE' && r.paramsUsed && ('punti_attivi' in r.paramsUsed || 'punti_previsti' in r.paramsUsed)) {
      const newParams: Record<string, number> = {
        num_punti_ricarica_attivi_anno_t: typeof r.paramsUsed.punti_attivi === 'number' ? r.paramsUsed.punti_attivi : 14,
        num_totale_parcheggi_comune_anno_t: typeof r.paramsUsed.punti_previsti === 'number' ? 450 : 450,
      };
      return {
        ...r,
        paramsUsed: newParams,
        calculatedValue: newParams.num_totale_parcheggi_comune_anno_t
          ? Math.round((newParams.num_punti_ricarica_attivi_anno_t / newParams.num_totale_parcheggi_comune_anno_t) * 10000) / 100
          : 0,
      };
    }
    if (r.code === 'DMD' && r.paramsUsed && 'dotazioni' in r.paramsUsed) {
      const newParams: Record<string, number> = {
        num_ebike_messe_a_disposizione: typeof r.paramsUsed.dotazioni === 'number' ? r.paramsUsed.dotazioni : 30,
        km_ciclabile: typeof r.paramsUsed.km_ciclabile === 'number' ? r.paramsUsed.km_ciclabile : 24.5,
      };
      return {
        ...r,
        paramsUsed: newParams,
        calculatedValue: newParams.km_ciclabile > 0
          ? Math.round((newParams.num_ebike_messe_a_disposizione / newParams.km_ciclabile) * 100) / 100
          : 0,
      };
    }
    if (r.code === 'IDEMH' && r.paramsUsed && ('hubs_ebike' in r.paramsUsed || 'hubs_tot' in r.paramsUsed)) {
      const newParams: Record<string, number> = {
        num_ebike_noleggiabili_parcheggi_scambiatori: typeof r.paramsUsed.hubs_ebike === 'number' ? 18 : 18,
        numero_totale_ebike_messe_a_disposizione: typeof r.paramsUsed.hubs_tot === 'number' ? 30 : 30,
      };
      return {
        ...r,
        paramsUsed: newParams,
        calculatedValue: newParams.numero_totale_ebike_messe_a_disposizione
          ? Math.round((newParams.num_ebike_noleggiabili_parcheggi_scambiatori / newParams.numero_totale_ebike_messe_a_disposizione) * 10000) / 100
          : 0,
      };
    }
    if (r.code === 'IMS' && r.paramsUsed && ('punteggio_ciclabilita' in r.paramsUsed || 'punteggio_ricarica' in r.paramsUsed)) {
      const newParams: Record<string, number> = {
        somma_collegamenti_eventi: 24,
        numero_eventi: 4,
        collegamenti_giornalieri_infrasettimanali: 8,
        collegamenti_giornalieri_weekend: 16,
      };
      const mediaEventi = 24 / 4;
      const mediaOrdinario = (8 * 5 + 16 * 2) / 7;
      return {
        ...r,
        paramsUsed: newParams,
        unit: 'collegamenti',
        calculatedValue: Math.round((mediaEventi + mediaOrdinario) * 100) / 100,
      };
    }
    return r;
  });

  // Deduplicate and heal duplicate records resulting from earlier migration bug
  const seenKey = new Map<string, IndicatorRecord>();
  const result: IndicatorRecord[] = [];

  for (const r of updated) {
    const mun = r.municipality || 'Comune di Montecassiano';
    const comboKey = `${mun}__${r.year}__${r.code}`;

    if (seenKey.has(comboKey)) {
      // If we have a duplicate IAC record and IDAP is missing for this municipality/year,
      // heal the second record by restoring it as IDAP
      if (r.code === 'IAC') {
        const hasIdap = updated.some(
          (item) =>
            (item.municipality || 'Comune di Montecassiano') === mun &&
            item.year === r.year &&
            item.code === 'IDAP'
        );
        if (!hasIdap) {
          const restoredIdap: IndicatorRecord = {
            ...r,
            id: r.id.replace(/-iac$/, '-idap'),
            code: 'IDAP',
            indicatorName: "IDAP - Indice di dotazione di Dispositivi per l'Acqua Potabile (Numero/mq di suolo pubblico)",
            unit: 'dispositivi/10k mq',
            dimensionId: 'dim2' as DimensionId,
          };
          seenKey.set(`${mun}__${r.year}__IDAP`, restoredIdap);
          result.push(restoredIdap);
          continue;
        }
      }

      // If duplicate, prefer the one with real calculated values / non-empty params
      const existing = seenKey.get(comboKey)!;
      if (existing.isNotAvailable && !r.isNotAvailable) {
        const idx = result.indexOf(existing);
        if (idx >= 0) {
          result[idx] = r;
          seenKey.set(comboKey, r);
        }
      }
      continue;
    }

    seenKey.set(comboKey, r);
    result.push(r);
  }

  // Ensure all IDs are strictly unique across the returned list
  const seenId = new Set<string>();
  return result.map((r, i) => {
    let finalId = r.id;
    if (!finalId || seenId.has(finalId)) {
      const munSlug = (r.municipality || 'montecassiano').toLowerCase().replace(/[^a-z0-9]/g, '');
      finalId = `rec-${munSlug}-${r.year}-${r.code.toLowerCase()}-${i}`;
    }
    seenId.add(finalId);
    return { ...r, id: finalId };
  });
}

export function loadRecordsFromStorage(): IndicatorRecord[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed: IndicatorRecord[] = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return migrateRecordNames(parsed);
      }
    }
    return [];
  } catch (e) {
    console.error('Failed to load records from localStorage', e);
    return [];
  }
}

export function saveRecordsToStorage(records: IndicatorRecord[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(records));
  } catch (e) {
    console.error('Failed to save records to localStorage', e);
  }
}

export const DEMO_BASELINE_KEY = 'matrice_demo_baseline_records';

export function saveDemoBaselineToStorage(records: IndicatorRecord[]): void {
  try {
    localStorage.setItem(DEMO_BASELINE_KEY, JSON.stringify(records));
  } catch (e) {
    console.error('Failed to save demo baseline to localStorage', e);
  }
}

export function loadDemoBaselineFromStorage(): IndicatorRecord[] | null {
  try {
    const raw = localStorage.getItem(DEMO_BASELINE_KEY);
    if (raw) {
      const parsed: IndicatorRecord[] = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return migrateRecordNames(parsed);
      }
    }
  } catch (e) {
    console.error('Failed to load demo baseline from localStorage', e);
  }
  return null;
}

export const BASELINE_YEARS = [2023, 2024, 2025, 2026, 2027];
const CUSTOM_YEARS_STORAGE_KEY = 'matrice_custom_years';

export function loadCustomYearsFromStorage(): number[] {
  try {
    const raw = localStorage.getItem(CUSTOM_YEARS_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) {
        return parsed
          .map(Number)
          .filter((y) => !isNaN(y) && y >= 2000 && y <= 2100);
      }
    }
  } catch (e) {
    console.error('Failed to load custom years from localStorage', e);
  }
  return [];
}

export function saveCustomYearsToStorage(years: number[]): void {
  try {
    localStorage.setItem(CUSTOM_YEARS_STORAGE_KEY, JSON.stringify(years));
  } catch (e) {
    console.error('Failed to save custom years to localStorage', e);
  }
}

export function getAllAvailableYears(records: IndicatorRecord[], customYears: number[] = []): number[] {
  const setYears = new Set<number>(BASELINE_YEARS);
  records.forEach((r) => {
    if (r.year && !isNaN(r.year) && r.year >= 2000 && r.year <= 2100) {
      setYears.add(r.year);
    }
  });
  customYears.forEach((y) => {
    if (y && !isNaN(y) && y >= 2000 && y <= 2100) {
      setYears.add(y);
    }
  });
  return Array.from(setYears).sort((a, b) => a - b);
}


