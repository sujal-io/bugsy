import { useEffect, useRef } from 'react';
import { Button } from './Button';

export function Modal({
  open,
  onClose,
  title,
  children,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  onConfirm,
  confirmVariant = 'danger',
  loading = false,
  showActions = true,
}) {
  const dialogRef = useRef(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (open && !dialog.open) {
      dialog.showModal();
    } else if (!open && dialog.open) {
      dialog.close();
    }
  }, [open]);

  return (
    <dialog
      ref={dialogRef}
      className="fixed inset-0 z-50 m-0 h-full max-h-none w-full max-w-none border-0 bg-transparent p-4 backdrop:bg-black/60 backdrop:backdrop-blur-modal open:flex open:items-center open:justify-center"
      onClose={onClose}
      onClick={(e) => {
        if (e.target === dialogRef.current) onClose?.();
      }}
    >
      <div
        className="ui-modal-panel"
        onClick={(e) => e.stopPropagation()}
      >
        {title && <h3 className="ui-modal-title">{title}</h3>}
        {children && <div className="ui-modal-body">{children}</div>}
        {showActions && (
          <div className="ui-modal-actions">
            <Button variant="ghost" size="sm" onClick={onClose} disabled={loading}>
              {cancelLabel}
            </Button>
            {onConfirm && (
              <Button
                variant={confirmVariant}
                size="sm"
                loading={loading}
                onClick={onConfirm}
              >
                {confirmLabel}
              </Button>
            )}
          </div>
        )}
      </div>
    </dialog>
  );
}
