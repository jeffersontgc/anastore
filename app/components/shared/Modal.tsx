"use client";

import { ReactNode, useEffect } from "react";

type Props = {
  open: boolean;
  title?: string;
  onClose: () => void;
  children: ReactNode;
  widthClass?: string;
};

export function Modal({
  open,
  title,
  onClose,
  children,
  widthClass = "max-w-lg",
}: Props) {
  useEffect(() => {
    function handleEsc(event: KeyboardEvent) {
      if (event.key === "Escape") onClose();
    }
    if (open) {
      window.addEventListener("keydown", handleEsc);
    }
    return () => window.removeEventListener("keydown", handleEsc);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center bg-slate-900/40 px-4 py-10 backdrop-blur-sm">
      <div
        className={`w-full ${widthClass} rounded-2xl border border-slate-200 bg-white shadow-2xl`}
      >
        <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">
          <div>
            {title ? (
              <h2 className="text-lg font-semibold text-slate-900">{title}</h2>
            ) : null}
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-2 text-slate-500 transition hover:bg-slate-100"
            aria-label="Cerrar modal"
          >
            ✕
          </button>
        </div>
        <div className="px-5 py-4">{children}</div>
      </div>
    </div>
  );
}
