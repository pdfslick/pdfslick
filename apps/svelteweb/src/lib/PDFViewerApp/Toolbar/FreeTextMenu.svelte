<script lang="ts">
	import { pdfSlickStore } from '$lib/store';
	import { default as colors, colorStrengths, colorNames } from '$lib/colors';
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu/index.js';
	import { AnnotationEditorType, AnnotationEditorParamsType } from 'pdfjs-dist';

	let fontSize = $state(12);
	let isFreetextMode = $derived(
		$pdfSlickStore?.annotationEditorMode === AnnotationEditorType.FREETEXT
	);
</script>

<div
	class={{
		'flex items-center group rounded-sm': true,
		'bg-blue-100': isFreetextMode,
		'hover:bg-slate-200/50': !isFreetextMode
	}}
>
	<button
		aria-label="Insert Text"
		class="inline-flex enabled:hover:text-black text-slate-600 p-0.5 disabled:text-slate-300 rounded-sm transition-all group relative focus:border-blue-400 focus:ring-0 focus:shadow outline-none border border-transparent"
		onclick={() => {
			const mode = isFreetextMode ? AnnotationEditorType.NONE : AnnotationEditorType.FREETEXT;
			$pdfSlickStore?.pdfSlick?.setAnnotationEditorMode(mode);
		}}
	>
		<iconify-icon height={20} icon="codicon:case-sensitive"></iconify-icon>
	</button>

	<DropdownMenu.Root>
		<DropdownMenu.Trigger
			class="inline-flex p-0.5 enabled:group-hover:hover:bg-slate-200 enabled:hover:text-black text-slate-500 disabled:text-slate-300 rounded-sm transition-all focus:border-blue-400 focus:ring-0 focus:shadow outline-none border border-transparent"
		>
			<iconify-icon height={12} icon="codicon:chevron-down"></iconify-icon>
		</DropdownMenu.Trigger>
		<DropdownMenu.Content
			class="rounded-sm shadow-lg divide-y divide-slate-200 p-0 top-2 absolute -right-2 z-50"
		>
			<DropdownMenu.Group>
				<DropdownMenu.GroupHeading>Color</DropdownMenu.GroupHeading>
				<div class="flex flex-col gap-1 p-2">
					{#each colorStrengths as s}
						<div class="flex gap-1">
							{#each colorNames as name}
								<DropdownMenu.Item
									class="p-2 cursor-pointer block rounded-full origin-center border border-transparent hover:scale-125 hover:border-blue-300 focus:ring-0 focus:outline-none focus:scale-125 focus:border-blue-300"
									style={`background-color: ${colors[name][s]}`}
									onSelect={() => {
										$pdfSlickStore?.pdfSlick?.setAnnotationEditorMode(
											AnnotationEditorType.FREETEXT
										);
										$pdfSlickStore?.pdfSlick?.setAnnotationEditorParams([
											{
												type: AnnotationEditorParamsType.FREETEXT_COLOR,
												value: colors[name][s]
											}
										]);
									}}
								></DropdownMenu.Item>
							{/each}
						</div>
					{/each}
				</div>
			</DropdownMenu.Group>

			<DropdownMenu.Group class="py-1 flex gap-1 items-center">
				<DropdownMenu.GroupHeading>Font Size</DropdownMenu.GroupHeading>
				<div class="w-full flex flex-1 items-center px-2">
					<input
						class="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
						bind:value={fontSize}
						id="fontSize"
						type="range"
						min={12}
						max={100}
						onchange={(e) => {
							$pdfSlickStore?.pdfSlick?.setAnnotationEditorParams([
								{
									type: AnnotationEditorParamsType.FREETEXT_SIZE,
									value: +e.currentTarget.value
								}
							]);
						}}
					/>
				</div>
			</DropdownMenu.Group>
		</DropdownMenu.Content>
	</DropdownMenu.Root>
</div>
