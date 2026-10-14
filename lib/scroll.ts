import type Lenis from "lenis";

let instance: Lenis | null = null;

export function setLenis(lenis: Lenis | null) {
  instance = lenis;
}

export function getLenis() {
  return instance;
}

/** Freeze page scroll (preloader, mobile menu). */
export function lockScroll() {
  document.documentElement.classList.add("is-locked");
  instance?.stop();
}

export function unlockScroll() {
  document.documentElement.classList.remove("is-locked");
  instance?.start();
}

export function isReady() {
  return typeof document !== "undefined" && document.documentElement.dataset.echoReady === "1";
}

/** Run once the preloader has revealed the page (or immediately if it already has). */
export function onEchoReady(callback: () => void) {
  if (typeof window === "undefined") return () => {};
  if (isReady()) {
    callback();
    return () => {};
  }
  const handler = () => callback();
  window.addEventListener("echo:ready", handler, { once: true });
  return () => window.removeEventListener("echo:ready", handler);
}
