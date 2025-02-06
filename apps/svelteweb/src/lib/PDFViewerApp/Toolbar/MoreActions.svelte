<script lang="ts">
	import { pdfSlickStore } from '$lib/store';
	import { SpreadMode, ScrollMode } from '@pdfslick/core';
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu/index.js';

	let openPdfFileRef: HTMLInputElement;
	let { isDocumentInfoOpen = $bindable(false) } = $props();

	const handleOpenPdfFile = (e: Event) => {
		const target = e.target as HTMLInputElement;
		if (target.files && target.files[0]) {
			const file = target.files[0];
			const url = URL.createObjectURL(file);
			$pdfSlickStore?.pdfSlick?.loadDocument(url, { filename: file.name });
		}
	};
</script>

<div class="absolute overflow-hidden w-0 h-0">
	<input
		id="openPdfFileAction"
		tabIndex={-1}
		type="file"
		accept=".pdf,application/pdf"
		onchange={handleOpenPdfFile}
		class="absolute -top-[10000px"
		bind:this={openPdfFileRef}
	/>
</div>

<DropdownMenu.Root>
	<DropdownMenu.Trigger
		class="inline-flex enabled:hover:bg-slate-200 enabled:hover:text-black text-slate-500 disabled:text-slate-300 p-1 rounded-sm transition-all group relative focus:border-blue-400 focus:ring-0 focus:shadow outline-none border border-transparent"
	>
		<iconify-icon height={16} icon="codicon:kebab-vertical"></iconify-icon>
	</DropdownMenu.Trigger>
	<DropdownMenu.Content class="rounded shadow-lg divide-y divide-slate-200 p-0 m-1 mr-2 w-52">
		<DropdownMenu.Group class="py-1">
			<DropdownMenu.Item
				onSelect={() => {
					$pdfSlickStore?.pdfSlick?.requestPresentationMode();
				}}
				class="rounded-none w-full cursor-pointer items-center flex gap-2 box-border text-left px-2 py-1.5 text-xs text-gray-700 hover:text-gray-900 hover:bg-slate-100"
			>
				<iconify-icon height={16} icon="codicon:play"></iconify-icon>
				<span>Presentation Mode</span>
			</DropdownMenu.Item>
		</DropdownMenu.Group>

		<DropdownMenu.Group class="py-1">
			<DropdownMenu.Item
				class="rounded-none w-full cursor-pointer items-center flex gap-2 box-border text-left px-2 py-1.5 text-xs text-gray-700 hover:text-gray-900 hover:bg-slate-100"
				onSelect={() => {
					openPdfFileRef.click();
				}}
			>
				<iconify-icon height={16} icon="codicon:diff-added"></iconify-icon>
				<span>Open PDF File...</span>
			</DropdownMenu.Item>
			<DropdownMenu.Item
				onSelect={() => {
					$pdfSlickStore?.pdfSlick?.downloadOrSave();
				}}
				class="rounded-none w-full cursor-pointer items-center flex gap-2 box-border text-left px-2 py-1.5 text-xs text-gray-700 hover:text-gray-900 hover:bg-slate-100"
			>
				<iconify-icon height={16} icon="codicon:desktop-download"></iconify-icon>
				<span>Save</span>
			</DropdownMenu.Item>
			<DropdownMenu.Item
				onSelect={() => {
					$pdfSlickStore.pdfSlick?.triggerPrinting();
				}}
				class="rounded-none w-full cursor-pointer items-center flex gap-2 box-border text-left px-2 py-1.5 text-xs text-gray-700 hover:text-gray-900 hover:bg-slate-100"
			>
				<svg viewBox="0 0 20 20" class="w-5 h-5 fill-current -ml-0.5">
					<path
						d="M5 4.5C5 3.67 5.67 3 6.5 3h7c.83 0 1.5.67 1.5 1.5V5h.5A2.5 2.5 0 0118 7.5v5c0 .83-.67 1.5-1.5 1.5H15v1.5c0 .83-.67 1.5-1.5 1.5h-7A1.5 1.5 0 015 15.5V14H3.5A1.5 1.5 0 012 12.5v-5A2.5 2.5 0 014.5 5H5v-.5zM6 5h8v-.5a.5.5 0 00-.5-.5h-7a.5.5 0 00-.5.5V5zm-1 8v-1.5c0-.83.67-1.5 1.5-1.5h7c.83 0 1.5.67 1.5 1.5V13h1.5a.5.5 0 00.5-.5v-5c0-.83-.67-1.5-1.5-1.5h-11C3.67 6 3 6.67 3 7.5v5c0 .28.22.5.5.5H5zm1.5-2a.5.5 0 00-.5.5v4c0 .28.22.5.5.5h7a.5.5 0 00.5-.5v-4a.5.5 0 00-.5-.5h-7z"
						fill-rule="nonzero"
					/>
				</svg>
				<span>Print</span>
			</DropdownMenu.Item>
		</DropdownMenu.Group>

		<DropdownMenu.Group class="py-1">
			<DropdownMenu.Item
				disabled={$pdfSlickStore?.pageNumber === 1}
				onSelect={() => {
					$pdfSlickStore?.pdfSlick?.gotoPage(1);
				}}
				class="rounded-none w-full cursor-pointer items-center flex gap-2 box-border text-left px-2 py-1.5 text-xs text-gray-700 hover:text-gray-900 hover:bg-slate-100"
			>
				<iconify-icon height={16} icon="codicon:export" class="-rotate-90"></iconify-icon>
				<span>Go to First Page</span>
			</DropdownMenu.Item>
			<DropdownMenu.Item
				disabled={$pdfSlickStore?.pageNumber === $pdfSlickStore?.numPages}
				onSelect={() => {
					$pdfSlickStore?.pdfSlick?.gotoPage($pdfSlickStore?.numPages);
				}}
				class="rounded-none w-full cursor-pointer items-center flex gap-2 box-border text-left px-2 py-1.5 text-xs text-gray-700 hover:text-gray-900 hover:bg-slate-100"
			>
				<iconify-icon height={16} icon="codicon:export" class="rotate-90"></iconify-icon>
				<span>Go to Last Page</span>
			</DropdownMenu.Item>
		</DropdownMenu.Group>

		<DropdownMenu.Group class="py-1">
			<DropdownMenu.Item
				onSelect={() => {
					$pdfSlickStore?.pdfSlick?.setRotation($pdfSlickStore?.pagesRotation + 90);
				}}
				class="rounded-none w-full cursor-pointer items-center flex gap-2 box-border text-left px-2 py-1.5 text-xs text-gray-700 hover:text-gray-900 hover:bg-slate-100"
			>
				<iconify-icon height={16} icon="codicon:refresh"></iconify-icon>
				<span>Rotate Clockwise</span>
			</DropdownMenu.Item>
			<DropdownMenu.Item
				onSelect={() => {
					$pdfSlickStore?.pdfSlick?.setRotation($pdfSlickStore?.pagesRotation - 90);
				}}
				class="rounded-none w-full cursor-pointer items-center flex gap-2 box-border text-left px-2 py-1.5 text-xs text-gray-700 hover:text-gray-900 hover:bg-slate-100"
			>
				<iconify-icon height={16} icon="codicon:refresh" class="-scale-x-100 scale-y-100"
				></iconify-icon>
				<span>Rotate Counterclockwise</span>
			</DropdownMenu.Item>
		</DropdownMenu.Group>

		<DropdownMenu.Group class="py-1">
			<DropdownMenu.Item
				onSelect={() => {
					$pdfSlickStore?.pdfSlick?.setScrollMode(ScrollMode.PAGE);
				}}
				class="rounded-none w-full cursor-pointer items-center flex gap-2 box-border text-left px-2 py-1.5 text-xs text-gray-700 hover:text-gray-900 hover:bg-slate-100"
			>
				<iconify-icon height={16} icon="codicon:file-pdf"></iconify-icon>
				<span class="flex-1">Page Scrolling</span>
				{#if $pdfSlickStore.scrollMode === ScrollMode.PAGE}
					<iconify-icon height={12} icon="codicon:check"></iconify-icon>
				{/if}
			</DropdownMenu.Item>
			<DropdownMenu.Item
				onSelect={() => {
					$pdfSlickStore?.pdfSlick?.setScrollMode(ScrollMode.VERTICAL);
				}}
				class="rounded-none w-full cursor-pointer items-center flex gap-2 box-border text-left px-2 py-1.5 text-xs text-gray-700 hover:text-gray-900 hover:bg-slate-100"
			>
				<iconify-icon height={16} icon="codicon:arrow-both" class="rotate-90"></iconify-icon>
				<span class="flex-1">Vertical Scrolling</span>
				{#if $pdfSlickStore.scrollMode === ScrollMode.VERTICAL}
					<iconify-icon height={12} icon="codicon:check"></iconify-icon>
				{/if}
			</DropdownMenu.Item>
			<DropdownMenu.Item
				onSelect={() => {
					$pdfSlickStore?.pdfSlick?.setScrollMode(ScrollMode.HORIZONTAL);
				}}
				class="rounded-none w-full cursor-pointer items-center flex gap-2 box-border text-left px-2 py-1.5 text-xs text-gray-700 hover:text-gray-900 hover:bg-slate-100"
			>
				<iconify-icon height={16} icon="codicon:arrow-both"></iconify-icon>
				<span class="flex-1">Horizontal Scrolling</span>
				{#if $pdfSlickStore.scrollMode === ScrollMode.HORIZONTAL}
					<iconify-icon height={12} icon="codicon:check"></iconify-icon>
				{/if}
			</DropdownMenu.Item>
			<DropdownMenu.Item
				onSelect={() => {
					$pdfSlickStore?.pdfSlick?.setScrollMode(ScrollMode.WRAPPED);
				}}
				class="rounded-none w-full cursor-pointer items-center flex gap-2 box-border text-left px-2 py-1.5 text-xs text-gray-700 hover:text-gray-900 hover:bg-slate-100"
			>
				<iconify-icon height={16} icon="codicon:extensions"></iconify-icon>
				<span class="flex-1">Wrapped Scrolling</span>
				{#if $pdfSlickStore.scrollMode === ScrollMode.WRAPPED}
					<iconify-icon height={12} icon="codicon:check"></iconify-icon>
				{/if}
			</DropdownMenu.Item>
		</DropdownMenu.Group>

		<DropdownMenu.Group class="py-1">
			<DropdownMenu.Item
				onSelect={() => {
					$pdfSlickStore?.pdfSlick?.setSpreadMode(SpreadMode.NONE);
				}}
				class="rounded-none w-full cursor-pointer items-center flex gap-2 box-border text-left px-2 py-1.5 text-xs text-gray-700 hover:text-gray-900 hover:bg-slate-100"
			>
				<iconify-icon height={16} icon="codicon:file"></iconify-icon>
				<span class="flex-1">No Spreads</span>
				{#if $pdfSlickStore.spreadMode === SpreadMode.NONE}
					<iconify-icon height={12} icon="codicon:check"></iconify-icon>
				{/if}
			</DropdownMenu.Item>
			<DropdownMenu.Item
				onSelect={() => {
					$pdfSlickStore?.pdfSlick?.setSpreadMode(SpreadMode.ODD);
				}}
				class="rounded-none w-full cursor-pointer items-center flex gap-2 box-border text-left px-2 py-1.5 text-xs text-gray-700 hover:text-gray-900 hover:bg-slate-100"
			>
				<iconify-icon height={16} icon="codicon:files"></iconify-icon>
				<span class="flex-1">Odd Spreads</span>
				{#if $pdfSlickStore.spreadMode === SpreadMode.ODD}
					<iconify-icon height={12} icon="codicon:check"></iconify-icon>
				{/if}
			</DropdownMenu.Item>
			<DropdownMenu.Item
				onSelect={() => {
					$pdfSlickStore?.pdfSlick?.setSpreadMode(SpreadMode.EVEN);
				}}
				class="rounded-none w-full cursor-pointer items-center flex gap-2 box-border text-left px-2 py-1.5 text-xs text-gray-700 hover:text-gray-900 hover:bg-slate-100"
			>
				<iconify-icon height={16} icon="codicon:copy"></iconify-icon>
				<span class="flex-1">Even Spreads</span>
				{#if $pdfSlickStore.spreadMode === SpreadMode.EVEN}
					<iconify-icon height={12} icon="codicon:check"></iconify-icon>
				{/if}
			</DropdownMenu.Item>
		</DropdownMenu.Group>

		<DropdownMenu.Group class="py-1">
			<DropdownMenu.Item
				onSelect={() => {
					isDocumentInfoOpen = true;
				}}
				class="rounded-none w-full cursor-pointer items-center flex gap-2 box-border text-left px-2 py-1.5 text-xs text-gray-700 hover:text-gray-900 hover:bg-slate-100"
			>
				<iconify-icon height={16} icon="codicon:info"></iconify-icon>
				<span>Document Properties...</span>
			</DropdownMenu.Item>
		</DropdownMenu.Group>
	</DropdownMenu.Content>
</DropdownMenu.Root>
