import { useEffect, useState } from 'react';
import { useAuth } from '../auth/AuthProvider';
import { getReadings } from '../tracking/store/readingsStore';
import { getTargets } from '../tracking/store/targetsStore';
import type { Reading, TargetRange } from '../tracking/types';
import { DateRangeForm } from './components/DateRangeForm';
import { PatientDetailsForm } from './components/PatientDetailsForm';
import {
  filterReadingsByRange,
  computeSummary,
  parseDateInput,
  isValidRange,
  isValidPatientDetails,
  toDateInputValue,
} from './lib/reportData';
import { buildReportPdf } from './lib/pdf';

const DEFAULT_TARGETS: TargetRange = { low: 70, high: 140 };
const DEFAULT_RANGE_DAYS = 13;

interface ReportsViewProps {
  refreshSignal: number;
}

export function ReportsView({ refreshSignal }: ReportsViewProps) {
  const { session } = useAuth();
  const userId = session!.user.id;

  const [readings, setReadings] = useState<Reading[]>([]);
  const [targets, setTargets] = useState<TargetRange>(DEFAULT_TARGETS);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const today = new Date();
  const defaultStart = new Date(today);
  defaultStart.setDate(today.getDate() - DEFAULT_RANGE_DAYS);
  const todayInput = toDateInputValue(today);

  const [nameInput, setNameInput] = useState('');
  const [dobInput, setDobInput] = useState('');
  const [startInput, setStartInput] = useState(toDateInputValue(defaultStart));
  const [endInput, setEndInput] = useState(todayInput);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    Promise.all([getReadings(userId), getTargets(userId)])
      .then(([r, t]) => {
        if (cancelled) return;
        setReadings(r);
        setTargets(t);
        setError('');
      })
      .catch((e: unknown) => {
        if (!cancelled) setError(e instanceof Error ? e.message : 'Could not load your data.');
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [userId, refreshSignal]);

  const dob = parseDateInput(dobInput);
  const patientDetailsValid = isValidPatientDetails(nameInput, dob);

  const start = parseDateInput(startInput);
  const end = parseDateInput(endInput);
  const rangeValid = isValidRange(start, end);
  const readingsInRange = rangeValid ? filterReadingsByRange(readings, { start: start!, end: end! }) : [];
  const summary = rangeValid ? computeSummary(readingsInRange, targets) : null;

  function handleDownload() {
    if (!patientDetailsValid) {
      setError("Enter the patient's name and date of birth.");
      return;
    }
    if (!rangeValid || !start || !end) {
      setError('Choose a start date on or before the end date.');
      return;
    }
    setError('');
    const doc = buildReportPdf({
      patientName: nameInput.trim(),
      patientDob: dob!,
      range: { start, end },
      targets,
      readings: readingsInRange,
      summary: summary!,
    });
    doc.save(`glucose-report-${startInput}-to-${endInput}.pdf`);
  }

  if (loading) {
    return (
      <div className="card">
        <p className="sub">Loading your readings...</p>
      </div>
    );
  }

  return (
    <div className="card">
      <h2>Export a report</h2>
      <p className="sub">Enter patient details and a date range to build a PDF you can share with your care provider.</p>

      <PatientDetailsForm
        name={nameInput}
        dob={dobInput}
        maxDob={todayInput}
        onNameChange={setNameInput}
        onDobChange={setDobInput}
      />

      <DateRangeForm
        start={startInput}
        end={endInput}
        maxDate={todayInput}
        onStartChange={setStartInput}
        onEndChange={setEndInput}
        onDownload={handleDownload}
        downloadDisabled={!rangeValid || !patientDetailsValid}
      />
      <div className="error-msg" role="alert">{error}</div>

      {summary && (
        <p className="sub">
          {summary.count
            ? `${summary.count} reading${summary.count === 1 ? '' : 's'} in range, averaging ${summary.average} mg/dL, ${summary.inRangePercent}% in range.`
            : 'No readings fall in this date range yet.'}
        </p>
      )}
    </div>
  );
}
