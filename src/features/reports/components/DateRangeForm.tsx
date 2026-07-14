interface DateRangeFormProps {
  start: string;
  end: string;
  maxDate: string;
  onStartChange: (value: string) => void;
  onEndChange: (value: string) => void;
  onDownload: () => void;
  downloadDisabled: boolean;
}

export function DateRangeForm({
  start,
  end,
  maxDate,
  onStartChange,
  onEndChange,
  onDownload,
  downloadDisabled,
}: DateRangeFormProps) {
  return (
    <form className="reading-form" onSubmit={(e) => e.preventDefault()}>
      <div className="field">
        <label htmlFor="reportStart">From</label>
        <input
          type="date"
          id="reportStart"
          value={start}
          max={end}
          onChange={(e) => onStartChange(e.target.value)}
        />
      </div>
      <div className="field">
        <label htmlFor="reportEnd">To</label>
        <input
          type="date"
          id="reportEnd"
          value={end}
          min={start}
          max={maxDate}
          onChange={(e) => onEndChange(e.target.value)}
        />
      </div>
      <div className="field">
        <button type="button" className="primary" onClick={onDownload} disabled={downloadDisabled}>
          Download PDF
        </button>
      </div>
    </form>
  );
}
