<script lang="ts">
	import { type PDFSlickState, PDFSlick, create } from '@pdfslick/core';
	import { onMount, onDestroy } from 'svelte';
	import Thumbsbar from './Thumbsbar/Thumbsbar.svelte';
	import Toolbar from './Toolbar/Toolbar.svelte';
	import { pdfSlickStore, isThumbsbarOpen } from '$lib/store';

	/**
	 * We'll use predefined PDF url to a document, but if this were a
	 * Svelte component this could be a property as well
	 */
	let { url = $bindable('/pdfs/Wines-of-Macedonia-Brochure.pdf') } = $props();

	let RO: ResizeObserver;

	let container: HTMLDivElement;
	let thumbs = $state<HTMLDivElement>();
	let store: import('zustand/vanilla').StoreApi<PDFSlickState>;
	let pdfSlick: PDFSlick;
	let unsubscribe: () => void = () => {};
	let openedInitial = $state(false);

	/**
	 * Open thumbnails sidebar when PDF document is loaded
	 */
	$effect(() => {
		if ($pdfSlickStore && $pdfSlickStore.pagesReady && !openedInitial) {
			isThumbsbarOpen.set(true);
			openedInitial = true;
		}
	});

	onMount(async () => {
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
	$effect(() => {
		if (RO && container) {
			RO.observe(container);
		}
	});
</script>

<div class="absolute inset-0 bg-slate-200/70 flex flex-col pdfSlick">
	<Toolbar />
	<div class="flex-1 flex">
		<Thumbsbar bind:thumbsRef={thumbs!} />

		<div class="flex-1 relative h-full" id="container">
			<div
				id="viewerContainer"
				class="pdfSlickContainer absolute inset-0 overflow-auto"
				bind:this={container}
			>
				<div id="viewer" class="pdfSlickViewer pdfViewer"></div>
			</div>
		</div>
	</div>
</div>
