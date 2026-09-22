import React, { useState, useEffect } from 'react';
import { ShieldAlert, CheckCircle2, ExternalLink, Edit3, ShieldCheck, RefreshCw, Lock } from 'lucide-react';

interface InteractiveMapEmbedProps {
  embedUrl: string;
  mapTitle: string;
  sourceLabel: string;
  externalUrl: string;
  actionTitle: string;
  icon: React.ReactNode;
}

export const InteractiveMapEmbed: React.FC<InteractiveMapEmbedProps> = ({
  embedUrl,
  mapTitle,
  sourceLabel,
  externalUrl,
  actionTitle,
  icon,
}) => {
  const [isAuthorized, setIsAuthorized] = useState<boolean>(() => {
    try {
      return localStorage.getItem('map_external_consent') === 'true';
    } catch {
      return false;
    }
  });

  const handleAuthorize = () => {
    try {
      localStorage.setItem('map_external_consent', 'true');
    } catch {
      // localStorage may fail in restricted sandboxes
    }
    setIsAuthorized(true);
  };

  const handleRevoke = () => {
    try {
      localStorage.removeItem('map_external_consent');
    } catch {
      // ignore
    }
    setIsAuthorized(false);
  };

  return (
    <div className="mt-4 pt-4 border-t border-purple-200/80 dark:border-purple-900/50 space-y-3">
      {/* Intestazione Sezione Mappa */}
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          {icon}
          <span className="text-sm font-bold text-zinc-900 dark:text-zinc-100">
            {actionTitle}
          </span>
        </div>

        <div className="flex items-center gap-2">
          {isAuthorized && (
            <button
              type="button"
              onClick={handleRevoke}
              className="inline-flex items-center gap-1 px-2.5 py-1 text-[11px] font-medium text-zinc-500 hover:text-zinc-800 dark:text-zinc-400 dark:hover:text-zinc-200 bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 rounded-lg transition-colors cursor-pointer"
              title="Revoca il consenso al caricamento delle mappe esterne"
            >
              <Lock className="h-3 w-3" />
              <span>Revoca autorizzazione</span>
            </button>
          )}

          <a
            href={externalUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-lg bg-purple-700 hover:bg-purple-800 text-white transition-all shadow-xs hover:shadow cursor-pointer"
            title="Apri ed edita la mappa su uMap in una nuova scheda"
          >
            <Edit3 className="h-3.5 w-3.5" />
            <span>Apri ed edita su uMap</span>
            <ExternalLink className="h-3 w-3 ml-0.5" />
          </a>
        </div>
      </div>

      {/* Finestra con anteprima mappa uMap */}
      <div className="rounded-xl overflow-hidden border border-purple-200 dark:border-purple-800 bg-white dark:bg-zinc-900 shadow-sm">
        {/* Header informativo della finestra */}
        <div className="flex flex-wrap items-center justify-between gap-2 px-3.5 py-2.5 bg-purple-50/90 dark:bg-purple-950/70 border-b border-purple-200 dark:border-purple-800">
          <div className="flex items-center gap-2 text-xs font-medium text-purple-900 dark:text-purple-200">
            <span className={`inline-block w-2 h-2 rounded-full ${isAuthorized ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500'}`} />
            <span className="font-semibold">uMap Anteprima:</span>
            <span className="text-purple-700 dark:text-purple-300">
              {mapTitle} ({sourceLabel})
            </span>
          </div>

          <div className="flex items-center gap-2">
            {isAuthorized ? (
              <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 dark:text-emerald-300 bg-emerald-100 dark:bg-emerald-950/60 px-2 py-0.5 rounded-md border border-emerald-200 dark:border-emerald-800">
                <ShieldCheck className="h-3 w-3" />
                Cartografia autorizzata
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-amber-800 dark:text-amber-300 bg-amber-100 dark:bg-amber-950/60 px-2 py-0.5 rounded-md border border-amber-200 dark:border-amber-800">
                <ShieldAlert className="h-3 w-3" />
                Consenso preventivo attivo
              </span>
            )}
          </div>
        </div>

        {/* Box Contenitore Iframe con Blocco di Consenso Preventivo */}
        <div className="relative w-full h-[480px] bg-zinc-100 dark:bg-zinc-950 overflow-hidden">
          {/* Mappa Reale (visibile in trasparenza sottostante a ~90% se non autorizzata, interattiva al 100% se autorizzata) */}
          <iframe
            src={embedUrl}
            title={mapTitle}
            className={`w-full h-full border-0 transition-opacity duration-300 ${
              isAuthorized ? 'opacity-100 pointer-events-auto' : 'opacity-90 pointer-events-none'
            }`}
            allow="geolocation"
            loading="lazy"
          />

          {/* Overlay di Blocco Preventivo Privacy (se non ancora autorizzata) */}
          {!isAuthorized && (
            <div className="absolute inset-0 z-20 flex items-center justify-center p-4 bg-zinc-900/25 backdrop-blur-[1px]">
              <div className="w-full max-w-lg rounded-2xl bg-white/95 dark:bg-zinc-900/95 backdrop-blur-md p-5 sm:p-6 shadow-2xl border border-zinc-200/90 dark:border-zinc-800 text-center space-y-4 animate-in fade-in zoom-in-95">
                <div className="mx-auto w-12 h-12 rounded-2xl bg-purple-100 dark:bg-purple-950/70 text-purple-700 dark:text-purple-300 flex items-center justify-center shadow-xs">
                  <ShieldAlert className="h-6 w-6" />
                </div>

                <div className="space-y-1.5">
                  <h4 className="text-sm sm:text-base font-bold text-zinc-900 dark:text-zinc-100 leading-snug">
                    Tutela della riservatezza: la mappa interattiva richiede il caricamento di cartografia da OpenStreetMap/uMap.
                  </h4>
                  <p className="text-xs text-zinc-600 dark:text-zinc-300 leading-relaxed max-w-md mx-auto">
                    In conformità con le linee guida per la Pubblica Amministrazione e la riservatezza dell&apos;utente, il caricamento di risorse esterne avviene solo su tua esplicita richiesta.
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row items-center justify-center gap-2.5 pt-1">
                  <button
                    type="button"
                    onClick={handleAuthorize}
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-2.5 text-xs font-bold rounded-xl bg-purple-700 hover:bg-purple-800 text-white shadow-sm shadow-purple-700/25 transition-all cursor-pointer"
                  >
                    <CheckCircle2 className="h-4 w-4" />
                    <span>Autorizza e Carica Mappa</span>
                  </button>

                  <a
                    href={externalUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-4 py-2.5 text-xs font-semibold rounded-xl bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-zinc-800 dark:text-zinc-200 transition-colors cursor-pointer"
                  >
                    <ExternalLink className="h-3.5 w-3.5" />
                    <span>Apri su uMap</span>
                  </a>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
