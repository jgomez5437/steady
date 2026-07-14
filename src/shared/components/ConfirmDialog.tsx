interface ConfirmDialogProps {
  open: boolean;
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export function ConfirmDialog({
  open,
  title,
  message,
  confirmLabel = 'Delete',
  cancelLabel = 'Cancel',
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  if (!open) return null;

  return (
    <div className="modal-overlay" role="presentation" onClick={onCancel}>
      <div
        className="modal"
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="confirmDialogTitle"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 id="confirmDialogTitle">{title}</h2>
        <p className="sub">{message}</p>
        <div className="modal-actions">
          <button type="button" className="link" onClick={onCancel}>
            {cancelLabel}
          </button>
          <button type="button" className="primary danger" onClick={onConfirm}>
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
