import { create } from "@pdfslick/core";

export function setNavigation(store: ReturnType<typeof create>) {
  const zoomOutBtn = document.querySelector("#zoomOutBtn");
  const zoomInBtn = document.querySelector("#zoomInBtn");
  const previousBtn = document.querySelector("#previousBtn");
  const nextBtn = document.querySelector("#nextBtn");

  const unsubscribe = store.subscribe((s) => {
    if (s.pageNumber <= 1) {
      previousBtn?.setAttribute("disabled", "true");
    } else {
      previousBtn?.removeAttribute("disabled");
    }

    if (s.pageNumber >= s.numPages) {
      nextBtn?.setAttribute("disabled", "true");
    } else {
      nextBtn?.removeAttribute("disabled");
    }
  });

  const onZoomIn = () => store.getState().pdfSlick?.increaseScale();
  const onZoomOut = () => store.getState().pdfSlick?.decreaseScale();
  const onNextPage = () =>
    store.getState().pdfSlick?.gotoPage(store.getState().pageNumber + 1);
  const onPreviousPage = () =>
    store.getState().pdfSlick?.gotoPage(store.getState().pageNumber - 1);

  zoomInBtn?.addEventListener("click", onZoomIn);
  zoomOutBtn?.addEventListener("click", onZoomOut);
  nextBtn?.addEventListener("click", onNextPage);
  previousBtn?.addEventListener("click", onPreviousPage);

  window.addEventListener("beforeunload", () => {
    zoomInBtn?.removeEventListener("click", onZoomIn);
    zoomOutBtn?.removeEventListener("click", onZoomOut);
    nextBtn?.removeEventListener("click", onNextPage);
    previousBtn?.removeEventListener("click", onPreviousPage);

    unsubscribe();
  });
}
