"use client";

import { dismissToast, useToastStore, type ToastTone } from "@/store/useToastStore";

const TONE_CLASSES: Record<ToastTone, string> = {
  info: "bg-dark-200 text-white border-white/10",
  success: "bg-green-700 text-white border-green-600",
  error: "bg-red-700 text-white border-red-600",
  warning: "bg-amber-300 text-gray-900 border-amber-400",
};

/** Renders toasts pushed through `pushToast` from the global toast store. */
export function ToastViewport() {
  const toasts = useToastStore();

  return (
    <div
      aria-live="polite"
      role="status"
      className="pointer-events-none fixed inset-x-0 top-24 z-50 flex flex-col items-center gap-2 px-4"
    >
      {toasts.map((toast) => (
        <button
          key={toast.id}
          type="button"
          onClick={() => dismissToast(toast.id)}
          className={`pointer-events-auto rounded-lg border px-4 py-2 text-sm font-semibold shadow-lg ${TONE_CLASSES[toast.tone]}`}
        >
          {toast.message}
        </button>
      ))}
    </div>
  );
}
