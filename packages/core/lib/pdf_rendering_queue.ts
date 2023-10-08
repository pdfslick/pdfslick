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

/** @typedef {import("./interfaces").IRenderableView} IRenderableView */
/** @typedef {import("./pdf_viewer").PDFViewer} PDFViewer */
// eslint-disable-next-line max-len
/** @typedef {import("./pdf_thumbnail_viewer").PDFThumbnailViewer} PDFThumbnailViewer */

import { RenderingCancelledException } from "pdfjs-dist";
import { RenderingStates } from "./ui_utils";
import { PDFThumbnailView } from "./pdf_thumbnail_view";
import { IRenderableView } from "pdfjs-dist/types/web/interfaces.js";
import { PDFThumbnailViewer } from "./pdf_thumbnail_viewer";

import { PDFViewer, PDFPageView } from "pdfjs-dist/web/pdf_viewer";

const CLEANUP_TIMEOUT = 30000;

/**
 * Controls rendering of the views for pages and thumbnails.
 */
class PDFRenderingQueue {
  pdfViewer: PDFViewer | null;
  pdfThumbnailViewer: PDFThumbnailViewer | null;
  onIdle: (() => void) | null;
  highestPriorityPage: string | null;
  idleTimeout: ReturnType<typeof setTimeout> | null; // number | null
  printing: boolean;
  isThumbnailViewEnabled: boolean;

  constructor() {
    this.pdfViewer = null;
    this.pdfThumbnailViewer = null;
    this.onIdle = null;
    this.highestPriorityPage = null;
    /** @type {number} */
    this.idleTimeout = null;
    this.printing = false;
    this.isThumbnailViewEnabled = false;
  }

  /**
   * @param {PDFViewer} pdfViewer
   */
  setViewer(pdfViewer: PDFViewer) {
    this.pdfViewer = pdfViewer;
  }

  /**
   * @param {PDFThumbnailViewer} pdfThumbnailViewer
   */
  setThumbnailViewer(pdfThumbnailViewer: PDFThumbnailViewer) {
    this.pdfThumbnailViewer = pdfThumbnailViewer;
  }

  /**
   * @param {IRenderableView} view
   * @returns {boolean}
   */
  isHighestPriority(view: PDFPageView) {
    return this.highestPriorityPage === view.renderingId;
  }

  /**
   * @returns {boolean}
   */
  hasViewer() {
    return !!this.pdfViewer;
  }

  /**
   * @param {Object} currentlyVisiblePages
   */
  renderHighestPriority(currentlyVisiblePages?: Object) {
    if (this.idleTimeout) {
      clearTimeout(this.idleTimeout);
      this.idleTimeout = null;
    }

    // Pages have a higher priority than thumbnails, so check them first.
    if (this.pdfViewer?.forceRendering(currentlyVisiblePages)) {
      return;
    }
    // No pages needed rendering, so check thumbnails.
    if (
      this.isThumbnailViewEnabled &&
      this.pdfThumbnailViewer?.forceRendering()
    ) {
      return;
    }

    if (this.printing) {
      // If printing is currently ongoing do not reschedule cleanup.
      return;
    }

    if (this.onIdle) {
      this.idleTimeout = setTimeout(this.onIdle.bind(this), CLEANUP_TIMEOUT);
    }
  }

  /**
   * @param {Object} visible
   * @param {Array} views
   * @param {boolean} scrolledDown
   * @param {boolean} [preRenderExtra]
   */
  getHighestPriority(
    visible: { first: any; last: any; views: any; ids: any },
    views: PDFThumbnailView[],
    scrolledDown: boolean,
    preRenderExtra = false
  ) {
    /**
     * The state has changed. Figure out which page has the highest priority to
     * render next (if any).
     *
     * Priority:
     * 1. visible pages
     * 2. if last scrolled down, the page after the visible pages, or
     *    if last scrolled up, the page before the visible pages
     */
    const visibleViews = visible.views,
      numVisible = visibleViews.length;

    if (numVisible === 0) {
      return null;
    }
    for (let i = 0; i < numVisible; i++) {
      const view = visibleViews[i].view;
      if (!this.isViewFinished(view)) {
        return view;
      }
    }
    const firstId = visible.first.id,
      lastId = visible.last.id;

    // All the visible views have rendered; try to handle any "holes" in the
    // page layout (can happen e.g. with spreadModes at higher zoom levels).
    if (lastId - firstId + 1 > numVisible) {
      const visibleIds = visible.ids;
      for (let i = 1, ii = lastId - firstId; i < ii; i++) {
        const holeId = scrolledDown ? firstId + i : lastId - i;
        if (visibleIds.has(holeId)) {
          continue;
        }
        const holeView = views[holeId - 1];
        if (!this.isViewFinished(holeView)) {
          return holeView;
        }
      }
    }

    // All the visible views have rendered; try to render next/previous page.
    // (IDs start at 1, so no need to add 1 when `scrolledDown === true`.)
    let preRenderIndex = scrolledDown ? lastId : firstId - 2;
    let preRenderView = views[preRenderIndex];

    if (preRenderView && !this.isViewFinished(preRenderView)) {
      return preRenderView;
    }
    if (preRenderExtra) {
      preRenderIndex += scrolledDown ? 1 : -1;
      preRenderView = views[preRenderIndex];

      if (preRenderView && !this.isViewFinished(preRenderView)) {
        return preRenderView;
      }
    }
    // Everything that needs to be rendered has been.
    return null;
  }

  /**
   * @param {IRenderableView} view
   * @returns {boolean}
   */
  isViewFinished(view: IRenderableView) {
    return view.renderingState === RenderingStates.FINISHED;
  }

  /**
   * Render a page or thumbnail view. This calls the appropriate function
   * based on the views state. If the view is already rendered it will return
   * `false`.
   *
   * @param {IRenderableView} view
   */
  renderView(view: IRenderableView) {
    switch (view.renderingState) {
      case RenderingStates.FINISHED:
        return false;
      case RenderingStates.PAUSED:
        this.highestPriorityPage = view.renderingId;
        view.resume!();
        break;
      case RenderingStates.RUNNING:
        this.highestPriorityPage = view.renderingId;
        break;
      case RenderingStates.INITIAL:
        this.highestPriorityPage = view.renderingId;
        view
          .draw()
          .finally(() => {
            this.renderHighestPriority();
          })
          .catch((reason) => {
            if (reason instanceof RenderingCancelledException) {
              return;
            }
            console.error(`renderView: "${reason}"`);
          });
        break;
    }
    return true;
  }
}

export { PDFRenderingQueue };
