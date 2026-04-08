import { useCallback, useMemo, useState } from "react";
import { ToastContext } from "./toast.context";

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const dismiss = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const push = useCallback((type, message, opts = {}) => {
    const id = crypto.randomUUID?.() || String(Date.now() + Math.random());
    const durationMs = opts.durationMs ?? 2200;

    setToasts((prev) => [
      ...prev,
      {
        id,
        type,
        message,
      },
    ]);

    window.setTimeout(() => dismiss(id), durationMs);
  }, [dismiss]);

  const api = useMemo(
    () => ({
      success: (msg, opts) => push("success", msg, opts),
      error: (msg, opts) => push("error", msg, opts),
      info: (msg, opts) => push("info", msg, opts),
      dismiss,
    }),
    [dismiss, push]
  );

  return (
    <ToastContext.Provider value={api}>
      {children}
      {toasts.length > 0 && (
        <div className="toast toast-top toast-end z-50">
          {toasts.map((t) => (
            <div
              key={t.id}
              className={`alert ${
                t.type === "error"
                  ? "alert-error"
                  : t.type === "success"
                    ? "alert-success"
                    : "alert-info"
              }`}
            >
              <span>{t.message}</span>
            </div>
          ))}
        </div>
      )}
    </ToastContext.Provider>
  );
}

