import "@testing-library/jest-dom/vitest";

if (typeof window !== "undefined" && !window.scrollTo) {
  window.scrollTo = () => {};
}

if (typeof Element !== "undefined" && !Element.prototype.scrollIntoView) {
  Element.prototype.scrollIntoView = () => {};
}
