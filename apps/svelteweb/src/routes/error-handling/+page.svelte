<script lang="ts">
	import type { PDFSlick, PDFException } from '@pdfslick/core';
	import { onMount } from 'svelte';

	/**
	 * Load non-existing pdf doc that errors out
	 */
	export let url = '/pdfs/non_existing.pdf';

	let container: HTMLDivElement;
	let pdfSlick: PDFSlick;

	let error: PDFException | null = null;

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
			},
			onError: (e) => (error = e)
		});

		/**
		 * Load the PDF document
		 */
		pdfSlick.loadDocument(url);
		store.setState({ pdfSlick });
	});
</script>

<div class="absolute inset-0 bg-slate-200/70 pdfSlick">
	<div class="flex-1 relative h-full" id="container">
		<div
			id="viewerContainer"
			class="pdfSlickContainer absolute inset-0 overflow-auto"
			bind:this={container}
			class:hidden={!!error}
		>
			<div id="viewer" class="pdfSlickViewer pdfViewer"></div>
		</div>
		{#if !!error}
			<div class="w-full max-w-(--breakpoint-sm) mx-auto py-4">
				<div
					id="alert-additional-content-2"
					class="p-4 mb-4 text-red-800 border border-red-300 rounded-lg bg-red-50 dark:bg-gray-800 dark:text-red-400 dark:border-red-800"
					role="alert"
				>
					<div class="flex items-center">
						<svg
							class="shrink-0 w-4 h-4 me-2"
							aria-hidden="true"
							xmlns="http://www.w3.org/2000/svg"
							fill="currentColor"
							viewBox="0 0 20 20"
						>
							<path
								d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5ZM9.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM12 15H8a1 1 0 0 1 0-2h1v-3H8a1 1 0 0 1 0-2h2a1 1 0 0 1 1 1v4h1a1 1 0 0 1 0 2Z"
							/>
						</svg>
						<span class="sr-only">Info</span>
						<h3 class="text-lg font-medium">Error loading PDF document</h3>
					</div>
					<div class="mt-2 mb-4 text-sm">
						There was an error loading the PDF document: <i>{url}</i>.
						<br /> Here are the details:
						<div class="overflow-scroll py-2">
							<pre>{JSON.stringify(error, null, 2)}</pre>
						</div>
					</div>
				</div>
			</div>
		{/if}
	</div>
</div>
