import React from "react";

export default function BlogsIndexPage() {
  return (
    <main id="main-scroll-area" className="flex min-w-0 flex-1 flex-col overflow-y-auto relative scroll-smooth bg-transparent h-full">
      <header className="px-5 py-3 border-b border-[var(--border)] shrink-0 bg-[var(--background)]/80 backdrop-blur top-0 sticky z-10 flex items-center justify-between">
        <div>
          <h1 className="text-sm font-medium uppercase tracking-wide text-[var(--muted-foreground)]">Articles & Posts</h1>
          <p className="text-xs text-[var(--muted-foreground)] opacity-70 mt-0.5">Read thoughts, tutorials and technical insights</p>
        </div>
      </header>
      <div className="p-5 sm:p-8 flex-1 flex items-center justify-center">
         <p className="text-sm text-[var(--muted-foreground)] border border-[var(--border)] bg-[var(--card)] px-6 py-4">Select a file from the index to read.</p>
      </div>
    </main>
  );
}
