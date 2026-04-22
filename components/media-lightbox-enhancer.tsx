"use client";

import { useEffect } from "react";

export default function MediaLightboxEnhancer() {
  useEffect(() => {
    const selectors = ".project-media, .blog-prose img";
    const mediaNodes = document.querySelectorAll<HTMLImageElement>(selectors);

    const overlay = document.createElement("div");
    overlay.className = "media-lightbox";
    overlay.setAttribute("aria-hidden", "true");

    const image = document.createElement("img");
    image.className = "media-lightbox-image";
    image.alt = "Expanded media";

    const closeButton = document.createElement("button");
    closeButton.type = "button";
    closeButton.className = "media-lightbox-close";
    closeButton.textContent = "close";
    closeButton.setAttribute("aria-label", "Close media viewer");

    overlay.append(image, closeButton);
    document.body.append(overlay);

    function openLightbox(target: HTMLImageElement) {
      image.src = target.currentSrc || target.src;
      image.alt = target.alt || "Expanded media";
      overlay.classList.add("is-open");
      overlay.setAttribute("aria-hidden", "false");
      document.body.style.overflow = "hidden";
    }

    function closeLightbox() {
      overlay.classList.remove("is-open");
      overlay.setAttribute("aria-hidden", "true");
      image.src = "";
      document.body.style.overflow = "";
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        closeLightbox();
      }
    }

    closeButton.addEventListener("click", closeLightbox);
    overlay.addEventListener("click", (event) => {
      if (event.target === overlay) {
        closeLightbox();
      }
    });

    document.addEventListener("keydown", handleKeyDown);

    for (const node of mediaNodes) {
      if (node.dataset.lightboxReady === "true") {
        continue;
      }

      node.dataset.lightboxReady = "true";
      node.addEventListener("click", () => openLightbox(node));
      node.style.cursor = "zoom-in";
    }

    return () => {
      closeButton.removeEventListener("click", closeLightbox);
      document.removeEventListener("keydown", handleKeyDown);
      overlay.remove();
      document.body.style.overflow = "";
    };
  }, []);

  return null;
}
