<script lang="ts">
	import type { PDFSlickState, PDFSlick } from '@pdfslick/core';
	import { onMount, onDestroy } from 'svelte';
	import Thumbsbar from './Thumbsbar/Thumbsbar.svelte';
	import Toolbar from './Toolbar/Toolbar.svelte';
	import { pdfSlickStore, isThumbsbarOpen } from '$lib/store';

	/**
	 * We'll use predefined PDF url to a document, but if this were a
	 * Svelte component this could be a property as well
	 */
	export let url = '/pdfs/Wines-of-Macedonia-Brochure.pdf';

	let RO: ResizeObserver;

	let container: HTMLDivElement;
	let thumbs: HTMLDivElement;
	let store: import('zustand/vanilla').StoreApi<PDFSlickState>;
	let pdfSlick: PDFSlick;
	let unsubscribe: () => void = () => {};
	let openedInitial = false;

	/**
	 * Open thumbnails sidebar when PDF document is loaded
	 */
	$: {
		if ($pdfSlickStore && $pdfSlickStore.pagesReady && !openedInitial) {
			isThumbsbarOpen.set(true);
			openedInitial = true;
		}
	}

	onMount(async () => {
		/**
		 * This is all happening on client side, so make sure we load it only there
		 */
		const { create, PDFSlick } = await import('@pdfslick/core');

		/**
		 * Create the PDF Slick store
		 */
		store = create();

		/**
		 * Create the PDF Slick instance
		 */
		pdfSlick = new PDFSlick({
			container,
			store,
			thumbs,
			options: {
				scaleValue: 'page-fit'
			}
		});

		/**
		 * Load the PDF document
		 */
		pdfSlick.loadDocument(url);

		/**
		 * Resize observer — if zoom is not an absolute numeric value, adjust the PDF viewer accordingly
		 */
		RO = new ResizeObserver(() => {
			const { scaleValue } = store.getState();
			if (scaleValue && ['page-width', 'page-fit', 'auto'].includes(scaleValue)) {
				pdfSlick.viewer.currentScaleValue = scaleValue;
			}
		});

		/**
		 * Subscribe to state changes, and keep values of interest as Svelte writable store,
		 * or alternatively we could subscribe to just those we need as Svelte vars instead of entire state
		 *
		 * Also keep reference of the unsubscribe function we call on component's `onDestroy()` below
		 */
		unsubscribe = store.subscribe((s) => {
			pdfSlickStore.set(s);
		});

		store.setState({ pdfSlick });
	});

	onDestroy(() => {
		unsubscribe();
		RO?.disconnect();
	});

	/**
	 * start observing DOM container
	 */
	$: {
		if (RO && container) {
			RO.observe(container);
		}
	}
</script>

<div class="absolute inset-0 bg-slate-200/70 flex flex-col pdfSlick">
	<Toolbar />
	<div class="flex-1 flex">
		<Thumbsbar bind:thumbsRef={thumbs} />

		<div class="flex-1 relative h-full" id="container">
			<div id="viewerContainer" class="pdfSlickContainer absolute inset-0 overflow-auto" bind:this={container}>
				<div id="viewer" class="pdfSlickViewer pdfViewer" />
			</div>
		</div>
	</div>
</div>

<!-- the following used for printing and displaying the print dialog -->
<div id="printContainer" />
<dialog id="printServiceDialog" class="min-w-[200px]">
	<div class="row">
		<span data-l10n-id="print_progress_message">Preparing document for printing…</span>
	</div>
	<div class="row">
		<progress value="0" max="100" />
		<span
			data-l10n-id="print_progress_percent"
			data-l10n-args={`{ "progress": 0 }`}
			class="relative-progress">0%</span
		>
	</div>
	<div class="buttonRow">
		<button id="printCancel" class="dialogButton"
			><span data-l10n-id="print_progress_close">Cancel</span></button
		>
	</div>
</dialog>
