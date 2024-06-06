import { PDFViewer } from "pdfjs-dist/web/pdf_viewer";
import { StoreApi } from "zustand";
import { PDFSlick, type PDFException } from "./PDFSlick";
import { PDFThumbnailView } from "./lib";

export type TPDFDocumentOutline = {
  title: string;
  bold: boolean;
  italic: boolean;
  color: Uint8ClampedArray;
  dest: string | any[];
  url: string;
  unsafeUrl: string;
  newWindow: boolean;
  count: number;
  items: TPDFDocumentOutline;
}[];

export type TPDFDocumentAttachment = {
  filename: string;
  content: Uint8Array;
};

export type TPDFDocumentAttachments = Record<string, TPDFDocumentAttachment>;

export type PDFSlickStateProps = {
  isDocumentLoaded: boolean;
  pagesReady: boolean;

  numPages: number;
  pageNumber: number;
  scale: number;
  scaleValue: string | undefined;
  pagesRotation: number;
  spreadMode: number;
  scrollMode: number;

  // documentInfo
  url: string | ArrayBuffer | null;
  filename?: string;
  filesize?: number;
  title?: string;
  author?: string;
  subject?: string;
  keywords?: any;
  creationDate?: Date | null;
  modificationDate?: Date | null;
  creator?: string;
  producer?: string;
  version?: string;
  pageSize?: any;
  isLinearized?: boolean;

  documentOutline: TPDFDocumentOutline | null;
  attachments: Map<string, TPDFDocumentAttachment>;

  annotationEditorMode: number;

  // thumbnailViews: PDFThumbnailView[],
  thumbnailViews: Map<number, PDFThumbnailView>;
  thumbnails: Map<
    number,
    {
      pageNumber: number;
      width: number;
      height: number;
      scale: number;
      rotation: number;
      loaded: boolean;
      pageLabel: string | null;
      src: string | null;
    }
  >;

  pdfSlick: PDFSlick | null;
};

export type PDFSlickStateSetters = {
  _setThumbnailView: (pageNumber: number, view: PDFThumbnailView) => void;
  _setThumbnailsViews: (views: PDFThumbnailView[]) => void;
};

export type PDFSlickState = PDFSlickStateProps & PDFSlickStateSetters;

export type TEventBusEvent = {
  source: PDFViewer;
  pagesCount: number;
  pageNumber: number;
  pagesRotation: number;
  pageLabel: string;
  previous: number;
  scale: number;
  mode: number; // switchspreadmode + switchscrollmode
  presetValue: string | undefined;
  error?: any;
};

export type PDFSlickOptions = {
  textLayerMode?: number;
  annotationMode?: number;
  annotationEditorMode?: number;
  singlePageViewer?: boolean;
  removePageBorders?: boolean;
  enablePrintAutoRotate?: boolean;
  useOnlyCssZoom?: boolean;
  pageColors?: { background: any; foreground: any };
  l10n?: any;
  maxCanvasPixels?: number;
  printResolution?: number;
  thumbnailWidth?: number;
  scaleValue?: string;
  filename?: string;
};

export type PDFSlickInputArgs = {
  container: HTMLDivElement;
  viewer?: HTMLDivElement | undefined;
  thumbs?: HTMLDivElement | undefined;
  store?: StoreApi<PDFSlickState>;
  options?: PDFSlickOptions;
  onError?: (err: PDFException) => void;
};

export type TEventBusName =
  | "textlayerrendered"
  | "pagesinit"
  | "pagesloaded"
  | "scalechanging"
  | "pagechanging"
  | string;
export type TEventBusOptions = {
  once?: boolean;
};

export type TEventBusListener = (source: TEventBusEvent | Object) => void;

export type TEventBusOn = (
  eventName: TEventBusName,
  listener: TEventBusListener,
  options: TEventBusOptions
) => void;
