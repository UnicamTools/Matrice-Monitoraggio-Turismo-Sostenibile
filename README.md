# Matrice di Monitoraggio del Turismo Sostenibile
### Comuni di Montecassiano · Montefano · Montelupone

Uno strumento digitale interattivo di supporto decisionale e monitoraggio strategico per valutare, misurare e guidare la transizione verso un turismo sostenibile, responsabile e integrato a livello intercomunale.

---

## 🎯 Obiettivi del Progetto

L'applicazione nasce con lo scopo di:
- **Misurare in modo oggettivo la sostenibilità turistica locale**, integrando parametri demografici, ambientali, ricettivi ed economico-sociali.
- **Supportare la governance pubblica** nella pianificazione strategica e nella verifica dell'efficacia delle azioni intraprese da ciascun Ente.
- **Favorire la sinergia territoriale** tra i borghi di Montecassiano, Montefano e Montelupone attraverso indicatori comparabili e una visione integrata dell'area.
- **Semplificare il calcolo e la gestione dei dati** mediante formule matematiche standardizzate, propagazione automatica delle variabili condivise e generazione istantanea di reportistica tecnica in PDF.

---

## 🏛️ Le 4 Dimensioni di Monitoraggio

La matrice organizza gli indicatori e le relative linee strategiche in quattro pilastri tematici:

1. **Dimensione 1 — Capacità di Attrazione e Flussi Turistici**  
   Analisi dei volumi di arrivi e presenze, permanenza media, tasso di internazionalizzazione e destagionalizzazione dei flussi, orientati al riequilibrio della domanda nei borghi.
2. **Dimensione 2 — Pressione Turistica e Impatto Ambientale**  
   Valutazione del carico antropico (indice di intensità turistica, densità per km²), impronta ecologica, produzione di rifiuti pro capite, consumi idrici/energetici e impatto sui centri storici.
3. **Dimensione 3 — Struttura dell'Offerta Sostenibile e Mobilità Dolce**  
   Censimento delle strutture ricettive certificate, qualità dell'offerta, accessibilità dei luoghi culturali, ciclovie, cammini naturalistici e percorsi a ridotto impatto carbonico.
4. **Dimensione 4 — Resilienza Demografica ed Economica**  
   Monitoraggio della vitalità residenziale (indice di vecchiaia, spopolamento), occupazione generata dalla filiera turistico-culturale, tutela del tessuto commerciale di vicinato e delle botteghe artigiane.

---

## 🚀 Funzionalità Principali

### 1. Esplorazione Gerarchica della Matrice (Matrix Explorer)
- Navigazione strutturata tra **Dimensioni**, **Profili Turistico-Ambientali**, **Linee Strategiche** e **Interventi Specifici**.
- Consultazione di **15 Indicatori di Contesto (CTX)** e dei relativi **Indicatori di Output**, con indicazione di formule di calcolo, unità di misura, fonti dati e note metodologiche.

### 2. Calcolatore Guidato degli Indicatori (Indicator Calculator)
- Inserimento guidato dei parametri di calcolo con riscontro numerico immediato e validazione dei dati.
- **Sincronizzazione intelligente delle variabili condivise**: modificando una variabile di base (es. popolazione residente, arrivi totali, posti letto) per un determinato anno e Comune, il valore viene automaticamente propagato a tutti gli altri indicatori dipendenti.
- Valutazione automatica rispetto a **soglie di target** (*Buono*, *Attenzione*, *Critico*) e gestione dei valori contrassegnati come *"Dato non disponibile (n.d.)"*.

### 3. Dashboard dei Trend e Analisi Storica (Trend Dashboard)
- Visualizzazione grafica dell'evoluzione temporale (serie storica 2023–2027+) per ciascun indicatore.
- Proiezioni e monitoraggio dello scostamento rispetto agli obiettivi di sostenibilità prefissati.
- Possibilità di aggiungere dinamicamente nuove annualità di monitoraggio.

### 4. Confronto Intercomunale (Intermunicipal Comparison)
- Sezione dedicata alla comparazione diretta degli indici tra Montecassiano, Montefano e Montelupone.
- Diagrammi dimensionali per evidenziare punti di forza e aree di miglioramento per ciascun borgo.

### 5. Generazione Report e Gestione Dati
- **Export in formato PDF**: generazione di report completi per singolo Comune o per l'intera aggregazione territoriale, pronti per deliberazioni, atti d'indirizzo e trasparenza amministrativa.
- **Persistenza e Backup**: salvataggio automatico locale (`localStorage`), esportazione/importazione dell'intero dataset in formato JSON/CSV e ripristino dei dati di baseline.
- **Identità visiva dinamica per Ente**: interfaccia adattiva con color-coding tematico dedicato a ciascun Comune (Blu per Montecassiano, Giallo ambra per Montefano, Rosso bordeaux per Montelupone).

---

## 🛠️ Stack Tecnologico

- **Frontend Framework**: React 19 con TypeScript
- **Build Tool**: Vite 6
- **Styling**: Tailwind CSS v4 con supporto Dark/Light mode
- **Data Visualization**: Recharts
- **Generazione Documenti**: jsPDF & jspdf-autotable
- **Iconografia e Animazioni**: Lucide React & Motion

---

## 💻 Sviluppo Locale e Build

```bash
# Installa le dipendenze
npm install

# Avvia l'ambiente di sviluppo locale
npm run dev

# Compila l'applicazione per la produzione (output in ./dist)
npm run build

# Anteprima locale del build di produzione
npm run preview
```

---

## 👥 Enti Coinvolti

- **Comune di Montecassiano**
- **Comune di Montefano**
- **Comune di Montelupone**
