import { DateRangeFields } from '../../../shared/components/DateRangeFields';

interface DateRangeFormProps {
  start: string;
  end: string;
  maxDate: string;
  onStartChange: (value: string) => void;
  onEndChange: (value: string) => void;
  onPastWeek: () => void;
  onDownload: () => void;
  downloadDisabled: boolean;
}

export function DateRangeForm({
  start,
  end,
  maxDate,
  onStartChange,
  onEndChange,
  onPastWeek,
  onDownload,
  downloadDisabled,
}: DateRangeFormProps) {
  return (
    <form className="reading-form" onSubmit={(e) => e.preventDefault()}>
      <DateRangeFields
        start={start}
        end={end}
        maxDate={maxDate}
        onStartChange={onStartChange}
        onEndChange={onEndChange}
        startId="reportStart"
        endId="reportEnd"
      />
      <div className="field">
        <button type="button" className="chip" onClick={onPastWeek}>
          Past 7 Days
        </button>
      </div>
      <div className="download-row">
        <button type="button" className="primary" onClick={onDownload} disabled={downloadDisabled}>
          Download PDF
        </button>
      </div>
    </form>
  );
}
