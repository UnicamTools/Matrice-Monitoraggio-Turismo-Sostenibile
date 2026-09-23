import React, { useState, useMemo } from 'react';
import {
  CONTEXT_ANALYSIS_SECTIONS,
  INTERVENTION_PERSPECTIVES,
} from '../data/matrixData';
import { DimensionId } from '../types';
import {
  Calculator,
  Info,
  Zap,
  LayoutGrid,
  Table as TableIcon,
  Layers,
  Compass,
  ListTree,
  ArrowRight,
  Target,
  Sparkles,
} from 'lucide-react';

interface MatrixExplorerProps {
  onSelectIndicatorForCalculation: (outputCode: string) => void;
}

type MacroSection = 'context' | 'intervention';

export const MatrixExplorer: React.FC<MatrixExplorerProps> = ({
  onSelectIndicatorForCalculation,
}) => {
  const [macroSection, setMacroSection] = useState<MacroSection>('context');
  const [selectedDimension, setSelectedDimension] = useState<DimensionId | 'all'>('all');
  const [selectedDirection, setSelectedDirection] = useState<string | 'all'>('all');
  const [viewMode, setViewMode] = useState<'cards' | 'grid'>('cards');

  // Filter Context Sections based on dimension
  const filteredContextSections = useMemo(() => {
    if (selectedDimension === 'all') return CONTEXT_ANALYSIS_SECTIONS;
    return CONTEXT_ANALYSIS_SECTIONS.filter((sec) => sec.id === selectedDimension);
  }, [selectedDimension]);

  // Filter Intervention Perspectives based on direction
  const filteredInterventionPerspectives = useMemo(() => {
    if (selectedDirection === 'all') return INTERVENTION_PERSPECTIVES;
    return INTERVENTION_PERSPECTIVES.filter((persp) => persp.id === selectedDirection);
  }, [selectedDirection]);

  // Total counts for summary
  const totalContextIndicatorsCount = useMemo(() => {
    return CONTEXT_ANALYSIS_SECTIONS.reduce(
      (sum, sec) => sum + sec.contextIndicators.length,
      0
    );
  }, []);

  const totalOutputIndicatorsCount = useMemo(() => {
    return INTERVENTION_PERSPECTIVES.reduce((sum, persp) => {
      return (
        sum +
        persp.azioni.reduce((azSum, az) => {
          return (
            azSum +
            az.interventi.reduce((intSum, int) => intSum + int.outputIndicators.length, 0)
          );
        }, 0)
      );
    }, 0);
  }, []);

  // Banner Pilastro 1 con filtri Dimensioni integrati
  const renderContextBanner = () => (
    <div
      onClick={() => setSelectedDimension('all')}
      className="p-4 sm:p-5 rounded-2xl bg-purple-100/90 dark:bg-purple-950/60 border-2 border-purple-300 dark:border-purple-800 space-y-3 shadow-sm cursor-pointer"
      title="Clicca per visualizzare tutte e 4 le Dimensioni"
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3 text-left">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-700 text-white dark:bg-purple-900 shadow-xs shrink-0">
            <Layers className="h-5 w-5" />
          </div>
          <div>
            <div className="text-[11px] font-extrabold uppercase tracking-wider text-purple-900 dark:text-purple-300">
              PILASTRO 1
            </div>
            <h3 className="text-lg sm:text-xl font-black text-purple-950 dark:text-purple-100 leading-tight">
              1. Analisi di Contesto — Profilo Turistico-Ambientale
            </h3>
          </div>
        </div>

        <div className="text-xs font-bold text-purple-900 dark:text-purple-200 bg-white/85 dark:bg-zinc-900/85 px-3 py-1.5 rounded-lg border border-purple-200 dark:border-purple-800 self-start sm:self-center shrink-0 shadow-2xs">
          {selectedDimension === 'all'
            ? `${totalContextIndicatorsCount} Indicatori di Contesto`
            : `${filteredContextSections.reduce((sum, s) => sum + s.contextIndicators.length, 0)} di ${totalContextIndicatorsCount} Indicatori`}
        </div>
      </div>

      {/* Elenco delle 4 Dimensioni cliccabili per esteso come filtri */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-2 pt-2 border-t border-purple-200/80 dark:border-purple-800/80">
        {CONTEXT_ANALYSIS_SECTIONS.map((sec) => {
          const isSelected = selectedDimension === sec.id;
          const count = sec.contextIndicators.length;
          return (
            <button
              key={sec.id}
              type="button"
              id={`btn-filter-dim-${sec.id}`}
              onClick={(e) => {
                e.stopPropagation();
                setSelectedDimension(isSelected ? 'all' : (sec.id as DimensionId));
              }}
              className={`flex items-center justify-between gap-3 px-3.5 py-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                isSelected
                  ? 'bg-purple-700 text-white border-purple-700 shadow-sm ring-2 ring-purple-600/30'
                  : 'bg-white/90 dark:bg-zinc-900/90 hover:bg-white dark:hover:bg-zinc-800 text-purple-950 dark:text-purple-100 border border-purple-200/90 dark:border-purple-800/80 shadow-2xs'
              }`}
              title={sec.title}
            >
              <span className="text-xs sm:text-sm font-bold leading-snug">
                {sec.title}
              </span>
              <span
                className={`shrink-0 text-[11px] font-extrabold px-2.5 py-0.5 rounded-full ${
                  isSelected
                    ? 'bg-purple-900/90 text-purple-100'
                    : 'bg-purple-100 text-purple-800 dark:bg-purple-950 dark:text-purple-300 border border-purple-200 dark:border-purple-800/60'
                }`}
              >
                {count} Indicatori
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );

  // Banner Pilastro 2 con filtri Direzioni integrati
  const renderInterventionBanner = () => (
    <div
      onClick={() => setSelectedDirection('all')}
      className="p-4 sm:p-5 rounded-2xl bg-emerald-100/90 dark:bg-emerald-950/60 border-2 border-emerald-300 dark:border-emerald-800 space-y-3 shadow-sm cursor-pointer"
      title="Clicca per visualizzare tutte e 4 le Direzioni"
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3 text-left">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-700 text-white dark:bg-emerald-900 shadow-xs shrink-0">
            <Compass className="h-5 w-5" />
          </div>
          <div>
            <div className="text-[11px] font-extrabold uppercase tracking-wider text-emerald-900 dark:text-emerald-300">
              PILASTRO 2
            </div>
            <h3 className="text-lg sm:text-xl font-black text-emerald-950 dark:text-emerald-100 leading-tight">
              2. Prospettive di Intervento — Linee Strategiche e Interventi Operativi
            </h3>
          </div>
        </div>

        <div className="text-xs font-bold text-emerald-900 dark:text-emerald-200 bg-white/85 dark:bg-zinc-900/85 px-3 py-1.5 rounded-lg border border-emerald-200 dark:border-emerald-800 self-start sm:self-center shrink-0 shadow-2xs">
          {selectedDirection === 'all'
            ? `${totalOutputIndicatorsCount} Indicatori di Output`
            : `${filteredInterventionPerspectives.reduce((sum, p) => {
                return (
                  sum +
                  p.azioni.reduce(
                    (azSum, a) =>
                      azSum +
                      a.interventi.reduce((intSum, i) => intSum + i.outputIndicators.length, 0),
                    0
                  )
                );
              }, 0)} di ${totalOutputIndicatorsCount} Output`}
        </div>
      </div>

      {/* Elenco delle 4 Direzioni strategiche cliccabili per esteso come filtri */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-2 pt-2 border-t border-emerald-200/80 dark:border-emerald-800/80">
        {INTERVENTION_PERSPECTIVES.map((persp) => {
          const isSelected = selectedDirection === persp.id;
          const count = persp.azioni.reduce(
            (azSum, a) =>
              azSum +
              a.interventi.reduce((intSum, i) => intSum + i.outputIndicators.length, 0),
            0
          );
          return (
            <button
              key={persp.id}
              type="button"
              id={`btn-filter-dir-${persp.id}`}
              onClick={(e) => {
                e.stopPropagation();
                setSelectedDirection(isSelected ? 'all' : persp.id);
              }}
              className={`flex items-center justify-between gap-3 px-3.5 py-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                isSelected
                  ? 'bg-emerald-700 text-white border-emerald-700 shadow-sm ring-2 ring-emerald-600/30'
                  : 'bg-white/90 dark:bg-zinc-900/90 hover:bg-white dark:hover:bg-zinc-800 text-emerald-950 dark:text-emerald-100 border border-emerald-200/90 dark:border-emerald-800/80 shadow-2xs'
              }`}
              title={persp.title}
            >
              <span className="text-xs sm:text-sm font-bold leading-snug">
                {persp.title}
              </span>
              <span
                className={`shrink-0 text-[11px] font-extrabold px-2.5 py-0.5 rounded-full ${
                  isSelected
                    ? 'bg-emerald-900/90 text-emerald-100'
                    : 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800/60'
                }`}
              >
                {count} Output
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Intro Banner with conceptual clarity */}
      <div className="rounded-2xl border border-zinc-200 bg-gradient-to-br from-purple-50/90 via-white to-emerald-50/80 p-6 sm:p-7 dark:border-zinc-800 dark:from-purple-950/30 dark:via-zinc-900 dark:to-emerald-950/30 shadow-sm space-y-4">
        {/* Intestazione: Etichetta ambra + Titolo a sinistra, Tasti Vista a destra */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-black text-amber-600 dark:text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
                <TableIcon className="h-4 w-4" />
                <span>Modulo di Presentazione della Matrice Logica &amp; Struttura Metodologica</span>
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-zinc-900 dark:text-zinc-100 tracking-tight mt-0.5">
              Cruscotto della Matrice: Analisi di Contesto &amp; Prospettive di Intervento
            </h2>
          </div>

          {/* View Mode Toggle Buttons - Perfettamente allineati a destra */}
          <div className="flex items-center p-1 rounded-xl bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 shrink-0 self-start md:self-auto">
            <button
              type="button"
              onClick={() => setViewMode('cards')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                viewMode === 'cards'
                  ? 'bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 shadow-sm ring-1 ring-zinc-200 dark:ring-zinc-700'
                  : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200'
              }`}
            >
              <LayoutGrid className="h-4 w-4 text-amber-600 dark:text-amber-400" />
              <span>Vista Schede</span>
            </button>

            <button
              type="button"
              onClick={() => setViewMode('grid')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                viewMode === 'grid'
                  ? 'bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 shadow-sm ring-1 ring-zinc-200 dark:ring-zinc-700'
                  : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200'
              }`}
            >
              <TableIcon className="h-4 w-4 text-amber-600 dark:text-amber-400" />
              <span>Vista Tabella</span>
            </button>
          </div>
        </div>

        {/* Scritte descrittive grigie a tutta larghezza per distendersi su una riga ciascuna */}
        <div className="text-xs text-zinc-500 dark:text-zinc-400 space-y-1.5 w-full leading-relaxed">
          <p>La matrice è organizzata nei suoi due pilastri distinti:</p>
          <div className="space-y-1 pl-0.5">
            <div className="w-full">
              <strong className="font-bold text-purple-700 dark:text-purple-300">
                1) Analisi di Contesto
              </strong>
              , che delinea il profilo turistico ambientale del Comune attraverso Indicatori di Contesto (15 Indicatori distribuiti su 4 Dimensioni di analisi)
            </div>
            <div className="w-full">
              <strong className="font-bold text-emerald-700 dark:text-emerald-300">
                2) Prospettive di Intervento
              </strong>
              , che individua le linee strategiche estratte criticamente dal quadro diagnostico complessivo e monitora i risultati delle azioni implementate tramite Indicatori di Output (43 Indicatori di Output distribuiti su 4 Direzioni chiave).
            </div>
          </div>
        </div>

        {/* Macro Structure Switcher - Solo i titoli nei tasti colorati */}
        <div className="pt-2 border-t border-zinc-200/80 dark:border-zinc-800/80 grid grid-cols-1 sm:grid-cols-2 gap-3">
          <button
            type="button"
            id="btn-macro-context"
            onClick={() => {
              setMacroSection('context');
              setSelectedDirection('all');
            }}
            className={`py-3 px-4 rounded-xl border font-black text-xs sm:text-sm uppercase tracking-wider transition-all cursor-pointer flex items-center justify-center gap-2 ${
              macroSection === 'context'
                ? 'bg-purple-700 text-white border-purple-700 shadow-sm ring-2 ring-purple-600/30 dark:ring-purple-400/30'
                : 'bg-purple-50/70 dark:bg-purple-950/30 text-purple-950 dark:text-purple-200 border-purple-200 dark:border-purple-800/60 hover:bg-purple-100/70 dark:hover:bg-purple-900/40'
            }`}
          >
            <Layers className="h-4 w-4 shrink-0" />
            <span>1. ANALISI DI CONTESTO</span>
          </button>

          <button
            type="button"
            id="btn-macro-intervention"
            onClick={() => {
              setMacroSection('intervention');
              setSelectedDimension('all');
            }}
            className={`py-3 px-4 rounded-xl border font-black text-xs sm:text-sm uppercase tracking-wider transition-all cursor-pointer flex items-center justify-center gap-2 ${
              macroSection === 'intervention'
                ? 'bg-emerald-700 text-white border-emerald-700 shadow-sm ring-2 ring-emerald-600/30 dark:ring-emerald-400/30'
                : 'bg-emerald-50/70 dark:bg-emerald-950/30 text-emerald-950 dark:text-emerald-200 border-emerald-200 dark:border-emerald-800/60 hover:bg-emerald-100/70 dark:hover:bg-emerald-900/40'
            }`}
          >
            <Compass className="h-4 w-4 shrink-0" />
            <span>2. PROSPETTIVE DI INTERVENTO</span>
          </button>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* VISTA SCHEDE (CARD VIEW) */}
      {/* ========================================================================= */}
      {viewMode === 'cards' && (
        <div className="space-y-12">
          {/* --------------------------------------------------------------------- */}
          {/* SEZIONE 1: ANALISI DI CONTESTO (DIMENSIONI E INDICATORI DI CONTESTO) */}
          {/* --------------------------------------------------------------------- */}
          {macroSection === 'context' && (
            <div className="space-y-6">
              {/* Header Sezione 1 con filtri Dimensioni integrati */}
              {renderContextBanner()}

              {filteredContextSections.length === 0 ? (
                <div className="text-center py-8 bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 text-zinc-500 text-xs">
                  Nessuna dimensione di contesto corrispondente ai filtri.
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-6">
                  {filteredContextSections.map((sec) => (
                    <div
                      key={sec.id}
                      className="rounded-2xl border-2 border-purple-200 dark:border-purple-800/80 bg-white dark:bg-zinc-900 shadow-sm overflow-hidden"
                    >
                      {/* Dimension Card Header */}
                      <div className="bg-purple-50/90 dark:bg-purple-950/40 p-5 sm:p-6 border-b border-purple-200 dark:border-purple-800/80 space-y-2">
                        <div className="flex items-center justify-between gap-2 flex-wrap">
                          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-purple-700 text-white text-xs font-extrabold uppercase tracking-wide">
                            <Layers className="h-3.5 w-3.5" />
                            <span>Dimensione {sec.number}</span>
                          </span>
                          <span className="text-xs font-bold text-purple-800 dark:text-purple-300">
                            {sec.contextIndicators.length} Indicatori Diagnostici
                          </span>
                        </div>
                        <h4 className="text-lg sm:text-xl font-black text-purple-950 dark:text-purple-100">
                          {sec.title}
                        </h4>
                        <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-300 leading-relaxed">
                          {sec.description}
                        </p>
                      </div>

                      {/* Context Indicators Grid */}
                      <div className="p-5 sm:p-6 bg-white dark:bg-zinc-900">
                        <div className="text-xs font-extrabold uppercase tracking-wider text-purple-900 dark:text-purple-300 mb-4 flex items-center gap-1.5">
                          <Info className="h-4 w-4 text-purple-700 dark:text-purple-400" />
                          <span>Indicatori di Contesto associati alla Dimensione:</span>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                          {sec.contextIndicators.map((ctx) => (
                            <div
                              key={ctx.code}
                              className="flex flex-col justify-between p-4 rounded-xl border border-purple-200 dark:border-purple-800/70 bg-purple-50/30 dark:bg-purple-950/20 hover:border-purple-400 dark:hover:border-purple-600 transition-all space-y-3"
                            >
                              <div className="space-y-2">
                                <div className="flex items-center justify-between gap-2">
                                  <span className="text-xs font-mono font-extrabold px-2 py-0.5 rounded bg-purple-200 dark:bg-purple-900 text-purple-950 dark:text-purple-100 border border-purple-300 dark:border-purple-700">
                                    {ctx.code}
                                  </span>
                                  <span className="text-[11px] font-semibold text-zinc-500 dark:text-zinc-400">
                                    Unità: {ctx.unit}
                                  </span>
                                </div>

                                <h5 className="text-xs sm:text-sm font-bold text-zinc-900 dark:text-zinc-100 leading-snug">
                                  {ctx.name}
                                </h5>

                                <p className="text-[11px] text-zinc-600 dark:text-zinc-400 leading-relaxed line-clamp-3">
                                  {ctx.description}
                                </p>

                                <div className="pt-1.5 border-t border-purple-100 dark:border-purple-900/60 text-[10px] text-zinc-500 dark:text-zinc-400 font-mono">
                                  <strong>Formula:</strong> {ctx.formulaDisplay}
                                </div>
                              </div>

                              <div className="pt-2 flex items-center justify-between gap-2 border-t border-purple-100 dark:border-purple-900/60">
                                <span className="text-[10px] font-medium text-zinc-500 dark:text-zinc-400 italic">
                                  Target: Impostabile dall&apos;utente
                                </span>
                                <button
                                  onClick={() => onSelectIndicatorForCalculation(ctx.code)}
                                  className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-lg bg-purple-700 text-white hover:bg-purple-800 transition-colors shadow-xs ml-auto"
                                >
                                  <Calculator className="h-3.5 w-3.5" />
                                  <span>Calcola</span>
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* --------------------------------------------------------------------- */}
          {/* SEZIONE 2: PROSPETTIVE DI INTERVENTO (DIREZIONI E INDICATORI DI OUTPUT) */}
          {/* --------------------------------------------------------------------- */}
          {macroSection === 'intervention' && (
            <div className="space-y-6">
              {/* Header Sezione 2 con filtri Direzioni integrati */}
              {renderInterventionBanner()}

              {filteredInterventionPerspectives.length === 0 ? (
                <div className="text-center py-8 bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 text-zinc-500 text-xs">
                  Nessuna prospettiva di intervento corrispondente ai filtri.
                </div>
              ) : (
                <div className="space-y-8">
                  {filteredInterventionPerspectives.map((persp) => (
                    <div
                      key={persp.id}
                      className="rounded-2xl border-2 border-emerald-200 dark:border-emerald-800/80 bg-white dark:bg-zinc-900 shadow-sm overflow-hidden space-y-5"
                    >
                      {/* Direction Card Header */}
                      <div className="bg-emerald-50/90 dark:bg-emerald-950/40 p-5 sm:p-6 border-b border-emerald-200 dark:border-emerald-800/80 space-y-2.5">
                        <div className="flex items-center justify-between gap-2 flex-wrap">
                          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-emerald-700 text-white text-xs font-extrabold uppercase tracking-wide">
                            <Compass className="h-3.5 w-3.5" />
                            <span>Direzione {persp.number}</span>
                          </span>
                          <span className="text-xs font-bold text-emerald-800 dark:text-emerald-300">
                            {persp.azioni.length} Azioni Strategiche
                          </span>
                        </div>

                        <h4 className="text-lg sm:text-xl font-black text-emerald-950 dark:text-emerald-100">
                          {persp.title}
                        </h4>

                        <div className="p-2.5 rounded-lg bg-emerald-100/70 dark:bg-emerald-900/40 border border-emerald-200 dark:border-emerald-800 text-xs font-bold text-emerald-950 dark:text-emerald-200">
                          {persp.asseTitle}
                        </div>

                        <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-300 leading-relaxed pt-1">
                          {persp.description}
                        </p>
                      </div>

                      {/* Azioni & Interventi Container */}
                      <div className="p-5 sm:p-6 pt-0 space-y-6">
                        <div className="text-xs font-extrabold uppercase tracking-wider text-emerald-900 dark:text-emerald-300 flex items-center gap-1.5 border-b border-emerald-100 dark:border-emerald-900 pb-2">
                          <Zap className="h-4 w-4 text-emerald-700 dark:text-emerald-400" />
                          <span>Azioni Operative, Interventi Specifici &amp; Indicatori di Output:</span>
                        </div>

                        <div className="space-y-6">
                          {persp.azioni.map((az) => (
                            <div
                              key={az.id}
                              className="rounded-xl border border-emerald-200 dark:border-emerald-800/80 bg-zinc-50/70 dark:bg-zinc-950/50 p-4 sm:p-5 space-y-4 shadow-2xs"
                            >
                              {/* Azione Header */}
                              <div className="flex items-start gap-2.5">
                                <span className="p-1 px-2.5 rounded bg-emerald-200 dark:bg-emerald-900 text-emerald-950 dark:text-emerald-100 text-xs font-mono font-extrabold shrink-0 mt-0.5">
                                  Azione {az.code}
                                </span>
                                <h5 className="text-sm sm:text-base font-bold text-zinc-900 dark:text-zinc-100 leading-snug">
                                  {az.title}
                                </h5>
                              </div>

                              {/* Interventi Specifici */}
                              <div className="space-y-4 pl-1 sm:pl-3">
                                {az.interventi.map((int) => (
                                  <div
                                    key={int.id}
                                    className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-4 space-y-3 shadow-2xs"
                                  >
                                    <div className="flex items-center gap-2 font-bold text-xs sm:text-sm text-zinc-800 dark:text-zinc-200">
                                      <ListTree className="h-4 w-4 text-emerald-700 dark:text-emerald-400 shrink-0" />
                                      <span>{int.title}</span>
                                    </div>

                                    {/* Indicatori di Output */}
                                    <div className="space-y-2 pt-1">
                                      <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-900 dark:text-emerald-300 block">
                                        Indicatori di Output correlati:
                                      </span>

                                      <div className="grid grid-cols-1 gap-2.5">
                                        {int.outputIndicators.map((out) => (
                                          <div
                                            key={out.code}
                                            className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 rounded-lg bg-emerald-50/70 dark:bg-emerald-950/40 border border-emerald-200/80 dark:border-emerald-800 hover:bg-emerald-100/70 transition-all"
                                          >
                                            <div className="space-y-1">
                                              <div className="flex items-center gap-2 flex-wrap">
                                                <span className="text-xs font-extrabold text-emerald-950 dark:text-emerald-100 px-2.5 py-1 rounded-md bg-emerald-200/90 dark:bg-emerald-900/90 border border-emerald-300 dark:border-emerald-800 inline-block leading-snug">
                                                  {out.name}
                                                </span>
                                                <span className="text-[11px] font-semibold text-zinc-500 dark:text-zinc-400">
                                                  Unità: {out.unit}
                                                </span>
                                              </div>
                                              <p className="text-xs text-zinc-600 dark:text-zinc-400 pl-0.5 mt-0.5">
                                                {out.description}
                                              </p>
                                              <div className="text-[10px] text-zinc-500 font-mono pl-0.5">
                                                <strong>Formula:</strong> {out.formulaDisplay}
                                              </div>
                                            </div>

                                            <button
                                              onClick={() => onSelectIndicatorForCalculation(out.code)}
                                              className="inline-flex items-center justify-center gap-1.5 px-3.5 py-1.5 text-xs font-bold rounded-lg bg-emerald-700 text-white hover:bg-emerald-800 transition-colors shadow-xs self-start sm:self-center whitespace-nowrap shrink-0"
                                            >
                                              <Calculator className="h-3.5 w-3.5" />
                                              <span>Calcola Indicatore</span>
                                            </button>
                                          </div>
                                        ))}
                                      </div>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* ========================================================================= */}
      {/* VISTA TABELLA (TABLE VIEW) */}
      {/* ========================================================================= */}
      {viewMode === 'grid' && (
        <div className="space-y-10">
          {/* TABELLA 1: ANALISI DI CONTESTO */}
          {macroSection === 'context' && (
            <div className="space-y-4">
              {renderContextBanner()}

              <div className="overflow-x-auto rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-sm">
                <table className="w-full text-left text-xs border-collapse">
                  <thead className="bg-purple-50 dark:bg-purple-950/40 text-purple-950 dark:text-purple-200 font-extrabold uppercase border-b border-purple-200 dark:border-purple-800">
                    <tr>
                      <th className="p-3.5 border-r border-zinc-200 dark:border-zinc-700 min-w-[200px]">
                        DIMENSIONE DI ANALISI
                      </th>
                      <th className="p-3.5 border-r border-zinc-200 dark:border-zinc-700 min-w-[90px]">
                        CODICE
                      </th>
                      <th className="p-3.5 border-r border-zinc-200 dark:border-zinc-700 min-w-[240px]">
                        INDICATORE DI CONTESTO
                      </th>
                      <th className="p-3.5 border-r border-zinc-200 dark:border-zinc-700 min-w-[100px]">
                        UNITÀ
                      </th>
                      <th className="p-3.5 border-r border-zinc-200 dark:border-zinc-700 min-w-[260px]">
                        FORMULA / METODO
                      </th>
                      <th className="p-3.5 border-r border-zinc-200 dark:border-zinc-700 min-w-[130px]">
                        TARGET
                      </th>
                      <th className="p-3.5 text-center min-w-[100px]">AZIONE</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800">
                    {filteredContextSections.flatMap((sec) => {
                      const totalRows = sec.contextIndicators.length;
                      return sec.contextIndicators.map((ctx, idx) => (
                        <tr
                          key={ctx.code}
                          className="hover:bg-purple-50/40 dark:hover:bg-purple-950/20 transition-colors"
                        >
                          {idx === 0 && (
                            <td
                              rowSpan={totalRows}
                              className="p-3.5 align-top font-bold border-r border-zinc-200 dark:border-zinc-800 bg-purple-50/20 dark:bg-purple-950/10"
                            >
                              <div className="space-y-1 sticky top-16">
                                <span className="text-[10px] font-extrabold uppercase tracking-wider text-purple-700 dark:text-purple-300 block">
                                  Dimensione {sec.number}
                                </span>
                                <div className="text-xs font-bold text-zinc-900 dark:text-zinc-100">
                                  {sec.title.replace(`Dimensione ${sec.number}: `, '')}
                                </div>
                              </div>
                            </td>
                          )}
                          <td className="p-3.5 align-top border-r border-zinc-200 dark:border-zinc-800 font-mono font-bold text-purple-700 dark:text-purple-300">
                            {ctx.code}
                          </td>
                          <td className="p-3.5 align-top border-r border-zinc-200 dark:border-zinc-800">
                            <div className="space-y-1">
                              <span className="font-bold text-zinc-900 dark:text-zinc-100 block">
                                {ctx.name}
                              </span>
                              <p className="text-[11px] text-zinc-500 dark:text-zinc-400">
                                {ctx.description}
                              </p>
                            </div>
                          </td>
                          <td className="p-3.5 align-top border-r border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400">
                            {ctx.unit}
                          </td>
                          <td className="p-3.5 align-top border-r border-zinc-200 dark:border-zinc-800 font-mono text-[11px] text-zinc-600 dark:text-zinc-400">
                            {ctx.formulaDisplay}
                          </td>
                          <td className="p-3.5 align-top border-r border-zinc-200 dark:border-zinc-800 text-[11px] font-medium text-zinc-500 dark:text-zinc-400 italic">
                            Impostabile dall&apos;utente
                          </td>
                          <td className="p-3.5 align-top text-center">
                            <button
                              onClick={() => onSelectIndicatorForCalculation(ctx.code)}
                              className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-bold rounded-lg bg-purple-700 text-white hover:bg-purple-800 transition-colors shadow-2xs"
                            >
                              <Calculator className="h-3 w-3" />
                              <span>Calcola</span>
                            </button>
                          </td>
                        </tr>
                      ));
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TABELLA 2: PROSPETTIVE DI INTERVENTO */}
          {macroSection === 'intervention' && (
            <div className="space-y-4">
              {renderInterventionBanner()}

              <div className="overflow-x-auto rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-sm">
                <table className="w-full text-left text-xs border-collapse">
                  <thead className="bg-emerald-50 dark:bg-emerald-950/40 text-emerald-950 dark:text-emerald-200 font-extrabold uppercase border-b border-emerald-200 dark:border-emerald-800">
                    <tr>
                      <th className="p-3.5 border-r border-zinc-200 dark:border-zinc-700 min-w-[200px]">
                        DIREZIONE STRATEGICA &amp; ASSE
                      </th>
                      <th className="p-3.5 border-r border-zinc-200 dark:border-zinc-700 min-w-[180px]">
                        AZIONE PRINCIPALE
                      </th>
                      <th className="p-3.5 border-r border-zinc-200 dark:border-zinc-700 min-w-[200px]">
                        INTERVENTO SPECIFICO
                      </th>
                      <th className="p-3.5 border-r border-zinc-200 dark:border-zinc-700 min-w-[220px]">
                        INDICATORE DI OUTPUT
                      </th>
                      <th className="p-3.5 border-r border-zinc-200 dark:border-zinc-700 min-w-[90px]">
                        UNITÀ
                      </th>
                      <th className="p-3.5 text-center min-w-[100px]">AZIONE</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800">
                    {filteredInterventionPerspectives.flatMap((persp) => {
                      const dirTotalRows = persp.azioni.reduce(
                        (acc, az) =>
                          acc +
                          az.interventi.reduce(
                            (intAcc, int) => intAcc + Math.max(1, int.outputIndicators.length),
                            0
                          ),
                        0
                      );

                      let dirRowIndex = 0;

                      return persp.azioni.flatMap((az) => {
                        const azTotalRows = az.interventi.reduce(
                          (intAcc, int) => intAcc + Math.max(1, int.outputIndicators.length),
                          0
                        );

                        let azRowIndex = 0;

                        return az.interventi.flatMap((int) => {
                          const intTotalRows = Math.max(1, int.outputIndicators.length);

                          return int.outputIndicators.map((out, outIdx) => {
                            const isFirstRowOfDir = dirRowIndex === 0;
                            const isFirstRowOfAz = azRowIndex === 0;
                            const isFirstRowOfInt = outIdx === 0;

                            dirRowIndex++;
                            azRowIndex++;

                            return (
                              <tr
                                key={`${persp.id}-${az.id}-${int.id}-${out.code}`}
                                className="hover:bg-emerald-50/40 dark:hover:bg-emerald-950/20 transition-colors"
                              >
                                {isFirstRowOfDir && (
                                  <td
                                    rowSpan={dirTotalRows}
                                    className="p-3.5 align-top font-bold border-r border-zinc-200 dark:border-zinc-800 bg-emerald-50/20 dark:bg-emerald-950/10"
                                  >
                                    <div className="space-y-2 sticky top-16">
                                      <span className="text-[10px] font-extrabold uppercase tracking-wider text-emerald-700 dark:text-emerald-300 block">
                                        Direzione {persp.number}
                                      </span>
                                      <div className="text-xs font-bold text-zinc-900 dark:text-zinc-100">
                                        {persp.title.replace(`Direzione ${persp.number}: `, '')}
                                      </div>
                                      <div className="text-[11px] text-zinc-500 dark:text-zinc-400 font-medium pt-1 border-t border-emerald-100 dark:border-emerald-900">
                                        {persp.asseTitle}
                                      </div>
                                    </div>
                                  </td>
                                )}

                                {isFirstRowOfAz && (
                                  <td
                                    rowSpan={azTotalRows}
                                    className="p-3.5 align-top border-r border-zinc-200 dark:border-zinc-800 bg-zinc-50/30 dark:bg-zinc-900/30"
                                  >
                                    <div className="space-y-1 sticky top-16">
                                      <span className="text-[10px] font-mono font-bold text-emerald-800 dark:text-emerald-300 block">
                                        Azione {az.code}
                                      </span>
                                      <div className="font-bold text-zinc-900 dark:text-zinc-100 text-xs">
                                        {az.title}
                                      </div>
                                    </div>
                                  </td>
                                )}

                                {isFirstRowOfInt && (
                                  <td
                                    rowSpan={intTotalRows}
                                    className="p-3.5 align-top border-r border-zinc-200 dark:border-zinc-800"
                                  >
                                    <div className="font-medium text-zinc-800 dark:text-zinc-200 text-xs">
                                      {int.title}
                                    </div>
                                  </td>
                                )}

                                <td className="p-3.5 align-top border-r border-zinc-200 dark:border-zinc-800">
                                  <div className="space-y-1">
                                    <div className="font-bold text-emerald-950 dark:text-emerald-100 text-xs">
                                      {out.name}
                                    </div>
                                    <p className="text-[11px] text-zinc-500 dark:text-zinc-400">
                                      {out.description}
                                    </p>
                                  </div>
                                </td>

                                <td className="p-3.5 align-top border-r border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400 font-medium">
                                  {out.unit}
                                </td>

                                <td className="p-3.5 align-top text-center">
                                  <button
                                    onClick={() => onSelectIndicatorForCalculation(out.code)}
                                    className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-bold rounded-lg bg-emerald-700 text-white hover:bg-emerald-800 transition-colors shadow-2xs"
                                  >
                                    <Calculator className="h-3 w-3" />
                                    <span>Calcola</span>
                                  </button>
                                </td>
                              </tr>
                            );
                          });
                        });
                      });
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
