import {
    type OnProgressParameters,
    GlobalWorkerOptions,
    getDocument,
    getPdfFilenameFromUrl,
    AnnotationEditorType,
    AnnotationMode,
    PDFDocumentProxy,
    PDFDateString,
    AbortException,
    ResponseException,
    InvalidPDFException,
    RenderingCancelledException,
    AnnotationEditorParamsType
} from "pdfjs-dist";
import type { DocumentInitParameters } from "pdfjs-dist/types/src/display/api";
import {
    EventBus,
    PDFViewer,
    PDFLinkService,
    GenericL10n,
    DownloadManager,
    PDFFindController,
    PDFPageView,
    PDFSinglePageViewer
} from "pdfjs-dist/web/pdf_viewer.mjs";

import { IL10n, PDFViewerOptions } from "pdfjs-dist/types/web/pdf_viewer";
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
    PDFPresentationMode,
} from "./lib";

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
import { PDFSlickPrintService } from "./PDFSlickPrintService";
import { PDFSlickPrintDialog } from "./PDFSlickPrintDialog";

export type PDFException =
    | AbortException
    | ResponseException
    | InvalidPDFException
    | RenderingCancelledException;

GlobalWorkerOptions.workerSrc = new URL(
    'pdfjs-dist/build/pdf.worker.min.mjs',
    import.meta.url
).toString();

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
    #renderingQueue: PDFRenderingQueue;
    #container: HTMLDivElement;
    #viewerContainer: HTMLDivElement | undefined;
    #thumbsContainer: HTMLDivElement | undefined;
    #printService: PDFSlickPrintService;

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
    l10n: IL10n;
    singlePageViewer: boolean;
    removePageBorders: boolean;
    enablePrintAutoRotate: boolean;
    useOnlyCssZoom: boolean;
    pageColors: { background: any; foreground: any } | null;
    annotationEditorHighlightColors: string | undefined;
    textLayerMode: number;
    maxCanvasPixels: number;
    maxCanvasDim: number;
    capCanvasAreaFactor: number;
    printResolution: number;
    thumbnailWidth: number;
    enableHWA: boolean;
    enableDetailCanvas: boolean
    enableOptimizedPartialRendering: boolean;
    minDurationToUpdateCanvas: number;
    getDocumentParams: DocumentInitParameters;

    #onError: ((err: PDFException) => void) | undefined;

    #eventAbortController: AbortController | undefined | null;

    constructor({
        container,
        viewer,
        thumbs,
        store = createStore(),
        options,
        onError,
        printDialog,
    }: PDFSlickInputArgs) {
        this.#container = container;
        this.#viewerContainer = viewer;
        this.#thumbsContainer = thumbs;
        this.#onError = onError;

        this.l10n = options?.l10n ?? new GenericL10n(navigator.language);
        this.downloadManager = new DownloadManager();

        this.textLayerMode = options?.textLayerMode ?? TextLayerMode.ENABLE;
        this.#annotationMode = options?.annotationMode ?? AnnotationMode.ENABLE_FORMS;
        this.#annotationEditorMode = options?.annotationEditorMode ?? AnnotationEditorType.NONE;
        this.annotationEditorHighlightColors = options?.annotationEditorHighlightColors ?? "yellow=#FFFF98,green=#53FFBC,blue=#80EBFF,pink=#FFCBE6,red=#FF4F5F"
        this.removePageBorders = options?.removePageBorders ?? false;
        this.singlePageViewer = options?.singlePageViewer ?? false;
        this.enablePrintAutoRotate = options?.enablePrintAutoRotate ?? false;
        this.useOnlyCssZoom = options?.useOnlyCssZoom ?? false;
        this.pageColors = options?.pageColors ?? null;
        this.maxCanvasPixels = options?.maxCanvasPixels ?? 2 ** 24;
        this.maxCanvasDim = options?.maxCanvasDim ?? 32767
        this.capCanvasAreaFactor = options?.capCanvasAreaFactor ?? 200;
        this.printResolution = options?.printResolution ?? 96;
        this.thumbnailWidth = options?.thumbnailWidth ?? 125;
        this.enableHWA = options?.enableHWA ?? false;
        this.enableDetailCanvas = options?.enableDetailCanvas ?? true;
        this.enableOptimizedPartialRendering = options?.enableOptimizedPartialRendering ?? false;
        this.minDurationToUpdateCanvas = options?.minDurationToUpdateCanvas ?? 500;
        this.getDocumentParams = options?.getDocumentParams ?? {};

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
        this.store = store;

        const renderingQueue = new PDFRenderingQueue();
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
        const findController = new PDFFindController({ eventBus, linkService });

        const viewerOptions: PDFViewerOptions = {
            container,
            ...(viewer && { viewer }),
            eventBus,
            linkService,
            findController,
            renderingQueue: renderingQueue as unknown as PDFViewerOptions['renderingQueue'],
            textLayerMode: this.textLayerMode,
            annotationEditorHighlightColors: this.annotationEditorHighlightColors,
            l10n: this.l10n,
            annotationMode: this.#annotationMode,
            annotationEditorMode: this.#annotationEditorMode,
            removePageBorders: this.removePageBorders,
            imageResourcesPath: "/images/",
            enableHWA: this.enableHWA,
            enableDetailCanvas: this.enableDetailCanvas,
            enableOptimizedPartialRendering: this.enableOptimizedPartialRendering,
            minDurationToUpdateCanvas: this.minDurationToUpdateCanvas,
            maxCanvasPixels: this.useOnlyCssZoom === true ? 0 : this.maxCanvasPixels,
            maxCanvasDim: this.maxCanvasDim,
            capCanvasAreaFactor: this.capCanvasAreaFactor,
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
                maxCanvasPixels: this.useOnlyCssZoom === true ? 0 : this.maxCanvasPixels,
                maxCanvasDim: this.maxCanvasDim,
                pageColors: this.pageColors,
                enableHWA: this.enableHWA,
                store: store,
                thumbnailWidth: this.thumbnailWidth,
                abortSignal: this.#eventAbortController?.signal,

            });
            renderingQueue.setThumbnailViewer(
                this.thumbnailViewer
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
        this.findController = findController;
        this.viewer = pdfViewer;
        this.linkService.setViewer(pdfViewer);

        this.#printService = new PDFSlickPrintService({
            eventBus,
            slick: this,
            printDialog: printDialog ?? PDFSlickPrintDialog.create(),
        });

        const scaleValue = options?.scaleValue ?? "auto";
        this.store.setState({ scaleValue });
    }

    async loadDocument(
        url: string | URL | ArrayBuffer,
        options?: { filename?: string; onProgress?: (_: OnProgressParameters) => void; },
    ) {
        if (this.url && typeof this.url === "string") {
            try {
                URL.revokeObjectURL(this.url);
            } catch (err) { }
        }

        try {
            this.document?.destroy();
            this.viewer?.cleanup();

            if (url instanceof URL) {
                this.url = url.toString();
            } else if (url instanceof ArrayBuffer) {
                this.url = URL.createObjectURL(new Blob([url], { type: "application/pdf" }));
            } else {
                this.url = url;
            }

            const filename = options?.filename ?? getPdfFilenameFromUrl(this.url?.toString());
            this.filename = filename;

            const pdfDocumentLoader = getDocument({
                ...this.getDocumentParams,
                url: this.url,
                isEvalSupported: false
            });

            if (!!options?.onProgress) {
                pdfDocumentLoader.onProgress = options.onProgress;
            }

            const pdfDocument = await pdfDocumentLoader.promise;

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
        } catch (err) {
            if (this.#onError) {
                this.#onError(err as PDFException);
            }
        }
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
                `document_properties_page_size_unit_${_isNonMetricLocale ? "inches" : "millimeters"}`, null
            ),
            rawName &&
            this.l10n.get(
                `document_properties_page_size_name_${rawName.toLowerCase()}`, null
            ),
            this.l10n.get(
                `document_properties_page_size_orientation_${isPortrait ? "portrait" : "landscape"}`, null
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
        this.#renderingQueue.printing = !!this.#printService.printing;
        this.#renderingQueue.isThumbnailViewEnabled = isThumbnailViewEnabled;
        this.#renderingQueue.renderHighestPriority();
    }

    gotoPage(pageNumber: number) {
        this.linkService.goToPage(pageNumber);
    }

    openOrDownloadData(
        data: Uint8Array,
        filename: string
    ) {
        this.downloadManager?.openOrDownloadData(data, filename);
    }

    async download() {
        const url = this.url;
        const { filename } = this;
        try {
            // this._ensureDownloadComplete();

            const data = (await this.document!.getData()).slice(0);
            const blob = new Blob([data], { type: "application/pdf" });

            await this.downloadManager?.download(blob, url, filename);
        } catch (reason) {
            // When the PDF document isn't ready, or the PDF file is still
            // downloading, simply download using the URL.
            await this.downloadManager?.download(null, url, filename);
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

            const data = (await this.document!.saveDocument()).slice(0);
            const blob = new Blob([data], { type: "application/pdf" });

            await this.downloadManager?.download(blob, url, filename);
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
        return this.#printService.supportsPrinting;
    }

    requestPresentationMode() {
        this.pdfPresentationMode?.request();
    }

    triggerPrinting() {
        this.#printService.print();
    }

    #initInternalEventListeners() {
        this.#eventAbortController = new AbortController();
        const { signal } = this.#eventAbortController;
        const opts: any = { signal };

        this.eventBus._on("pagesinit", this.#onDocumentReady.bind(this), opts);
        this.eventBus._on("scalechanging", this.#onScaleChanging.bind(this), opts);
        this.eventBus._on("pagechanging", this.#onPageChanging.bind(this), opts);
        this.eventBus._on("pagerendered", this.#onPageRendered.bind(this), opts);
        this.eventBus._on("rotationchanging", this.#onRotationChanging.bind(this), opts);
        this.eventBus._on("switchspreadmode", this.#onSwitchSpreadMode.bind(this), opts);
        this.eventBus._on("switchscrollmode", this.#onSwitchScrollMode.bind(this), opts);
    }

    unbindEvents() {
        this.#eventAbortController?.abort();
        this.#eventAbortController = null;
        this.#printService.unbindEvents();
    }

    async #onDocumentReady({ source }: TEventBusEvent) {
        const documentOutline =
            (await this.document?.getOutline()) as unknown as TPDFDocumentOutline;

        const scaleValue = this.store.getState().scaleValue;
        // source.currentScale = 1;
        source.currentScaleValue = scaleValue ?? "auto";
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
        this.viewer.annotationEditorMode = { mode: annotationEditorMode }
        this.dispatch("switchannotationeditormode", {
            source: this,
            mode: annotationEditorMode
        })
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
            this.dispatch("switchannotationeditorparams", {
                source: this,
                type: params.type,
                value: params.value,
            });
        }
    }

    setHighlightDefaultColor(color: string) {
        this.setAnnotationEditorMode(
            AnnotationEditorType.HIGHLIGHT
        );

        this.setAnnotationEditorParams([
            {
                type: AnnotationEditorParamsType.HIGHLIGHT_COLOR,
                value: color,
            },
        ]);

        this.store.setState({ highlightDefaultColor: color })
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
     * Dispatch event on the eventBus
     * @param eventName TEventBusName
     * @param data Object
     */
    dispatch(eventName: TEventBusName, data: Object) {
        this.eventBus.dispatch(eventName, data);
    }
}
