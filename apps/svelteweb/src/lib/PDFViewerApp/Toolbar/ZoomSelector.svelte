<script lang="ts">
	import { pdfSlickStore } from '$lib/store';
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu/index.js';

	const presets = new Map([
		['auto', 'Auto'],
		['page-actual', 'Actual Size'],
		['page-fit', 'Page Fit'],
		['page-width', 'Page Width']
	]);

	const zoomVals = new Map([
		[0.5, '50%'],
		[0.75, '75%'],
		[1, '100%'],
		[1.25, '125%'],
		[1.5, '150%'],
		[2, '200%']
	]);
</script>

<div class="flex items-center space-x-1">
	<button
		aria-label="Zoom Out"
		disabled={!$pdfSlickStore?.pdfSlick || $pdfSlickStore?.scale <= 0.25}
		class="inline-flex enabled:hover:bg-slate-200 enabled:hover:text-black text-slate-500 disabled:text-slate-300 p-1 rounded-sm transition-all group relative focus:border-blue-400 focus:ring-0 focus:shadow-sm outline-hidden border border-transparent"
		on:click={() => $pdfSlickStore?.pdfSlick?.viewer?.decreaseScale()}
	>
		<iconify-icon height={16} icon="codicon:remove"></iconify-icon>
	</button>

	<DropdownMenu.Root>
		<DropdownMenu.Trigger
			class="flex w-32 text-left items-center bg-slate-200/70 hover:bg-slate-200 py-1 rounded-sm focus:border-blue-400 focus:ring-0 focus:shadow-sm outline-hidden border border-transparent"
		>
			<span class="sr-only">Open zoom options</span>
			<div class="flex px-1 w-full">
				<span class={`flex-1 px-1 ${$pdfSlickStore?.pdfSlick ? 'opacity-100' : 'opacity-0'}`}>
					{$pdfSlickStore?.scaleValue && presets.has($pdfSlickStore?.scaleValue)
						? presets.get($pdfSlickStore?.scaleValue)
						: `${~~($pdfSlickStore?.scale * 100)}%`}
				</span>

				<div class="w-4 h-4">
					<iconify-icon height={16} icon="codicon:chevron-down"></iconify-icon>
				</div>
			</div></DropdownMenu.Trigger
		>
		<DropdownMenu.Content
			class="rounded-sm shadow-lg divide-y divide-slate-200 p-0 m-1 mr-2 w-32 ring-1 ring-black/10"
		>
			<DropdownMenu.Group class="py-1">
				{#each Array.from(presets.entries()) as [value, label]}
					<DropdownMenu.Item
						onSelect={() => {
							if ($pdfSlickStore.pdfSlick) {
								$pdfSlickStore.pdfSlick.currentScaleValue = value;
							}
						}}
						class="cursor-pointer rounded-none block w-full text-left px-2 py-1.5 text-xs text-slate-700 hover:bg-slate-100 hover:text-slate-900"
					>
						{label}
					</DropdownMenu.Item>
				{/each}
			</DropdownMenu.Group>

			<DropdownMenu.Group class="py-1">
				{#each Array.from(zoomVals.entries()) as [value, label]}
					<DropdownMenu.Item
						onSelect={() => {
							if ($pdfSlickStore.pdfSlick) {
								$pdfSlickStore.pdfSlick.currentScale = value;
							}
						}}
						class="cursor-pointer rounded-none block w-full text-left px-2 py-1.5 text-xs text-slate-700 hover:bg-slate-100 hover:text-slate-900"
					>
						{label}
					</DropdownMenu.Item>
				{/each}
			</DropdownMenu.Group>
		</DropdownMenu.Content>
	</DropdownMenu.Root>

	<!-- <Menu as="div" class="relative">
		<MenuButton
			class="flex w-32 text-left items-center bg-slate-200/70 hover:bg-slate-200 py-1 rounded-sm focus:border-blue-400 focus:ring-0 focus:shadow-sm outline-hidden border border-transparent"
			on:click={(e) => {
				e.preventDefault();
				e.stopPropagation();
			}}
		>
			<span class="sr-only">Open zoom options</span>
			<div class="flex px-1 w-full">
				<span class={`flex-1 px-1 ${$pdfSlickStore?.pdfSlick ? 'opacity-100' : 'opacity-0'}`}>
					{$pdfSlickStore?.scaleValue && presets.has($pdfSlickStore?.scaleValue)
						? presets.get($pdfSlickStore?.scaleValue)
						: `${~~($pdfSlickStore?.scale * 100)}%`}
				</span>

				<div class="w-4 h-4">
					<iconify-icon height={16} icon="codicon:chevron-down"></iconify-icon>
				</div>
			</div>
		</MenuButton>
		<MenuItems
			as="div"
			class="absolute w-32 max-w-[142px] right-0 left-0 z-30 mt-1 origin-top-right divide-y divide-slate-200 rounded text-left bg-white shadow-lg ring-1 ring-black/5 focus:outline-hidden animate-content-hide ui-expanded:animate-content-show"
			role="menu"
			aria-orientation="vertical"
			tabindex={-1}
		>
			<div class="py-1">
				{#each Array.from(presets.entries()) as [value, label]}
					<MenuItem
						on:click={() => {
							if ($pdfSlickStore.pdfSlick) {
								$pdfSlickStore.pdfSlick.currentScaleValue = value;
							}
						}}
						class={({ active }) =>
							clsx(`cursor-pointer block w-full text-left px-2 py-1.5 text-xs`, {
								'bg-slate-100 text-slate-900': active,
								'text-slate-700': !active
							})}
					>
						{label}
					</MenuItem>
				{/each}
			</div>

			<div class="py-1">
				{#each Array.from(zoomVals.entries()) as [value, label]}
					<MenuItem
						on:click={() => {
							if ($pdfSlickStore.pdfSlick) {
								$pdfSlickStore.pdfSlick.currentScale = value;
							}
						}}
						class={({ active }) =>
							clsx(`cursor-pointer block w-full text-left px-2 py-1.5 text-xs`, {
								'bg-slate-100 text-slate-900': active,
								'text-slate-700': !active
							})}
					>
						{label}
					</MenuItem>
				{/each}
			</div>
		</MenuItems>
	</Menu> -->

	<button
		aria-label="Zoom In"
		disabled={!$pdfSlickStore?.pdfSlick || $pdfSlickStore?.scale >= 5}
		class="inline-flex enabled:hover:bg-slate-200 enabled:hover:text-black text-slate-500 disabled:text-slate-300 p-1 rounded-sm transition-all group relative focus:border-blue-400 focus:ring-0 focus:shadow-sm outline-hidden border border-transparent"
		on:click={() => $pdfSlickStore?.pdfSlick?.viewer?.increaseScale()}
	>
		<iconify-icon height={16} icon="codicon:add"></iconify-icon>
	</button>
</div>
