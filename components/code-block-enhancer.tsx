"use client";

import { useEffect } from "react";

function createCopyButton(pre: HTMLPreElement) {
  const button = document.createElement("button");
  button.type = "button";
  button.className = "code-copy-button";
  button.textContent = "copy";

  button.addEventListener("click", async () => {
    try {
      await navigator.clipboard.writeText(pre.innerText);
      button.textContent = "copied";
      window.setTimeout(() => {
        button.textContent = "copy";
      }, 1200);
    } catch {
      button.textContent = "failed";
      window.setTimeout(() => {
        button.textContent = "copy";
      }, 1200);
    }
  });

  pre.append(button);
}

export default function CodeBlockEnhancer() {
  useEffect(() => {
    const blocks = document.querySelectorAll<HTMLPreElement>(".blog-prose pre");

    for (const pre of blocks) {
      if (pre.dataset.copyReady === "true") {
        continue;
      }

      pre.dataset.copyReady = "true";
      createCopyButton(pre);
    }
  }, []);

  return null;
}
