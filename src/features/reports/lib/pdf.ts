import { jsPDF } from 'jspdf';
import { autoTable } from 'jspdf-autotable';
import type { Reading, TargetRange } from '../../tracking/types';
import { formatTime } from '../../tracking/lib/dateUtils';
import type { DateRange, ReportSummary } from './reportData';

const MEAL_LABELS: Record<Reading['mealType'], string> = {
  fasting: 'Fasting',
  breakfast: 'Breakfast',
  lunch: 'Lunch',
  dinner: 'Dinner',
};

interface BuildReportPdfParams {
  patientName: string;
  patientDob: Date;
  range: DateRange;
  targets: TargetRange;
  readings: Reading[];
  summary: ReportSummary;
}

const INK = '#2B3B38';
const INK_MUTED = '#6C7A77';
const BORDER = '#D6E1DB';
const TEAL: [number, number, number] = [62, 124, 116];
const ROW_TINT: [number, number, number] = [238, 242, 240];

function formatDate(date: Date): string {
  return date.toLocaleDateString('en-US', { dateStyle: 'medium' });
}

export function buildReportPdf({
  patientName,
  patientDob,
  range,
  targets,
  readings,
  summary,
}: BuildReportPdfParams): jsPDF {
  const doc = new jsPDF({ unit: 'pt', format: 'letter' });
  const pageWidth = doc.internal.pageSize.getWidth();
  const margin = 48;

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(20);
  doc.setTextColor(INK);
  doc.text('Glucose Report', margin, 56);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  doc.setTextColor(INK_MUTED);
  doc.text(`Patient: ${patientName}`, margin, 76);
  doc.text(`Date of birth: ${formatDate(patientDob)}`, margin, 90);
  doc.text(`Period: ${formatDate(range.start)} to ${formatDate(range.end)}`, margin, 104);
  doc.text(`Generated: ${formatDate(new Date())}`, margin, 118);
  doc.text(`Target range: ${targets.low}–${targets.high} mg/dL`, margin, 132);

  doc.setDrawColor(BORDER);
  doc.line(margin, 146, pageWidth - margin, 146);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(13);
  doc.setTextColor(INK);
  doc.text('Summary', margin, 168);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  doc.setTextColor(INK);
  const summaryLines = summary.count
    ? [
        `Total readings: ${summary.count}`,
        `Average glucose: ${summary.average} mg/dL`,
        `In range: ${summary.inRangeCount} (${summary.inRangePercent}%)`,
        `Low: ${summary.lowCount}    High: ${summary.highCount}`,
      ]
    : ['No readings were logged in this date range.'];

  summaryLines.forEach((line, i) => doc.text(line, margin, 186 + i * 16));

  const tableStartY = 186 + summaryLines.length * 16 + 20;

  if (readings.length) {
    autoTable(doc, {
      startY: tableStartY,
      margin: { left: margin, right: margin },
      head: [['Date', 'Time', 'Meal', 'Reading (mg/dL)', 'Status']],
      body: readings.map((r) => {
        const d = new Date(r.timestamp);
        const status = r.value < targets.low ? 'Low' : r.value > targets.high ? 'High' : 'In range';
        return [
          d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
          formatTime(d),
          MEAL_LABELS[r.mealType],
          String(r.value),
          status,
        ];
      }),
      headStyles: { fillColor: TEAL, textColor: 255, fontStyle: 'bold' },
      styles: { fontSize: 9, textColor: [43, 59, 56] },
      alternateRowStyles: { fillColor: ROW_TINT },
    });
  }

  return doc;
}
