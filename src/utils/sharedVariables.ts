import { IndicatorRecord, MunicipalityName } from '../types';
import { evaluateProgrammingTarget } from './calculator';

export interface SharedParamDef {
  key: string;
  label: string;
  usedInCodes: string[];
  directIndicatorCode?: string;
  unit: string;
  defaultValue: number;
  legacyKeys: string[];
}

export const SHARED_PARAM_DEFINITIONS: Record<string, SharedParamDef> = {
  totale_arrivi_turistici_rilevati_anno_t: {
    key: 'totale_arrivi_turistici_rilevati_anno_t',
    label: 'Totale arrivi turistici rilevati (Anno t)',
    usedInCodes: ['CTX-1', 'CTX-3'],
    directIndicatorCode: 'CTX-1',
    unit: 'arrivi',
    defaultValue: 12500,
    legacyKeys: ['valore_rilevato', 'arrivi', 'arrivi_turistici'],
  },
  totale_presenze_turistiche_rilevate_anno_t: {
    key: 'totale_presenze_turistiche_rilevate_anno_t',
    label: 'Totale presenze turistiche rilevate (Anno t)',
    usedInCodes: ['CTX-2', 'CTX-3', 'CTX-4', 'CTX-5', 'CTX-7', 'CTX-8', 'IOT', 'ICG'],
    directIndicatorCode: 'CTX-2',
    unit: 'presenze',
    defaultValue: 28500,
    legacyKeys: ['valore_rilevato', 'presenze', 'presenze_totali', 'totali', 'Presenze turistiche annue'],
  },
  totale_popolazione_residente_anno_t: {
    key: 'totale_popolazione_residente_anno_t',
    label: 'Totale popolazione residente (Anno t)',
    usedInCodes: ['CTX-5', 'CTX-14', 'CTX-15', 'IOT', 'ICG'],
    unit: 'abitanti',
    defaultValue: 3400,
    legacyKeys: ['residenti', 'res_t', 'popolazione', 'Popolazione residente'],
  },
  totale_posti_letto_censiti_anno_t: {
    key: 'totale_posti_letto_censiti_anno_t',
    label: 'Totale posti letto censiti (Anno t)',
    usedInCodes: ['CTX-10', 'CTX-11', 'TPCT', 'PRPL'],
    directIndicatorCode: 'CTX-10',
    unit: 'posti',
    defaultValue: 650,
    legacyKeys: ['posti_letto', 'posti_letto_totali', 'Posti letto totali'],
  },
  numero_totale_ebike_messe_a_disposizione: {
    key: 'numero_totale_ebike_messe_a_disposizione',
    label: 'Numero totale di e-bike messe a disposizione (Anno t)',
    usedInCodes: ['DMD', 'IDEMH'],
    unit: 'e-bike',
    defaultValue: 30,
    legacyKeys: ['num_ebike_messe_a_disposizione', 'ebike', 'totale_ebike'],
  },
  superficie_totale_di_suolo_pubblico: {
    key: 'superficie_totale_di_suolo_pubblico',
    label: 'Superficie totale di suolo pubblico',
    usedInCodes: ['ISPR', 'IDAP', 'ICS', 'TPCA'],
    unit: 'mq',
    defaultValue: 50000,
    legacyKeys: ['mq_totali', 'mq_suolo', 'sup_suolo_pubblico', 'sup_totale_suolo_pubblico'],
  },
  totale_eventi_organizzati_anno_t: {
    key: 'totale_eventi_organizzati_anno_t',
    label: 'Totale eventi organizzati (Anno t)',
    usedInCodes: ['TCOE', 'TOEI', 'TOEO', 'TDE'],
    unit: 'eventi',
    defaultValue: 25,
    legacyKeys: ['eventi_t', 'eventi_totali', 'totale_eventi'],
  },
  totale_strutture_ricettive_anno_t: {
    key: 'totale_strutture_ricettive_anno_t',
    label: 'Totale strutture ricettive (Anno t)',
    usedInCodes: ['TFKE', 'TST', 'TDRF', 'TDRAG', 'TPR', 'TIEA', 'TIEP', 'TIFTA'],
    unit: 'strutture',
    defaultValue: 35,
    legacyKeys: ['strutture_tot', 'totale_strutture_ricettive', 'strutture'],
  },
  nomadi_digitali_periodo_ottobre_maggio_anno_t: {
    key: 'nomadi_digitali_periodo_ottobre_maggio_anno_t',
    label: 'Nomadi digitali periodo ottobre-maggio (Anno t)',
    usedInCodes: ['INDI', 'TUIP'],
    directIndicatorCode: 'INDI',
    unit: 'nomadi',
    defaultValue: 12,
    legacyKeys: ['nomadi', 'nomadi_invernali', 'nomadi_digitali'],
  },
  postazioni_di_smart_working_disponibili: {
    key: 'postazioni_di_smart_working_disponibili',
    label: 'Postazioni di smart working disponibili',
    usedInCodes: ['IPSW', 'TUIP'],
    directIndicatorCode: 'IPSW',
    unit: 'postazioni',
    defaultValue: 18,
    legacyKeys: ['postazioni', 'postazioni_disponibili', 'postazioni_smart_working'],
  },
  num_totale_parcheggi_comune_anno_t: {
    key: 'num_totale_parcheggi_comune_anno_t',
    label: 'Numero totale di parcheggi nel Comune (Anno t)',
    usedInCodes: ['IDPRE', 'IDPMH'],
    unit: 'parcheggi',
    defaultValue: 450,
    legacyKeys: ['stalli_previsti', 'parcheggi_tot', 'totale_parcheggi', 'num_totale_parcheggi'],
  },
  superficie_totale_area_urbana_funzionale_fua: {
    key: 'superficie_totale_area_urbana_funzionale_fua',
    label: "Superficie totale dell'area urbana funzionale FUA",
    usedInCodes: ['IVS', 'SPD'],
    unit: 'mq',
    defaultValue: 200000,
    legacyKeys: ['sup_fua', 'fua_totale', 'superficie_fua'],
  },
  bandi_pubblicati_dallo_sportello_anno_t: {
    key: 'bandi_pubblicati_dallo_sportello_anno_t',
    label: 'Bandi pubblicati dallo sportello (Anno t)',
    usedInCodes: ['TBPIG', 'TNIG'],
    directIndicatorCode: 'TBPIG',
    unit: 'bandi',
    defaultValue: 3,
    legacyKeys: ['bandi_pubblicati', 'bandi', 'totale_bandi', 'bandi_sportello'],
  },
  km_piste_ciclabili_fruibili_anno_t: {
    key: 'km_piste_ciclabili_fruibili_anno_t',
    label: 'Km di piste ciclabili fruibili (Anno t)',
    usedInCodes: ['CTX-12', 'TCIC', 'DMD'],
    directIndicatorCode: 'CTX-12',
    unit: 'km',
    defaultValue: 24.5,
    legacyKeys: [
      'km_ciclabili',
      'km_ciclabile',
      'km_piste_ciclabili',
      'km_rete_ciclabile',
      'Km di piste ciclabili',
      'Km di rete ciclabile',
      'km_totali_percorsi_cicloturistici_fruibili_mappati_anno_t',
      'km_totali',
    ],
  },
  numero_punti_ricarica_elettrica_attivi_anno_t: {
    key: 'numero_punti_ricarica_elettrica_attivi_anno_t',
    label: 'Numero punti di ricarica elettrica attivi (Anno t)',
    usedInCodes: ['CTX-13', 'IDPRE'],
    directIndicatorCode: 'CTX-13',
    unit: 'punti',
    defaultValue: 14,
    legacyKeys: [
      'num_punti_ricarica_attivi_anno_t',
      'punti_attivi',
      'punti_ricarica',
      'numero_totale_stalli_punti_ricarica_elettrica_attivi_anno_t',
      'punti',
      'ricarica',
      'punti_ricarica_attivi',
    ],
  },
};

/**
 * Returns shared parameter definition by key or label
 */
export function getSharedParamDefinition(paramKeyOrLabel: string): SharedParamDef | undefined {
  if (SHARED_PARAM_DEFINITIONS[paramKeyOrLabel]) {
    return SHARED_PARAM_DEFINITIONS[paramKeyOrLabel];
  }
  return Object.values(SHARED_PARAM_DEFINITIONS).find(
    (def) => def.label.toLowerCase() === paramKeyOrLabel.toLowerCase() || def.legacyKeys.includes(paramKeyOrLabel)
  );
}

/**
 * Returns other indicators that use the same parameter
 */
export function getOtherIndicatorsForParam(paramKey: string, currentIndicatorCode?: string): string[] {
  const def = getSharedParamDefinition(paramKey);
  if (!def) return [];
  if (!currentIndicatorCode) return def.usedInCodes;
  return def.usedInCodes.filter((code) => code !== currentIndicatorCode);
}

/**
 * Extracts current value of a shared parameter for a given municipality and year
 */
export function getSharedParamCurrentValue(
  records: IndicatorRecord[],
  municipality: MunicipalityName,
  year: number,
  paramKey: string,
  fallbackDefault?: number
): number | undefined {
  const def = getSharedParamDefinition(paramKey);
  if (!def) return fallbackDefault;

  const relevantRecords = records.filter(
    (r) =>
      r.year === year &&
      (r.municipality === municipality || (!r.municipality && municipality === 'Comune di Montecassiano'))
  );

  // 1. If direct indicator exists and has a value, use it
  if (def.directIndicatorCode) {
    const directRec = relevantRecords.find((r) => r.code === def.directIndicatorCode);
    if (directRec && !directRec.isNotAvailable && directRec.calculatedValue !== null && !isNaN(directRec.calculatedValue)) {
      return directRec.calculatedValue;
    }
  }

  // 2. Check if any record in usedInCodes has this param in paramsUsed
  for (const code of def.usedInCodes) {
    const rec = relevantRecords.find((r) => r.code === code);
    if (rec && rec.paramsUsed) {
      if (typeof rec.paramsUsed[def.key] === 'number') {
        return rec.paramsUsed[def.key];
      }
      for (const legacyKey of def.legacyKeys) {
        if (typeof rec.paramsUsed[legacyKey] === 'number') {
          return rec.paramsUsed[legacyKey];
        }
      }
    }
  }

  // 3. Check most recent available year for this municipality if not found for requested year
  const munRecords = records.filter(
    (r) => r.municipality === municipality || (!r.municipality && municipality === 'Comune di Montecassiano')
  );
  const otherYears = Array.from(new Set(munRecords.map((r) => r.year)))
    .filter((y) => y !== year)
    .sort((a, b) => b - a);

  for (const prevYear of otherYears) {
    const prevRelevant = munRecords.filter((r) => r.year === prevYear);
    if (def.directIndicatorCode) {
      const dir = prevRelevant.find((r) => r.code === def.directIndicatorCode);
      if (dir && !dir.isNotAvailable && dir.calculatedValue !== null && !isNaN(dir.calculatedValue)) {
        return dir.calculatedValue;
      }
    }
    for (const code of def.usedInCodes) {
      const rec = prevRelevant.find((r) => r.code === code);
      if (rec && rec.paramsUsed) {
        if (typeof rec.paramsUsed[def.key] === 'number') {
          return rec.paramsUsed[def.key];
        }
        for (const legacyKey of def.legacyKeys) {
          if (typeof rec.paramsUsed[legacyKey] === 'number') {
            return rec.paramsUsed[legacyKey];
          }
        }
      }
    }
  }

  return fallbackDefault ?? def.defaultValue;
}

/**
 * Extracts all shared parameters for a municipality and year
 */
export function extractAllSharedParams(
  records: IndicatorRecord[],
  municipality: MunicipalityName,
  year: number
): Record<string, number> {
  const result: Record<string, number> = {};
  for (const [key, def] of Object.entries(SHARED_PARAM_DEFINITIONS)) {
    const val = getSharedParamCurrentValue(records, municipality, year, key, def.defaultValue);
    if (val !== undefined) {
      result[key] = val;
    }
  }
  return result;
}

/**
 * Synchronizes all records in the same municipality and year that share a modified parameter.
 */
export function syncRecordsWithSharedParam(
  records: IndicatorRecord[],
  municipality: MunicipalityName,
  year: number,
  changedParamKey: string,
  newValue: number,
  calculateMap: Record<string, (params: Record<string, number>) => number>
): { updatedRecords: IndicatorRecord[]; affectedCodes: string[] } {
  const def = getSharedParamDefinition(changedParamKey);
  if (!def) {
    return { updatedRecords: records, affectedCodes: [] };
  }

  const affectedCodes: string[] = [];
  const updatedRecords = records.map((record) => {
    const isSameMun =
      record.municipality === municipality ||
      (!record.municipality && municipality === 'Comune di Montecassiano');

    if (!isSameMun || record.year !== year) {
      return record;
    }

    if (!def.usedInCodes.includes(record.code)) {
      return record;
    }

    affectedCodes.push(record.code);

    // Update paramsUsed
    const updatedParams = {
      ...(record.paramsUsed || {}),
      [def.key]: newValue,
    };
    // Also update legacy keys if present for consistency
    def.legacyKeys.forEach((lk) => {
      if (record.paramsUsed && lk in record.paramsUsed) {
        updatedParams[lk] = newValue;
      }
    });

    let newCalculatedValue = record.calculatedValue;

    if (!record.isNotAvailable) {
      if (record.code === def.directIndicatorCode) {
        newCalculatedValue = newValue;
      } else {
        const calcFn = calculateMap[record.code];
        if (calcFn) {
          try {
            const rawVal = calcFn(updatedParams);
            newCalculatedValue = isNaN(rawVal) || !isFinite(rawVal) ? 0 : Math.round(rawVal * 100) / 100;
          } catch {
            // keep existing if error
          }
        }
      }
    }

    // Re-evaluate target progress if targetValue exists
    let updatedProgress = record.progressPercentage;
    if (
      !record.isNotAvailable &&
      record.targetValue !== undefined &&
      record.targetValue !== null &&
      newCalculatedValue !== null
    ) {
      const evalResult = evaluateProgrammingTarget(
        newCalculatedValue,
        record.targetValue,
        record.targetDirection,
        record.baselineValue,
        record.indicatorLevel
      );
      updatedProgress = evalResult.progressPercent ?? undefined;
    }

    return {
      ...record,
      paramsUsed: updatedParams,
      calculatedValue: newCalculatedValue,
      progressPercentage: updatedProgress,
    };
  });

  // If a direct indicator (like CTX-1 for arrivi, CTX-2 for presenze, CTX-14 for posti letto)
  // does not have a record yet for this municipality and year, automatically instantiate it!
  if (def.directIndicatorCode) {
    const hasDirect = updatedRecords.some(
      (r) =>
        r.code === def.directIndicatorCode &&
        r.year === year &&
        (r.municipality === municipality || (!r.municipality && municipality === 'Comune di Montecassiano'))
    );

    if (!hasDirect) {
      const directRec: IndicatorRecord = {
        id: `rec-${municipality.toLowerCase().replace(/[^a-z0-9]/g, '')}-${year}-${def.directIndicatorCode}-${Date.now()}`,
        code: def.directIndicatorCode,
        indicatorName:
          def.directIndicatorCode === 'CTX-1'
            ? '1. Arrivi turistici annui (A)'
            : def.directIndicatorCode === 'CTX-2'
            ? '2. Presenze turistiche annue (P)'
            : def.directIndicatorCode === 'CTX-10'
            ? '10. Posti letto totali disponibili (PL)'
            : def.directIndicatorCode === 'CTX-12'
            ? '12. Km di rete cicloturistica fruibile (KC)'
            : def.directIndicatorCode === 'CTX-13'
            ? '13. Punti di ricarica per mobilità elettrica (PR)'
            : def.directIndicatorCode,
        indicatorLevel: 'context',
        dimensionId:
          def.directIndicatorCode === 'CTX-10' ||
          def.directIndicatorCode === 'CTX-12' ||
          def.directIndicatorCode === 'CTX-13'
            ? 'dim3'
            : 'dim1',
        year,
        calculatedValue: newValue,
        unit: def.unit,
        paramsUsed: { [def.key]: newValue },
        timestamp: new Date().toISOString(),
        municipality,
        notes: `Sincronizzato automaticamente da parametro condiviso: ${def.label}`,
      };
      updatedRecords.unshift(directRec);
      affectedCodes.push(def.directIndicatorCode);
    }
  }

  return { updatedRecords, affectedCodes };
}
