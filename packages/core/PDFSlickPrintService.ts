import { EventBus } from "pdfjs-dist/web/pdf_viewer.mjs";
import { PDFPrintService, PDFPrintServiceFactory } from "./lib";
import type { PDFSlick } from "./PDFSlick";
import { IPDFSlickPrintDialog } from "./PDFSlickPrintDialog";


type PDFSlickPrintServiceOptions = {
    eventBus: EventBus;
    slick: PDFSlick;
    printDialog?: IPDFSlickPrintDialog | null;
}

export class PDFSlickPrintService {
    eventBus: EventBus;
    slick: PDFSlick;
    printDialog: IPDFSlickPrintDialog | null;

    #printService: PDFPrintService | null = null;
    #eventAbortController: AbortController | null = null;
    #printContainer: ReturnType<typeof createPrintContainer> | null = null;

    constructor({ eventBus, slick, printDialog }: PDFSlickPrintServiceOptions) {
        this.eventBus = eventBus;
        this.slick = slick;
        this.printDialog = printDialog ?? null;

        this.bindEvents();
    }

    get supportsPrinting() {
        return PDFPrintServiceFactory.instance.supportsPrinting;
    }

    get printing() {
        return !!this.#printService
    }

    async print() {
        if (!this.supportsPrinting) {
            return;
        }

        if (this.printing) {
            console.warn("Ignored pdf print because of a pending print job.");
            return;
        }

        await this.printDialog?.open({
            close: () => this.abort()
        });

        try {
            this.eventBus.dispatch("beforeprint", { source: this });
        } finally {
            if (!this.printing) {
                console.error("Expected print service to be initialized.");
                this.printDialog?.close();
            } else {
                const printService = this.#printService!;
                await printService
                    .renderPages(x => this.printDialog?.progress(x))
                    .then(() => printService.performPrint())
                    .catch(() => {
                        // Ignore any error messages.
                    })
                    .then(() => {
                        // aborts acts on the "active" print request, so we need to check
                        // whether the print request (activeServiceOnEntry) is still active.
                        // Without the check, an unrelated print request (created after
                        // aborting this print request while the pages were being generated)
                        // would be aborted.
                        const active = printService === this.#printService;
                        if (active) {
                            this.abort();
                        }
                    });
            }
        }
    }

    abort() {
        if (this.#printService) {
            this.#printService.destroy();
            this.printDialog?.close();
            this.eventBus.dispatch("afterprint", { source: this });
        }
    }

    #beforePrint() {
        if (this.#printService) {
            // There is no way to suppress beforePrint/afterPrint events,
            // but PDFPrintService may generate double events -- this will ignore
            // the second event that will be coming from native window.print().
            return;
        }

        if (!this.supportsPrinting) {
            // this.l10n.get("printing_not_supported").then(msg => {
            //   this._otherError(msg);
            // });
            return;
        }

        // The beforePrint is a sync method and we need to know layout before
        // returning from this method. Ensure that we can get sizes of the pages.
        if (!this.slick.viewer.pageViewsReady) {
            this.slick.l10n.get("printing_not_ready", null).then((msg) => {
                // eslint-disable-next-line no-alert
                window.alert(msg);
            });
            return;
        }

        this.#printContainer = createPrintContainer();

        this.#printService = PDFPrintServiceFactory.instance.createPrintService({
            pdfDocument: this.slick.document!,
            pagesOverview: this.slick.viewer.getPagesOverview(),
            printContainer: this.#printContainer.element,
            printResolution: this.slick.printResolution,
            optionalContentConfigPromise: null,
            printAnnotationStoragePromise: null, // this._printAnnotationStoragePromise,
        });

        this.slick.forceRendering();

        this.#printService.layout();
    }

    #afterPrint() {
        if (this.#printService) {
            this.#printService.destroy();
            this.#printService = null;
            this.printDialog?.close();
            this.#printContainer?.remove();
            this.#printContainer = null;

            this.slick.document?.annotationStorage.resetModified();
        }
        this.slick.forceRendering();
    }

    bindEvents() {
        this.#eventAbortController = new AbortController();
        const { signal } = this.#eventAbortController;
        const opts: any = { signal };

        this.eventBus._on("beforeprint", this.#beforePrint.bind(this), opts);
        this.eventBus._on("afterprint", this.#afterPrint.bind(this), opts);

        window.addEventListener(
            "beforeprint",
            () => this.eventBus.dispatch("beforeprint", { source: window }),
            opts
        );
        window.addEventListener(
            "afterprint",
            () => this.eventBus.dispatch("afterprint", { source: window }),
            opts
        );

        window.addEventListener(
            "keydown",
            (event) => {
                // Intercept Cmd/Ctrl + P in all browsers.
                // Also intercept Cmd/Ctrl + Shift + P in Chrome and Opera
                if (
                    event.keyCode === /* P= */ 80 &&
                    (event.ctrlKey || event.metaKey) &&
                    !event.altKey &&
                    (!event.shiftKey || (<any>window).chrome || (<any>window).opera)
                ) {
                    this.print();

                    event.preventDefault();
                    event.stopImmediatePropagation();
                }
            },
            { signal, capture: true }
        );
    }

    unbindEvents() {
        this.#eventAbortController?.abort();
        this.#eventAbortController = null;
    }
}


function createPrintContainer() {
    const printContainer = document.createElement("div");
    printContainer.classList.add('pdfSlickPrintContainer');
    document.body.append(printContainer);

    const sheet = document.createElement("style");

    /** source: https://github.com/mozilla/pdf.js/blob/v4.10.38/web/viewer.css */
    sheet.textContent = `
@page {
  margin: 0;
}

.pdfSlickPrintContainer {
  display: none;
}

@media print {
  body {
    background: rgb(0 0 0 / 0) none;
  }

  body[data-pdfjsprinting] > *:not(.pdfSlickPrintContainer) {
    display: none;
  }

  body[data-pdfjsprinting] .pdfSlickPrintContainer {
    display: block;
  }

  .pdfSlickPrintContainer {
    height: 100%;
  }

  /* wrapper around (scaled) print canvas elements */
  .pdfSlickPrintContainer > .printedPage {
    page-break-after: always;
    page-break-inside: avoid;

    /* The wrapper always cover the whole page. */
    height: 100%;
    width: 100%;

    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }

  .pdfSlickPrintContainer > .xfaPrintedPage .xfaPage {
    position: absolute;
  }

  .pdfSlickPrintContainer > .xfaPrintedPage {
    page-break-after: always;
    page-break-inside: avoid;
    width: 100%;
    height: 100%;
    position: relative;
  }

  .pdfSlickPrintContainer > .printedPage :is(canvas, img) {
    /* The intrinsic canvas / image size will make sure that we fit the page. */
    max-width: 100%;
    max-height: 100%;

    direction: ltr;
    display: block;
  }
}`;
    document.body.append(sheet);

    return {
        get element() { return printContainer },
        remove: () => {
            printContainer.remove();
            sheet.remove();
        }
    };
}
