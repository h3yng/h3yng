import React from "react";
import Link from "next/link";

export default function ProfilePage() {
  return (
    <main className="flex min-w-0 flex-1 flex-col overflow-y-auto relative scroll-smooth bg-transparent h-full">
      {/* Context Header */}
      <header className="px-5 py-3 border-b border-[var(--border)] shrink-0 bg-[var(--background)]/80 backdrop-blur top-0 sticky z-10 flex items-center justify-between">
        <div>
          <h1 className="text-sm font-medium uppercase tracking-wide text-[var(--muted-foreground)]">Overview</h1>
          <p className="text-xs text-[var(--muted-foreground)] opacity-70 mt-0.5">Developer Portfolio & Info</p>
        </div>
        <div className="flex gap-2 sm:hidden">
          <Link href="/projects" className="text-xs font-semibold px-2 py-1 border border-[var(--border)] text-[var(--foreground)] bg-[var(--surface)] focus:ring-0">
            View Projects
          </Link>
        </div>
      </header>

      <div className="p-5 sm:p-8 flex-1 animate-enter relative z-20">
          <div className="max-w-3xl">
            <div className="badge mb-6">SOFTWARE ENGINEER</div>
            <h1 className="max-w-3xl tracking-tighter text-[var(--foreground)] text-4xl sm:text-5xl md:text-6xl font-semibold mb-6">
              Building purposeful tools with clean interaction and strong delivery.
            </h1>
            <p className="text-lg leading-relaxed text-[var(--muted-foreground)] mb-10 max-w-2xl">
              I design and ship developer-facing products with a pragmatic focus
              on speed, reliability, and visual clarity. Currently working remotely in APAC.
            </p>
            <div className="flex flex-wrap gap-4 items-center border border-[var(--border)] bg-[var(--surface)] p-6 mb-10">
              <div className="flex-1">
                <p className="text-xs font-semibold uppercase tracking-wide text-[var(--muted-foreground)] mb-2">Current Focus</p>
                <p className="text-sm text-[var(--foreground)]">Productive CLI and release tooling for teams that want fewer manual steps and smoother shipping.</p>
              </div>
              <Link href="/projects" className="primary-pill animate-enter">
                View Gallery
              </Link>
            </div>
          </div>
      </div>
    </main>
  );
}
