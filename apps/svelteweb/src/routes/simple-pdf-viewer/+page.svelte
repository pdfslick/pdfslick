<script lang="ts">
	import type { PDFSlick } from '@pdfslick/core';
	import { onMount, onDestroy } from 'svelte';

	/**
	 * We'll use predefined PDF url to a document, but if this were a
	 * Svelte component this could be a property as well
	 */
	export let url = '/pdfs/CH_infographics.pdf';

	let RO: ResizeObserver;

	let container: HTMLDivElement;
	let pdfSlick: PDFSlick;
	let unsubscribe: () => void = () => {};

	/**
	 * We keep PDF Slick state portions of interest in reactive Svelte vars
	 */
	let pageNumber = 1;
	let numPages = 0;
	let scaleValue: string | undefined;

	onMount(async () => {
		/**
		 * This is all happening on client side, so make sure we load it only there
		 */
		const { create, PDFSlick } = await import('@pdfslick/core');

		/**
		 * Create the PDF Slick store
		 */
		const store = create();

		pdfSlick = new PDFSlick({
			container,
			store,
			options: {
				scaleValue: 'page-fit'
			}
		});

		/**
		 * Load the PDF document
		 */
		pdfSlick.loadDocument(url);
		store.setState({ pdfSlick });

		/**
		 * Resize observer — if zoom is not an absolute numeric value, adjust the PDF accordingly
		 */
		RO = new ResizeObserver(() => {
			// const { scaleValue } = store.getState();
			if (scaleValue && ['page-width', 'page-fit', 'auto'].includes(scaleValue)) {
				pdfSlick.viewer.currentScaleValue = scaleValue;
			}
		});

		/**
		 * We can subscribe to state changes, and keep values of interest as reactive Svelte vars,
		 * or alternatively we could hook these to a Svelte store
		 *
		 * Also keep reference of the unsubscribe function we call on component destroy
		 */
		unsubscribe = store.subscribe((s) => {
			pageNumber = s.pageNumber;
			numPages = s.numPages;
			scaleValue = s.scaleValue;
		});
	});

	onDestroy(() => {
		unsubscribe();
		RO?.disconnect();
	});

	$: {
		if (RO && container) {
			RO.observe(container);
		}
	}

	const onGotoNext = () => pdfSlick?.gotoPage(Math.min(pageNumber + 1, numPages));
	const onGotoPrevious = () => pdfSlick?.gotoPage(Math.max(pageNumber - 1, 1));
	const zoomOut = () => pdfSlick?.decreaseScale();
	const zoomIn = () => pdfSlick?.increaseScale();
</script>

<div class="absolute inset-0 bg-slate-200/70 pdfSlick">
	<div class="flex-1 relative h-full" id="container">
		<div id="viewerContainer" class="pdfSlickContainer absolute inset-0 overflow-auto" bind:this={container}>
			<div id="viewer" class="pdfSlickViewer pdfViewer"></div>
		</div>
	</div>

	<div class="fixed w-full h-12 bottom-0 right-0 z-50 pointer-events-none">
		<div class="flex justify-center">
			<div
				class="inline-flex rounded shadow justify-center border border-slate-300 bg-white divide-x divide-x-slate-100"
			>
				<button
					on:click={onGotoPrevious}
					disabled={pageNumber <= 1}
					id="previousBtn"
					type="button"
					class="relative inline-flex items-center rounded-l px-2 py-2 text-slate-500 ring-0 ring-inset ring-slate-700 hover:bg-slate-50 enabled:hover:text-slate-900 transition-all focus:z-10 disabled:opacity-70 pointer-events-auto"
				>
					<span class="sr-only">Previous</span>
					<svg
						width="16"
						height="16"
						viewBox="0 0 16 16"
						fill="currentColor"
						xmlns="http://www.w3.org/2000/svg"
						class="h-5 w-5"
						aria-hidden="true"
					>
						<path
							fill-rule="evenodd"
							clip-rule="evenodd"
							d="M5.92803 7.97603L10.2853 12.3333L9.66662 12.9521L4.99995 8.28539V7.66667L9.66662 3L10.2853 3.61872L5.92803 7.97603Z"
						/>
					</svg>
				</button>
				<button
					on:click={zoomOut}
					id="zoomOutBtn"
					type="button"
					class="relative inline-flex items-center px-2 py-2 text-slate-500 ring-0 ring-inset ring-slate-700 hover:bg-slate-50 enabled:hover:text-slate-900 transition-all focus:z-10 pointer-events-auto disabled:opacity-70"
				>
					<span class="sr-only">Zoom Out</span>
					<svg
						width="16"
						height="16"
						viewBox="0 0 16 16"
						fill="currentColor"
						xmlns="http://www.w3.org/2000/svg"
						class="h-5 w-5"
						aria-hidden="true"
					>
						<path
							fill-rule="evenodd"
							clip-rule="evenodd"
							d="M12.0275 6.14861C12.1231 7.56649 11.6682 8.96661 10.7575 10.0575L15.0175 14.3176L14.3176 15.0275L10.0575 10.7575C8.96661 11.6682 7.56649 12.1231 6.14861 12.0275C4.73072 11.9319 3.40437 11.2931 2.44561 10.2442C1.48684 9.19523 0.969494 7.81691 1.00139 6.39617C1.03329 4.97542 1.61188 3.62162 2.61675 2.61675C3.62162 1.61188 4.97542 1.03329 6.39617 1.00139C7.81691 0.969494 9.19523 1.48684 10.2442 2.44561C11.2931 3.40437 11.9319 4.73072 12.0275 6.14861ZM6.57756 11.0375C7.77042 11.0354 8.91377 10.5608 9.7575 9.71758L9.71758 9.7376C10.1447 9.32074 10.4849 8.82316 10.7183 8.27385C10.9518 7.72455 11.0739 7.13437 11.0776 6.53752C11.0776 5.64751 10.8136 4.77755 10.3191 4.03752C9.82467 3.2975 9.12188 2.72065 8.29961 2.38005C7.47734 2.03946 6.57255 1.95032 5.69963 2.12395C4.82672 2.29758 4.02489 2.72618 3.39556 3.35552C2.76622 3.98485 2.33762 4.78668 2.16399 5.6596C1.99036 6.53251 2.0795 7.4373 2.42009 8.25957C2.76069 9.08184 3.33742 9.78464 4.07744 10.2791C4.81746 10.7736 5.68755 11.0375 6.57756 11.0375ZM4.03748 6.0575H9.03748V7.0575H4.03748V6.0575Z"
						/>
					</svg>
				</button>
				<button
					on:click={zoomIn}
					id="zoomInBtn"
					type="button"
					class="relative inline-flex items-center px-2 py-2 text-slate-500 ring-0 ring-inset ring-slate-700 hover:bg-slate-50 enabled:hover:text-slate-900 transition-all focus:z-10 pointer-events-auto disabled:opacity-70"
				>
					<span class="sr-only">Zoom In</span>
					<svg
						width="16"
						height="16"
						viewBox="0 0 16 16"
						fill="currentColor"
						xmlns="http://www.w3.org/2000/svg"
						class="h-5 w-5"
						aria-hidden="true"
					>
						<path
							fill-rule="evenodd"
							clip-rule="evenodd"
							d="M12.0275 6.14861C12.1231 7.56649 11.6682 8.96661 10.7575 10.0575L15.0175 14.3176L14.3176 15.0275L10.0575 10.7575C8.96661 11.6682 7.56649 12.1231 6.14861 12.0275C4.73072 11.9319 3.40437 11.2931 2.44561 10.2442C1.48684 9.19523 0.969494 7.81691 1.00139 6.39617C1.03329 4.97542 1.61188 3.62162 2.61675 2.61675C3.62162 1.61188 4.97542 1.03329 6.39617 1.00139C7.81691 0.969494 9.19523 1.48684 10.2442 2.44561C11.2931 3.40437 11.9319 4.73072 12.0275 6.14861ZM6.57756 11.0375C7.77042 11.0354 8.91377 10.5608 9.7575 9.71758L9.71758 9.7376C10.1447 9.32074 10.4849 8.82316 10.7183 8.27385C10.9518 7.72455 11.0739 7.13437 11.0776 6.53752C11.0776 5.64751 10.8136 4.77755 10.3191 4.03752C9.82467 3.2975 9.12188 2.72065 8.29961 2.38005C7.47734 2.03946 6.57255 1.95032 5.69963 2.12395C4.82672 2.29758 4.02489 2.72618 3.39556 3.35552C2.76622 3.98485 2.33762 4.78668 2.16399 5.6596C1.99036 6.53251 2.0795 7.4373 2.42009 8.25957C2.76069 9.08184 3.33742 9.78464 4.07744 10.2791C4.81746 10.7736 5.68755 11.0375 6.57756 11.0375ZM9.01749 7.0376V6.0376H7.01749V4.0376H6.01749V6.0376H4.01749V7.0376H6.01749V9.0376H7.01749V7.0376H9.01749Z"
						/>
					</svg>
				</button>
				<button
					on:click={onGotoNext}
					disabled={pageNumber >= numPages}
					id="nextBtn"
					type="button"
					class="relative inline-flex items-center rounded-r px-2 py-2 text-slate-500 ring-0 ring-inset ring-slate-700 hover:bg-slate-50 enabled:hover:text-slate-900 transition-all focus:z-10 disabled:opacity-70 pointer-events-auto"
				>
					<span class="sr-only">Next</span>
					<svg
						width="16"
						height="16"
						viewBox="0 0 16 16"
						fill="currentColor"
						xmlns="http://www.w3.org/2000/svg"
						class="h-5 w-5"
						aria-hidden="true"
					>
						<path
							fill-rule="evenodd"
							clip-rule="evenodd"
							d="M10.0718 8.02397L5.71454 3.66666L6.33326 3.04794L10.9999 7.71461V8.33333L6.33326 13L5.71454 12.3813L10.0718 8.02397Z"
						/>
					</svg>
				</button>
			</div>
		</div>
	</div>
</div>
