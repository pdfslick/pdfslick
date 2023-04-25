import { create, PDFSlick } from "@pdfslick/core";
import { setNavigation } from "./setNavigation";

export function loadPdf(url: string = "/pdfs/CH_infographics.pdf") {
  const store = create();
  const container = document.querySelector<HTMLDivElement>('#viewerContainer')!

  const pdfSlick = new PDFSlick({
    container,
    store,
    options: {
      scaleValue: "page-fit"
    },
  });
  pdfSlick.loadDocument(url)
  store.setState({ pdfSlick });

  const resizeObserver = new ResizeObserver(() => {
    const { scaleValue } = store.getState()
    if (scaleValue && ["page-width", "page-fit", "auto"].includes(scaleValue)) {
      pdfSlick.viewer.currentScaleValue = scaleValue;
    }
  });

  resizeObserver.observe(container)
  setNavigation(store)

  window.addEventListener("beforeunload", () => {
    resizeObserver.disconnect();
  })
}
