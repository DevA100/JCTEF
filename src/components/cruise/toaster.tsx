"use client";

import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from "react";
import { CruiseToast, type CruiseToastTone } from "./toast";
import { CruiseToastViewport, type CruiseToastPosition } from "./toast-viewport";

export type CruiseToastOptions = {
  title?: ReactNode;
  description?: ReactNode;
  tone?: CruiseToastTone;
  /** Overrides the Toaster's position for this toast. */
  position?: CruiseToastPosition;
  /** Milliseconds before it closes; 0 keeps it open. Default 3000, or 0 for danger. */
  duration?: number;
  /** Your own toast (e.g. CruiseAchievementToast) instead of the default one. */
  render?: (dismiss: () => void) => ReactNode;
};

type LiveToast = CruiseToastOptions & { id: string; leaving?: boolean };

type ToastApi = {
  /** Shows a toast and returns its id. */
  toast: (options: CruiseToastOptions) => string;
  dismiss: (id: string) => void;
};

const ToastContext = createContext<ToastApi | null>(null);

// Matches the exit animation in theme.css (.toast-viewport [data-leaving]).
const EXIT_MS = 150;
let lastId = 0;

/**
 * Toaster, spec A5 Toast: wrap your app once, then call
 * `useCruiseToast().toast({ title, tone, position })` anywhere. Toasts close
 * after ~3s (danger ones stay until closed), enter and leave from the
 * nearest edge, and stack per position.
 */
export function CruiseToaster({
  position = "bottom-right",
  children,
}: {
  /** Default spot for every toast; each toast can override it. */
  position?: CruiseToastPosition;
  children?: ReactNode;
}) {
  const [toasts, setToasts] = useState<LiveToast[]>([]);

  const dismiss = useCallback((id: string) => {
    setToasts((all) => all.map((t) => (t.id === id ? { ...t, leaving: true } : t)));
    window.setTimeout(() => setToasts((all) => all.filter((t) => t.id !== id)), EXIT_MS);
  }, []);

  const toast = useCallback(
    (options: CruiseToastOptions) => {
      const id = `cruise-toast-${++lastId}`;
      setToasts((all) => [...all, { ...options, id }]);
      const duration = options.duration ?? (options.tone === "danger" ? 0 : 3000);
      if (duration > 0) window.setTimeout(() => dismiss(id), duration);
      return id;
    },
    [dismiss],
  );

  const api = useMemo(() => ({ toast, dismiss }), [toast, dismiss]);
  const positions = [...new Set(toasts.map((t) => t.position ?? position))];

  return (
    <ToastContext.Provider value={api}>
      {children}
      {positions.map((spot) => (
        <CruiseToastViewport key={spot} position={spot}>
          {toasts
            .filter((t) => (t.position ?? position) === spot)
            .map((t) => (
              <div key={t.id} className="toast-slot" data-leaving={t.leaving ? "" : undefined}>
                {t.render ? (
                  t.render(() => dismiss(t.id))
                ) : (
                  <CruiseToast tone={t.tone} title={t.title} onDismiss={() => dismiss(t.id)}>
                    {t.description}
                  </CruiseToast>
                )}
              </div>
            ))}
        </CruiseToastViewport>
      ))}
    </ToastContext.Provider>
  );
}

/** `toast()` and `dismiss()` from the nearest CruiseToaster. */
export function useCruiseToast(): ToastApi {
  const api = useContext(ToastContext);
  if (!api) throw new Error("useCruiseToast must be used inside <CruiseToaster>.");
  return api;
}
