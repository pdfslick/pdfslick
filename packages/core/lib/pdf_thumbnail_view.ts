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

// eslint-disable-next-line max-len
/** @typedef {import("./event_utils").EventBus} EventBus */
/** @typedef {import("./interfaces").IL10n} IL10n */
/** @typedef {import("./interfaces").IPDFLinkService} IPDFLinkService */
/** @typedef {import("./interfaces").IRenderableView} IRenderableView */
/** @typedef {import("./pdf_rendering_queue").PDFRenderingQueue} PDFRenderingQueue */

import { OutputScale, RenderingStates } from "./ui_utils";
import {
  RenderingCancelledException,
  PDFPageProxy,
  PageViewport,
  RenderTask,
} from "pdfjs-dist";
import { PDFViewer, PDFPageView, EventBus } from "pdfjs-dist/web/pdf_viewer.mjs";
import { StoreApi } from "zustand/vanilla";
import type { PDFSlickState } from "../types";
import { OptionalContentConfig, PDFViewerOptions } from "pdfjs-dist/types/web/pdf_viewer";
import type { PDFRenderingQueue } from "./pdf_rendering_queue";

const DRAW_UPSCALE_FACTOR = 2; // See comment in `PDFThumbnailView.draw` below.
const MAX_NUM_SCALING_STEPS = 3;
const THUMBNAIL_WIDTH = 98; // px

/**
 * @typedef {Object} PDFThumbnailViewOptions
 * @property {HTMLDivElement} container - The viewer element.
 * @property {EventBus} eventBus - The application event bus.
 * @property {number} id - The thumbnail's unique ID (normally its number).
 * @property {PageViewport} defaultViewport - The page viewport.
 * @property {Promise<OptionalContentConfig>} [optionalContentConfigPromise] -
 *   A promise that is resolved with an {@link OptionalContentConfig} instance.
 *   The default value is `null`.
 * @property {IPDFLinkService} linkService - The navigation/linking service.
 * @property {PDFRenderingQueue} renderingQueue - The rendering queue object.
 * @property {Object} [pageColors] - Overwrites background and foreground colors
 *   with user defined ones in order to improve readability in high contrast
 *   mode.
 * @property {boolean} [enableHWA] - Enables hardware acceleration for
 *   rendering. The default value is `false`.
 */

class TempImageFactory {
  static #tempCanvas: HTMLCanvasElement | null = null;

  static getCanvas(width: number, height: number) {
    const tempCanvas = (this.#tempCanvas ||= document.createElement("canvas")) as HTMLCanvasElement;
    tempCanvas.width = width;
    tempCanvas.height = height;

    // Since this is a temporary canvas, we need to fill it with a white
    // background ourselves. `#getPageDrawContext` uses CSS rules for this.
    const ctx = tempCanvas.getContext("2d", { alpha: false })!;
    ctx.save();
    ctx.fillStyle = "rgb(255, 255, 255)";
    ctx.fillRect(0, 0, width, height);
    ctx.restore();
    return [tempCanvas!, tempCanvas.getContext("2d")!] as const;
  }

  static destroyCanvas() {
    const tempCanvas = this.#tempCanvas;
    if (tempCanvas) {
      // Zeroing the width and height causes Firefox to release graphics
      // resources immediately, which can greatly reduce memory consumption.
      tempCanvas.width = 0;
      tempCanvas.height = 0;
    }
    this.#tempCanvas = null;
  }
}

type PDFThumbnailViewOptions = {
  id: any;
  container: HTMLElement;
  eventBus: EventBus;
  defaultViewport: PageViewport;
  optionalContentConfigPromise?: Promise<OptionalContentConfig>
  linkService: NonNullable<PDFViewerOptions['linkService']>;
  renderingQueue: PDFRenderingQueue;
  pageColors: { background: any; foreground: any } | null;
  enableHWA?: boolean;
  store: StoreApi<PDFSlickState>;
  thumbnailWidth: number;
}

/**
 * @implements {IRenderableView}
 */
class PDFThumbnailView {
  id: number;
  eventBus: EventBus;
  viewport: PageViewport;
  _optionalContentConfigPromise: PDFThumbnailViewOptions['optionalContentConfigPromise'] | null;
  linkService: PDFThumbnailViewOptions['linkService'];
  renderingQueue: PDFThumbnailViewOptions['renderingQueue'];
  pageColors: PDFThumbnailViewOptions['pageColors'];
  enableHWA: boolean | null;

  store: StoreApi<PDFSlickState>;
  thumbnailWidth: number;
  loaded: boolean;

  renderingId: string;
  pageLabel: string | null;
  rotation: number;
  pdfPageRotate: number;

  renderTask: RenderTask | null;
  renderingState: number;
  resume: any;

  canvasWidth: number;
  canvasHeight: number;
  scale: number;

  pdfPage: PDFPageProxy | null;

  src?: string | null;

  div: HTMLDivElement;

  /**
   * @param {PDFThumbnailViewOptions} options
   */
  constructor({
    container,
    eventBus,
    id,
    defaultViewport,
    optionalContentConfigPromise,
    linkService,
    renderingQueue,
    pageColors,
    enableHWA,
    store,
    thumbnailWidth,
  }: PDFThumbnailViewOptions) {
    this.id = id;
    this.renderingId = "thumbnail" + id;
    this.pageLabel = null;

    this.pdfPage = null;
    this.rotation = 0;
    this.viewport = defaultViewport;
    this.pdfPageRotate = defaultViewport.rotation;
    this._optionalContentConfigPromise = optionalContentConfigPromise || null;
    this.pageColors = pageColors || null;
    this.enableHWA = enableHWA || false;

    this.eventBus = eventBus;
    this.linkService = linkService;
    this.renderingQueue = renderingQueue;

    this.renderTask = null;
    this.renderingState = RenderingStates.INITIAL;
    this.resume = null;

    // <pdf-slick>
    // const anchor = document.createElement("a");
    // anchor.href = linkService.getAnchorUrl("#page=" + id);
    // anchor.setAttribute("data-l10n-id", "pdfjs-thumb-page-title");
    // anchor.setAttribute("data-l10n-args", this.#pageL10nArgs);
    // anchor.onclick = function () {
    //   linkService.goToPage(id);
    //   return false;
    // };
    // this.anchor = anchor;

    // const div = document.createElement("div");
    // div.className = "thumbnail pdfSlickThumbHolder"; // <pdf-slick>
    // div.setAttribute("data-page-number", String(this.id));
    // this.div = div;
    // this.#updateDims();

    // const img = document.createElement("div");
    // img.className = "thumbnailImage";
    // this._placeholderImg = img;

    // div.append(img);
    // anchor.append(div);
    // container.append(anchor);

    // ---------------
    this.store = store;
    this.thumbnailWidth = thumbnailWidth;
    this.loaded = false;

    const div = document.createElement("div");
    div.className = "thumbnail pdfSlickThumbHolder";
    div.setAttribute("data-page-number", this.id.toString());
    this.div = div;
    this.#updateDims();

    container.append(div);
    // </pdf-slick>
  }

  #updateDims() {
    const { width, height } = this.viewport;
    const ratio = width / height;

    this.canvasWidth = this.thumbnailWidth; // <pdf-slick>
    this.canvasHeight = (this.canvasWidth / ratio) | 0;
    this.scale = this.canvasWidth / width;

    const { style } = this.div;
    style.setProperty("--thumbnail-width", `${this.canvasWidth}px`);
    style.setProperty("--thumbnail-height", `${this.canvasHeight}px`);
  }

  setPdfPage(pdfPage: PDFPageProxy) {
    this.pdfPage = pdfPage;
    this.pdfPageRotate = pdfPage.rotate;
    const totalRotation = (this.rotation + this.pdfPageRotate) % 360;
    this.viewport = pdfPage.getViewport({ scale: 1, rotation: totalRotation });
    this.reset();
  }

  reset() {
    this.cancelRendering();
    this.renderingState = RenderingStates.INITIAL;

    this.div.removeAttribute("data-loaded");
    // <pdf-slick>
    //this.image?.replaceWith(this._placeholderImg);
    //this.#updateDims();

    // if (this.image) {
    //   this.image.removeAttribute("src");
    //   delete this.image;
    // }

    // -----------
    this.loaded = false;
    this.#updateDims();
    // </pdf-slick>
  }

  update({ rotation = null }: { rotation: number | null }) {
    if (typeof rotation === "number") {
      this.rotation = rotation; // The rotation may be zero.
    }
    const totalRotation = (this.rotation + this.pdfPageRotate) % 360;
    this.viewport = this.viewport.clone({
      scale: 1,
      rotation: totalRotation,
    });
    this.reset();
  }

  /**
   * PLEASE NOTE: Most likely you want to use the `this.reset()` method,
   *              rather than calling this one directly.
   */
  cancelRendering() {
    if (this.renderTask) {
      this.renderTask.cancel();
      this.renderTask = null;
    }
    this.resume = null;
  }

  #getPageDrawContext(upscaleFactor = 1, enableHWA = this.enableHWA) {
    // Keep the no-thumbnail outline visible, i.e. `data-loaded === false`,
    // until rendering/image conversion is complete, to avoid display issues.
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d", {
      alpha: false,
      willReadFrequently: !enableHWA,
    })!;
    const outputScale = new OutputScale();

    canvas.width = (upscaleFactor * this.canvasWidth * outputScale.sx) | 0;
    canvas.height = (upscaleFactor * this.canvasHeight * outputScale.sy) | 0;

    const transform = outputScale.scaled
      ? [outputScale.sx, 0, 0, outputScale.sy, 0, 0]
      : null;

    return { ctx, canvas, transform };
  }

  #convertCanvasToImage(canvas: HTMLCanvasElement) {
    if (this.renderingState !== RenderingStates.FINISHED) {
      throw new Error("#convertCanvasToImage: Rendering has not finished.");
    }
    const reducedCanvas = this.#reduceImage(canvas);

    // <pdf-slick>
    // const image = document.createElement("img");
    // image.className = "thumbnailImage";
    // image.setAttribute("data-l10n-id", "pdfjs-thumb-page-canvas");
    // image.setAttribute("data-l10n-args", this.#pageL10nArgs);
    // image.src = reducedCanvas.toDataURL();
    // this.image = image;

    //this.div.setAttribute("data-loaded", 'true');
    //this._placeholderImg.replaceWith(image);

    // -------------
    this.src = reducedCanvas.toDataURL();
    this.div.setAttribute("data-loaded", "true");
    this.loaded = true;
    this.store.getState()._setThumbnailView(this.id, this);
    // </pdf-slick>

    // Zeroing the width and height causes Firefox to release graphics
    // resources immediately, which can greatly reduce memory consumption.
    reducedCanvas.width = 0;
    reducedCanvas.height = 0;
  }

  async #finishRenderTask(renderTask: any, canvas: HTMLCanvasElement, error: any = null) {
    // The renderTask may have been replaced by a new one, so only remove
    // the reference to the renderTask if it matches the one that is
    // triggering this callback.
    if (renderTask === this.renderTask) {
      this.renderTask = null;
    }

    if (error instanceof RenderingCancelledException) {
      return;
    }
    this.renderingState = RenderingStates.FINISHED;
    this.#convertCanvasToImage(canvas);

    if (error) {
      throw error;
    }
  }

  async draw() {
    if (this.renderingState !== RenderingStates.INITIAL) {
      console.error("Must be in new state before drawing");
      return undefined;
    }
    const { pdfPage } = this;

    if (!pdfPage) {
      this.renderingState = RenderingStates.FINISHED;
      throw new Error("pdfPage is not loaded");
    }

    this.renderingState = RenderingStates.RUNNING;

    // Render the thumbnail at a larger size and downsize the canvas (similar
    // to `setImage`), to improve consistency between thumbnails created by
    // the `draw` and `setImage` methods (fixes issue 8233).
    // NOTE: To primarily avoid increasing memory usage too much, but also to
    //   reduce downsizing overhead, we purposely limit the up-scaling factor.
    const { ctx, canvas, transform } =
      this.#getPageDrawContext(DRAW_UPSCALE_FACTOR);
    const drawViewport = this.viewport.clone({
      scale: DRAW_UPSCALE_FACTOR * this.scale,
    });
    const renderContinueCallback = (cont: () => void) => {
      if (!this.renderingQueue.isHighestPriority(this)) {
        this.renderingState = RenderingStates.PAUSED;
        this.resume = () => {
          this.renderingState = RenderingStates.RUNNING;
          cont();
        };
        return;
      }
      cont();
    };

    const renderContext = {
      canvasContext: ctx,
      transform,
      viewport: drawViewport,
      optionalContentConfigPromise: this._optionalContentConfigPromise,
      pageColors: this.pageColors,
    } as Parameters<PDFPageProxy["render"]>[0];
    const renderTask = (this.renderTask = pdfPage.render(renderContext));
    renderTask.onContinue = renderContinueCallback;

    const resultPromise = renderTask.promise.then(
      () => this.#finishRenderTask(renderTask, canvas),
      error => this.#finishRenderTask(renderTask, canvas, error)
    );
    resultPromise.finally(() => {
      // Zeroing the width and height causes Firefox to release graphics
      // resources immediately, which can greatly reduce memory consumption.
      canvas.width = 0;
      canvas.height = 0;

      this.eventBus.dispatch("thumbnailrendered", {
        source: this,
        pageNumber: this.id,
        pdfPage: this.pdfPage,
      });
    });

    return resultPromise;
  }

  setImage(pageView: PDFPageView) {
    if (this.renderingState !== RenderingStates.INITIAL) {
      return;
    }
    const { thumbnailCanvas: canvas, pdfPage, scale } = pageView;
    if (!canvas) {
      return;
    }
    if (!this.pdfPage) {
      this.setPdfPage(pdfPage);
    }
    if (scale < this.scale) {
      // Avoid upscaling the image, since that makes the thumbnail look blurry.
      return;
    }
    this.renderingState = RenderingStates.FINISHED;
    this.#convertCanvasToImage(canvas);
  }

  #reduceImage(img: HTMLCanvasElement) {
    const { ctx, canvas } = this.#getPageDrawContext(1, true);

    if (img.width <= 2 * canvas.width) {
      ctx.drawImage(
        img,
        0,
        0,
        img.width,
        img.height,
        0,
        0,
        canvas.width,
        canvas.height
      );
      return canvas;
    }
    // drawImage does an awful job of rescaling the image, doing it gradually.
    let reducedWidth = canvas.width << MAX_NUM_SCALING_STEPS;
    let reducedHeight = canvas.height << MAX_NUM_SCALING_STEPS;
    const [reducedImage, reducedImageCtx] = TempImageFactory.getCanvas(
      reducedWidth,
      reducedHeight
    );

    while (reducedWidth > img.width || reducedHeight > img.height) {
      reducedWidth >>= 1;
      reducedHeight >>= 1;
    }
    reducedImageCtx.drawImage(
      img,
      0,
      0,
      img.width,
      img.height,
      0,
      0,
      reducedWidth,
      reducedHeight
    );
    while (reducedWidth > 2 * canvas.width) {
      reducedImageCtx.drawImage(
        reducedImage,
        0,
        0,
        reducedWidth,
        reducedHeight,
        0,
        0,
        reducedWidth >> 1,
        reducedHeight >> 1
      );
      reducedWidth >>= 1;
      reducedHeight >>= 1;
    }
    ctx.drawImage(
      reducedImage,
      0,
      0,
      reducedWidth,
      reducedHeight,
      0,
      0,
      canvas.width,
      canvas.height
    );
    return canvas;
  }

  get #pageL10nArgs() {
    return JSON.stringify({ page: this.pageLabel ?? this.id });
  }

  /**
   * @param {string|null} label
   */
  setPageLabel(label: string | null) {
    this.pageLabel = typeof label === "string" ? label : null;

    // <pdf-slick>
    // this.anchor.setAttribute("data-l10n-args", this.#pageL10nArgs);

    // if (this.renderingState !== RenderingStates.FINISHED) {
    //   return;
    // }
    // this.image?.setAttribute("data-l10n-args", this.#pageL10nArgs);
    // </pdf-slick>
  }
}

export { PDFThumbnailView, TempImageFactory };
