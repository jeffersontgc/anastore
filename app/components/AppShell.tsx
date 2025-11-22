"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import { useEffect, useState } from "react";
import { TiThMenu } from "react-icons/ti";
import { useDataStore } from "../store/data-store";

type Props = {
  children: ReactNode;
  title?: string;
  description?: string;
};

const navItems = [
  { href: "/", label: "Dashboard" },
  { href: "/fiadores", label: "Fiadores" },
  { href: "/usuarios", label: "Usuarios" },
  { href: "/productos", label: "Productos" },
];

export function AppShell({ children, title, description }: Props) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    useDataStore.persist.rehydrate();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-100 via-slate-50 to-white text-slate-900">
      <header className="sticky top-0 z-10 border-b border-slate-200 bg-white/85 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 sm:h-16">
          <Link href="/" className="text-lg font-semibold text-slate-900">
            CrediStore
          </Link>
          <button
            type="button"
            onClick={() => setOpen(true)}
            className="inline-flex items-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-100 sm:hidden"
            aria-label="Abrir menu"
          >
            <TiThMenu />
          </button>
          <nav className="hidden items-center gap-1 rounded-xl border border-slate-200 bg-slate-50 px-1 py-1 text-sm sm:flex sm:border-0 sm:bg-transparent sm:px-0">
            {navItems.map((item) => {
              const active = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`whitespace-nowrap rounded-lg px-3 py-2 font-medium transition-colors ${
                    active
                      ? "bg-slate-900 text-white shadow-sm"
                      : "text-slate-600 hover:bg-slate-100"
                  }`}
                  onClick={() => setOpen(false)}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-6 sm:py-8">
        {(title || description) && (
          <div className="mb-6">
            {title ? (
              <h1 className="text-2xl font-semibold text-slate-900">{title}</h1>
            ) : null}
            {description ? (
              <p className="mt-1 text-sm text-slate-600">{description}</p>
            ) : null}
          </div>
        )}
        {children}
      </main>

      <div
        className={`fixed inset-0 z-30 bg-slate-900/40 transition-opacity duration-200 ${
          open
            ? "pointer-events-auto opacity-100"
            : "pointer-events-none opacity-0"
        }`}
        onClick={() => setOpen(false)}
        aria-hidden="true"
      />
      <aside
        className={`fixed inset-y-0 left-0 z-40 w-72 max-w-[80vw] bg-white shadow-2xl transition-transform duration-200 ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
        aria-label="Menu lateral"
      >
        <div className="flex items-center justify-between border-b border-slate-200 px-4 py-3">
          <span className="text-lg font-semibold text-slate-900">
            CrediStore
          </span>
          <button
            type="button"
            onClick={() => setOpen(false)}
            className="rounded-lg p-2 text-slate-500 hover:bg-slate-100"
            aria-label="Cerrar menu"
          >
            x
          </button>
        </div>
        <nav className="flex flex-col gap-1 p-3">
          {navItems.map((item) => {
            const active = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                  active
                    ? "bg-slate-900 text-white shadow-sm"
                    : "text-slate-700 hover:bg-slate-100"
                }`}
                onClick={() => setOpen(false)}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>
      </aside>
    </div>
  );
}
