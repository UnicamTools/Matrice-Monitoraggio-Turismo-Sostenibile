import React from 'react';
import { X, Table, Calculator, TrendingUp, CheckCircle2, HelpCircle } from 'lucide-react';

interface HelpModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const HelpModal: React.FC<HelpModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="w-full max-w-2xl rounded-2xl bg-white dark:bg-zinc-900 p-6 shadow-2xl border border-zinc-200 dark:border-zinc-800 space-y-5">
        <div className="flex items-center justify-between border-b border-zinc-100 dark:border-zinc-800 pb-3">
          <div className="flex items-center gap-2">
            <HelpCircle className="h-5 w-5 text-amber-600" />
            <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-100">
              Guida all&apos;Uso del Tool di Sostenibilità Turistica
            </h3>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1 text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-600 dark:text-zinc-300 cursor-pointer"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="space-y-4 text-xs sm:text-sm text-zinc-600 dark:text-zinc-300 leading-relaxed">
          <div className="flex items-start gap-3 p-3.5 rounded-xl bg-purple-50/70 dark:bg-purple-950/30 border border-purple-200 dark:border-purple-900/50">
            <Table className="h-5 w-5 text-purple-600 shrink-0 mt-0.5" />
            <div>
              <strong className="text-purple-950 dark:text-purple-100 font-bold block mb-0.5">
                1. Struttura del Cruscotto e Suddivisione Cromatica
              </strong>
              Il cruscotto è organizzato in due macro-sezioni coordinate e rigorosamente differenziate:
              <ul className="mt-1.5 space-y-1.5 text-xs">
                <li className="flex items-start gap-1.5">
                  <span className="h-2 w-2 rounded-full bg-purple-600 shrink-0 mt-1" />
                  <span>
                    <strong className="text-purple-900 dark:text-purple-200">1. Analisi di Contesto (Viola):</strong> Profilo turistico-ambientale articolato in <strong>4 Dimensioni</strong> di analisi e 15 Indicatori di Contesto diagnostici (CTX-1...CTX-15).
                  </span>
                </li>
                <li className="flex items-start gap-1.5">
                  <span className="h-2 w-2 rounded-full bg-emerald-600 shrink-0 mt-1" />
                  <span>
                    <strong className="text-emerald-900 dark:text-emerald-200">2. Prospettive di Intervento (Verde):</strong> Linee strategiche e interventi operativi articolati in <strong>4 Direzioni</strong>, Assi, Azioni, Interventi e Indicatori di Output.
                  </span>
                </li>
              </ul>
            </div>
          </div>

          <div className="flex items-start gap-3 p-3.5 rounded-xl bg-amber-50/70 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/50">
            <Calculator className="h-5 w-5 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <strong className="text-amber-950 dark:text-amber-100 font-bold block mb-0.5">
                2. Calcolo degli Indicatori
              </strong>
              Nel tab <strong>Calcolatore indicatori</strong>, seleziona l&apos;indicatore (contesto o output). Inserisci i valori delle variabili tramite i cursori o i campi numerici, e definisci liberamente il target programmato per l&apos;amministrazione. Il sistema calcolerà istantaneamente il punteggio, l&apos;avanzamento percentuale e lo scostamento. Clicca &ldquo;Salva Rilevazione&rdquo; per registrare il dato per l&apos;anno attivo.
            </div>
          </div>

          <div className="flex items-start gap-3 p-3.5 rounded-xl bg-amber-50/70 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/50">
            <TrendingUp className="h-5 w-5 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <strong className="text-amber-950 dark:text-amber-100 font-bold block mb-0.5">
                3. Monitoraggio e Trend Temporali
              </strong>
              Analizza l&apos;andamento pluriennale con serie storiche, radar chart di equilibrio (4 Dimensioni di contesto / 4 Direzioni di intervento) e tabelle comparative YoY per monitorare l&apos;impatto dei progetti.
            </div>
          </div>

          <div className="flex items-start gap-3 p-3.5 rounded-xl bg-amber-50/70 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/50">
            <CheckCircle2 className="h-5 w-5 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <strong className="text-amber-950 dark:text-amber-100 font-bold block mb-0.5">
                4. Esportazione & Report
              </strong>
              Dalla sezione <strong>Gestione dati & export</strong> è possibile scaricare i dati in JSON/CSV oppure generare e stampare un report sintetico stampabile per la giunta ed i portatori di interesse.
            </div>
          </div>
        </div>

        <div className="flex justify-end pt-2">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs shadow-md shadow-amber-600/20 transition-all cursor-pointer ring-1 ring-amber-500"
          >
            Capito, Inizia
          </button>
        </div>
      </div>
    </div>
  );
};
