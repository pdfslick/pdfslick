/* Copyright 2012 Mozilla Foundation
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/** @typedef {import("../src/display/api").PDFDocumentProxy} PDFDocumentProxy */
/** @typedef {import("./interfaces").IL10n} IL10n */
/** @typedef {import("./interfaces").IPDFLinkService} IPDFLinkService */
// eslint-disable-next-line max-len
/** @typedef {import("./pdf_rendering_queue").PDFRenderingQueue} PDFRenderingQueue */

import {
  getVisibleElements,
  isValidRotation,
  RenderingStates,
  scrollIntoView,
  watchScroll,
} from "./ui_utils";
import { PDFThumbnailView, TempImageFactory } from "./pdf_thumbnail_view";
import { PDFDocumentProxy } from "pdfjs-dist";
import { StoreApi } from "zustand/vanilla";
import type { PDFSlickState } from "../types";

const THUMBNAIL_SCROLL_MARGIN = -19;
const THUMBNAIL_SELECTED_CLASS = "selected";

/**
 * @typedef {Object} PDFThumbnailViewerOptions
 * @property {HTMLDivElement} container - The container for the thumbnail
 *   elements.
 * @property {IPDFLinkService} linkService - The navigation/linking service.
 * @property {PDFRenderingQueue} renderingQueue - The rendering queue object.
 * @property {IL10n} l10n - Localization service.
 * @property {Object} [pageColors] - Overwrites background and foreground colors
 *   with user defined ones in order to improve readability in high contrast
 *   mode.
 */

/**
 * Viewer control to display thumbnails for pages in a PDF document.
 */
class PDFThumbnailViewer {
  container: HTMLElement;
  linkService: any;
  renderingQueue: any;
  l10n: any;
  pageColors: { background: any, foreground: any } | null;
  scroll: any;

  _thumbnails: PDFThumbnailView[];
  _currentPageNumber: number;
  _pagesRotation?: number | null;
  _pageLabels: string[];

  pdfDocument: PDFDocumentProxy | null;

  store: StoreApi<PDFSlickState>;
  thumbnailWidth: number;

  /**
   * @param {PDFThumbnailViewerOptions} options
   */
  constructor({ container, linkService, renderingQueue, l10n, pageColors, store, thumbnailWidth }: {
    container: HTMLDivElement,
    linkService: any,
    renderingQueue: any,
    l10n: any,
    pageColors: { background: any, foreground: any } | null,
    store: StoreApi<PDFSlickState>,
    thumbnailWidth: number
  }) {
    this.container = container;
    this.linkService = linkService;
    this.renderingQueue = renderingQueue;
    this.l10n = l10n;
    this.pageColors = pageColors || null;

    this._thumbnails = []
    this._currentPageNumber = 0
    this._pagesRotation = 0
    this._pageLabels = []

    this.pdfDocument = null

    this.store = store
    this.thumbnailWidth = thumbnailWidth

    if (
      this.pageColors &&
      !(
        CSS.supports("color", this.pageColors.background) &&
        CSS.supports("color", this.pageColors.foreground)
      )
    ) {
      if (this.pageColors.background || this.pageColors.foreground) {
        console.warn(
          "PDFThumbnailViewer: Ignoring `pageColors`-option, since the browser doesn't support the values used."
        );
      }
      this.pageColors = null;
    }


    this.scroll = watchScroll(this.container, this._scrollUpdated.bind(this));
    this._resetView();
  }

  /**
   * @private
   */
  _scrollUpdated() {
    this.renderingQueue.renderHighestPriority();
  }

  getThumbnail(index: number) {
    return this._thumbnails[index];
  }

  /**
   * @private
   */
  _getVisibleThumbs() {
    return getVisibleElements({
      scrollEl: this.container,
      views: this._thumbnails
    })
  }

  scrollThumbnailIntoView(pageNumber: number) {
    if (!this.pdfDocument) {
      return;
    }
    const thumbnailView = this._thumbnails[pageNumber - 1];

    if (!thumbnailView) {
      console.error('scrollThumbnailIntoView: Invalid "pageNumber" parameter.');
      return;
    }

    if (pageNumber !== this._currentPageNumber) {
      const prevThumbnailView = this._thumbnails[this._currentPageNumber - 1];
      // Remove the highlight from the previous thumbnail...
      prevThumbnailView.div.classList.remove(THUMBNAIL_SELECTED_CLASS);
      // ... and add the highlight to the new thumbnail.
      thumbnailView.div.classList.add(THUMBNAIL_SELECTED_CLASS);
    }
    const visibleThumbs = this._getVisibleThumbs();
    const { first, last, views } = visibleThumbs

    // If the thumbnail isn't currently visible, scroll it into view.
    if (views.length > 0) {
      let shouldScroll = false;
      if (pageNumber <= first.id || pageNumber >= last?.id) {
        shouldScroll = true;
      } else {
        for (const { id, percent } of views) {
          if (id !== pageNumber) {
            continue;
          }
          shouldScroll = percent < 100;
          break;
        }
      }
      if (shouldScroll) {
        scrollIntoView(thumbnailView.div, { top: THUMBNAIL_SCROLL_MARGIN });
      }
    }

    this._currentPageNumber = pageNumber;

    this.forceRendering()
  }

  get pagesRotation() {
    return this._pagesRotation;
  }

  set pagesRotation(rotation) {
    if (!isValidRotation(rotation!)) {
      throw new Error("Invalid thumbnails rotation angle.");
    }
    if (!this.pdfDocument) {
      return;
    }
    if (this._pagesRotation === rotation) {
      return; // The rotation didn't change.
    }
    this._pagesRotation = rotation;

    const updateArgs = { rotation: rotation! };
    for (const thumbnail of this._thumbnails) {
      thumbnail.update(updateArgs);
    }
  }

  cleanup() {
    for (const thumbnail of this._thumbnails) {
      if (thumbnail.renderingState !== RenderingStates.FINISHED) {
        thumbnail.reset();
      }
    }
    TempImageFactory.destroyCanvas();
  }

  /**
   * @private
   */
  _resetView() {
    this._thumbnails = [];
    this._currentPageNumber = 1;
    this._pageLabels = [];
    this._pagesRotation = 0;

    // Remove the thumbnails from the DOM.
    this.container.textContent = "";
  }

  /**
   * @param {PDFDocumentProxy} pdfDocument
   */
  setDocument(pdfDocument: PDFDocumentProxy) {
    if (this.pdfDocument) {
      this._cancelRendering();
      this._resetView();
    }

    this.pdfDocument = pdfDocument;
    if (!pdfDocument) {
      return;
    }
    const firstPagePromise = pdfDocument.getPage(1);
    const optionalContentConfigPromise = pdfDocument.getOptionalContentConfig();

    firstPagePromise
      .then(firstPdfPage => {
        const pagesCount = pdfDocument.numPages;
        const viewport = firstPdfPage.getViewport({ scale: 1 });

        for (let pageNum = 1; pageNum <= pagesCount; ++pageNum) {
          const thumbnail = new PDFThumbnailView({
            container: this.container,
            id: pageNum,
            defaultViewport: viewport.clone(),
            optionalContentConfigPromise,
            linkService: this.linkService,
            renderingQueue: this.renderingQueue,
            l10n: this.l10n,
            pageColors: this.pageColors,
            store: this.store,
            thumbnailWidth: this.thumbnailWidth
          });
          this._thumbnails.push(thumbnail);
        }
        // Set the first `pdfPage` immediately, since it's already loaded,
        // rather than having to repeat the `PDFDocumentProxy.getPage` call in
        // the `this.#ensurePdfPageLoaded` method before rendering can start.
        this._thumbnails[0]?.setPdfPage(firstPdfPage);

        // Ensure that the current thumbnail is always highlighted on load.
        const thumbnailView = this._thumbnails[this._currentPageNumber - 1];
        thumbnailView.div.classList.add(THUMBNAIL_SELECTED_CLASS);

        this.store.getState()._setThumbnailsViews(this._thumbnails)
      })
      .catch(reason => {
        console.error("Unable to initialize thumbnail viewer", reason);
      });
  }

  /**
   * @private
   */
  _cancelRendering() {
    for (const thumbnail of this._thumbnails) {
      thumbnail.cancelRendering();
    }
  }

  /**
   * @param {Array|null} labels
   */
  setPageLabels(labels: string[]) {
    if (!this.pdfDocument) {
      return;
    }
    if (!labels) {
      this._pageLabels = [];
    } else if (
      !(Array.isArray(labels) && this.pdfDocument.numPages === labels.length)
    ) {
      this._pageLabels = [];
      console.error("PDFThumbnailViewer_setPageLabels: Invalid page labels.");
    } else {
      this._pageLabels = labels;
    }
    // Update all the `PDFThumbnailView` instances.
    for (let i = 0, ii = this._thumbnails.length; i < ii; i++) {
      this._thumbnails[i].setPageLabel(this._pageLabels?.[i] ?? null);
    }
  }

  /**
   * @param {PDFThumbnailView} thumbView
   * @returns {Promise<PDFPageProxy | null>}
   */
  async #ensurePdfPageLoaded(thumbView: PDFThumbnailView | null) {
    if (thumbView?.pdfPage) {
      return thumbView.pdfPage;
    }
    try {
      const pdfPage = await this.pdfDocument?.getPage(thumbView!.id);
      if (!thumbView?.pdfPage) {
        thumbView!.setPdfPage(pdfPage!);
      }
      return pdfPage;
    } catch (reason) {
      console.error("Unable to get page for thumb view", reason);
      return null; // Page error -- there is nothing that can be done.
    }
  }

  #getScrollAhead(visible: any) {
    // console.log(`visible: `, visible)
    if (visible.first?.id === 1) {
      return true;
    } else if (visible.last?.id === this._thumbnails.length) {
      return false;
    }
    return this.scroll.down;
  }

  forceRendering() {
    const visibleThumbs = this._getVisibleThumbs();
    // console.log(`forceRendering, visibleThumbs: `, visibleThumbs)
    const scrollAhead = this.#getScrollAhead(visibleThumbs!);
    const thumbView = this.renderingQueue.getHighestPriority(
      visibleThumbs,
      this._thumbnails,
      scrollAhead
    );
    // console.log(`forceRendering, thumbView: `, thumbView)
    if (thumbView) {
      this.#ensurePdfPageLoaded(thumbView).then(() => {
        this.renderingQueue.renderView(thumbView);
      });
      return true;
    }
    return false;
  }
}

export { PDFThumbnailViewer };
