import { createStore } from 'zustand/vanilla'
import { AnnotationEditorType } from "pdfjs-dist";
import { SpreadMode, ScrollMode } from './lib';
import type { PDFSlickState, PDFSlickStateProps } from './types'

export const initialState: PDFSlickStateProps = {
  isDocumentLoaded: false,
  pagesReady: false,

  url: null,

  numPages: 0,
  pageNumber: 0,
  scale: 0,
  scaleValue: "auto",
  pagesRotation: 0,
  spreadMode: SpreadMode.UNKNOWN,
  scrollMode: ScrollMode.UNKNOWN,

  documentOutline: null,
  attachments: new Map(),

  thumbnails: new Map(),
  thumbnailViews: new Map(),

  annotationEditorMode: AnnotationEditorType.NONE,

  pdfSlick: null
}

export const create = () => createStore<PDFSlickState>((set, get) => ({
  ...initialState,
  _setThumbnailView: (pageNumber, view) => {
    const thumbnails = new Map(get().thumbnails)
    const thumbnailViews = new Map(get().thumbnailViews)

    const {
      canvasWidth: width,
      canvasHeight: height,
      scale,
      rotation,
      loaded,
      pageLabel,
      src = null,
    } = view

    thumbnailViews.set(pageNumber, view);
    thumbnails.set(pageNumber, {
      pageNumber,
      width,
      height,
      scale,
      rotation,
      loaded,
      pageLabel,
      src,
    })
    set({ thumbnailViews, thumbnails })
  },
  _setThumbnailsViews: (views) => {
    const thumbnailViews = new Map(views.map(view => [view.id, view]))
    const thumbnails = new Map(views.map(view => {
      const {
        canvasWidth: width,
        canvasHeight: height,
        scale,
        rotation,
        loaded,
        pageLabel,
        src = null,
      } = view

      return [view.id, {
        pageNumber: view.id,
        width,
        height,
        scale,
        rotation,
        loaded,
        pageLabel,
        src,
      }]
    }))

    set({ thumbnailViews, thumbnails })
  },
}))
