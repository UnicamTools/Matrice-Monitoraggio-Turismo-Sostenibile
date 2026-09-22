import React, { useState, useEffect } from 'react';
import { Shield, ShieldCheck, X, FileText, CheckCircle2, Lock, Database, Globe, Info, ExternalLink } from 'lucide-react';

interface PrivacyBannerAndModalProps {
  isModalOpen: boolean;
  setIsModalOpen: (open: boolean) => void;
}

export const PrivacyBannerAndModal: React.FC<PrivacyBannerAndModalProps> = ({
  isModalOpen,
  setIsModalOpen,
}) => {
  const [hasAcknowledged, setHasAcknowledged] = useState<boolean>(true);

  // Check acknowledgement status on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem('privacy_acknowledged');
      if (stored !== 'true') {
        setHasAcknowledged(false);
      }
    } catch {
      setHasAcknowledged(false);
    }
  }, []);

  const handleAcknowledge = () => {
    try {
      localStorage.setItem('privacy_acknowledged', 'true');
    } catch {
      // localStorage may be disabled
    }
    setHasAcknowledged(true);
  };

  return (
    <>
      {/* Banner discreto in basso al primo accesso */}
      {!hasAcknowledged && (
        <div
          id="privacy-cookie-banner"
          className="fixed bottom-0 inset-x-0 z-50 p-3 sm:p-4 bg-white/95 dark:bg-zinc-900/95 backdrop-blur-md border-t border-zinc-200 dark:border-zinc-800 shadow-2xl transition-all duration-300 animate-in fade-in slide-in-from-bottom-4"
          role="region"
          aria-label="Informativa sulla riservatezza e privacy"
        >
          <div className="mx-auto max-w-7xl flex flex-col md:flex-row md:items-center justify-between gap-3 sm:gap-4">
            <div className="flex items-start gap-3">
              <div className="h-9 w-9 rounded-xl bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 flex items-center justify-center shrink-0 mt-0.5">
                <ShieldCheck className="h-5 w-5" />
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <h4 className="text-xs sm:text-sm font-bold text-zinc-900 dark:text-zinc-100">
                    Trasparenza & Tutela della Riservatezza (Conforme PA & GDPR)
                  </h4>
                  <span className="hidden sm:inline-block text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950/70 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                    No Cookie Profilanti
                  </span>
                </div>
                <p className="text-xs text-zinc-600 dark:text-zinc-300 leading-relaxed max-w-4xl">
                  Questo applicativo istituzionale opera con approccio <em>Privacy-by-Design</em>: <strong>non utilizza cookie di profilazione</strong> né tracciamento pubblicitario. Tutti i dati, i calcoli e le simulazioni rimangono memorizzati esclusivamente in locale sul tuo browser. Le mappe interattive esterne sono protette da consenso preventivo.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0 self-end md:self-center pt-1 md:pt-0">
              <button
                type="button"
                id="btn-privacy-more-info"
                onClick={() => setIsModalOpen(true)}
                className="px-3.5 py-2 text-xs font-semibold text-zinc-700 hover:text-zinc-900 dark:text-zinc-300 dark:hover:text-zinc-100 bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 rounded-xl transition-colors cursor-pointer flex items-center gap-1.5"
              >
                <FileText className="h-3.5 w-3.5" />
                <span>Informativa Estesa</span>
              </button>
              <button
                type="button"
                id="btn-privacy-acknowledge"
                onClick={handleAcknowledge}
                className="px-4 py-2 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl shadow-xs shadow-emerald-600/20 transition-all cursor-pointer flex items-center gap-1.5"
              >
                <CheckCircle2 className="h-4 w-4" />
                <span>Ho compreso</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Informativa Privacy Estesa */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 overflow-y-auto">
          <div className="w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-2xl bg-white dark:bg-zinc-900 p-6 sm:p-8 shadow-2xl border border-zinc-200 dark:border-zinc-800 space-y-6 animate-in fade-in zoom-in-95 duration-150">
            {/* Header del Modal */}
            <div className="flex items-start justify-between border-b border-zinc-200 dark:border-zinc-800 pb-4">
              <div className="flex items-center gap-3">
                <div className="h-11 w-11 rounded-xl bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 flex items-center justify-center shrink-0">
                  <Shield className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-100">
                    Informativa Privacy, Trattamento Dati & Risorse Esterne
                  </h3>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
                    Progetto di Ricerca & Monitoraggio Turismo Sostenibile — UNICAM & Comuni di Montecassiano, Montefano, Montelupone
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="rounded-lg p-1.5 text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-600 dark:text-zinc-300 cursor-pointer transition-colors"
                title="Chiudi informativa"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Contenuto dell'Informativa */}
            <div className="space-y-4 text-xs sm:text-sm text-zinc-600 dark:text-zinc-300 leading-relaxed">
              {/* Box 1: Privacy by Design & Zero Profilazione */}
              <div className="p-4 rounded-xl bg-emerald-50/70 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-900/50 space-y-1.5">
                <div className="flex items-center gap-2 text-emerald-950 dark:text-emerald-100 font-bold text-sm">
                  <Lock className="h-4 w-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                  <h4>1. Assenza di Cookie di Profilazione & Tracciamento (GDPR Reg. UE 2016/679)</h4>
                </div>
                <p className="text-xs text-zinc-600 dark:text-zinc-300">
                  La presente piattaforma informatica istituzionale <strong>non impiega cookie di profilazione</strong>, né identificatori commerciali o tracker di terze parti per finalità di marketing o profilazione dell&apos;utenza. La navigazione è interamente anonima e non richiede registrazione o conferimento di dati anagrafici personali.
                </p>
              </div>

              {/* Box 2: Archiviazione Locale */}
              <div className="p-4 rounded-xl bg-zinc-50 dark:bg-zinc-800/40 border border-zinc-200 dark:border-zinc-800 space-y-1.5">
                <div className="flex items-center gap-2 text-zinc-900 dark:text-zinc-100 font-bold text-sm">
                  <Database className="h-4 w-4 text-purple-600 dark:text-purple-400 shrink-0" />
                  <h4>2. Archiviazione Locale dei Dati (Local Storage sul Dispositivo Utente)</h4>
                </div>
                <p className="text-xs text-zinc-600 dark:text-zinc-300">
                  Tutte le operazioni analitiche, l&apos;inserimento di parametri, la modifica di indicatori e i calcoli delle serie storiche (2023–2027) sono elaborati dal motore matematico integrato ed archiviati <strong>esclusivamente nella memoria locale del tuo browser</strong> (<code className="font-mono text-[11px] bg-zinc-200 dark:bg-zinc-700 px-1 py-0.5 rounded">localStorage</code>). Nessun dato inserito viene trasmesso o registrato su server remoti non autorizzati. Tramite la scheda <em>&quot;Gestione Dati & Report&quot;</em> l&apos;utente può in ogni momento esportare copie di backup in JSON o CSV, oppure azzerare e ripristinare il dataset di base.
                </p>
              </div>

              {/* Box 3: Risorse Esterne & Cartografia uMap/OpenStreetMap */}
              <div className="p-4 rounded-xl bg-purple-50/70 dark:bg-purple-950/30 border border-purple-200 dark:border-purple-900/50 space-y-1.5">
                <div className="flex items-center gap-2 text-purple-950 dark:text-purple-100 font-bold text-sm">
                  <Globe className="h-4 w-4 text-purple-600 dark:text-purple-400 shrink-0" />
                  <h4>3. Tutela della Riservatezza & Cartografia Esterna (OpenStreetMap / uMap)</h4>
                </div>
                <p className="text-xs text-zinc-600 dark:text-zinc-300">
                  L&apos;applicazione integra facoltativamente cartografie territoriali collaborative per la consultazione e il tracciamento della rete cicloturistica, delle strutture ricettive e delle colonnine di ricarica. In ossequio alle linee guida della Pubblica Amministrazione sul caricamento di risorse terze, <strong>le mappe interattive uMap / OpenStreetMap sono protette da un blocco di consenso preventivo</strong>. Le tessere cartografiche vengono caricate e stabiliscono una connessione con i server OpenStreetMap solo previo consenso esplicito dell&apos;operatore. L&apos;utente può inoltre consultare le mappe direttamente sul portale uMap in una finestra separata.
                </p>
              </div>

              {/* Box 4: Riferimenti Istituzionali */}
              <div className="p-3.5 rounded-xl bg-amber-50/70 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/50 space-y-1 text-xs">
                <div className="flex items-center gap-1.5 font-bold text-amber-950 dark:text-amber-100">
                  <Info className="h-4 w-4 text-amber-600 shrink-0" />
                  <span>Finalità Istituzionali & Scientifiche</span>
                </div>
                <p className="text-zinc-600 dark:text-zinc-300">
                  Lo strumento è destinato ad attività di studio, programmazione turistica e benchmarking amministrativo intercomunale promosso dall&apos;Università di Camerino (UNICAM) in collaborazione con le Giunte e gli Uffici Tecnici dei Comuni di Montecassiano, Montefano e Montelupone.
                </p>
              </div>
            </div>

            {/* Footer Modal */}
            <div className="flex items-center justify-end gap-3 pt-3 border-t border-zinc-200 dark:border-zinc-800">
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="px-5 py-2 text-xs font-bold text-zinc-800 dark:text-zinc-100 bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 rounded-xl transition-colors cursor-pointer"
              >
                Chiudi Informativa
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
