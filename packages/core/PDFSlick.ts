import {
  GlobalWorkerOptions,
  getDocument,
  getPdfFilenameFromUrl,
  AnnotationEditorType,
  AnnotationMode,
  PDFDocumentProxy,
  version,
  PDFDateString,
} from "pdfjs-dist";
import {
  EventBus,
  PDFViewer,
  PDFLinkService,
  NullL10n,
  DownloadManager,
  PDFFindController,
  PDFPageView,
  PDFSinglePageViewer,
} from "pdfjs-dist/web/pdf_viewer";

import type {
  TEventBusEvent,
  PDFSlickInputArgs,
  PDFSlickState,
  TEventBusName,
  TEventBusOptions,
  TEventBusListener,
  TPDFDocumentOutline,
  TPDFDocumentAttachments,
} from "./types";

import {
  PDFThumbnailViewer,
  PDFRenderingQueue,
  PDFPrintServiceFactory,
  PDFPresentationMode,
} from "./lib";
import { PDFRenderingQueue as TPDFRenderingQueue } from "pdfjs-dist/types/web/pdf_page_view";
import { PDFThumbnailViewer as TPDFThumbnailViewer } from "pdfjs-dist/types/web/pdf_thumbnail_viewer";

import { StoreApi } from "zustand/vanilla";
import { create as createStore } from "./store";
import {
  TextLayerMode,
  getPageSizeInches,
  isPortraitOrientation,
  isValidSpreadMode,
  isValidScrollMode,
  isValidRotation,
} from "./lib/ui_utils";

GlobalWorkerOptions.workerSrc = `//cdn.jsdelivr.net/npm/pdfjs-dist@${version}/build/pdf.worker.min.js`;

const US_PAGE_NAMES = {
  "8.5x11": "Letter",
  "8.5x14": "Legal",
};
const METRIC_PAGE_NAMES = {
  "297x420": "A3",
  "210x297": "A4",
};

function getPageName(
  size: { width: number; height: number },
  isPortrait: boolean,
  pageNames: Record<string, string>
) {
  const width = isPortrait ? size.width : size.height;
  const height = isPortrait ? size.height : size.width;

  return pageNames[`${width}x${height}`];
}

export class PDFSlick {
  #renderingQueue: TPDFRenderingQueue;

  #container: HTMLDivElement;
  #viewerContainer: HTMLDivElement | undefined;
  #thumbsContainer: HTMLDivElement | undefined;
  printService: any;
  url: string | ArrayBuffer | undefined;
  eventBus: EventBus;
  linkService: PDFLinkService;
  downloadManager: DownloadManager | null = null;
  findController: PDFFindController | null = null;
  pdfPresentationMode: PDFPresentationMode | null = null;
  viewer: PDFViewer;
  thumbnailViewer?: PDFThumbnailViewer;
  document: PDFDocumentProxy | null = null;
  store: StoreApi<PDFSlickState>;
  filename: string;

  // options
  #annotationMode: number;
  #annotationEditorMode: number;
  l10n: typeof NullL10n;
  singlePageViewer: boolean;
  removePageBorders: boolean;
  enablePrintAutoRotate: boolean;
  useOnlyCssZoom: boolean;
  pageColors: { background: any; foreground: any } | null;
  textLayerMode: number;
  maxCanvasPixels: number;
  printResolution: number;
  thumbnailWidth: number;

  constructor({
    container,
    viewer,
    thumbs,
    store = createStore(),
    options,
  }: PDFSlickInputArgs) {
    this.#container = container;
    this.#viewerContainer = viewer;
    this.#thumbsContainer = thumbs;

    this.l10n = options?.l10n ?? NullL10n;
    this.downloadManager = new DownloadManager();

    this.textLayerMode = options?.textLayerMode ?? TextLayerMode.ENABLE;
    this.#annotationMode =
      options?.annotationMode ?? AnnotationMode.ENABLE_FORMS;
    this.#annotationEditorMode =
      options?.annotationEditorMode ?? AnnotationEditorType.NONE;
    this.removePageBorders = options?.removePageBorders ?? false;
    this.singlePageViewer = options?.singlePageViewer ?? false;
    this.enablePrintAutoRotate = options?.enablePrintAutoRotate ?? false;
    this.useOnlyCssZoom = options?.useOnlyCssZoom ?? false;
    this.pageColors = options?.pageColors ?? null;
    this.maxCanvasPixels = options?.maxCanvasPixels ?? 16777216;
    this.printResolution = options?.printResolution ?? 96;
    this.thumbnailWidth = options?.thumbnailWidth ?? 125;

    if (
      this.pageColors &&
      !(
        CSS.supports("color", this.pageColors.background) &&
        CSS.supports("color", this.pageColors.foreground)
      )
    ) {
      if (this.pageColors.background || this.pageColors.foreground) {
        console.warn(
          "PDFViewer: Ignoring `pageColors`-option, since the browser doesn't support the values used."
        );
      }
      this.pageColors = null;
    }

    this.l10n = NullL10n;
    this.store = store;

    const renderingQueue =
      new PDFRenderingQueue() as unknown as TPDFRenderingQueue;
    renderingQueue.onIdle = this._cleanup.bind(this);
    renderingQueue.isThumbnailViewEnabled = true;
    this.#renderingQueue = renderingQueue;

    const eventBus = new EventBus();
    const linkService = new PDFLinkService({
      eventBus,
      externalLinkTarget: 2,
      externalLinkRel: "noopener noreferrer nofollow",
      ignoreDestinationZoom: false,
    });

    const viewerOptions = {
      container,
      ...(viewer && { viewer }),
      eventBus,
      linkService,
      renderingQueue,
      defaultRenderingQueue: true,
      textLayerMode: this.textLayerMode,
      l10n: this.l10n,
      annotationMode: this.#annotationMode,
      annotationEditorMode: this.#annotationEditorMode,
      removePageBorders: this.removePageBorders,
      imageResourcesPath: "/images/",
      useOnlyCssZoom: this.useOnlyCssZoom,
    };

    const pdfViewer = this.singlePageViewer
      ? new PDFSinglePageViewer(viewerOptions)
      : new PDFViewer(viewerOptions);
    renderingQueue.setViewer(pdfViewer);

    if (thumbs) {
      this.thumbnailViewer = new PDFThumbnailViewer({
        container: thumbs,
        eventBus,
        linkService,
        renderingQueue,
        l10n: this.l10n,
        pageColors: this.pageColors,
        store: store,
        thumbnailWidth: this.thumbnailWidth,
      });
      renderingQueue.setThumbnailViewer(
        this.thumbnailViewer as unknown as TPDFThumbnailViewer
      );
    }

    if (document.fullscreenEnabled) {
      this.pdfPresentationMode = new PDFPresentationMode({
        container,
        pdfViewer: pdfViewer,
        eventBus,
      });
    }

    this.eventBus = eventBus;
    this.linkService = linkService;
    this.viewer = pdfViewer;
    this.linkService.setViewer(pdfViewer);

    const scaleValue = options?.scaleValue ?? "auto";
    this.store.setState({ scaleValue });
  }

  async loadDocument(url: string | URL | ArrayBuffer, options?: { filename?: string }) {
    if (this.url && typeof this.url === "string") {
      try {
        URL.revokeObjectURL(this.url);
      } catch (err) {}
    }

    this.document?.destroy();
    this.viewer?.cleanup();

    if (url instanceof URL) {
      this.url = url.toString();
    } else {
      this.url = url;
    }

    const filename =
      options?.filename ?? getPdfFilenameFromUrl(this.url?.toString());
    this.filename = filename;

    const pdfDocument = await getDocument(url).promise;

    this.document = pdfDocument;
    this.viewer.setDocument(this.document);
    this.linkService.setDocument(this.document);

    if (this.thumbnailViewer) {
      this.thumbnailViewer?.setDocument(pdfDocument);
    }

    this.#initInternalEventListeners();
    await this.#initializePageLabels();

    this.store.setState({
      filename,
      numPages: pdfDocument.numPages,
      pageNumber: 1,
      isDocumentLoaded: true,
      url: url.toString(),
    });

    const rawAttachments =
      (await pdfDocument.getAttachments()) as TPDFDocumentAttachments;
    const attachments = new Map(
      Object.keys(rawAttachments ?? {})
        .sort((a, b) => a.toLowerCase().localeCompare(b.toLowerCase()))
        .map((key) => [key, rawAttachments[key]])
    );
    this.store.setState({ attachments });

    await this.#parseDocumentInfo();

    this.forceRendering();
  }

  async #initializePageLabels() {
    const pdfDocument = this.document!;
    const labels = (await pdfDocument.getPageLabels()) ?? [];

    const numLabels = labels.length;
    // Ignore page labels that correspond to standard page numbering,
    // or page labels that are all empty.
    let standardLabels = 0,
      emptyLabels = 0;
    for (let i = 0; i < numLabels; i++) {
      const label = labels[i];
      if (label === (i + 1).toString()) {
        standardLabels++;
      } else if (label === "") {
        emptyLabels++;
      } else {
        break;
      }
    }
    if (standardLabels >= numLabels || emptyLabels >= numLabels) {
      return;
    }
    const { viewer: pdfViewer, thumbnailViewer: pdfThumbnailViewer } = this;

    pdfViewer.setPageLabels(labels);
    pdfThumbnailViewer?.setPageLabels(labels);
  }

  async #parseDocumentInfo() {
    const { info, contentLength } = (await this.document!.getMetadata()) as any;
    const pageSize = await this.document!.getPage(
      this.store.getState().pageNumber
    ).then((pdfPage) => {
      return this.#parsePageSize(getPageSizeInches(pdfPage), 0);
    });

    this.store.setState({
      filesize: contentLength,
      title: info.Title,
      author: info.Author,
      subject: info.Subject,
      keywords: info.Keywords,
      creator: info.Creator,
      producer: info.Producer,
      version: info.PDFFormatVersion,
      creationDate: PDFDateString.toDateObject(info.CreationDate),
      modificationDate: PDFDateString.toDateObject(info.ModDate),
      isLinearized: info.IsLinearized,
      pageSize,
    });
  }

  async #parsePageSize(
    pageSizeInches: { width: number; height: number },
    pagesRotation: number
  ) {
    if (!pageSizeInches) {
      return undefined;
    }
    // Take the viewer rotation into account as well; compare with Adobe Reader.
    if (pagesRotation % 180 !== 0) {
      pageSizeInches = {
        width: pageSizeInches.height,
        height: pageSizeInches.width,
      };
    }
    const isPortrait = isPortraitOrientation(pageSizeInches);

    let sizeInches = {
      width: Math.round(pageSizeInches.width * 100) / 100,
      height: Math.round(pageSizeInches.height * 100) / 100,
    };
    // 1in == 25.4mm; no need to round to 2 decimals for millimeters.
    let sizeMillimeters = {
      width: Math.round(pageSizeInches.width * 25.4 * 10) / 10,
      height: Math.round(pageSizeInches.height * 25.4 * 10) / 10,
    };

    let rawName =
      getPageName(sizeInches, isPortrait, US_PAGE_NAMES) ||
      getPageName(sizeMillimeters, isPortrait, METRIC_PAGE_NAMES);

    if (
      !rawName &&
      !(
        Number.isInteger(sizeMillimeters.width) &&
        Number.isInteger(sizeMillimeters.height)
      )
    ) {
      // Attempt to improve the page name detection by falling back to fuzzy
      // matching of the metric dimensions, to account for e.g. rounding errors
      // and/or PDF files that define the page sizes in an imprecise manner.
      const exactMillimeters = {
        width: pageSizeInches.width * 25.4,
        height: pageSizeInches.height * 25.4,
      };
      const intMillimeters = {
        width: Math.round(sizeMillimeters.width),
        height: Math.round(sizeMillimeters.height),
      };

      // Try to avoid false positives, by only considering "small" differences.
      if (
        Math.abs(exactMillimeters.width - intMillimeters.width) < 0.1 &&
        Math.abs(exactMillimeters.height - intMillimeters.height) < 0.1
      ) {
        rawName = getPageName(intMillimeters, isPortrait, METRIC_PAGE_NAMES);
        if (rawName) {
          // Update *both* sizes, computed above, to ensure that the displayed
          // dimensions always correspond to the detected page name.
          sizeInches = {
            width: Math.round((intMillimeters.width / 25.4) * 100) / 100,
            height: Math.round((intMillimeters.height / 25.4) * 100) / 100,
          };
          sizeMillimeters = intMillimeters;
        }
      }
    }

    const _isNonMetricLocale = true;

    const [{ width, height }, unit, name, orientation] = await Promise.all([
      _isNonMetricLocale ? sizeInches : sizeMillimeters,
      this.l10n.get(
        `document_properties_page_size_unit_${
          _isNonMetricLocale ? "inches" : "millimeters"
        }`
      ),
      rawName &&
        this.l10n.get(
          `document_properties_page_size_name_${rawName.toLowerCase()}`
        ),
      this.l10n.get(
        `document_properties_page_size_orientation_${
          isPortrait ? "portrait" : "landscape"
        }`
      ),
    ]);

    return {
      width: width.toLocaleString(),
      height: height.toLocaleString(),
      unit,
      name,
      orientation,
    };
  }

  forceRendering(isThumbnailViewEnabled: boolean = true) {
    this.#renderingQueue.printing = !!this.printService;
    this.#renderingQueue.isThumbnailViewEnabled = isThumbnailViewEnabled;
    // @ts-ignore
    this.#renderingQueue.renderHighestPriority();
  }

  gotoPage(pageNumber: number) {
    this.linkService.goToPage(pageNumber);
  }

  openOrDownloadData(
    element: HTMLElement,
    content: Uint8Array,
    filename: string
  ) {
    this.downloadManager?.openOrDownloadData(element, content, filename);
  }

  async download() {
    const url = this.url;
    const { filename } = this;
    try {
      // this._ensureDownloadComplete();

      const data = await this.document!.getData();
      const blob = new Blob([data], { type: "application/pdf" });

      await this.downloadManager?.download(blob, url, filename, {});
    } catch (reason) {
      // When the PDF document isn't ready, or the PDF file is still
      // downloading, simply download using the URL.
      await this.downloadManager?.downloadUrl(url, filename, {});
    }
  }

  async save() {
    // if (this._saveInProgress) return;
    // this._saveInProgress = true;
    // await this.pdfScriptingManager.dispatchWillSave();

    const url = this.url;
    const { filename } = this;
    try {
      // this._ensureDownloadComplete();

      const data = await this.document!.saveDocument();
      const blob = new Blob([data], { type: "application/pdf" });

      await this.downloadManager?.download(blob, url, filename, {});
    } catch (reason: any) {
      // When the PDF document isn't ready, or the PDF file is still
      // downloading, simply fallback to a "regular" download.
      console.error(`Error when saving the document: ${reason.message}`);
      await this.download();
    } finally {
      // await this.pdfScriptingManager.dispatchDidSave();
      // this._saveInProgress = false;
    }

    // if (this._hasAnnotationEditors) {
    //   this.externalServices.reportTelemetry({
    //     type: "editing",
    //     data: { type: "save" },
    //   });
    // }
  }

  downloadOrSave() {
    const { annotationStorage } = this.document ?? {};
    if (annotationStorage && annotationStorage.size > 0) {
      this.save();
    } else {
      this.download();
    }
  }

  get supportsPrinting() {
    return PDFPrintServiceFactory.instance.supportsPrinting;
  }

  beforePrint() {
    // this._printAnnotationStoragePromise = this.pdfScriptingManager
    //   .dispatchWillPrint()
    //   .catch(() => {
    //     /* Avoid breaking printing; ignoring errors. */
    //   })
    //   .then(() => {
    //     return this.document?.annotationStorage.print;
    //   });

    if (this.printService) {
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
    if (!this.viewer.pageViewsReady) {
      this.l10n.get("printing_not_ready").then((msg) => {
        // eslint-disable-next-line no-alert
        window.alert(msg);
      });
      return;
    }

    const pagesOverview = this.viewer.getPagesOverview();
    const printContainer = document.getElementById("printContainer")!;
    const printResolution = this.printResolution;
    const optionalContentConfigPromise =
      this.viewer.optionalContentConfigPromise;

    const printService = PDFPrintServiceFactory.instance.createPrintService(
      this.document!,
      pagesOverview,
      printContainer,
      printResolution,
      optionalContentConfigPromise,
      null, // this._printAnnotationStoragePromise,
      this.l10n
    );
    this.printService = printService;
    this.forceRendering();
    // Disable the editor-indicator during printing (fixes bug 1790552).
    // this.setTitle();

    printService.layout();

    // if (this._hasAnnotationEditors) {
    //   this.externalServices.reportTelemetry({
    //     type: "editing",
    //     data: { type: "print" },
    //   });
    // }
  }

  afterPrint() {
    // if (this._printAnnotationStoragePromise) {
    //   this._printAnnotationStoragePromise.then(() => {
    //     this.pdfScriptingManager.dispatchDidPrint();
    //   });
    //   this._printAnnotationStoragePromise = null;
    // }

    if (this.printService) {
      this.printService.destroy();
      this.printService = null;

      this.document?.annotationStorage.resetModified();
    }
    this.forceRendering();
    // Re-enable the editor-indicator after printing (fixes bug 1790552).
    // this.setTitle();
  }

  requestPresentationMode() {
    this.pdfPresentationMode?.request();
  }

  triggerPrinting() {
    if (!this.supportsPrinting) {
      return;
    }
    window.print();
  }

  #initInternalEventListeners() {
    this.eventBus._on("pagesinit", this.#onDocumentReady.bind(this));
    this.eventBus._on("scalechanging", this.#onScaleChanging.bind(this));
    this.eventBus._on("pagechanging", this.#onPageChanging.bind(this));
    this.eventBus._on("pagerendered", this.#onPageRendered.bind(this));
    this.eventBus._on("rotationchanging", this.#onRotationChanging.bind(this));
    this.eventBus._on("switchspreadmode", this.#onSwitchSpreadMode.bind(this));
    this.eventBus._on("switchscrollmode", this.#onSwitchScrollMode.bind(this));

    this.eventBus._on("beforeprint", this.beforePrint.bind(this));
    this.eventBus._on("afterprint", this.afterPrint.bind(this));

    window.onbeforeprint = (e) => {
      this.eventBus.dispatch("beforeprint", { source: window });
    };

    window.onafterprint = (e) => {
      this.eventBus.dispatch("afterprint", { source: window });
    };
  }

  async #onDocumentReady({ source }: TEventBusEvent) {
    const documentOutline =
      (await this.document?.getOutline()) as unknown as TPDFDocumentOutline;

    const scaleValue = this.store.getState().scaleValue;
    // source._setScale(scaleValue, {}); // page-fit, page-actual, auto, page-width
    source.currentScale = 1;
    source.currentScaleValue = "auto";
    this.store.setState({
      documentOutline,
      pageNumber: 1,
      scaleValue,
      pagesReady: true,
    });
  }

  #onRotationChanging({ pagesRotation, pageNumber }: TEventBusEvent) {
    this.store.setState({ pagesRotation });
    if (this.thumbnailViewer) {
      this.thumbnailViewer.pagesRotation = pagesRotation;
    }

    this.forceRendering();
    // Ensure that the active page doesn't change during rotation.
    this.viewer.currentPageNumber = pageNumber;
  }

  #onSwitchSpreadMode({ mode: spreadMode }: TEventBusEvent) {
    this.store.setState({ spreadMode });
  }

  #onSwitchScrollMode({ mode: scrollMode }: TEventBusEvent) {
    this.store.setState({ scrollMode });
  }

  #onScaleChanging({ scale, presetValue: scaleValue }: TEventBusEvent) {
    this.store.setState({ scale, scaleValue });
    this.viewer.update();
  }

  #onPageChanging({ pageNumber }: TEventBusEvent) {
    this.thumbnailViewer?.scrollThumbnailIntoView(pageNumber);
    this.store.setState({ pageNumber });
  }

  #onPageRendered({ pageNumber, error }: TEventBusEvent) {
    // Use the rendered page to set the corresponding thumbnail image.
    if (this.#thumbsContainer) {
      const pageView = this.viewer.getPageView(pageNumber - 1);
      const thumbnailView = this.thumbnailViewer?.getThumbnail(pageNumber - 1);
      if (pageView && thumbnailView) {
        thumbnailView.setImage(pageView);
      }
    }
  }

  _cleanup() {
    if (!this.document) {
      return; // run cleanup when document is loaded
    }

    try {
      this.viewer.cleanup();
      this.thumbnailViewer?.cleanup();
      this.document.cleanup();
    } catch (reason) {
      console.error("Unable to perform cleanup", reason);
    }
  }

  setAnnotationEditorMode(annotationEditorMode: number) {
    // @ts-ignore: agr updated to { mode: number, editId: null } see: https://github.com/mozilla/pdf.js/commit/5c5f9af803187d616703c19987eca5d7d39d9420
    this.viewer.annotationEditorMode = { mode: annotationEditorMode };
    this.store.setState({ annotationEditorMode });
  }

  setAnnotationEditorParams(
    annotationEditorParams:
      | { type: number; value: any }
      | { type: number; value: any }[]
  ) {
    const pairs = Array.isArray(annotationEditorParams)
      ? annotationEditorParams
      : [annotationEditorParams];
    for (const params of pairs) {
      this.viewer.annotationEditorParams = params;
    }
  }

  setSpreadMode(spread: number) {
    if (isValidSpreadMode(spread)) {
      this.viewer.spreadMode = spread;
      this.dispatch("switchspreadmode", { mode: spread });
    }
  }

  setScrollMode(scroll: number) {
    if (isValidScrollMode(scroll)) {
      this.viewer.scrollMode = scroll;
      this.dispatch("switchscrollmode", { mode: scroll });
    }
  }

  setRotation(rotation: number) {
    if (isValidRotation(rotation)) {
      this.viewer.pagesRotation = rotation;
    }
  }

  getPagesOverview() {
    try {
      const pagesOverview =
        (this.viewer?.getPagesOverview() as {
          width: number;
          height: number;
          rotation: number;
        }[]) ?? [];
      return pagesOverview;
    } catch (reason) {
      return [];
    }
  }

  /**
   * Zoom In
   */
  increaseScale() {
    this.viewer.increaseScale();
  }

  /**
   * Zoom out
   */
  decreaseScale() {
    this.viewer.decreaseScale();
  }

  /**
   * Set preset value ("auto", "page-width" wtc)
   */
  set currentScaleValue(val: string) {
    this.viewer.currentScaleValue = val;
  }

  /**
   * Set viewer's scale to a number value
   */
  set currentScale(val: number) {
    this.viewer.currentScale = val;
  }

  getPageView(ix: number) {
    return this.viewer.getPageView(ix) as PDFPageView;
  }

  /**
   * Add event listener on the pdfViewer eventBus
   * @param eventName TEventBusName
   * @param listener TEventBusListener
   * @param options TEventBusOptions
   */
  on(
    eventName: TEventBusName,
    listener: TEventBusListener,
    options?: TEventBusOptions
  ) {
    this.eventBus.on(eventName, listener, options);
  }

  /**
   * Remove event listener from the pdfViewer eventBus
   * @param eventName TEventBusName
   * @param listener TEventBusListener
   * @param options TEventBusOptions
   */
  off(
    eventName: TEventBusName,
    listener: TEventBusListener,
    options?: TEventBusOptions
  ) {
    this.eventBus.off(eventName, listener, options);
  }

  /**
   * Dispatch event on teh eventBus
   * @param eventName TEventBusName
   * @param data Object
   */
  dispatch(eventName: TEventBusName, data: Object) {
    this.eventBus.dispatch(eventName, data);
  }
}
