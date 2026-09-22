import {
  ContextIndicator,
  OutputIndicator,
  CalculableIndicator,
  DimensionCardData,
  ContextAnalysisSection,
  InterventionPerspective,
} from '../types';

export const DIMENSIONS = [
  {
    id: 'dim1' as const,
    number: 1,
    title: 'Capacità di Attrazione e Flussi turistici',
    description: 'Profilo turistico-ambientale e linee strategiche per il riequilibrio e la destagionalizzazione dei flussi.',
    color: 'emerald',
    badgeBg: 'bg-emerald-100 text-emerald-800 border-emerald-200 dark:bg-emerald-950 dark:text-emerald-300 dark:border-emerald-800',
  },
  {
    id: 'dim2' as const,
    number: 2,
    title: 'Pressione Turistica e Impatto Ambientale',
    description: 'Profilo turistico-ambientale e linee strategiche per la mitigazione dell\'impronta ecologica turistica.',
    color: 'sky',
    badgeBg: 'bg-sky-100 text-sky-800 border-sky-200 dark:bg-sky-950 dark:text-sky-300 dark:border-sky-800',
  },
  {
    id: 'dim3' as const,
    number: 3,
    title: 'Struttura dell\'Offerta Sostenibile e Mobilità Dolce',
    description: 'Profilo turistico-ambientale e linee strategiche per l\'incremento della mobilità dolce e dell\'accessibilità.',
    color: 'amber',
    badgeBg: 'bg-amber-100 text-amber-800 border-amber-200 dark:bg-amber-950 dark:text-amber-300 dark:border-amber-800',
  },
  {
    id: 'dim4' as const,
    number: 4,
    title: 'Resilienza Demografica ed Economica',
    description: 'Profilo turistico-ambientale e linee strategiche per la tutela della resilienza demografica.',
    color: 'indigo',
    badgeBg: 'bg-indigo-100 text-indigo-800 border-indigo-200 dark:bg-indigo-950 dark:text-indigo-300 dark:border-indigo-800',
  },
];

// Definition of 15 Context Indicators
export const CONTEXT_INDICATORS: ContextIndicator[] = [
  // DIMENSIONE 1
  {
    id: 'ind1',
    code: 'CTX-1',
    number: 1,
    level: 'context',
    dimensionId: 'dim1',
    name: '1. Arrivi turistici annui (A)',
    unit: 'arrivi',
    description: 'Indicatore di Contesto: misura il volume complessivo degli arrivi turistici annui nel Comune.',
    formulaDisplay: 'Totale arrivi turistici rilevati (Anno t)',
    params: [
      {
        key: 'totale_arrivi_turistici_rilevati_anno_t',
        label: 'Totale arrivi turistici rilevati (Anno t)',
        defaultValue: 12500,
        unit: 'arrivi',
      },
    ],
    calculate: (p) => p.totale_arrivi_turistici_rilevati_anno_t ?? p.valore_rilevato ?? p.arrivi ?? 0,
    objective: 'Aumento dell\'attrattività per incrementare gli arrivi e le permanenze nei borghi.',
    strategy: 'Riequilibrio e destagionalizzazione dei flussi.',
    action: 'Sviluppo dell’offerta turistica e riqualificazione degli spazi.',
    outputIndicators: [],
  },
  {
    id: 'ind2',
    code: 'CTX-2',
    number: 2,
    level: 'context',
    dimensionId: 'dim1',
    name: '2. Presenze turistiche annue (P)',
    unit: 'presenze',
    description: 'Indicatore di Contesto: totale dei pernottamenti turistici annui.',
    formulaDisplay: 'Totale presenze turistiche rilevate (Anno t)',
    params: [
      {
        key: 'totale_presenze_turistiche_rilevate_anno_t',
        label: 'Totale presenze turistiche rilevate (Anno t)',
        defaultValue: 28500,
        unit: 'presenze',
      },
    ],
    calculate: (p) => p.totale_presenze_turistiche_rilevate_anno_t ?? p.valore_rilevato ?? p.presenze ?? 0,
    objective: 'Incremento della permanenza complessiva e rigenerazione urbana.',
    strategy: 'Riequilibrio e destagionalizzazione dei flussi.',
    action: 'Sviluppo dell’offerta turistica e riqualificazione degli spazi.',
    outputIndicators: [],
  },
  {
    id: 'ind3',
    code: 'CTX-3',
    number: 3,
    level: 'context',
    dimensionId: 'dim1',
    name: '3. Permanenza media (PM)',
    unit: 'giorni',
    description: 'Indicatore di Contesto: durata media del soggiorno dei turisti (Presenze / Arrivi).',
    formulaDisplay: 'Totale presenze turistiche rilevate (Anno t) / Totale arrivi turistici rilevati (Anno t)',
    params: [
      {
        key: 'totale_presenze_turistiche_rilevate_anno_t',
        label: 'Totale presenze turistiche rilevate (Anno t)',
        defaultValue: 28500,
        unit: 'presenze',
      },
      {
        key: 'totale_arrivi_turistici_rilevati_anno_t',
        label: 'Totale arrivi turistici rilevati (Anno t)',
        defaultValue: 12500,
        unit: 'arrivi',
      },
    ],
    calculate: (p) => {
      const pres = p.totale_presenze_turistiche_rilevate_anno_t ?? p.presenze ?? 0;
      const arr = p.totale_arrivi_turistici_rilevati_anno_t ?? p.arrivi ?? 0;
      return arr > 0 ? pres / arr : 0;
    },
    objective: 'Estendere la durata dei soggiorni valorizzando l\'offerta locale.',
    strategy: 'Riequilibrio e destagionalizzazione dei flussi.',
    action: 'Sviluppo dell’offerta turistica e riqualificazione degli spazi.',
    outputIndicators: [],
  },
  {
    id: 'ind4',
    code: 'CTX-4',
    number: 4,
    level: 'context',
    dimensionId: 'dim1',
    name: '4. Incidenza del turismo straniero (IS)',
    unit: '%',
    description: 'Indicatore di Contesto: incidenza percentuale delle presenze straniere rispetto al totale delle presenze turistiche.',
    formulaDisplay: '(Presenze turistiche straniere rilevate (Anno t) / Totale presenze turistiche rilevate (Anno t)) * 100',
    params: [
      {
        key: 'presenze_turistiche_straniere_rilevate_anno_t',
        label: 'Presenze turistiche straniere rilevate (Anno t)',
        defaultValue: 8550,
        unit: 'presenze',
      },
      {
        key: 'totale_presenze_turistiche_rilevate_anno_t',
        label: 'Totale presenze turistiche rilevate (Anno t)',
        defaultValue: 28500,
        unit: 'presenze',
      },
    ],
    calculate: (p) => {
      const presStranieri = p.presenze_turistiche_straniere_rilevate_anno_t ?? p.presenze_stranieri ?? p.stranieri ?? 0;
      const presTotali = p.totale_presenze_turistiche_rilevate_anno_t ?? p.presenze_totali ?? p.presenze ?? 0;
      return presTotali > 0 ? (presStranieri / presTotali) * 100 : 0;
    },
    objective: 'Attrazione di flussi turistici internazionali e incremento delle presenze estere.',
    strategy: 'Riequilibrio e destagionalizzazione dei flussi.',
    action: 'Sviluppo dell’offerta turistica e riqualificazione degli spazi.',
    outputIndicators: [],
  },
  // DIMENSIONE 2
  {
    id: 'ind5',
    code: 'CTX-5',
    number: 5,
    level: 'context',
    dimensionId: 'dim2',
    name: '5. Intensità turistica (IT)',
    unit: 'presenze/ab',
    description: 'Indicatore di Contesto: rapporto tra presenze turistiche e popolazione residente.',
    formulaDisplay: 'Totale presenze turistiche rilevate (Anno t) / Totale popolazione residente (Anno t)',
    params: [
      {
        key: 'totale_presenze_turistiche_rilevate_anno_t',
        label: 'Totale presenze turistiche rilevate (Anno t)',
        defaultValue: 28500,
        unit: 'presenze',
      },
      {
        key: 'totale_popolazione_residente_anno_t',
        label: 'Totale popolazione residente (Anno t)',
        defaultValue: 3400,
        unit: 'abitanti',
      },
    ],
    calculate: (p) => {
      const pres = p.totale_presenze_turistiche_rilevate_anno_t ?? p.presenze ?? 0;
      const pop = p.totale_popolazione_residente_anno_t ?? p.residenti ?? 0;
      return pop > 0 ? pres / pop : 0;
    },
    objective: 'Misurare la densità di presenza turistica rispetto alla comunità locale e monitorare la pressione sul territorio.',
    strategy: 'Mitigazione dell\'impronta ecologica turistica.',
    action: 'Promozione della transizione energetica e metabolismo circolare.',
    outputIndicators: [],
  },
  {
    id: 'ind6',
    code: 'CTX-6',
    number: 6,
    level: 'context',
    dimensionId: 'dim2',
    name: '6. Stagionalità turistica (ST)',
    unit: '%',
    description: 'Indicatore di Contesto: rapporto percentuale tra le presenze registrate nel trimestre di picco massimo e quelle nel trimestre di picco minimo.',
    formulaDisplay: '(Presenze turistiche rilevate nel trimestre di picco massimo (Anno t) / Presenze turistiche rilevate nel trimestre di picco minimo (Anno t)) * 100',
    params: [
      {
        key: 'presenze_trimestre_picco_massimo_anno_t',
        label: 'Presenze turistiche rilevate nel trimestre di picco massimo (Anno t)',
        defaultValue: 14200,
        unit: 'presenze',
      },
      {
        key: 'presenze_trimestre_picco_minimo_anno_t',
        label: 'Presenze turistiche rilevate nel trimestre di picco minimo (Anno t)',
        defaultValue: 3550,
        unit: 'presenze',
      },
    ],
    calculate: (p) => {
      const piccoMax = p.presenze_trimestre_picco_massimo_anno_t ?? p.presenze_trimestre_picco_anno_t ?? p.presenze_picco_max ?? p.picco_max ?? 0;
      const piccoMin = p.presenze_trimestre_picco_minimo_anno_t ?? p.presenze_trimestre_morbida_anno_t ?? p.presenze_picco_min ?? p.picco_min ?? 0;
      return piccoMin > 0 ? (piccoMax / piccoMin) * 100 : 0;
    },
    objective: 'Riequilibrare la distribuzione stagionale dei flussi riducendo il divario tra picco massimo e picco minimo.',
    strategy: 'Mitigazione dell\'impronta ecologica turistica.',
    action: 'Promozione della transizione energetica e metabolismo circolare.',
    outputIndicators: [],
  },
  {
    id: 'ind7',
    code: 'CTX-7',
    number: 7,
    level: 'context',
    dimensionId: 'dim2',
    name: '7. Rifiuti prodotti dal turismo (RT)',
    unit: 'kg',
    description: 'Indicatore di Contesto: stima della produzione totale di rifiuti attribuibili ai flussi turistici.',
    formulaDisplay: 'Coefficiente ISPRA (Anno t) * Totale presenze turistiche rilevate (Anno t)',
    params: [
      {
        key: 'coefficiente_ispra_anno_t',
        label: 'Coefficiente ISPRA (Anno t)',
        defaultValue: 1.47,
        unit: 'kg/giorno per turista',
      },
      {
        key: 'totale_presenze_turistiche_rilevate_anno_t',
        label: 'Totale presenze turistiche rilevate (Anno t)',
        defaultValue: 28500,
        unit: 'presenze',
      },
    ],
    calculate: (p) => {
      const coeff = p.coefficiente_ispra_anno_t ?? p.coeff_ispra ?? 1.47;
      const pres = p.totale_presenze_turistiche_rilevate_anno_t ?? p.presenze ?? 28500;
      return coeff * pres;
    },
    objective: 'Riduzione della produzione di rifiuti e miglioramento dell\'economia circolare nel comparto turistico.',
    strategy: 'Mitigazione dell\'impronta ecologica turistica.',
    action: 'Promozione della transizione energetica e metabolismo circolare.',
    outputIndicators: [],
  },
  {
    id: 'ind8',
    code: 'CTX-8',
    number: 8,
    level: 'context',
    dimensionId: 'dim2',
    name: '8. Consumo idrico turistico (CI)',
    unit: 'litri',
    description: 'Indicatore di Contesto: stima del consumo idrico complessivo generato dal turismo.',
    formulaDisplay: 'Coefficiente di Consumo Idrico (Anno t) * Totale presenze turistiche rilevate (Anno t)',
    params: [
      {
        key: 'coefficiente_consumo_idrico_anno_t',
        label: 'Coefficiente di Consumo Idrico (Anno t)',
        defaultValue: 150,
        unit: 'l/giorno per turista',
      },
      {
        key: 'totale_presenze_turistiche_rilevate_anno_t',
        label: 'Totale presenze turistiche rilevate (Anno t)',
        defaultValue: 28500,
        unit: 'presenze',
      },
    ],
    calculate: (p) => {
      const coeff = p.coefficiente_consumo_idrico_anno_t ?? p.coeff_idrico ?? 150;
      const pres = p.totale_presenze_turistiche_rilevate_anno_t ?? p.presenze ?? 28500;
      return coeff * pres;
    },
    objective: 'Promozione del risparmio idrico e riduzione degli sprechi nel settore turistico.',
    strategy: 'Mitigazione dell\'impronta ecologica turistica.',
    action: 'Promozione della transizione energetica e metabolismo circolare.',
    outputIndicators: [],
  },
  {
    id: 'ind9',
    code: 'CTX-9',
    number: 9,
    level: 'context',
    dimensionId: 'dim2',
    name: '9. Intensità energetica della destinazione ricettiva (IDE)',
    unit: 'kWh',
    description: 'Indicatore di Contesto: consumo energetico elettrico e termico medio giornaliero del comparto ricettivo per tipologia di struttura.',
    formulaDisplay: '(Presenze turistiche rilevate in strutture alberghiere (Anno t) * Coefficiente di Consumo elettrico e termico medio giornaliero associato alle strutture alberghiere (Anno t)) + (Presenze turistiche rilevate in strutture extra alberghiere (Anno t) * Coefficiente di Consumo elettrico e termico medio giornaliero associato alle strutture extra alberghiere (Anno t)) + (Presenze turistiche rilevate in strutture non imprenditoriali (Anno t) * Coefficiente di Consumo elettrico e termico medio giornaliero associato alle strutture non imprenditoriali (Anno t))',
    params: [
      {
        key: 'presenze_strutture_alberghiere_anno_t',
        label: 'Presenze turistiche rilevate in strutture alberghiere (Anno t)',
        defaultValue: 14000,
        unit: 'presenze',
      },
      {
        key: 'coeff_consumo_strutture_alberghiere_anno_t',
        label: 'Coefficiente di Consumo elettrico e termico medio giornaliero associato alle strutture alberghiere (Anno t)',
        defaultValue: 20,
        unit: 'kWh/giorno',
      },
      {
        key: 'presenze_strutture_extra_alberghiere_anno_t',
        label: 'Presenze turistiche rilevate in strutture extra alberghiere (Anno t)',
        defaultValue: 10500,
        unit: 'presenze',
      },
      {
        key: 'coeff_consumo_strutture_extra_alberghiere_anno_t',
        label: 'Coefficiente di Consumo elettrico e termico medio giornaliero associato alle strutture extra alberghiere (Anno t)',
        defaultValue: 12,
        unit: 'kWh/giorno',
      },
      {
        key: 'presenze_strutture_non_imprenditoriali_anno_t',
        label: 'Presenze turistiche rilevate in strutture non imprenditoriali (Anno t)',
        defaultValue: 4000,
        unit: 'presenze',
      },
      {
        key: 'coeff_consumo_strutture_non_imprenditoriali_anno_t',
        label: 'Coefficiente di Consumo elettrico e termico medio giornaliero associato alle strutture non imprenditoriali (Anno t)',
        defaultValue: 8,
        unit: 'kWh/giorno',
      },
    ],
    calculate: (p) => {
      const presAlb = p.presenze_strutture_alberghiere_anno_t ?? p.presenze_alberghiere ?? 14000;
      const coeffAlb = p.coeff_consumo_strutture_alberghiere_anno_t ?? 20;
      const presExtra = p.presenze_strutture_extra_alberghiere_anno_t ?? p.presenze_extra_alberghiere ?? 10500;
      const coeffExtra = p.coeff_consumo_strutture_extra_alberghiere_anno_t ?? 12;
      const presNonImp = p.presenze_strutture_non_imprenditoriali_anno_t ?? p.presenze_non_imprenditoriali ?? 4000;
      const coeffNonImp = p.coeff_consumo_strutture_non_imprenditoriali_anno_t ?? 8;
      const sum = (presAlb * coeffAlb) + (presExtra * coeffExtra) + (presNonImp * coeffNonImp);
      if (sum === 0 && p.consumo_totale_energia_strutture_ricettive_anno_t) {
        return p.consumo_totale_energia_strutture_ricettive_anno_t;
      }
      return sum;
    },
    objective: 'Efficientamento energetico e diffusione di fonti rinnovabili nel comparto ricettivo.',
    strategy: 'Mitigazione dell\'impronta ecologica turistica.',
    action: 'Promozione della transizione energetica e metabolismo circolare.',
    outputIndicators: [],
  },

  // DIMENSIONE 3
  {
    id: 'ind10',
    code: 'CTX-10',
    number: 10,
    level: 'context',
    dimensionId: 'dim3',
    name: '10. Posti letto totali disponibili (PL)',
    unit: 'posti',
    description: 'Indicatore di Contesto: capacità ricettiva complessiva del comune in termini di posti letto censiti.',
    formulaDisplay: 'Totale posti letto censiti (Anno t)',
    params: [
      {
        key: 'totale_posti_letto_censiti_anno_t',
        label: 'Totale posti letto censiti (Anno t)',
        defaultValue: 650,
        unit: 'posti',
      },
    ],
    calculate: (p) => p.totale_posti_letto_censiti_anno_t ?? p.posti_letto ?? 0,
    objective: 'Garantire un adeguato dimensionamento dell\'offerta ricettiva.',
    strategy: 'Incremento della mobilità dolce e dell’accessibilità.',
    action: 'Sviluppo della connessione intermodale e incremento dei servizi per la mobilità dolce.',
    outputIndicators: [],
  },
  {
    id: 'ind11',
    code: 'CTX-11',
    number: 11,
    level: 'context',
    dimensionId: 'dim3',
    name: '11. Incidenza degli agriturismi (%Agri)',
    unit: '%',
    description: 'Indicatore di Contesto: quota percentuale di posti letto in agriturismi rispetto alla capacità ricettiva totale.',
    formulaDisplay: '(Posti letto in Agriturismo censiti (Anno t) / Totale posti letto censiti (Anno t)) * 100',
    params: [
      {
        key: 'posti_letto_agriturismo_censiti_anno_t',
        label: 'Posti letto in Agriturismo censiti (Anno t)',
        defaultValue: 130,
        unit: 'posti letto',
      },
      {
        key: 'totale_posti_letto_censiti_anno_t',
        label: 'Totale posti letto censiti (Anno t)',
        defaultValue: 650,
        unit: 'posti letto',
      },
    ],
    calculate: (p) => {
      const agri = p.posti_letto_agriturismo_censiti_anno_t ?? p.numero_totale_posti_letto_agriturismo_censiti_anno_t ?? p.posti_letto_agriturismi ?? p.agriturismi ?? 0;
      const tot = p.totale_posti_letto_censiti_anno_t ?? p.posti_letto_totali ?? p.tot_strutture ?? 0;
      return tot > 0 ? (agri / tot) * 100 : 0;
    },
    objective: 'Favorire la sinergia tra agricoltura locale e turismo sostenibile valorizzando la capacità ricettiva rurale.',
    strategy: 'Incremento della mobilità dolce e dell’accessibilità.',
    action: 'Sviluppo della connessione intermodale e incremento dei servizi per la mobilità dolce.',
    outputIndicators: [],
  },
  {
    id: 'ind12',
    code: 'CTX-12',
    number: 12,
    level: 'context',
    dimensionId: 'dim3',
    name: '12. Km di rete cicloturistica fruibile (KC)',
    unit: 'km',
    description: 'Indicatore di Contesto: estensione complessiva dei percorsi cicloturistici e piste ciclabili fruibili.',
    formulaDisplay: 'Km di piste ciclabili fruibili (Anno t)',
    params: [
      {
        key: 'km_piste_ciclabili_fruibili_anno_t',
        label: 'Km di piste ciclabili fruibili (Anno t)',
        defaultValue: 24.5,
        unit: 'km',
      },
    ],
    calculate: (p) => p.km_piste_ciclabili_fruibili_anno_t ?? p.km_totali_percorsi_cicloturistici_fruibili_mappati_anno_t ?? p.km_totali ?? 0,
    objective: 'Potenziamento dell\'infrastruttura per la mobilità sostenibile e ciclabile.',
    strategy: 'Incremento della mobilità dolce e dell’accessibilità.',
    action: 'Sviluppo della connessione intermodale e incremento dei servizi per la mobilità dolce.',
    outputIndicators: [],
  },
  {
    id: 'ind13',
    code: 'CTX-13',
    number: 13,
    level: 'context',
    dimensionId: 'dim3',
    name: '13. Punti di ricarica per mobilità elettrica (PR)',
    unit: 'punti',
    description: 'Indicatore di Contesto: numero di punti di ricarica per veicoli elettrici attivi sul territorio comunale.',
    formulaDisplay: 'Numero punti di ricarica elettrica attivi (Anno t)',
    params: [
      {
        key: 'numero_punti_ricarica_elettrica_attivi_anno_t',
        label: 'Numero punti di ricarica elettrica attivi (Anno t)',
        defaultValue: 14,
        unit: 'punti',
      },
    ],
    calculate: (p) => p.numero_punti_ricarica_elettrica_attivi_anno_t ?? p.numero_totale_stalli_punti_ricarica_elettrica_attivi_anno_t ?? p.punti_ricarica ?? 0,
    objective: 'Favorire la transizione verso veicoli elettrici e la connessione intermodale.',
    strategy: 'Incremento della mobilità dolce e dell’accessibilità.',
    action: 'Sviluppo della connessione intermodale e incremento dei servizi per la mobilità dolce.',
    outputIndicators: [],
  },

  // DIMENSIONE 4
  {
    id: 'ind14',
    code: 'CTX-14',
    number: 14,
    level: 'context',
    dimensionId: 'dim4',
    name: '14. Variazione della popolazione residente a 5 anni (ΔR)',
    unit: '%',
    description: 'Indicatore di Contesto: variazione percentuale della popolazione residente nel periodo di 5 anni.',
    formulaDisplay: '[(Totale popolazione residente (Anno t) - Totale popolazione residente (Anno t-5)) / Totale popolazione residente (Anno t-5)] * 100',
    params: [
      {
        key: 'totale_popolazione_residente_anno_t',
        label: 'Totale popolazione residente (Anno t)',
        defaultValue: 3400,
        unit: 'abitanti',
      },
      {
        key: 'totale_popolazione_residente_anno_t_5',
        label: 'Totale popolazione residente (Anno t-5)',
        defaultValue: 3520,
        unit: 'abitanti',
      },
    ],
    calculate: (p) => {
      const resT = p.totale_popolazione_residente_anno_t ?? p.residenti ?? 0;
      const resT5 = p.totale_popolazione_residente_anno_t_5 ?? p.residenti_t5 ?? 3520;
      return resT5 > 0 ? ((resT - resT5) / resT5) * 100 : 0;
    },
    objective: 'Monitorare la dinamica demografica e contrastare lo spopolamento.',
    strategy: 'Tutela della resilienza demografica.',
    action: 'Sostegno al tessuto economico e contrasto allo spopolamento.',
    outputIndicators: [],
  },
  {
    id: 'ind15',
    code: 'CTX-15',
    number: 15,
    level: 'context',
    dimensionId: 'dim4',
    name: '15. Densità imprenditoriale turistica (DT)',
    unit: 'imprese/1k ab',
    description: 'Indicatore di Contesto: rapporto tra imprese turistiche attive e popolazione residente.',
    formulaDisplay: '(Imprese turistiche attive (Anno t) / Totale popolazione residente (Anno t)) * 1000',
    params: [
      {
        key: 'imprese_turistiche_attive_anno_t',
        label: 'Imprese turistiche attive (Anno t)',
        defaultValue: 42,
        unit: 'imprese',
      },
      {
        key: 'totale_popolazione_residente_anno_t',
        label: 'Totale popolazione residente (Anno t)',
        defaultValue: 3400,
        unit: 'abitanti',
      },
    ],
    calculate: (p) => {
      const imp = p.imprese_turistiche_attive_anno_t ?? p.imprese ?? 0;
      const pop = p.totale_popolazione_residente_anno_t ?? p.residenti ?? 0;
      return pop > 0 ? (imp / pop) * 1000 : 0;
    },
    objective: 'Favorire la vitalità del tessuto imprenditoriale turistico locale.',
    strategy: 'Tutela della resilienza demografica.',
    action: 'Sostegno al tessuto economico e contrasto allo spopolamento.',
    outputIndicators: [],
  },
];

// Definition of 4 Dimension Cards (Vista Schede) according to the precise new specification
export const DIMENSION_CARDS: DimensionCardData[] = [
  // DIMENSIONE 1
  {
    id: 'dim1',
    number: 1,
    profiloTitle: 'PROFILO TURISTICO-AMBIENTALE',
    dimensionTitle: 'Dimensione 1: Capacità di Attrazione e Flussi turistici',
    contextIndicatorsSubtitle: 'INDICATORI DI CONTESTO',
    contextIndicators: CONTEXT_INDICATORS.filter((c) => c.dimensionId === 'dim1'),
    lineeStrategicheTitle: 'LINEE STRATEGICHE E INTERVENTI OPERATIVI',
    direzioneTitle: 'Direzione 1: Riequilibrio e destagionalizzazione dei flussi',
    asseTitle: 'Asse d\'Intervento: Sviluppo dell’offerta turistica e riqualificazione degli spazi',
    azioniSubtitle: 'AZIONI',
    azioni: [
      {
        id: 'az-dim1-1',
        code: '1',
        title: "1. Ampliare e strutturare un'offerta esperienziale integrata",
        interventi: [
          {
            id: 'int-1a',
            code: '1.a',
            title: '1.a - Aumentare gli eventi e le attività (enogastronomici, culturali, sportivi)',
            outputIndicators: [
              {
                code: 'TCOE',
                name: "TCOE - Tasso di Crescita dell'Offerta Eventi (%)",
                level: 'output',
                unit: '%',
                description: "Variazione percentuale dell'offerta complessiva di eventi e attività organizzate.",
                formulaDisplay: "[(Eventi Anno t - Eventi Anno t-1) / Eventi Anno t-1] * 100",
                params: [
                  { key: 'totale_eventi_organizzati_anno_t', label: 'Totale eventi organizzati (Anno t)', defaultValue: 25, unit: 'eventi' },
                  { key: 'eventi_t1', label: 'Totale eventi organizzati (Anno t-1)', defaultValue: 20, unit: 'eventi' },
                ],
                calculate: (p) => {
                  const evT = p.totale_eventi_organizzati_anno_t ?? p.eventi_t ?? 0;
                  return p.eventi_t1 ? ((evT - p.eventi_t1) / p.eventi_t1) * 100 : 0;
                },
              },
            ],
          },
          {
            id: 'int-1b',
            code: '1.b',
            title: '1.b - Aumentare gli itinerari (tour tematici, percorsi naturalistici)',
            outputIndicators: [
              {
                code: 'TCOI',
                name: "TCOI - Tasso di Crescita dell'Offerta Itinerari (%)",
                level: 'output',
                unit: '%',
                description: "Variazione percentuale degli itinerari e percorsi tematici fruibili.",
                formulaDisplay: "[(Totale itinerari fruibili (Anno t) - Totale itinerari fruibili (Anno t-1)) / Totale itinerari fruibili (Anno t-1)] * 100",
                params: [
                  { key: 'itinerari_t', label: 'Totale itinerari fruibili (Anno t)', defaultValue: 12, unit: 'itinerari' },
                  { key: 'itinerari_t1', label: 'Totale itinerari fruibili (Anno t-1)', defaultValue: 10, unit: 'itinerari' },
                ],
                calculate: (p) => (p.itinerari_t1 ? ((p.itinerari_t - p.itinerari_t1) / p.itinerari_t1) * 100 : 0),
              },
            ],
          },
        ],
      },
      {
        id: 'az-dim1-2',
        code: '2',
        title: '2. Incrementare la qualità degli spazi dei borghi',
        interventi: [
          {
            id: 'int-2a',
            code: '2.a',
            title: '2.a - Riqualificare spazi pubblici outdoor (piazze, belvederi, ecc.)',
            outputIndicators: [
              {
                code: 'ISPR',
                name: 'ISPR - Indice di Superficie Pubblica Riqualificata (%)',
                level: 'output',
                unit: '%',
                description: 'Percentuale di suolo pubblico riqualificato rispetto al totale.',
                formulaDisplay: '(Superficie di suolo pubblico riqualificato / Superficie totale di suolo pubblico) * 100',
                params: [
                  { key: 'mq_riqualificati', label: 'Superficie di suolo pubblico riqualificato', defaultValue: 4500, unit: 'mq' },
                  { key: 'superficie_totale_di_suolo_pubblico', label: 'Superficie totale di suolo pubblico', defaultValue: 50000, unit: 'mq' },
                ],
                calculate: (p) => {
                  const tot = p.superficie_totale_di_suolo_pubblico ?? p.mq_totali ?? 0;
                  return tot ? ((p.mq_riqualificati ?? 0) / tot) * 100 : 0;
                },
              },
            ],
          },
          {
            id: 'int-2b',
            code: '2.b',
            title: '2.b - Riqualificare edifici (museali, multifunzionali, ecc.)',
            outputIndicators: [
              {
                code: 'IERT',
                name: 'IERT - Indice di Edifici Riqualificati a fini Turistico culturali (%)',
                level: 'output',
                unit: '%',
                description: 'Percentuale di interventi su edifici destinati alla fruizione turistico-culturale.',
                formulaDisplay: '(Interventi di riqualificazione ai fini turistico culturale (Anno t) / Totale interventi di riqualificazione autorizzati (Anno t)) * 100',
                params: [
                  { key: 'interventi_tur', label: 'Interventi di riqualificazione ai fini turistico culturale (Anno t)', defaultValue: 4, unit: 'interventi' },
                  { key: 'interventi_tot', label: 'Totale interventi di riqualificazione autorizzati (Anno t)', defaultValue: 20, unit: 'interventi' },
                ],
                calculate: (p) => (p.interventi_tot ? (p.interventi_tur / p.interventi_tot) * 100 : 0),
              },
              {
                code: 'TRUV',
                name: 'TRUV - Tasso di Rigenerazione Urbana a Vocazione Turistica (%)',
                level: 'output',
                unit: '%',
                description: 'Percentuale di edifici abbandonati recuperati per uso turistico/culturale.',
                formulaDisplay: '(Edifici recuperati per uso turistico (Anno t) / Edifici abbandonati in disuso) * 100',
                params: [
                  { key: 'edifici_recuperati', label: 'Edifici recuperati per uso turistico (Anno t)', defaultValue: 3, unit: 'edifici' },
                  { key: 'edifici_abbandonati', label: 'Edifici abbandonati in disuso', defaultValue: 12, unit: 'edifici' },
                ],
                calculate: (p) => (p.edifici_abbandonati ? (p.edifici_recuperati / p.edifici_abbandonati) * 100 : 0),
              },
            ],
          },
          {
            id: 'int-2c',
            code: '2.c',
            title: '2.c - Realizzare spazi aperti con valenza ambientale e di comfort microclimatico',
            outputIndicators: [
              {
                code: 'ICS',
                name: 'ICS - Indice di Copertura Arborea (%)',
                level: 'output',
                unit: '%',
                description: 'Percentuale di suolo pubblico coperto dalla chioma degli alberi.',
                formulaDisplay: '(Superficie comunale coperta dalla chioma degli alberi / Superficie totale di suolo pubblico) * 100',
                params: [
                  { key: 'sup_alberi', label: 'Superficie comunale coperta dalla chioma degli alberi', defaultValue: 12500, unit: 'mq' },
                  { key: 'superficie_totale_di_suolo_pubblico', label: 'Superficie totale di suolo pubblico', defaultValue: 50000, unit: 'mq' },
                ],
                calculate: (p) => {
                  const tot = p.superficie_totale_di_suolo_pubblico ?? p.sup_suolo_pubblico ?? 0;
                  return tot ? ((p.sup_alberi ?? 0) / tot) * 100 : 0;
                },
              },
              {
                code: 'IVS',
                name: 'IVS - Indice di Verde Urbano (%)',
                level: 'output',
                unit: '%',
                description: 'Percentuale di superficie destinata a parchi e giardini pubblici.',
                formulaDisplay: '(Superficie di parchi e giardini pubblici / Superficie totale dell\'area urbana funzionale FUA) * 100',
                params: [
                  { key: 'sup_parchi_giardini', label: 'Superficie di parchi e giardini pubblici', defaultValue: 32000, unit: 'mq' },
                  { key: 'superficie_totale_area_urbana_funzionale_fua', label: "Superficie totale dell'area urbana funzionale FUA", defaultValue: 200000, unit: 'mq' },
                ],
                calculate: (p) => {
                  const tot = p.superficie_totale_area_urbana_funzionale_fua ?? p.sup_fua ?? 0;
                  return tot ? ((p.sup_parchi_giardini ?? 0) / tot) * 100 : 0;
                },
              },
              {
                code: 'SPD',
                name: 'SPD - Superficie Pubblica Depavimentata (%)',
                level: 'output',
                unit: '%',
                description: 'Percentuale di suolo pubblico depavimentato e riqualificato a verde.',
                formulaDisplay: '(Superficie di suolo pubblico depavimentato e riqualificato a verde / Superficie totale dell\'area urbana funzionale FUA) * 100',
                params: [
                  { key: 'mq_depavimentati', label: 'Superficie di suolo pubblico depavimentato e riqualificato a verde', defaultValue: 6000, unit: 'mq' },
                  { key: 'superficie_totale_area_urbana_funzionale_fua', label: "Superficie totale dell'area urbana funzionale FUA", defaultValue: 200000, unit: 'mq' },
                ],
                calculate: (p) => {
                  const tot = p.superficie_totale_area_urbana_funzionale_fua ?? p.sup_fua ?? 0;
                  return tot ? ((p.mq_depavimentati ?? 0) / tot) * 100 : 0;
                },
              },
            ],
          },
        ],
      },
      {
        id: 'az-dim1-3',
        code: '3',
        title: '3. Incrementare le dotazioni e le attrezzature utili al turismo',
        interventi: [
          {
            id: 'int-3a',
            code: '3.a',
            title: '3.a - Aumentare la segnaletica turistica (multilingua)',
            outputIndicators: [
              {
                code: 'IDS',
                name: 'IDS - Indice di Dotazione Segnaletica (%)',
                level: 'output',
                unit: '%',
                description: 'Percentuale di punti di interesse turistico con segnaletica installata.',
                formulaDisplay: '(Totale cartelli installati / Punti di interesse totali) * 100',
                params: [
                  { key: 'cartelli_nuovi', label: 'Totale cartelli installati', defaultValue: 18, unit: 'cartelli' },
                  { key: 'poi_totali', label: 'Totale punti interesse (POI)', defaultValue: 20, unit: 'POI' },
                ],
                calculate: (p) => (p.poi_totali ? (p.cartelli_nuovi / p.poi_totali) * 100 : 0),
              },
              {
                code: 'ICSM',
                name: 'ICSM - Indice di Copertura Segnaletica Multilingua (%)',
                level: 'output',
                unit: '%',
                description: 'Percentuale di cartelli turistico-informativi con supporto multilingua.',
                formulaDisplay: '(Cartelli multilingua / Totale cartelli previsti) * 100',
                params: [
                  { key: 'cartelli_multi', label: 'Cartelli multilingua', defaultValue: 15, unit: 'cartelli' },
                  { key: 'cartelli_tot', label: 'Totale cartelli previsti', defaultValue: 20, unit: 'cartelli' },
                ],
                calculate: (p) => (p.cartelli_tot ? (p.cartelli_multi / p.cartelli_tot) * 100 : 0),
              },
            ],
          },
          {
            id: 'int-3b',
            code: '3.b',
            title: '3.b - Valorizzare le aree naturalistiche come "Rifugi climatici attrezzati"',
            outputIndicators: [
              {
                code: 'IALV',
                name: 'IALV - Indice di Attrezzatura Leggera del Verde (Aree Attrezzate/mq di verde pubblico)',
                level: 'output',
                unit: 'aree/10k mq',
                description: 'Aree verdi attrezzate per 10.000 mq di verde pubblico.',
                formulaDisplay: '(Aree verdi attrezzate / Superficie di verde pubblico (parchi, giardini, aree boschive naturali)) * 10.000',
                params: [
                  { key: 'aree_attrezzate', label: 'Aree verdi attrezzate', defaultValue: 5, unit: 'aree' },
                  { key: 'mq_verde_pubb', label: 'Superficie di verde pubblico (parchi, giardini, aree boschive naturali)', defaultValue: 40000, unit: 'mq' },
                ],
                calculate: (p) => (p.mq_verde_pubb ? (p.aree_attrezzate / p.mq_verde_pubb) * 10000 : 0),
              },
            ],
          },
        ],
      },
      {
        id: 'az-dim1-4',
        code: '4',
        title: '4. Diversificare la stagionalità dell\'offerta turistica',
        interventi: [
          {
            id: 'int-4a',
            code: '4.a',
            title: '4.a - Redigere una calendarizzazione di eventi in spazi indoor',
            outputIndicators: [
              {
                code: 'TOEI',
                name: 'TOEI - Tasso di Offerta Eventi in spazi Indoor (%)',
                level: 'output',
                unit: '%',
                description: 'Quota di eventi culturali ed enogastronomici svolti in spazi al coperto.',
                formulaDisplay: '(Totale eventi indoor (Anno t) / Totale eventi organizzati (Anno t)) * 100',
                params: [
                  { key: 'eventi_indoor', label: 'Totale eventi indoor (Anno t)', defaultValue: 10, unit: 'eventi' },
                  { key: 'totale_eventi_organizzati_anno_t', label: 'Totale eventi organizzati (Anno t)', defaultValue: 25, unit: 'eventi' },
                ],
                calculate: (p) => {
                  const tot = p.totale_eventi_organizzati_anno_t ?? p.eventi_totali ?? 0;
                  return tot ? ((p.eventi_indoor ?? 0) / tot) * 100 : 0;
                },
              },
            ],
          },
          {
            id: 'int-4b',
            code: '4.b',
            title: '4.b - Redigere una calendarizzazione di eventi in spazi outdoor',
            outputIndicators: [
              {
                code: 'TOEO',
                name: 'TOEO - Tasso di Offerta Eventi in spazi Outdoor (%)',
                level: 'output',
                unit: '%',
                description: 'Quota di eventi e festival svolti in spazi aperti e parchi.',
                formulaDisplay: '(Totale eventi outdoor (Anno t) / Totale eventi organizzati (Anno t)) * 100',
                params: [
                  { key: 'eventi_outdoor', label: 'Totale eventi outdoor (Anno t)', defaultValue: 15, unit: 'eventi' },
                  { key: 'totale_eventi_organizzati_anno_t', label: 'Totale eventi organizzati (Anno t)', defaultValue: 25, unit: 'eventi' },
                ],
                calculate: (p) => {
                  const tot = p.totale_eventi_organizzati_anno_t ?? p.eventi_totali ?? 0;
                  return tot ? ((p.eventi_outdoor ?? 0) / tot) * 100 : 0;
                },
              },
            ],
          },
          {
            id: 'int-4c',
            code: '4.c',
            title: '4.c - Redigere un calendario di eventi congiunto nei mesi "spalla" (ottobre-maggio)',
            outputIndicators: [
              {
                code: 'TDE',
                name: 'TDE - Tasso di Destagionalizzazione degli eventi (%)',
                level: 'output',
                unit: '%',
                description: 'Percentuale di eventi programmati nei mesi spalla (ottobre-maggio).',
                formulaDisplay: '(Totale eventi organizzati nel periodo ottobre-maggio (Anno t) / Totale eventi organizzati (Anno t)) * 100',
                params: [
                  { key: 'eventi_spalla', label: 'Totale eventi organizzati nel periodo ottobre-maggio (Anno t)', defaultValue: 9, unit: 'eventi' },
                  { key: 'totale_eventi_organizzati_anno_t', label: 'Totale eventi organizzati (Anno t)', defaultValue: 25, unit: 'eventi' },
                ],
                calculate: (p) => {
                  const tot = p.totale_eventi_organizzati_anno_t ?? p.eventi_totali ?? 0;
                  return tot ? ((p.eventi_spalla ?? 0) / tot) * 100 : 0;
                },
              },
            ],
          },
          {
            id: 'int-4d',
            code: '4.d',
            title: '4.d - Realizzare una "mixitè" funzionale degli edifici',
            outputIndicators: [
              {
                code: 'IPSW',
                name: 'IPSW - Indice di Postazioni di Smart Working (num)',
                level: 'output',
                unit: 'postazioni',
                description: 'Numero totale di postazioni lavorative attrezzate e fruibili nei borghi.',
                formulaDisplay: 'Postazioni di smart working disponibili',
                params: [
                  {
                    key: 'postazioni_di_smart_working_disponibili',
                    label: 'Postazioni di smart working disponibili',
                    defaultValue: 18,
                    unit: 'postazioni',
                  },
                ],
                calculate: (p) => p.postazioni_di_smart_working_disponibili ?? p.postazioni ?? 0,
              },
              {
                code: 'INDI',
                name: 'INDI - Indice di Nomadi Digitali nel periodo Invernale (num)',
                level: 'output',
                unit: 'nomadi',
                description: 'Numero di lavoratori da remoto che soggiornano nei borghi nel periodo invernali.',
                formulaDisplay: 'Nomadi digitali periodo ottobre-maggio (Anno t)',
                params: [
                  {
                    key: 'nomadi_digitali_periodo_ottobre_maggio_anno_t',
                    label: 'Nomadi digitali periodo ottobre-maggio (Anno t)',
                    defaultValue: 12,
                    unit: 'nomadi',
                  },
                ],
                calculate: (p) => p.nomadi_digitali_periodo_ottobre_maggio_anno_t ?? p.nomadi ?? 0,
              },
              {
                code: 'TUIP',
                name: 'TUIP - Tasso di Utilizzo Invernale delle Postazioni (persone/postazioni)',
                level: 'output',
                unit: 'persone/postazione',
                description: 'Utilizzo medio delle postazioni di lavoro nei mesi invernali.',
                formulaDisplay: 'Nomadi digitali periodo ottobre-maggio (Anno t) / Postazioni di smart working disponibili',
                params: [
                  {
                    key: 'nomadi_digitali_periodo_ottobre_maggio_anno_t',
                    label: 'Nomadi digitali periodo ottobre-maggio (Anno t)',
                    defaultValue: 12,
                    unit: 'nomadi',
                  },
                  {
                    key: 'postazioni_di_smart_working_disponibili',
                    label: 'Postazioni di smart working disponibili',
                    defaultValue: 18,
                    unit: 'postazioni',
                  },
                ],
                calculate: (p) => {
                  const num = p.nomadi_digitali_periodo_ottobre_maggio_anno_t ?? p.nomadi ?? 0;
                  const denom = p.postazioni_di_smart_working_disponibili ?? p.postazioni ?? 0;
                  return denom ? num / denom : 0;
                },
              },
            ],
          },
        ],
      },
    ],
  },

  // DIMENSIONE 2
  {
    id: 'dim2',
    number: 2,
    profiloTitle: 'PROFILO TURISTICO-AMBIENTALE',
    dimensionTitle: 'Dimensione 2: Pressione Turistica e Impatto Ambientale',
    contextIndicatorsSubtitle: 'INDICATORI DI CONTESTO',
    contextIndicators: CONTEXT_INDICATORS.filter((c) => c.dimensionId === 'dim2'),
    lineeStrategicheTitle: 'LINEE STRATEGICHE E INTERVENTI OPERATIVI',
    direzioneTitle: 'Direzione 2: Mitigazione dell\'impronta ecologica turistica',
    asseTitle: 'Asse d\'Intervento: Promozione della transizione energetica e miglioramento del metabolismo circolare',
    azioniSubtitle: 'AZIONI',
    azioni: [
      {
        id: 'az-dim2-1',
        code: '1',
        title: '1. Stimolare la sensibilizzazione dei turisti sui temi dell\'economia circolare',
        interventi: [
          {
            id: 'int-dim2-1a',
            code: '1.a',
            title: '1.a - Organizzare workshop e laboratori sul tema della sostenibilità',
            outputIndicators: [
              {
                code: 'TFEC',
                name: 'TFEC - Tasso di Formazione in tema di Economia Circolare (persone/eventi)',
                level: 'output',
                unit: 'persone/evento',
                description: 'Partecipazione media ai workshop ed eventi di sensibilizzazione.',
                formulaDisplay: 'Totale di partecipanti a workshop ed eventi in tema di Economia Circolare (Anno t) / Numero di workshop ed eventi in tema di Economia Circolare (Anno t)',
                params: [
                  { key: 'partecipanti', label: 'Totale di partecipanti a workshop ed eventi in tema di Economia Circolare (Anno t)', defaultValue: 180, unit: 'persone' },
                  { key: 'eventi', label: 'Numero di workshop ed eventi in tema di Economia Circolare (Anno t)', defaultValue: 6, unit: 'eventi' },
                ],
                calculate: (p) => (p.eventi ? p.partecipanti / p.eventi : 0),
              },
            ],
          },
        ],
      },
      {
        id: 'az-dim2-2',
        code: '2',
        title: '2. Stimolare l\'aumento della raccolta differenziata nelle strutture ricettive',
        interventi: [
          {
            id: 'int-dim2-2a',
            code: '2.a',
            title: '2.a - Adottare un protocollo "Rifiuti Zero" per le strutture ricettive',
            outputIndicators: [
              {
                code: 'TFKE',
                name: 'TFKE - Tasso di Fornitura di Kit Ecologico (%)',
                level: 'output',
                unit: '%',
                description: 'Percentuale di strutture ricettive fornite di kit ecologico per la differenziata.',
                formulaDisplay: '(Strutture con kit ecologico (Anno t) / Totale strutture ricettive (Anno t)) * 100',
                params: [
                  { key: 'strutture_kit', label: 'Strutture con kit ecologico (Anno t)', defaultValue: 24, unit: 'strutture' },
                  { key: 'totale_strutture_ricettive_anno_t', label: 'Totale strutture ricettive (Anno t)', defaultValue: 35, unit: 'strutture' },
                ],
                calculate: (p) => {
                  const tot = p.totale_strutture_ricettive_anno_t ?? p.strutture_tot ?? 0;
                  return tot ? ((p.strutture_kit ?? 0) / tot) * 100 : 0;
                },
              },
              {
                code: 'TST',
                name: 'TST - Tasso di Sgravio TARI (%)',
                level: 'output',
                unit: '%',
                description: 'Quota di strutture che beneficiano di riduzione TARI per l\'alta differenziata.',
                formulaDisplay: '(Strutture con sgravio TARI (Anno t) / Totale strutture ricettive (Anno t)) * 100',
                params: [
                  { key: 'strutture_sgravio', label: 'Strutture con sgravio TARI (Anno t)', defaultValue: 14, unit: 'strutture' },
                  { key: 'totale_strutture_ricettive_anno_t', label: 'Totale strutture ricettive (Anno t)', defaultValue: 35, unit: 'strutture' },
                ],
                calculate: (p) => {
                  const tot = p.totale_strutture_ricettive_anno_t ?? p.strutture_tot ?? 0;
                  return tot ? ((p.strutture_sgravio ?? 0) / tot) * 100 : 0;
                },
              },
            ],
          },
        ],
      },
      {
        id: 'az-dim2-3',
        code: '3',
        title: '3. Aumentare la circolarità delle dotazioni dei borghi',
        interventi: [
          {
            id: 'int-dim2-3a',
            code: '3.a',
            title: '3.a - Diffondere l\'osservazione dei CAM per la gestione dell\'impatto degli eventi',
            outputIndicators: [
              {
                code: 'IAC',
                name: 'IAC - Indice Annuale di Copertura CAM (%)',
                level: 'output',
                unit: '%',
                description: 'Rapporto percentuale tra criteri CAM soddisfatti e criteri CAM applicabili negli eventi dell\'anno t pesati per la durata effettiva in giorni.',
                formulaDisplay: '(Σ [Si * Gi] / Σ [Ai * Gi]) * 100',
                params: [
                  { key: 'somma_soddisfatti_giorni', label: 'Somma Criteri CAM Soddisfatti x Giorni [Σ (Si · Gi)]', defaultValue: 84, unit: 'criteri·giorni' },
                  { key: 'somma_applicabili_giorni', label: 'Somma Criteri CAM Applicabili x Giorni [Σ (Ai · Gi)]', defaultValue: 120, unit: 'criteri·giorni' },
                ],
                calculate: (p) => (p.somma_applicabili_giorni ? Math.round(((p.somma_soddisfatti_giorni ?? 0) / p.somma_applicabili_giorni) * 10000) / 100 : 0),
              },
            ],
          },
          {
            id: 'int-dim2-3b',
            code: '3.b',
            title: '3.b - Potenziare la distribuzione di dispositivi di erogazione di acqua potabile',
            outputIndicators: [
              {
                code: 'IDAP',
                name: 'IDAP - Indice di dotazione di Dispositivi per l\'Acqua Potabile (Numero/mq di suolo pubblico)',
                level: 'output',
                unit: 'dispositivi/10k mq',
                description: 'Capillarità di distributori ed erogatori d\'acqua gratuiti su aree pubbliche.',
                formulaDisplay: '(Dispositivi installati / Superficie totale di suolo pubblico) * 10.000',
                params: [
                  { key: 'dispositivi', label: 'Dispositivi acqua potabile', defaultValue: 10, unit: 'dispositivi' },
                  { key: 'superficie_totale_di_suolo_pubblico', label: 'Superficie totale di suolo pubblico', defaultValue: 50000, unit: 'mq' },
                ],
                calculate: (p) => {
                  const tot = p.superficie_totale_di_suolo_pubblico ?? p.mq_suolo ?? 0;
                  return tot ? ((p.dispositivi ?? 0) / tot) * 10000 : 0;
                },
              },
            ],
          },
        ],
      },
      {
        id: 'az-dim2-4',
        code: '4',
        title: '4. Coinvolgere la cittadinanza nei temi dell\'economia circolare',
        interventi: [
          {
            id: 'int-dim2-4a',
            code: '4.a',
            title: '4.a - Creare associazioni per la cura della città',
            outputIndicators: [
              {
                code: 'TPCA',
                name: 'TPCA - Tasso di Partecipazione Civica Attiva (%)',
                level: 'output',
                unit: '%',
                description: 'Rapporto percentuale tra la superficie di suolo pubblico curata dai cittadini nell\'anno t e la superficie totale di suolo pubblico.',
                formulaDisplay: '(Superficie di suolo pubblico curata dai cittadini nell\'anno t / Superficie totale di suolo pubblico) * 100',
                params: [
                  { key: 'sup_suolo_curata_cittadini_anno_t', label: 'Superficie di suolo pubblico curata dai cittadini (Anno t)', defaultValue: 2500, unit: 'mq' },
                  { key: 'superficie_totale_di_suolo_pubblico', label: 'Superficie totale di suolo pubblico', defaultValue: 50000, unit: 'mq' },
                ],
                calculate: (p) => {
                  const tot = p.superficie_totale_di_suolo_pubblico ?? p.sup_totale_suolo_pubblico ?? 0;
                  return tot ? Math.round(((p.sup_suolo_curata_cittadini_anno_t ?? 0) / tot) * 10000) / 100 : 0;
                },
              },
            ],
          },
        ],
      },
      {
        id: 'az-dim2-5',
        code: '5',
        title: '5. Stimolare la sensibilizzazione dei turisti sui temi del risparmio idrico',
        interventi: [
          {
            id: 'int-dim2-5a',
            code: '5.a',
            title: '5.a - Organizzare workshop e laboratori sul tema della sostenibilità (Focus idrico)',
            outputIndicators: [
              {
                code: 'TFRI',
                name: 'TFRI - Tasso di Formazione in tema di Risparmio Idrico (persone/eventi)',
                level: 'output',
                unit: 'persone/evento',
                description: 'Partecipanti medi a workshop specifici sul risparmio e riuso idrico.',
                formulaDisplay: 'Totale di partecipanti a workshop ed eventi in tema di Risparmio Idrico (Anno t) / Numero di workshop ed eventi in tema di Risparmio Idrico (Anno t)',
                params: [
                  { key: 'partecipanti', label: 'Totale di partecipanti a workshop ed eventi in tema di Risparmio Idrico (Anno t)', defaultValue: 120, unit: 'persone' },
                  { key: 'laboratori', label: 'Numero di workshop ed eventi in tema di Risparmio Idrico (Anno t)', defaultValue: 4, unit: 'eventi' },
                ],
                calculate: (p) => (p.laboratori ? p.partecipanti / p.laboratori : 0),
              },
            ],
          },
        ],
      },
      {
        id: 'az-dim2-6',
        code: '6',
        title: '6. Stimolare la riduzione del prelievo idrico nelle strutture ricettive',
        interventi: [
          {
            id: 'int-dim2-6a',
            code: '6.a',
            title: '6.a - Introdurre incentivi per l\'installazione di riduttori di flusso',
            outputIndicators: [
              {
                code: 'TDRF',
                name: 'TDRF - Tasso di Dotazione di Riduttori di Flusso (numero di richieste/strutture)',
                level: 'output',
                unit: 'richieste/struttura',
                description: 'Rapporto tra richieste di contributi per riduttori di flusso e strutture ricettive.',
                formulaDisplay: 'Richieste incentivo riduttori (Anno t) / Totale strutture ricettive (Anno t)',
                params: [
                  { key: 'richieste', label: 'Richieste incentivo riduttori (Anno t)', defaultValue: 22, unit: 'richieste' },
                  { key: 'totale_strutture_ricettive_anno_t', label: 'Totale strutture ricettive (Anno t)', defaultValue: 35, unit: 'strutture' },
                ],
                calculate: (p) => {
                  const tot = p.totale_strutture_ricettive_anno_t ?? p.strutture_tot ?? 0;
                  return tot ? (p.richieste ?? 0) / tot : 0;
                },
              },
            ],
          },
          {
            id: 'int-dim2-6b',
            code: '6.b',
            title: '6.b - Introdurre incentivi per l\'installazione di sistemi di recupero e riuso delle acque grigie e/o meteoriche',
            outputIndicators: [
              {
                code: 'TDRAG',
                name: 'TDRAG - Tasso di Dotazione di sistemi di Recupero delle Acque (numero di richieste/strutture)',
                level: 'output',
                unit: 'richieste/struttura',
                description: 'Diffusione di impianti per la raccolta meteorica e recupero acque grigie.',
                formulaDisplay: 'Richieste impianti recupero acque (Anno t) / Totale strutture ricettive (Anno t)',
                params: [
                  { key: 'richieste_acque', label: 'Richieste impianti recupero acque (Anno t)', defaultValue: 11, unit: 'richieste' },
                  { key: 'totale_strutture_ricettive_anno_t', label: 'Totale strutture ricettive (Anno t)', defaultValue: 35, unit: 'strutture' },
                ],
                calculate: (p) => {
                  const tot = p.totale_strutture_ricettive_anno_t ?? p.strutture_tot ?? 0;
                  return tot ? (p.richieste_acque ?? 0) / tot : 0;
                },
              },
            ],
          },
        ],
      },
      {
        id: 'az-dim2-7',
        code: '7',
        title: '7. Stimolare la sensibilizzazione dei turisti sui temi della transizione energetica',
        interventi: [
          {
            id: 'int-dim2-7a',
            code: '7.a',
            title: '7.a - Organizzare workshop e laboratori sul tema della sostenibilità (Focus energetico)',
            outputIndicators: [
              {
                code: 'TFTE',
                name: 'TFTE - Tasso di Formazione in tema di Transizione Energetica (persone/eventi)',
                level: 'output',
                unit: 'persone/evento',
                description: 'Affluenza ai corsi e seminari dedicati alla transizione energetica.',
                formulaDisplay: 'Totale di partecipanti a workshop ed eventi in tema di Transizione Energetica (Anno t) / Numero di workshop ed eventi in tema di Transizione Energetica (Anno t)',
                params: [
                  { key: 'partecipanti', label: 'Totale di partecipanti a workshop ed eventi in tema di Transizione Energetica (Anno t)', defaultValue: 140, unit: 'persone' },
                  { key: 'seminari', label: 'Numero di workshop ed eventi in tema di Transizione Energetica (Anno t)', defaultValue: 5, unit: 'eventi' },
                ],
                calculate: (p) => (p.seminari ? p.partecipanti / p.seminari : 0),
              },
            ],
          },
        ],
      },
      {
        id: 'az-dim2-8',
        code: '8',
        title: '8. Stimolare l\'aumento dell\'approvvigionamento da fonti rinnovabili nelle strutture ricettive',
        interventi: [
          {
            id: 'int-dim2-8a',
            code: '8.a',
            title: '8.a - Adottare leve economiche per le strutture ricettive',
            outputIndicators: [
              {
                code: 'TPR',
                name: 'TPR - Tasso di Penetrazione delle Rinnovabili nel comparto ricettivo (%)',
                level: 'output',
                unit: '%',
                description: 'Percentuale di strutture ricettive dotate di impianti ad energia rinnovabile.',
                formulaDisplay: '(Strutture con impianti rinnovabili / Totale strutture ricettive (Anno t)) * 100',
                params: [
                  { key: 'strutture_rinnovabili', label: 'Strutture con impianti rinnovabili', defaultValue: 18, unit: 'strutture' },
                  { key: 'totale_strutture_ricettive_anno_t', label: 'Totale strutture ricettive (Anno t)', defaultValue: 35, unit: 'strutture' },
                ],
                calculate: (p) => {
                  const tot = p.totale_strutture_ricettive_anno_t ?? p.strutture_tot ?? 0;
                  return tot ? ((p.strutture_rinnovabili ?? 0) / tot) * 100 : 0;
                },
              },
              {
                code: 'PRPL',
                name: 'PRPL - Potenza Rinnovabile installata per Posto Letto (kW/posto letto)',
                level: 'output',
                unit: 'kW/posto',
                description: 'Potenza fotovoltaica/solare installata per ogni posto letto censito.',
                formulaDisplay: 'Potenza totale installata in kW / Totale posti letto censiti (Anno t)',
                params: [
                  { key: 'potenza_kw', label: 'Potenza rinnovabile totale (kW)', defaultValue: 280, unit: 'kW' },
                  { key: 'totale_posti_letto_censiti_anno_t', label: 'Totale posti letto censiti (Anno t)', defaultValue: 650, unit: 'posti' },
                ],
                calculate: (p) => {
                  const posti = p.totale_posti_letto_censiti_anno_t ?? p.posti_letto ?? 0;
                  return posti ? (p.potenza_kw ?? 0) / posti : 0;
                },
              },
            ],
          },
        ],
      },
      {
        id: 'az-dim2-9',
        code: '9',
        title: '9. Trasformare le strutture ricettive da consumatori passivi a "nodi attivi" (CER)',
        interventi: [
          {
            id: 'int-dim2-9a',
            code: '9.a',
            title: '9.a - Realizzare Comunità Energetiche Rinnovabili (CER) intercomunali',
            outputIndicators: [
              {
                code: 'TPCT',
                name: 'TPCT - Tasso di Penetrazione delle CER nel Turismo (%)',
                level: 'output',
                unit: '%',
                description: 'Rapporto percentuale tra il numero di posti letto delle strutture ricettive membri di una Comunità Energetica Rinnovabile (CER) nell\'anno t e il totale dei posti letto censiti.',
                formulaDisplay: '(Numero di posti letto delle strutture membri di una CER nell\'anno t / Numero di posti letto totali nell\'anno t) * 100',
                params: [
                  { key: 'posti_letto_strutture_membri_cer_anno_t', label: 'Posti letto delle strutture membri di una CER (Anno t)', defaultValue: 130, unit: 'posti letto' },
                  { key: 'totale_posti_letto_censiti_anno_t', label: 'Totale posti letto censiti (Anno t)', defaultValue: 650, unit: 'posti letto' },
                ],
                calculate: (p) => {
                  const tot = p.totale_posti_letto_censiti_anno_t ?? p.strutture_tot ?? 0;
                  const cer = p.posti_letto_strutture_membri_cer_anno_t ?? p.strutture_cer ?? 0;
                  return tot ? Math.round((cer / tot) * 10000) / 100 : 0;
                },
              },
            ],
          },
        ],
      },
      {
        id: 'az-dim2-10',
        code: '10',
        title: '10. Stimolare l\'efficientamento energetico delle strutture ricettive',
        interventi: [
          {
            id: 'int-dim2-10a',
            code: '10.a',
            title: '10.a - Introdurre incentivi per interventi di efficientamento energetico (Sistemi Attivi)',
            outputIndicators: [
              {
                code: 'TIEA',
                name: 'TIEA - Tasso di Interventi di Efficienza energetica Attivi (%)',
                level: 'output',
                unit: '%',
                description: 'Rapporto percentuale tra il numero di richieste di incentivo erogate nell\'anno t per sistemi attivi e il totale delle strutture ricettive.',
                formulaDisplay: '(Numero di richieste di incentivo erogate nell\'anno t / Totale strutture ricettive (Anno t)) * 100',
                params: [
                  { key: 'richieste_incentivo_erogate_anno_t', label: 'Numero di richieste di incentivo erogate nell\'anno t', defaultValue: 16, unit: 'richieste' },
                  { key: 'totale_strutture_ricettive_anno_t', label: 'Totale strutture ricettive (Anno t)', defaultValue: 35, unit: 'strutture' },
                ],
                calculate: (p) => {
                  const tot = p.totale_strutture_ricettive_anno_t ?? p.strutture_tot ?? 0;
                  const num = p.richieste_incentivo_erogate_anno_t ?? p.strutture_attivi ?? 0;
                  return tot ? Math.round((num / tot) * 10000) / 100 : 0;
                },
              },
            ],
          },
          {
            id: 'int-dim2-10b',
            code: '10.b',
            title: '10 b - Introdurre incentivi per la realizzazione di interfacce climatiche (Sistemi Passivi)',
            outputIndicators: [
              {
                code: 'TIEP',
                name: 'TIEP - Tasso di Interventi di Efficienza energetica Passivi (%)',
                level: 'output',
                unit: '%',
                description: 'Rapporto percentuale tra il numero di interventi di interfacce climatiche realizzati nell\'anno t e il totale delle strutture ricettive.',
                formulaDisplay: '(Numero di interventi di interfacce climatiche nell\'anno t / Totale strutture ricettive (Anno t)) * 100',
                params: [
                  { key: 'interventi_interfacce_climatiche_anno_t', label: 'Numero di interventi di interfacce climatiche nell\'anno t', defaultValue: 11, unit: 'interventi' },
                  { key: 'totale_strutture_ricettive_anno_t', label: 'Totale strutture ricettive (Anno t)', defaultValue: 35, unit: 'strutture' },
                ],
                calculate: (p) => {
                  const tot = p.totale_strutture_ricettive_anno_t ?? p.strutture_tot ?? 0;
                  const num = p.interventi_interfacce_climatiche_anno_t ?? p.strutture_passivi ?? 0;
                  return tot ? Math.round((num / tot) * 10000) / 100 : 0;
                },
              },
            ],
          },
        ],
      },
    ],
  },

  // DIMENSIONE 3
  {
    id: 'dim3',
    number: 3,
    profiloTitle: 'PROFILO TURISTICO-AMBIENTALE',
    dimensionTitle: 'Dimensione 3: Struttura dell\'Offerta Sostenibile e Mobilità Dolce',
    contextIndicatorsSubtitle: 'INDICATORI DI CONTESTO',
    contextIndicators: CONTEXT_INDICATORS.filter((c) => c.dimensionId === 'dim3'),
    lineeStrategicheTitle: 'LINEE STRATEGICHE E INTERVENTI OPERATIVI',
    direzioneTitle: 'Direzione 3: Incremento della mobilità dolce e dell’accessibilità',
    asseTitle: 'Asse d\'Intervento: Sviluppo della connessione intermodale e incremento dei servizi per la mobilità dolce',
    azioniSubtitle: 'AZIONI',
    azioni: [
      {
        id: 'az-dim3-1',
        code: '1',
        title: '1. Aumentare l\'infrastruttura della mobilità dolce',
        interventi: [
          {
            id: 'int-dim3-1a',
            code: '1.a',
            title: '1.a - Aumentare i percorsi ciclopedonali',
            outputIndicators: [
              {
                code: 'TCIC',
                name: 'TCIC - Tasso di Ciclabilità (%)',
                level: 'output',
                unit: '%',
                description: 'Percentuale di rete viaria urbana e periurbana dotata di corsia ciclabile.',
                formulaDisplay: '(Km di piste ciclabili fruibili (Anno t) / Km totale rete viaria (Anno t)) * 100',
                params: [
                  { key: 'km_piste_ciclabili_fruibili_anno_t', label: 'Km di piste ciclabili fruibili (Anno t)', defaultValue: 24.5, unit: 'km' },
                  { key: 'km_viabilita', label: 'Km totale rete viaria (Anno t)', defaultValue: 120, unit: 'km' },
                ],
                calculate: (p) => {
                  const km = p.km_piste_ciclabili_fruibili_anno_t ?? p.km_ciclabili ?? 0;
                  return p.km_viabilita ? (km / p.km_viabilita) * 100 : 0;
                },
              },
            ],
          },
        ],
      },
      {
        id: 'az-dim3-2',
        code: '2',
        title: '2. Implementare interventi strutturali per aumentare la dotazione di colonnine elettriche',
        interventi: [
          {
            id: 'int-dim3-2a',
            code: '2.a',
            title: '2.a - Aumentare la dotazione di punti di ricarica elettrica',
            outputIndicators: [
              {
                code: 'IDPRE',
                name: 'IDPRE - Indice di Dotazione dei Punti di Ricarica Elettrica (%)',
                level: 'output',
                unit: '%',
                description: 'Rapporto percentuale tra il numero di punti di ricarica elettrica attivi nell\'anno t e il numero totale di parcheggi nel Comune.',
                formulaDisplay: '(Numero punti di ricarica elettrica attivi (Anno t) / Numero totale di parcheggi nel Comune (Anno t)) * 100',
                params: [
                  { key: 'numero_punti_ricarica_elettrica_attivi_anno_t', label: 'Numero punti di ricarica elettrica attivi (Anno t)', defaultValue: 14, unit: 'punti' },
                  { key: 'num_totale_parcheggi_comune_anno_t', label: 'Numero totale di parcheggi nel Comune (Anno t)', defaultValue: 450, unit: 'parcheggi' },
                ],
                calculate: (p) => {
                  const tot = p.num_totale_parcheggi_comune_anno_t ?? p.punti_previsti ?? 0;
                  const attivi = p.numero_punti_ricarica_elettrica_attivi_anno_t ?? p.num_punti_ricarica_attivi_anno_t ?? p.punti_attivi ?? 0;
                  return tot ? Math.round((attivi / tot) * 10000) / 100 : 0;
                },
              },
            ],
          },
        ],
      },
      {
        id: 'az-dim3-3',
        code: '3',
        title: '3. Aumentare le attrezzature di supporto alla mobilità dolce',
        interventi: [
          {
            id: 'int-dim3-3a',
            code: '3.a',
            title: '3.a - Aumentare le attrezzature a supporto della mobilità ciclopedonale',
            outputIndicators: [
              {
                code: 'DMD',
                name: 'DMD - Dotazioni per la Mobilità Dolce (Numero/km rete ciclabile)',
                level: 'output',
                unit: 'e-bike/km',
                description: 'Rapporto tra il numero di e-bike messe a disposizione e i chilometri di rete ciclabile.',
                formulaDisplay: 'Numero totale di e-bike messe a disposizione (Anno t) / Km di piste ciclabili fruibili (Anno t)',
                params: [
                  { key: 'numero_totale_ebike_messe_a_disposizione', label: 'Numero totale di e-bike messe a disposizione (Anno t)', defaultValue: 30, unit: 'e-bike' },
                  { key: 'km_piste_ciclabili_fruibili_anno_t', label: 'Km di piste ciclabili fruibili (Anno t)', defaultValue: 24.5, unit: 'km' },
                ],
                calculate: (p) => {
                  const km = p.km_piste_ciclabili_fruibili_anno_t ?? p.km_ciclabile ?? 0;
                  const ebike = p.numero_totale_ebike_messe_a_disposizione ?? p.num_ebike_messe_a_disposizione ?? p.dotazioni ?? 0;
                  return km > 0 ? Math.round((ebike / km) * 100) / 100 : 0;
                },
              },
            ],
          },
          {
            id: 'int-dim3-3b',
            code: '3.b',
            title: '3.b - Realizzazione di Mobility hubs fuori dalle mura storiche dei tre borghi',
            outputIndicators: [
              {
                code: 'IDPMH',
                name: 'IDPMH - Indice di Dotazione Parcheggi nei Mobility Hubs (%)',
                level: 'output',
                unit: '%',
                description: 'Quota di parcheggi scambiatori realizzati nei mobility hub perimetrici.',
                formulaDisplay: '(Stalli realizzati nei mobility hub (Anno t) / Numero totale di parcheggi nel Comune (Anno t)) * 100',
                params: [
                  { key: 'stalli_realizzati', label: 'Stalli realizzati nei mobility hub (Anno t)', defaultValue: 140, unit: 'stalli' },
                  { key: 'num_totale_parcheggi_comune_anno_t', label: 'Numero totale di parcheggi nel Comune (Anno t)', defaultValue: 450, unit: 'parcheggi' },
                ],
                calculate: (p) => {
                  const tot = p.num_totale_parcheggi_comune_anno_t ?? p.stalli_previsti ?? 0;
                  return tot ? ((p.stalli_realizzati ?? 0) / tot) * 100 : 0;
                },
              },
              {
                code: 'IDEMH',
                name: 'IDEMH - Indice di Dotazione E-bike nei Mobility Hubs (%)',
                level: 'output',
                unit: '%',
                description: 'Rapporto percentuale tra il numero di e-bike noleggiabili nei parcheggi scambiatori e il numero totale di e-bike messe a disposizione.',
                formulaDisplay: '(Numero di e-bike noleggiabili nei parcheggi scambiatori (Anno t) / Numero totale di e-bike messe a disposizione (Anno t)) * 100',
                params: [
                  { key: 'num_ebike_noleggiabili_parcheggi_scambiatori', label: 'Numero di e-bike noleggiabili nei parcheggi scambiatori (Anno t)', defaultValue: 18, unit: 'e-bike' },
                  { key: 'numero_totale_ebike_messe_a_disposizione', label: 'Numero totale di e-bike messe a disposizione (Anno t)', defaultValue: 30, unit: 'e-bike' },
                ],
                calculate: (p) => {
                  const tot = p.numero_totale_ebike_messe_a_disposizione ?? p.num_ebike_messe_a_disposizione ?? p.hubs_tot ?? 0;
                  const num = p.num_ebike_noleggiabili_parcheggi_scambiatori ?? p.hubs_ebike ?? 0;
                  return tot ? Math.round((num / tot) * 10000) / 100 : 0;
                },
              },
              {
                code: 'IMS',
                name: 'IMS - Indice di Mobilità Sostenibile (Num)',
                level: 'output',
                unit: 'collegamenti',
                description: 'Servizi di mobilità sostenibile articolati in due voci: 1) Servizi in occasione degli eventi: (∑ collegamenti per evento / Numero di eventi); 2) Servizi in regime ordinario: sotto-voci "Periodo infrasettimanale" e "Weekend" (collegamenti giornalieri attivati per il servizio di navette di raggiungimento del centro storico).',
                formulaDisplay: 'Voce 1 (Eventi): (∑ collegamenti per evento / Numero di eventi) | Voce 2 (Regime ordinario): Infrasettimanale (collegamenti/giorno) & Weekend (collegamenti/giorno)',
                params: [
                  {
                    key: 'somma_collegamenti_eventi',
                    label: 'Voce 1 (Eventi): Somma collegamenti per gli eventi (∑ evento 1..N)',
                    defaultValue: 24,
                    unit: 'collegamenti',
                    description: 'Numero di collegamenti per evento 1 + evento 2 + ... + evento N',
                  },
                  {
                    key: 'numero_eventi',
                    label: 'Voce 1 (Eventi): Numero di eventi (Anno t)',
                    defaultValue: 4,
                    unit: 'eventi',
                    description: 'Numero di eventi con servizio di collegamento/navetta',
                  },
                  {
                    key: 'collegamenti_giornalieri_infrasettimanali',
                    label: 'Voce 2.a (Regime ordinario): Periodo infrasettimanale - Collegamenti giornalieri navette centro storico',
                    defaultValue: 8,
                    unit: 'collegamenti/giorno',
                    description: 'Numero di collegamenti giornalieri attivati per il servizio di navette di raggiungimento del centro storico nel periodo infrasettimanale',
                  },
                  {
                    key: 'collegamenti_giornalieri_weekend',
                    label: 'Voce 2.b (Regime ordinario): Weekend - Collegamenti giornalieri navette centro storico',
                    defaultValue: 16,
                    unit: 'collegamenti/giorno',
                    description: 'Numero di collegamenti giornalieri attivati per il servizio di navette di raggiungimento del centro storico nei weekend',
                  },
                ],
                calculate: (p) => {
                  if (p.punteggio_ciclabilita !== undefined && p.somma_collegamenti_eventi === undefined) {
                    return (p.punteggio_ciclabilita || 0) + (p.punteggio_ricarica || 0);
                  }
                  const numEv = p.numero_eventi ?? 0;
                  const sommaEv = p.somma_collegamenti_eventi ?? 0;
                  const mediaEventi = numEv > 0 ? sommaEv / numEv : 0;
                  const infra = p.collegamenti_giornalieri_infrasettimanali ?? 0;
                  const wend = p.collegamenti_giornalieri_weekend ?? 0;
                  const mediaOrdinario = (infra * 5 + wend * 2) / 7;
                  return Math.round((mediaEventi + mediaOrdinario) * 100) / 100;
                },
              },
            ],
          },
        ],
      },
    ],
  },

  // DIMENSIONE 4
  {
    id: 'dim4',
    number: 4,
    profiloTitle: 'PROFILO TURISTICO-AMBIENTALE',
    dimensionTitle: 'Dimensione 4: Resilienza Demografica ed Economica',
    contextIndicatorsSubtitle: 'INDICATORI DI CONTESTO',
    contextIndicators: CONTEXT_INDICATORS.filter((c) => c.dimensionId === 'dim4'),
    lineeStrategicheTitle: 'LINEE STRATEGICHE E INTERVENTI OPERATIVI',
    direzioneTitle: 'Direzione 4: Tutela della resilienza demografica',
    asseTitle: 'Asse d\'Intervento: Sostegno al tessuto economico e contrasto allo spopolamento',
    azioniSubtitle: 'AZIONI',
    azioni: [
      {
        id: 'az-dim4-1',
        code: '1',
        title: '1. Aumentare le sinergie tra settore agricolo e settore ricettivo',
        interventi: [
          {
            id: 'int-dim4-1a',
            code: '1.a',
            title: '1.a - Favorire reti d\'impresa tra produttori locali e strutture ricettive',
            outputIndicators: [
              {
                code: 'TIFTA',
                name: 'TIFTA - Tasso di Integrazione della Filiera Turistico-Agricola (%)',
                level: 'output',
                unit: '%',
                description: 'Quota di strutture ricettive con accordi formali con produttori e aziende agricole locali.',
                formulaDisplay: '{Accordi con produttori locali (Anno t) / [Totale strutture ricettive (Anno t) - Agriturismi censiti (Anno t)]} * 100',
                params: [
                  { key: 'accordi_filiera', label: 'Accordi con produttori locali (Anno t)', defaultValue: 12, unit: 'accordi' },
                  { key: 'totale_strutture_ricettive_anno_t', label: 'Totale strutture ricettive (Anno t)', defaultValue: 35, unit: 'strutture' },
                  { key: 'agriturismi', label: 'Agriturismi censiti (Anno t)', defaultValue: 8, unit: 'agriturismi' },
                ],
                calculate: (p) => {
                  const tot = p.totale_strutture_ricettive_anno_t ?? p.strutture_tot ?? 0;
                  const denom = Math.max(1, tot - (p.agriturismi ?? 0));
                  return ((p.accordi_filiera ?? 0) / denom) * 100;
                },
              },
            ],
          },
        ],
      },
      {
        id: 'az-dim4-2',
        code: '2',
        title: '2. Investire su nuove imprenditorialità e nuovi servizi legati al turismo sostenibile',
        interventi: [
          {
            id: 'int-dim4-2a',
            code: '2.a',
            title: '2.a - Introdurre nuove figure professionali apicali e operative',
            outputIndicators: [
              {
                code: 'IOT',
                name: 'IOT - Indice di Occupazione generata per il Turismo (Numero di professionisti/abitanti e presenze)',
                level: 'output',
                unit: 'prof/10k pop',
                description: 'Figure professionali qualificate attivate per il turismo per 10.000 (Residenti + Presenze).',
                formulaDisplay: '[Professionisti contrattualizzati (Anno t) / (Totale popolazione residente (Anno t) + Totale presenze turistiche rilevate (Anno t))] * 10.000',
                params: [
                  { key: 'prof_ruoli', label: 'Professionisti contrattualizzati (Anno t)', defaultValue: 6, unit: 'professionisti' },
                  { key: 'totale_popolazione_residente_anno_t', label: 'Totale popolazione residente (Anno t)', defaultValue: 3400, unit: 'abitanti' },
                  { key: 'totale_presenze_turistiche_rilevate_anno_t', label: 'Totale presenze turistiche rilevate (Anno t)', defaultValue: 28500, unit: 'presenze' },
                ],
                calculate: (p) => {
                  const res = p.totale_popolazione_residente_anno_t ?? p.residenti ?? 0;
                  const pres = p.totale_presenze_turistiche_rilevate_anno_t ?? p.presenze ?? 0;
                  const tot = res + pres;
                  return tot ? ((p.prof_ruoli ?? 0) / tot) * 10000 : 0;
                },
              },
            ],
          },
          {
            id: 'int-dim4-2b',
            code: '2.b',
            title: '2.b - Creare uno sportello unico e bandi dedicati per l\'imprenditoria giovanile',
            outputIndicators: [
              {
                code: 'TBPIG',
                name: 'TBPIG - Tasso di Bandi Pubblicati per l\'Imprenditoria Giovanile (Numero)',
                level: 'output',
                unit: 'bandi',
                description: 'Numero di bandi pubblici pubblicati dallo sportello unico per startup under 35.',
                formulaDisplay: 'Bandi pubblicati dallo sportello (Anno t)',
                params: [
                  {
                    key: 'bandi_pubblicati_dallo_sportello_anno_t',
                    label: 'Bandi pubblicati dallo sportello (Anno t)',
                    defaultValue: 3,
                    unit: 'bandi',
                  },
                ],
                calculate: (p) => p.bandi_pubblicati_dallo_sportello_anno_t ?? p.bandi_pubblicati ?? 0,
              },
              {
                code: 'TNIG',
                name: 'TNIG - Tasso di Nuova Imprenditoria Giovanile (%)',
                level: 'output',
                unit: '%',
                description: 'Percentuale di nuove start-up giovanili nate grazie ai bandi pubblicati.',
                formulaDisplay: '(Nuove start-up under 35 finanziate (Anno t) / Bandi pubblicati dallo sportello (Anno t)) * 100',
                params: [
                  { key: 'startup_finanziate', label: 'Nuove start-up under 35 finanziate (Anno t)', defaultValue: 5, unit: 'startup' },
                  {
                    key: 'bandi_pubblicati_dallo_sportello_anno_t',
                    label: 'Bandi pubblicati dallo sportello (Anno t)',
                    defaultValue: 3,
                    unit: 'bandi',
                  },
                ],
                calculate: (p) => {
                  const denom = p.bandi_pubblicati_dallo_sportello_anno_t ?? p.bandi_pubblicati ?? 0;
                  return denom ? ((p.startup_finanziate ?? 0) / denom) * 100 : 0;
                },
              },
            ],
          },
          {
            id: 'int-dim4-2c',
            code: '2.c',
            title: '2.c - Introdurre il Servizio Civile per la manutenzione di spazi pubblici e la comunità',
            outputIndicators: [
              {
                code: 'ICG',
                name: 'ICG - Indice di Coinvolgimento Giovanile istituzionale (Numero di giovani coinvolti/abitanti e presenze)',
                level: 'output',
                unit: 'giovani/10k pop',
                description: 'Giovani impegnati nel Servizio Civile per il patrimonio turistico e la comunità.',
                formulaDisplay: '[Giovani in Servizio Civile (Anno t) / (Totale popolazione residente (Anno t) + Totale presenze turistiche rilevate (Anno t))] * 10.000',
                params: [
                  { key: 'giovani_servizio', label: 'Giovani in Servizio Civile (Anno t)', defaultValue: 8, unit: 'giovani' },
                  { key: 'totale_popolazione_residente_anno_t', label: 'Totale popolazione residente (Anno t)', defaultValue: 3400, unit: 'abitanti' },
                  { key: 'totale_presenze_turistiche_rilevate_anno_t', label: 'Totale presenze turistiche rilevate (Anno t)', defaultValue: 28500, unit: 'presenze' },
                ],
                calculate: (p) => {
                  const res = p.totale_popolazione_residente_anno_t ?? p.residenti ?? 0;
                  const pres = p.totale_presenze_turistiche_rilevate_anno_t ?? p.presenze ?? 0;
                  const tot = res + pres;
                  return tot ? ((p.giovani_servizio ?? 0) / tot) * 10000 : 0;
                },
              },
            ],
          },
        ],
      },
    ],
  },
];

// SEZIONE 1: ANALISI DI CONTESTO (Dimensioni e Indicatori di Contesto associati)
export const CONTEXT_ANALYSIS_SECTIONS: ContextAnalysisSection[] = [
  {
    id: 'dim1',
    number: 1,
    title: 'Dimensione 1: Capacità di Attrazione e Flussi turistici',
    description: 'Quadro diagnostico del profilo turistico-ambientale: volumi complessivi di arrivi e presenze, permanenza media e internazionalizzazione dei flussi turistici.',
    color: 'purple',
    badgeBg: 'bg-purple-100 text-purple-800 border-purple-200 dark:bg-purple-950 dark:text-purple-300 dark:border-purple-800',
    contextIndicators: CONTEXT_INDICATORS.filter((c) => c.dimensionId === 'dim1'),
  },
  {
    id: 'dim2',
    number: 2,
    title: 'Dimensione 2: Pressione Turistica e Impatto Ambientale',
    description: 'Quadro diagnostico della pressione turistica e dell\'impronta ecologica: intensità turistica, concentrazione stagionale, produzione di rifiuti pro-capite, consumo idrico medio e intensità energetica delle strutture ricettive.',
    color: 'purple',
    badgeBg: 'bg-purple-100 text-purple-800 border-purple-200 dark:bg-purple-950 dark:text-purple-300 dark:border-purple-800',
    contextIndicators: CONTEXT_INDICATORS.filter((c) => c.dimensionId === 'dim2'),
  },
  {
    id: 'dim3',
    number: 3,
    title: 'Dimensione 3: Struttura dell\'Offerta Sostenibile e Mobilità Dolce',
    description: 'Quadro diagnostico dell\'offerta sostenibile e delle infrastrutture abilitanti: posti letto totali disponibili, incidenza degli agriturismi, estensione della rete cicloturistica fruibile e dotazione di punti di ricarica per mobilità elettrica.',
    color: 'purple',
    badgeBg: 'bg-purple-100 text-purple-800 border-purple-200 dark:bg-purple-950 dark:text-purple-300 dark:border-purple-800',
    contextIndicators: CONTEXT_INDICATORS.filter((c) => c.dimensionId === 'dim3'),
  },
  {
    id: 'dim4',
    number: 4,
    title: 'Dimensione 4: Resilienza Demografica ed Economica',
    description: 'Quadro diagnostico socio-economico del borgo: trend demografico a 5 anni e densità imprenditoriale turistica.',
    color: 'purple',
    badgeBg: 'bg-purple-100 text-purple-800 border-purple-200 dark:bg-purple-950 dark:text-purple-300 dark:border-purple-800',
    contextIndicators: CONTEXT_INDICATORS.filter((c) => c.dimensionId === 'dim4'),
  },
];

// SEZIONE 2: PROSPETTIVE DI INTERVENTO (Direzioni strategiche, Assi, Azioni e Indicatori di Output)
// Estratte criticamente dal quadro diagnostico complessivo dell'analisi di contesto
export const INTERVENTION_PERSPECTIVES: InterventionPerspective[] = [
  {
    id: 'dir1',
    number: 1,
    title: 'Direzione 1: Riequilibrio e destagionalizzazione dei flussi',
    asseTitle: 'Asse d\'Intervento: Sviluppo dell’offerta turistica e riqualificazione degli spazi',
    description: 'Linee strategiche volte ad ampliare l\'offerta esperienziale integrata, riqualificare il patrimonio pubblico e i borghi, incrementare la dotazione informativa e valorizzare i periodi spalla ed invernali con postazioni per nomadi digitali.',
    color: 'emerald',
    badgeBg: 'bg-emerald-100 text-emerald-800 border-emerald-200 dark:bg-emerald-950 dark:text-emerald-300 dark:border-emerald-800',
    azioni: DIMENSION_CARDS[0].azioni,
  },
  {
    id: 'dir2',
    number: 2,
    title: 'Direzione 2: Mitigazione dell\'impronta ecologica turistica',
    asseTitle: 'Asse d\'Intervento: Promozione della transizione energetica e miglioramento del metabolismo circolare',
    description: 'Linee strategiche per la riduzione dell\'impatto ambientale: sensibilizzazione di turisti e residenti, raccolta differenziata spinta, CAM negli eventi, riduzione dei prelievi idrici e recupero acque meteoriche, penetrazione delle rinnovabili, CER intercomunali ed efficientamento energetico attivo/passivo.',
    color: 'emerald',
    badgeBg: 'bg-emerald-100 text-emerald-800 border-emerald-200 dark:bg-emerald-950 dark:text-emerald-300 dark:border-emerald-800',
    azioni: DIMENSION_CARDS[1].azioni,
  },
  {
    id: 'dir3',
    number: 3,
    title: 'Direzione 3: Incremento della mobilità dolce e dell’accessibilità',
    asseTitle: 'Asse d\'Intervento: Sviluppo della connessione intermodale e incremento dei servizi per la mobilità dolce',
    description: 'Linee strategiche per potenziare i percorsi ciclabili, infrastrutturare i punti di ricarica per veicoli elettrici, installare dotazioni di supporto e realizzare Mobility Hubs di scambio all\'esterno delle cinte murarie storiche.',
    color: 'emerald',
    badgeBg: 'bg-emerald-100 text-emerald-800 border-emerald-200 dark:bg-emerald-950 dark:text-emerald-300 dark:border-emerald-800',
    azioni: DIMENSION_CARDS[2].azioni,
  },
  {
    id: 'dir4',
    number: 4,
    title: 'Direzione 4: Tutela della resilienza demografica',
    asseTitle: 'Asse d\'Intervento: Sostegno al tessuto economico e contrasto allo spopolamento',
    description: 'Linee strategiche a presidio della comunità: rafforzamento delle filiere corte tra agricoltura e ricettività, inserimento di figure professionali qualificate, sportello unico e bandi per giovani start-up, e coinvolgimento attivo nel Servizio Civile.',
    color: 'emerald',
    badgeBg: 'bg-emerald-100 text-emerald-800 border-emerald-200 dark:bg-emerald-950 dark:text-emerald-300 dark:border-emerald-800',
    azioni: DIMENSION_CARDS[3].azioni,
  },
];

// Collect all output indicators across all dimensions
export const ALL_OUTPUT_INDICATORS: OutputIndicator[] = [];
DIMENSION_CARDS.forEach((card) => {
  card.azioni.forEach((az) => {
    az.interventi.forEach((int) => {
      int.outputIndicators.forEach((out) => {
        if (!ALL_OUTPUT_INDICATORS.some((o) => o.code === out.code)) {
          ALL_OUTPUT_INDICATORS.push(out);
        }
      });
    });
  });
});

// Attach output indicators into CONTEXT_INDICATORS preserving all relationships
CONTEXT_INDICATORS.forEach((ctx) => {
  let allowedCodes: string[] = [];

  if (
    ctx.code === 'CTX-1' ||
    ctx.code === 'CTX-2' ||
    ctx.code === 'CTX-3' ||
    ctx.code === 'CTX-4' ||
    ctx.code === 'CTX-5'
  ) {
    // 1-4. Capacità di attrazione e 5. Intensità turistica: Azioni 1, 2, 3, 4
    allowedCodes = [
      'TCOE', 'TCOI', 'ISPR', 'IERT', 'TRUV', 'ICS', 'IVS', 'SPD',
      'IDS', 'ICSM', 'IALV', 'TOEI', 'TOEO', 'TDE', 'IPSW', 'INDI', 'TUIP'
    ];
  } else if (ctx.code === 'CTX-6') {
    // 6. Stagionalità turistica (ST): Azione 4 (Diversificazione della stagionalità)
    allowedCodes = ['TOEI', 'TOEO', 'TDE', 'IPSW', 'INDI', 'TUIP'];
  } else if (ctx.code === 'CTX-7') {
    // 7. Rifiuti prodotti dal turismo (RT): Azione 5 (Economia circolare e rifiuti)
    allowedCodes = ['TFEC', 'TFKE', 'TST', 'IAC', 'IDAP', 'TPCA'];
  } else if (ctx.code === 'CTX-8') {
    // 8. Consumo idrico turistico (CI): Azione 6 (Risparmio idrico)
    allowedCodes = ['TFRI', 'TDRF', 'TDRAG'];
  } else if (ctx.code === 'CTX-9') {
    // 9. Intensità energetica della destinazione ricettiva (IDE): Azione 7 (Efficienza energetica)
    allowedCodes = ['TFTE', 'TPR', 'PRPL', 'TPCT', 'TIEA', 'TIEP'];
  } else if (ctx.code === 'CTX-10' || ctx.code === 'CTX-11') {
    // 10. Posti letto (PL) e 11. Incidenza degli agriturismi (%Agri): Azione 10 (Sostegno economico e ricettività)
    allowedCodes = ['TIFTA', 'IOT', 'TBPIG', 'TNIG'];
  } else if (ctx.code === 'CTX-12' || ctx.code === 'CTX-13') {
    // 12. Km rete cicloturistica (KC) e 13. Punti ricarica mobilità elettrica (PR): Azioni 8 e 9 (Mobilità dolce e sostenibile)
    allowedCodes = ['TCIC', 'DMD', 'IDPRE', 'IDPMH', 'IDEMH', 'IMS'];
  } else if (ctx.code === 'CTX-14' || ctx.code === 'CTX-15') {
    // 14. Variazione popolazione (ΔR) e 15. Densità imprenditoriale turistica (DT): Azione 10 (Resilienza demografica ed economica)
    allowedCodes = ['TIFTA', 'IOT', 'TBPIG', 'TNIG'];
  }

  ctx.outputIndicators = ALL_OUTPUT_INDICATORS
    .filter((o) => allowedCodes.includes(o.code))
    .map((o) => ({ ...o, contextCode: ctx.code }));
});

// Lookup functions
export function getContextIndicatorByCode(code: string): ContextIndicator | null {
  return CONTEXT_INDICATORS.find((ci) => ci.code === code) || null;
}

export function getOutputIndicatorByCode(code: string): OutputIndicator | null {
  for (const card of DIMENSION_CARDS) {
    for (const az of card.azioni) {
      for (const int of az.interventi) {
        const found = int.outputIndicators.find((out) => out.code === code);
        if (found) return found;
      }
    }
  }
  return null;
}

export function getCalculableIndicatorByCode(code: string): CalculableIndicator | null {
  // Check context indicators first
  const ctx = CONTEXT_INDICATORS.find((c) => c.code === code);
  if (ctx) {
    return {
      code: ctx.code,
      name: ctx.name,
      level: 'context',
      dimensionId: ctx.dimensionId,
      unit: ctx.unit,
      description: ctx.description,
      formulaDisplay: ctx.formulaDisplay,
      params: ctx.params,
      calculate: ctx.calculate,
      targetThreshold: ctx.targetThreshold,
      objective: ctx.objective,
      strategy: ctx.strategy,
      action: ctx.action,
      outputIndicators: ctx.outputIndicators,
    };
  }

  // Check output indicators across dimension cards
  for (const card of DIMENSION_CARDS) {
    for (const az of card.azioni) {
      for (const int of az.interventi) {
        const out = int.outputIndicators.find((o) => o.code === code);
        if (out) {
          return {
            code: out.code,
            name: out.name,
            level: 'output',
            dimensionId: card.id,
            unit: out.unit,
            description: out.description,
            formulaDisplay: out.formulaDisplay,
            params: out.params,
            calculate: out.calculate,
            targetThreshold: out.targetThreshold,
            parentContextCode: card.contextIndicators[0]?.code,
            parentContextName: card.contextIndicators[0]?.name,
            objective: az.title,
            interventionTitle: int.title,
            direzioneTitle: card.direzioneTitle,
          };
        }
      }
    }
  }

  return null;
}

export function getAllCalculableIndicators(): CalculableIndicator[] {
  const list: CalculableIndicator[] = [];

  // Add Level 1 Context Indicators
  CONTEXT_INDICATORS.forEach((ctx) => {
    list.push({
      code: ctx.code,
      name: ctx.name,
      level: 'context',
      dimensionId: ctx.dimensionId,
      unit: ctx.unit,
      description: ctx.description,
      formulaDisplay: ctx.formulaDisplay,
      params: ctx.params,
      calculate: ctx.calculate,
      targetThreshold: ctx.targetThreshold,
      objective: ctx.objective,
      strategy: ctx.strategy,
      action: ctx.action,
      outputIndicators: ctx.outputIndicators,
    });
  });

  // Add Level 2 Output Indicators
  DIMENSION_CARDS.forEach((card) => {
    card.azioni.forEach((az) => {
      az.interventi.forEach((int) => {
        int.outputIndicators.forEach((out) => {
          if (!list.some((i) => i.code === out.code)) {
            list.push({
              code: out.code,
              name: out.name,
              level: 'output',
              dimensionId: card.id,
              unit: out.unit,
              description: out.description,
              formulaDisplay: out.formulaDisplay,
              params: out.params,
              calculate: out.calculate,
              targetThreshold: out.targetThreshold,
              parentContextCode: card.contextIndicators[0]?.code,
              parentContextName: card.contextIndicators[0]?.name,
              objective: az.title,
              interventionTitle: int.title,
              direzioneTitle: card.direzioneTitle,
            });
          }
        });
      });
    });
  });

  return list;
}

export function getAllOutputIndicators() {
  const result: { indicator: ContextIndicator; output: OutputIndicator }[] = [];
  DIMENSION_CARDS.forEach((card) => {
    const defaultCtx = card.contextIndicators[0] || CONTEXT_INDICATORS[0];
    card.azioni.forEach((az) => {
      az.interventi.forEach((int) => {
        int.outputIndicators.forEach((out) => {
          result.push({ indicator: defaultCtx, output: out });
        });
      });
    });
  });
  return result;
}
