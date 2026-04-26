"use client";
import React, { useRef, useState } from "react";

export function CodeBlock(props: React.HTMLProps<HTMLPreElement>) {
  const preRef = useRef<HTMLPreElement>(null);
  const [copied, setCopied] = useState(false);

  const copyToClipboard = async () => {
    if (preRef.current) {
      const codeEl = preRef.current.querySelector("code");
      const text = codeEl ? codeEl.innerText : preRef.current.innerText;
      
      try {
        await navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } catch (err) {
        console.error("Failed to copy text", err);
      }
    }
  };

  return (
    <div className="relative group">
      <button
        onClick={copyToClipboard}
        className="absolute right-2 top-2 z-10 opacity-0 group-hover:opacity-100 transition-opacity bg-[var(--background)] hover:bg-[var(--surface)] text-[var(--muted-foreground)] hover:text-[var(--foreground)] border border-[var(--border)] rounded-none px-2 py-1 text-[0.65rem] font-mono cursor-pointer uppercase tracking-widest shadow-sm"
        aria-label="Copy code"
      >
        {copied ? "Copied" : "Copy"}
      </button>
      <pre ref={preRef} {...props} />
    </div>
  );
}
