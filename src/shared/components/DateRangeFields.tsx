interface DateRangeFieldsProps {
  start: string;
  end: string;
  maxDate: string;
  onStartChange: (value: string) => void;
  onEndChange: (value: string) => void;
  startId: string;
  endId: string;
  startLabel?: string;
  endLabel?: string;
}

export function DateRangeFields({
  start,
  end,
  maxDate,
  onStartChange,
  onEndChange,
  startId,
  endId,
  startLabel = 'From',
  endLabel = 'To',
}: DateRangeFieldsProps) {
  return (
    <>
      <div className="field">
        <label htmlFor={startId}>{startLabel}</label>
        <input
          type="date"
          id={startId}
          value={start}
          max={end}
          onChange={(e) => onStartChange(e.target.value)}
        />
      </div>
      <div className="field">
        <label htmlFor={endId}>{endLabel}</label>
        <input
          type="date"
          id={endId}
          value={end}
          min={start}
          max={maxDate}
          onChange={(e) => onEndChange(e.target.value)}
        />
      </div>
    </>
  );
}
