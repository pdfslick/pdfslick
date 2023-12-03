import { writable } from 'svelte/store';
import type { PDFSlick } from '@pdfslick/core';
import type { PDFThumbnailView } from '@pdfslick/core/dist/esm/lib';

export type TPDFDocumentOutline = {
	title: string;
	bold: boolean;
	italic: boolean;
	color: Uint8ClampedArray;
	// eslint-disable-next-line  @typescript-eslint/no-explicit-any
	dest: string | any[];
	url: string;
	unsafeUrl: string;
	newWindow: boolean;
	count: number;
	items: TPDFDocumentOutline;
}[];
type TPDFDocumentAttachment = {
	filename: string;
	content: Uint8Array;
};
type PDFSlickState = {
	isDocumentLoaded: boolean;
	pagesReady: boolean;
	numPages: number;
	pageNumber: number;
	scale: number;
	scaleValue: string | undefined;
	pagesRotation: number;
	spreadMode: number;
	scrollMode: number;
	url: string | null;
	filename?: string;
	filesize?: number;
	title?: string;
	author?: string;
	subject?: string;
	// eslint-disable-next-line  @typescript-eslint/no-explicit-any
	keywords?: any;
	creationDate?: Date | null;
	modificationDate?: Date | null;
	creator?: string;
	producer?: string;
	version?: string;
	// eslint-disable-next-line  @typescript-eslint/no-explicit-any
	pageSize?: any;
	isLinearized?: boolean;
	documentOutline: TPDFDocumentOutline | null;
	attachments: Map<string, TPDFDocumentAttachment>;
	annotationEditorMode: number;
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

/**
 * Svelte Writables ============================================================
 */

/** Keep track of entire PDFSlick state */
export const pdfSlickStore = writable<PDFSlickState>();

/** Sidebar's tabs */
export const tab = writable<'thumbnails' | 'outline' | 'attachments'>('thumbnails');

/** Keep track of sidebar's open/closed state */
export const isThumbsbarOpen = writable(false);
