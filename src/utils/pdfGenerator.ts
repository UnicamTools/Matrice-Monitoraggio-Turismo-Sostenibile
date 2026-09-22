import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { IndicatorRecord, MunicipalityName } from '../types';
import { DIMENSIONS, CONTEXT_INDICATORS, getAllCalculableIndicators } from '../data/matrixData';

export interface GeneratePdfReportOptions {
  records: IndicatorRecord[];
  selectedYear: number;
  reportScope: 'current' | 'all';
  selectedMunicipality: MunicipalityName;
  availableYears?: number[];
}

interface ChartItemDefinition {
  code: string;
  name: string;
  unit: string;
  level: 'context' | 'output';
  dimensionId?: string;
}

const MUNICIPALITY_COLORS: Record<string, [number, number, number]> = {
  'Comune di Montecassiano': [37, 99, 235], // Blue 600
  'Comune di Montefano': [217, 119, 6], // Amber 600
  'Comune di Montelupone': [220, 38, 38], // Red 600
};

function formatCompactNumber(num: number): string {
  if (Math.abs(num) >= 10000) {
    return `${(num / 1000).toFixed(1)}k`;
  }
  if (Math.abs(num) >= 1000) {
    return `${(num / 1000).toFixed(1)}k`;
  }
  if (Math.round(num) === num) {
    return String(num);
  }
  return num.toFixed(1);
}

export function generatePdfReport({
  records,
  selectedYear,
  reportScope,
  selectedMunicipality,
  availableYears,
}: GeneratePdfReportOptions): void {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const primaryColor = [180, 83, 9]; // Amber 700
  const darkTextColor = [24, 24, 27]; // Zinc 900
  const grayTextColor = [113, 113, 122]; // Zinc 500
  const lightBgColor = [254, 243, 199]; // Amber 100

  // Determine chronological timeline across all available years
  const effectiveYears: number[] = (() => {
    if (availableYears && availableYears.length > 0) {
      return [...availableYears].sort((a, b) => a - b);
    }
    const yearsSet = new Set<number>([2023, 2024, 2025, 2026, 2027]);
    records.forEach((r) => {
      if (r.year && !isNaN(r.year) && r.year >= 2000 && r.year <= 2100) {
        yearsSet.add(r.year);
      }
    });
    return Array.from(yearsSet).sort((a, b) => a - b);
  })();

  const minYear = effectiveYears[0] ?? 2023;
  const maxYear = effectiveYears[effectiveYears.length - 1] ?? 2027;

  const municipalityTitle =
    reportScope === 'all'
      ? 'Territorio Integrato (Montecassiano, Montefano, Montelupone)'
      : selectedMunicipality;

  const municipalList: MunicipalityName[] = [
    'Comune di Montecassiano',
    'Comune di Montefano',
    'Comune di Montelupone',
  ];

  // Helper to extract time series values for an indicator code
  const getIndicatorTimeSeries = (code: string, munName: MunicipalityName) => {
    return effectiveYears.map((yr) => {
      const rec = records.find(
        (r) =>
          r.code === code &&
          r.year === yr &&
          (r.municipality === munName ||
            (!r.municipality && munName === 'Comune di Montecassiano'))
      );
      if (rec && !rec.isNotAvailable && typeof rec.calculatedValue === 'number') {
        return { year: yr, value: rec.calculatedValue, isNotAvailable: false };
      }
      return { year: yr, value: null, isNotAvailable: true };
    });
  };

  // Helper to check if an indicator has ANY non-null measured value in the entire timeline
  const indicatorHasMeasuredData = (code: string): boolean => {
    if (reportScope === 'all') {
      return municipalList.some((m) => {
        const series = getIndicatorTimeSeries(code, m);
        return series.some((s) => s.value !== null && !isNaN(s.value));
      });
    }
    const series = getIndicatorTimeSeries(code, selectedMunicipality);
    return series.some((s) => s.value !== null && !isNaN(s.value));
  };

  // Build the complete list of indicators and filter out those without any measured value across the entire timeline
  const allCalculable = getAllCalculableIndicators();
  const allCandidateCharts: ChartItemDefinition[] = allCalculable.map((c) => ({
    code: c.code,
    name: c.name,
    unit: c.unit || '',
    level: c.level,
    dimensionId: c.dimensionId,
  }));

  const validChartsToRender = allCandidateCharts.filter((c) => indicatorHasMeasuredData(c.code));

  // ==========================================
  // SECTION 1: HEADER & MULTI-PAGE TIME SERIES CHARTS
  // ==========================================

  // Dimensions of chart cards (2 columns x 4 rows = 8 per full page)
  const cardW = 88;
  const cardH = 53;
  const gapX = 6;
  const gapY = 4.5;
  const chartsPerPage = 8; // Uniform: up to 8 charts per page progressively

  // Draw Header for Page 1
  const drawPage1Header = () => {
    // Header Banner
    doc.setFillColor(primaryColor[0], primaryColor[1], primaryColor[2]);
    doc.rect(0, 0, 210, 18, 'F');

    doc.setTextColor(255, 255, 255);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(12);
    doc.text('REPORT DI MONITORAGGIO SOSTENIBILITÀ TURISTICA', 14, 8.5);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7.8);
    doc.text(
      `Matrice Indicatori Borghi Accoglienti — Anno di riferimento: ${selectedYear} (Trend: ${minYear}–${maxYear})`,
      14,
      14
    );

    const genDate = new Date().toLocaleDateString('it-IT', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
    doc.text(`Data: ${genDate}`, 196, 14, { align: 'right' });

    // Subtitle / Scope Box
    doc.setFillColor(lightBgColor[0], lightBgColor[1], lightBgColor[2]);
    doc.roundedRect(14, 21, 182, 12, 2, 2, 'F');

    doc.setTextColor(darkTextColor[0], darkTextColor[1], darkTextColor[2]);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9);
    doc.text(`Ambito Territoriale: ${municipalityTitle}`, 18, 26);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7.5);
    doc.setTextColor(grayTextColor[0], grayTextColor[1], grayTextColor[2]);
    const yearRecords = records.filter((r) => r.year === selectedYear);
    const validRecords = yearRecords.filter((r) => !r.isNotAvailable && r.calculatedValue !== null);
    doc.text(
      `Rilevazioni anno ${selectedYear}: ${yearRecords.length} (Rilevate: ${validRecords.length}, n.d.: ${yearRecords.length - validRecords.length}) • Grafici andamento temporale: ${validChartsToRender.length} indicatori censiti (${minYear}–${maxYear})`,
      18,
      30.5
    );

    // Section Title
    const currentY = 35.5;
    doc.setFillColor(244, 244, 245);
    doc.rect(14, currentY, 182, 6, 'F');
    doc.setTextColor(darkTextColor[0], darkTextColor[1], darkTextColor[2]);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8.5);
    doc.text(
      `ANDAMENTO TEMPORALE INDICATORI CON RILEVAZIONI MISURATE (${minYear}–${maxYear})`,
      16,
      currentY + 4.2
    );

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7.2);
    doc.setTextColor(grayTextColor[0], grayTextColor[1], grayTextColor[2]);
    if (reportScope === 'all') {
      doc.text(
        'Legenda: [Blu] Montecassiano | [Ambra] Montefano | [Rosso] Montelupone',
        194,
        currentY + 4.2,
        { align: 'right' }
      );
    } else {
      const cleanShort = selectedMunicipality.replace('Comune di ', '');
      doc.text(`Andamento temporale: ${cleanShort}`, 194, currentY + 4.2, { align: 'right' });
    }
  };

  const drawPageSubHeader = (sectionTitle: string) => {
    doc.setFillColor(primaryColor[0], primaryColor[1], primaryColor[2]);
    doc.rect(14, 11, 182, 7, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8.8);
    doc.text(sectionTitle, 18, 15.8);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7.2);
    if (reportScope === 'all') {
      doc.text(
        'Legenda: [Blu] Montecassiano | [Ambra] Montefano | [Rosso] Montelupone',
        194,
        15.8,
        { align: 'right' }
      );
    } else {
      doc.text(selectedMunicipality, 194, 15.8, { align: 'right' });
    }
  };

  // Helper to draw a single chart card at given cardX, cardY
  const renderChartCard = (chart: ChartItemDefinition, cardX: number, cardY: number) => {
    // Card border and background
    doc.setFillColor(252, 252, 253);
    doc.setDrawColor(228, 228, 231);
    doc.setLineWidth(0.2);
    doc.roundedRect(cardX, cardY, cardW, cardH, 2, 2, 'FD');

    // Indicator level badge color
    const isContext = chart.level === 'context';

    // Top Dedicated Header Area (Completely outside and above the chart plot)
    doc.setFillColor(isContext ? 250 : 246, isContext ? 245 : 253, isContext ? 255 : 248);
    doc.roundedRect(cardX, cardY, cardW, 12, 2, 2, 'F');
    doc.rect(cardX, cardY + 8, cardW, 4, 'F'); // flatten bottom corners
    doc.setDrawColor(isContext ? 233 : 209, isContext ? 213 : 250, isContext ? 255 : 229);
    doc.setLineWidth(0.2);
    doc.line(cardX, cardY + 12, cardX + cardW, cardY + 12);

    // Line 1: Code badge + Type label + Unit
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(6.5);
    if (isContext) {
      doc.setTextColor(109, 40, 217); // Purple 700
    } else {
      doc.setTextColor(4, 120, 87); // Emerald 700
    }
    doc.text(`[${chart.code}]`, cardX + 3.5, cardY + 3.8);

    const badgeWidth = doc.getTextWidth(`[${chart.code}]`);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(5.2);
    doc.setTextColor(113, 113, 122);
    doc.text(
      isContext ? '• CONTESTO' : '• OUTPUT',
      cardX + 3.5 + badgeWidth + 1.5,
      cardY + 3.8
    );

    if (chart.unit) {
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(5.8);
      doc.setTextColor(100, 100, 110);
      doc.text(`Unità: ${chart.unit}`, cardX + cardW - 3.5, cardY + 3.8, { align: 'right' });
    }

    // Line 2 & 3: Full indicator name (never truncated, wrapped cleanly to 1 or 2 lines)
    const cleanName = chart.name.replace(/^\d+\.\s*/, '').trim();
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(6.2);
    doc.setTextColor(24, 24, 27);
    const titleLines = doc.splitTextToSize(cleanName, cardW - 7);
    if (titleLines.length <= 1) {
      doc.text(titleLines[0] || cleanName, cardX + 3.5, cardY + 8.2);
    } else {
      doc.text(titleLines[0], cardX + 3.5, cardY + 7.2);
      doc.text(titleLines[1], cardX + 3.5, cardY + 10.3);
    }

    // Inner plot area (placed cleanly below the header)
    const plotX = cardX + 11;
    const plotY = cardY + 14.5;
    const plotW = cardW - 14;
    const plotH = 21.5;

    // Gather values across municipalities to compute scale
    const allValues: number[] = [];
    if (reportScope === 'all') {
      municipalList.forEach((m) => {
        const series = getIndicatorTimeSeries(chart.code, m);
        series.forEach((s) => {
          if (s.value !== null && !isNaN(s.value)) allValues.push(s.value);
        });
      });
    } else {
      const series = getIndicatorTimeSeries(chart.code, selectedMunicipality);
      series.forEach((s) => {
        if (s.value !== null && !isNaN(s.value)) allValues.push(s.value);
      });
    }

    let minVal = allValues.length > 0 ? Math.min(...allValues) : 0;
    let maxVal = allValues.length > 0 ? Math.max(...allValues) : 10;
    if (minVal > 0) minVal = 0; // Baseline zero
    if (maxVal === minVal) maxVal = minVal + 10;
    // Add 15% top headroom for labels
    const range = maxVal - minVal;
    maxVal = maxVal + range * 0.15;

    // Horizontal Grid Lines & Y-axis labels
    doc.setDrawColor(238, 238, 242);
    doc.setLineWidth(0.15);
    doc.setLineDashPattern([0.8, 0.8], 0);

    const gridSteps = [0, 0.5, 1];
    gridSteps.forEach((step) => {
      const gy = plotY + plotH - step * plotH;
      doc.line(plotX, gy, plotX + plotW, gy);

      const stepVal = minVal + step * (maxVal - minVal);
      doc.setFontSize(5.2);
      doc.setTextColor(140, 140, 150);
      doc.text(formatCompactNumber(stepVal), plotX - 1.5, gy + 1.2, { align: 'right' });
    });
    doc.setLineDashPattern([], 0); // reset dash

    // X-axis baseline
    doc.setDrawColor(212, 212, 216);
    doc.setLineWidth(0.25);
    doc.line(plotX, plotY + plotH, plotX + plotW, plotY + plotH);

    // X-axis year ticks & labels
    effectiveYears.forEach((yr, yIdx) => {
      const px =
        effectiveYears.length > 1
          ? plotX + (yIdx / (effectiveYears.length - 1)) * plotW
          : plotX + plotW / 2;

      doc.setDrawColor(212, 212, 216);
      doc.line(px, plotY + plotH, px, plotY + plotH + 1);

      doc.setFontSize(5.5);
      doc.setFont('helvetica', yr === selectedYear ? 'bold' : 'normal');
      doc.setTextColor(yr === selectedYear ? 180 : 120, yr === selectedYear ? 83 : 120, yr === selectedYear ? 9 : 130);
      doc.text(String(yr), px, plotY + plotH + 3.2, { align: 'center' });
    });

    // Draw Data Lines & Points
    if (reportScope === 'all') {
      // 3 Series
      municipalList.forEach((m) => {
        const series = getIndicatorTimeSeries(chart.code, m);
        const colRgb = MUNICIPALITY_COLORS[m] || [100, 100, 100];

        // Draw connecting line
        doc.setDrawColor(colRgb[0], colRgb[1], colRgb[2]);
        doc.setLineWidth(0.45);

        let prevPoint: { x: number; y: number } | null = null;
        series.forEach((s, yIdx) => {
          if (s.value === null) {
            prevPoint = null;
            return;
          }
          const px =
            effectiveYears.length > 1
              ? plotX + (yIdx / (effectiveYears.length - 1)) * plotW
              : plotX + plotW / 2;
          const py = plotY + plotH - ((s.value - minVal) / (maxVal - minVal)) * plotH;

          if (prevPoint !== null) {
            doc.line(prevPoint.x, prevPoint.y, px, py);
          }
          prevPoint = { x: px, y: py };
        });

        // Draw dots
        series.forEach((s, yIdx) => {
          if (s.value === null) return;
          const px =
            effectiveYears.length > 1
              ? plotX + (yIdx / (effectiveYears.length - 1)) * plotW
              : plotX + plotW / 2;
          const py = plotY + plotH - ((s.value - minVal) / (maxVal - minVal)) * plotH;

          doc.setFillColor(colRgb[0], colRgb[1], colRgb[2]);
          doc.circle(px, py, 0.75, 'F');
        });
      });
    } else {
      // Single Municipality Series
      const series = getIndicatorTimeSeries(chart.code, selectedMunicipality);
      const colRgb = MUNICIPALITY_COLORS[selectedMunicipality] || primaryColor;

      // Draw connecting line
      doc.setDrawColor(colRgb[0], colRgb[1], colRgb[2]);
      doc.setLineWidth(0.6);

      let prevPoint: { x: number; y: number } | null = null;
      series.forEach((s, yIdx) => {
        if (s.value === null) {
          prevPoint = null;
          return;
        }
        const px =
          effectiveYears.length > 1
            ? plotX + (yIdx / (effectiveYears.length - 1)) * plotW
            : plotX + plotW / 2;
        const py = plotY + plotH - ((s.value - minVal) / (maxVal - minVal)) * plotH;

        if (prevPoint !== null) {
          doc.line(prevPoint.x, prevPoint.y, px, py);
        }
        prevPoint = { x: px, y: py };
      });

      // Draw node dots & value labels
      series.forEach((s, yIdx) => {
        const px =
          effectiveYears.length > 1
            ? plotX + (yIdx / (effectiveYears.length - 1)) * plotW
            : plotX + plotW / 2;

        if (s.value === null) {
          doc.setFontSize(5);
          doc.setTextColor(180, 180, 185);
          doc.text('n.d.', px, plotY + plotH - 1.5, { align: 'center' });
          return;
        }

        const py = plotY + plotH - ((s.value - minVal) / (maxVal - minVal)) * plotH;
        doc.setFillColor(colRgb[0], colRgb[1], colRgb[2]);
        doc.circle(px, py, 1.05, 'F');

        doc.setFontSize(5.5);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(colRgb[0], colRgb[1], colRgb[2]);
        doc.text(formatCompactNumber(s.value), px, py - 1.5, { align: 'center' });
      });
    }

    // Mini Bottom Table: numeric summary
    const tableTopY = cardY + 44.2;
    doc.setDrawColor(240, 240, 244);
    doc.line(cardX + 2, tableTopY, cardX + cardW - 2, tableTopY);

    doc.setFontSize(5.0);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(100, 100, 110);

    if (reportScope === 'all') {
      const recsSelYear = records.filter(
        (r) => r.code === chart.code && r.year === selectedYear
      );
      const getVal = (mun: MunicipalityName) => {
        const rec = recsSelYear.find((r) => r.municipality === mun);
        return rec && !rec.isNotAvailable && rec.calculatedValue !== null
          ? formatCompactNumber(rec.calculatedValue)
          : 'n.d.';
      };
      const textVal = `Valori ${selectedYear} — MC: ${getVal('Comune di Montecassiano')} | MF: ${getVal('Comune di Montefano')} | ML: ${getVal('Comune di Montelupone')}`;
      doc.text(textVal, cardX + cardW / 2, tableTopY + 3.8, { align: 'center' });
    } else {
      const series = getIndicatorTimeSeries(chart.code, selectedMunicipality);
      const valuesRow = series
        .map((s) => `${s.year}: ${s.value !== null ? formatCompactNumber(s.value) : 'n.d.'}`)
        .join('  •  ');
      doc.text(valuesRow, cardX + cardW / 2, tableTopY + 3.8, { align: 'center' });
    }
  };

  // Draw Page 1
  drawPage1Header();

  let chartIdx = 0;
  // First page: render up to chartsPerPage (8 charts) to fill page 1 progressively without holes
  const firstBatch = validChartsToRender.slice(0, chartsPerPage);
  firstBatch.forEach((chart, localIdx) => {
    const col = localIdx % 2;
    const row = Math.floor(localIdx / 2);
    const cardX = 14 + col * (cardW + gapX);
    const cardY = 44 + row * (cardH + gapY);
    renderChartCard(chart, cardX, cardY);
  });
  chartIdx += firstBatch.length;

  // Render subsequent chart pages progressively with up to 8 charts per page
  while (chartIdx < validChartsToRender.length) {
    doc.addPage();
    drawPageSubHeader(
      `QUADRO GRAFICO DI SINTESI — SERIE STORICA MULTIANNUALE (${minYear}–${maxYear})`
    );

    const currentBatch = validChartsToRender.slice(chartIdx, chartIdx + chartsPerPage);
    currentBatch.forEach((chart, localIdx) => {
      const col = localIdx % 2;
      const row = Math.floor(localIdx / 2);
      const cardX = 14 + col * (cardW + gapX);
      const cardY = 22 + row * (cardH + gapY);
      renderChartCard(chart, cardX, cardY);
    });
    chartIdx += currentBatch.length;
  }

  // ==========================================
  // SECTION 2: DETAILED TABULAR MATRIX BY DIMENSION
  // ==========================================
  doc.addPage();
  let currentY = 20;

  // Header on Page for Tabular Breakdown
  doc.setFillColor(primaryColor[0], primaryColor[1], primaryColor[2]);
  doc.rect(14, currentY, 182, 8, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9.5);
  doc.text(
    `DETTAGLIO ANALITICO DELLA MATRICE PER DIMENSIONE — ANNO ${selectedYear}`,
    18,
    currentY + 5.5
  );
  currentY += 12;

  // Process Each Dimension
  DIMENSIONS.forEach((dim) => {
    const filtered = records.filter(
      (r) =>
        r.year === selectedYear &&
        (r.dimensionId === dim.id ||
          CONTEXT_INDICATORS.some(
            (ci) =>
              ci.dimensionId === dim.id &&
              (ci.code === r.code || ci.outputIndicators.some((o) => o.code === r.code))
          ))
    );

    // Deduplicate
    const dimRecordsMap = new Map<string, IndicatorRecord>();
    filtered.forEach((r) => {
      const key = `${r.municipality || 'comune'}-${r.year}-${r.code}`;
      if (!dimRecordsMap.has(key)) {
        dimRecordsMap.set(key, r);
      }
    });
    const dimRecords = Array.from(dimRecordsMap.values());

    // Check if new page needed before starting dimension header
    if (currentY > 245) {
      doc.addPage();
      currentY = 20;
    }

    // Dimension Title Bar
    doc.setFillColor(244, 244, 245); // Zinc 100
    doc.rect(14, currentY, 182, 7, 'F');
    doc.setTextColor(darkTextColor[0], darkTextColor[1], darkTextColor[2]);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9);
    doc.text(`Dimensione ${dim.number}: ${dim.title}`, 16, currentY + 5);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(grayTextColor[0], grayTextColor[1], grayTextColor[2]);
    doc.text(`${dimRecords.length} Rilevazioni`, 194, currentY + 5, { align: 'right' });

    currentY += 9;

    if (dimRecords.length === 0) {
      doc.setFont('helvetica', 'italic');
      doc.setFontSize(8);
      doc.setTextColor(grayTextColor[0], grayTextColor[1], grayTextColor[2]);
      doc.text(`Nessuna misurazione registrata per l'anno ${selectedYear}.`, 18, currentY + 3);
      currentY += 8;
      return;
    }

    const tableRows = dimRecords.map((r) => {
      const isContext = r.code.startsWith('CTX');
      const levelLabel = isContext ? 'Contesto' : 'Output';
      const munLabel =
        reportScope === 'all' && r.municipality
          ? r.municipality.replace('Comune di ', '')
          : '';

      let valueDisplay = 'n.d.';
      if (!r.isNotAvailable && r.calculatedValue !== null) {
        valueDisplay = `${r.calculatedValue} ${r.unit}`;
      }

      let targetDisplay = '—';
      if (r.targetValue !== undefined) {
        targetDisplay = `${r.targetValue} ${r.unit}`;
        if (r.progressPercentage !== undefined) {
          targetDisplay += ` (${r.progressPercentage}%)`;
        }
      }

      return [
        levelLabel,
        r.code,
        r.indicatorName || r.code,
        ...(reportScope === 'all' ? [munLabel] : []),
        valueDisplay,
        targetDisplay,
        r.notes || '',
      ];
    });

    const headers = [
      'Tipo',
      'Codice',
      'Indicatore',
      ...(reportScope === 'all' ? ['Comune'] : []),
      'Valore Rilevato',
      'Obiettivo (Target)',
      'Note / Fonti',
    ];

    autoTable(doc, {
      startY: currentY,
      head: [headers],
      body: tableRows,
      theme: 'grid',
      styles: {
        fontSize: 7.2,
        cellPadding: 2,
        textColor: [39, 39, 42],
        lineColor: [228, 228, 231],
        lineWidth: 0.1,
      },
      headStyles: {
        fillColor: [63, 63, 70],
        textColor: [255, 255, 255],
        fontStyle: 'bold',
        fontSize: 7.2,
      },
      alternateRowStyles: {
        fillColor: [250, 250, 250],
      },
      columnStyles: {
        0: { cellWidth: 16, halign: 'center' },
        1: { cellWidth: 16, fontStyle: 'bold' },
        2: { cellWidth: reportScope === 'all' ? 44 : 54 },
        ...(reportScope === 'all' ? { 3: { cellWidth: 20 } } : {}),
        [reportScope === 'all' ? 4 : 3]: { cellWidth: 26, fontStyle: 'bold', halign: 'right' },
        [reportScope === 'all' ? 5 : 4]: { cellWidth: 26, halign: 'center' },
        [reportScope === 'all' ? 6 : 5]: { cellWidth: 'auto' },
      },
      margin: { left: 14, right: 14 },
      didParseCell: (data) => {
        // Colorazione viola chiaro per gli indicatori di contesto e verde chiaro per gli indicatori di output
        if (data.section === 'body') {
          const rowData = dimRecords[data.row.index];
          if (rowData) {
            const isContext = rowData.code.startsWith('CTX');
            if (isContext) {
              // Viola chiaro / lavender per Indicatori di Contesto
              data.cell.styles.fillColor = [245, 243, 255]; // Purple 50
              if (data.column.index === 0 || data.column.index === 1) {
                data.cell.styles.textColor = [109, 40, 217]; // Purple 700
              }
            } else {
              // Verde chiaro / mint per Indicatori di Output
              data.cell.styles.fillColor = [240, 253, 244]; // Emerald 50
              if (data.column.index === 0 || data.column.index === 1) {
                data.cell.styles.textColor = [4, 120, 87]; // Emerald 700
              }
            }
          }
        }
      },
      didDrawPage: () => {
        // Page footer will be drawn in final pass
      },
    });

    // Update currentY from last autoTable position
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    currentY = (doc as any).lastAutoTable.finalY + 8;
  });

  // Final Pass: Update footers with exact total page numbers
  const totalPages = doc.getNumberOfPages();
  for (let p = 1; p <= totalPages; p++) {
    doc.setPage(p);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7);
    doc.setTextColor(161, 161, 170);
    doc.text(
      `Pagina ${p} di ${totalPages} — Report Generato dal Sistema di Monitoraggio della Sostenibilità Turistica`,
      105,
      290,
      { align: 'center' }
    );
  }

  // Filename formatting
  const cleanMun = (reportScope === 'all' ? 'Tutti_Comuni' : selectedMunicipality)
    .toLowerCase()
    .replace(/[^a-z0-9]/g, '_')
    .replace(/_+/g, '_');
  const filename = `Report_Sostenibilita_Turistica_${cleanMun}_${selectedYear}.pdf`;

  // Download PDF file directly to user's device
  doc.save(filename);
}

