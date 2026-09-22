import React, { useState, useEffect } from 'react';
import { X, Calendar, Plus, AlertCircle, CheckCircle2, ArrowRight } from 'lucide-react';

interface AddYearModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddYear: (year: number) => void;
  availableYears: number[];
}

export const AddYearModal: React.FC<AddYearModalProps> = ({
  isOpen,
  onClose,
  onAddYear,
  availableYears,
}) => {
  const maxExisting = availableYears.length > 0 ? Math.max(...availableYears) : 2027;
  const suggestedNextYear = Math.max(maxExisting + 1, 2028);

  const [inputYear, setInputYear] = useState<number>(suggestedNextYear);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    if (isOpen) {
      const next = Math.max(...availableYears) + 1;
      setInputYear(next);
      setError('');
    }
  }, [isOpen, availableYears]);

  if (!isOpen) return null;

  const quickSuggestions = [
    suggestedNextYear,
    suggestedNextYear + 1,
    suggestedNextYear + 2,
  ].filter((yr) => !availableYears.includes(yr));

  const handleConfirm = () => {
    const yr = Number(inputYear);
    if (!yr || isNaN(yr) || yr < 2000 || yr > 2100) {
      setError("Inserisci un anno valido compreso tra il 2000 e il 2100.");
      return;
    }
    if (availableYears.includes(yr)) {
      setError(`L'anno ${yr} è già presente tra le annualità di monitoraggio.`);
      return;
    }
    setError('');
    onAddYear(yr);
    onClose();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleConfirm();
    } else if (e.key === 'Escape') {
      onClose();
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 overflow-y-auto animate-fade-in"
      onClick={onClose}
    >
      <div
        className="w-full max-w-lg rounded-2xl bg-white dark:bg-zinc-900 p-6 shadow-2xl border border-zinc-200 dark:border-zinc-800 space-y-5"
        onClick={(e) => e.stopPropagation()}
        onKeyDown={handleKeyDown}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-zinc-100 dark:border-zinc-800 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
              <Calendar className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-zinc-900 dark:text-zinc-100">
                Aggiungi Anno di Monitoraggio
              </h3>
              <p className="text-xs text-zinc-500 dark:text-zinc-400">
                Estendi la matrice per la pianificazione e il calcolo degli anni futuri
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-600 dark:text-zinc-300 cursor-pointer transition-colors"
            title="Chiudi"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Existing Years Overview */}
        <div className="space-y-2">
          <span className="text-xs font-bold text-zinc-600 dark:text-zinc-400 block">
            Annualità attualmente attive nel sistema ({availableYears.length}):
          </span>
          <div className="flex flex-wrap items-center gap-1.5">
            {availableYears.map((yr) => (
              <span
                key={yr}
                className="px-2.5 py-1 rounded-lg text-xs font-mono font-bold bg-zinc-100 text-zinc-800 dark:bg-zinc-800 dark:text-zinc-200 border border-zinc-200 dark:border-zinc-700"
              >
                {yr}
              </span>
            ))}
          </div>
        </div>

        {/* Form Input */}
        <div className="space-y-3 pt-2">
          <label className="block text-xs font-bold text-zinc-700 dark:text-zinc-300">
            Anno da inserire:
          </label>
          <div className="relative">
            <input
              type="number"
              min="2000"
              max="2100"
              autoFocus
              value={inputYear || ''}
              onChange={(e) => {
                setInputYear(parseInt(e.target.value, 10));
                setError('');
              }}
              className="w-full text-base font-bold font-mono px-4 py-2.5 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 shadow-xs"
              placeholder="Es. 2028"
            />
            <div className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-semibold text-zinc-400 pointer-events-none">
              Anno solare
            </div>
          </div>

          {/* Quick Suggestions Buttons */}
          {quickSuggestions.length > 0 && (
            <div className="flex items-center gap-2 pt-1 text-xs">
              <span className="text-zinc-500 dark:text-zinc-400">Suggeriti:</span>
              {quickSuggestions.map((yr) => (
                <button
                  key={yr}
                  type="button"
                  onClick={() => {
                    setInputYear(yr);
                    setError('');
                  }}
                  className="px-2.5 py-1 rounded-lg border border-amber-300 dark:border-amber-800 bg-amber-50 dark:bg-amber-950/40 text-amber-900 dark:text-amber-200 font-bold hover:bg-amber-100 transition-colors cursor-pointer"
                >
                  +{yr}
                </button>
              ))}
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="flex items-center gap-2 p-2.5 rounded-lg bg-rose-50 text-rose-800 dark:bg-rose-950/50 dark:text-rose-200 text-xs border border-rose-200 dark:border-rose-900">
              <AlertCircle className="h-4 w-4 shrink-0 text-rose-600" />
              <span>{error}</span>
            </div>
          )}

          <p className="text-[11px] text-zinc-500 dark:text-zinc-400 leading-relaxed">
            L&apos;inserimento del nuovo anno consentirà di selezionarlo nel <strong>Calcolatore Indicatori</strong> per inserire nuovi dati, monitorare il trend temporale e confrontare le prestazioni con le annualità precedenti.
          </p>
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-end gap-2.5 border-t border-zinc-100 dark:border-zinc-800 pt-4">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl border border-zinc-200 dark:border-zinc-700 text-xs font-semibold text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
          >
            Annulla
          </button>
          <button
            type="button"
            onClick={handleConfirm}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs shadow-md shadow-amber-600/20 transition-all cursor-pointer ring-1 ring-amber-500 hover:scale-[1.01]"
          >
            <Plus className="h-4 w-4" />
            <span>Aggiungi e Passa all&apos;Anno {inputYear || ''}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
