import { useState, useEffect, useCallback, RefCallback, useMemo } from "react";
import { StoreApi, useStore } from "zustand";
import { create, PDFSlick } from "@pdfslick/core";
import type { PDFSlickState, PDFSlickOptions } from "@pdfslick/core";
import PDFSlickViewer from "./PDFSlickViewer";
import { PDFSlickThumbnails } from "./PDFSlickThumbnails";

export type TUsePDFSlickStore = {
  (): PDFSlickState;
  <T>(
    selector: (state: PDFSlickState) => T,
    equals?: ((a: T, b: T) => boolean) | undefined
  ): T;
};

type TUsePDFSlick = (
  url: string | URL | undefined,

  options?: PDFSlickOptions
) => {
  isDocumentLoaded: boolean;
  viewerRef: RefCallback<HTMLElement>;
  thumbsRef: RefCallback<HTMLElement>;
  store: StoreApi<PDFSlickState>;
  usePDFSlickStore: TUsePDFSlickStore;
  PDFSlickViewer: typeof PDFSlickViewer;
  PDFSlickThumbnails: typeof PDFSlickThumbnails;
};

export function createStore(store: StoreApi<PDFSlickState>) {
  function usePDFSlickStore(): PDFSlickState;
  function usePDFSlickStore<T>(
    selector: (state: PDFSlickState) => T,
    equals?: (a: T, b: T) => boolean
  ): T;
  function usePDFSlickStore<T>(
    selector?: (state: PDFSlickState) => T,
    equals?: (a: T, b: T) => boolean
  ) {
    return useStore(store, selector!, equals);
  }

  return usePDFSlickStore;
}

/**
 * 
 * @param url PDF Document path
 * @param options PDFSlick Options
 * @returns 
 */
export const usePDFSlick: TUsePDFSlick = (url, options) => {
  const [isDocumentLoaded, setIsDocumentLoaded] = useState(false);
  const [container, setContainer] = useState<HTMLDivElement | null>(null);
  const [thumbs, setThumbs] = useState<HTMLDivElement | null>(null);

  const store = useMemo<StoreApi<PDFSlickState>>(() => create(), []);
  const usePDFSlickStore = useMemo<TUsePDFSlickStore>(
    () => createStore(store),
    []
  );

  const viewerRef = useCallback((node: HTMLDivElement) => {
    if (node !== null) {
      setContainer(node);
    }
  }, []);

  const thumbsRef = useCallback((node: HTMLDivElement) => {
    if (node !== null) {
      setThumbs(node);
    }
  }, []);

  useEffect(() => {
    if (url && container) {
      const pdfSlick = new PDFSlick({
        container,
        thumbs: thumbs!,
        store,
        options,
      });
      pdfSlick.loadDocument(url, options).then(() => setIsDocumentLoaded(true));
      store.setState({ pdfSlick });
    }

    return () => {};
  }, [url, container]);

  return {
    isDocumentLoaded,
    viewerRef,
    thumbsRef,
    usePDFSlickStore,
    store,
    PDFSlickViewer,
    PDFSlickThumbnails,
  };
};
