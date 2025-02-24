<script lang="ts">
	import { pdfSlickStore } from '$lib/store';
	import { default as colors, colorStrengths, colorNames } from '$lib/colors';
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu/index.js';
	import { AnnotationEditorType, AnnotationEditorParamsType } from 'pdfjs-dist';

	let thickness = $state(1);
	let opacity = $state(100);

	let isInkMode = $derived($pdfSlickStore?.annotationEditorMode === AnnotationEditorType.INK);
</script>

<div
	class={{
		'flex items-center rounded-sm group': true,
		'bg-blue-100': isInkMode,
		'hover:bg-slate-200/50': !isInkMode
	}}
>
	<button
		aria-label="Free Draw"
		class={`inline-flex enabled:hover:text-black text-slate-600 p-1 disabled:text-slate-300 rounded-sm transition-all group relative focus:border-blue-400 focus:ring-0 focus:shadow-sm outline-hidden border border-transparent`}
		onclick={() => {
			const mode = isInkMode ? AnnotationEditorType.NONE : AnnotationEditorType.INK;
			$pdfSlickStore?.pdfSlick?.setAnnotationEditorMode(mode);
		}}
	>
		<iconify-icon height={16} icon="codicon:edit"></iconify-icon>
	</button>

	<DropdownMenu.Root>
		<DropdownMenu.Trigger
			class="inline-flex p-0.5 hover:group-hover:enabled:bg-slate-200 enabled:hover:text-black text-slate-500 disabled:text-slate-300 rounded-sm transition-all focus:border-blue-400 focus:ring-0 focus:shadow-sm outline-hidden border border-transparent"
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
									class="p-2 cursor-pointer block rounded-full origin-center border border-transparent hover:scale-125 hover:border-blue-300 focus:ring-0 focus:outline-hidden focus:scale-125 focus:border-blue-300"
									style={`background-color: ${colors[name][s]}`}
									onSelect={() => {
										$pdfSlickStore?.pdfSlick?.setAnnotationEditorMode(AnnotationEditorType.INK);
										$pdfSlickStore?.pdfSlick?.setAnnotationEditorParams([
											{
												type: AnnotationEditorParamsType.INK_COLOR,
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

			<DropdownMenu.Group class="flex flex-col">
				<div class="py-1 flex gap-1 items-center">
					<DropdownMenu.GroupHeading>Thickness</DropdownMenu.GroupHeading>
					<div class="w-full flex flex-1 items-center px-2">
						<input
							class="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
							bind:value={thickness}
							id="thickness"
							type="range"
							min={1}
							max={100}
							onchange={(e) => {
								$pdfSlickStore?.pdfSlick?.setAnnotationEditorParams([
									{
										type: AnnotationEditorParamsType.INK_THICKNESS,
										value: +e.currentTarget.value
									}
								]);
							}}
						/>
					</div>
				</div>

				<div class="py-1 flex gap-1 items-center">
					<DropdownMenu.GroupHeading>Opacity</DropdownMenu.GroupHeading>
					<div class="w-full flex flex-1 items-center px-2">
						<input
							class="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
							bind:value={opacity}
							id="opacity"
							type="range"
							step="0.1"
							min={0}
							max={1}
							onchange={(e) => {
								$pdfSlickStore?.pdfSlick?.setAnnotationEditorParams([
									{
										type: AnnotationEditorParamsType.INK_OPACITY,
										value: +e.currentTarget.value
									}
								]);
							}}
						/>
					</div>
				</div>
			</DropdownMenu.Group>
		</DropdownMenu.Content>
	</DropdownMenu.Root>

	<!-- <Menu class="relative" let:open>
		<MenuButton
			disabled={!$pdfSlickStore?.pdfSlick}
			class="h-6 hover:group-hover:enabled:bg-slate-200 enabled:hover:text-black text-slate-500 disabled:text-slate-300 rounded-sm transition-all focus:border-blue-400 focus:ring-0 focus:shadow-sm outline-hidden border border-transparent"
			on:click={(e) => {
				e.preventDefault();
				e.stopPropagation();
			}}
		>
			<div class="inline-flex p-0.5">
				<iconify-icon height={12} icon="codicon:chevron-down" />
			</div>
		</MenuButton>

		{#if open}
			<div
				in:scale={{ duration: 100, delay: 0, opacity: 0.75, start: 0.95, easing: quintOut }}
				out:scale={{ duration: 75, delay: 0, opacity: 0, start: 0.95, easing: quintIn }}
			>
				<MenuItems
					static
					class="absolute right-0 z-30 mt-2 origin-top-right rounded-sm text-left bg-white divide-y divide-slate-200 shadow-lg ring-1 ring-black/5 focus:outline-hidden"
					role="menu"
					aria-orientation="vertical"
					tabindex={-1}
				>
					<div class="flex flex-col space-y-1 p-2">
						<div class="text-sm font-medium text-gray-900 py-1">Color</div>
						{#each colorStrengths as s}
							<div class="flex space-x-1">
								{#each colorNames as name}
									<button
										class="p-2 cursor-pointer block rounded-full origin-center border border-transparent hover:scale-125 hover:border-blue-300 focus:ring-0 focus:outline-hidden focus:scale-125 focus:border-blue-300"
										style={`background-color: ${colors[name][s]}`}
										on:click={(e) => {
											e.preventDefault();
											e.stopPropagation();

											$pdfSlickStore?.pdfSlick?.setAnnotationEditorMode(AnnotationEditorType.INK);
											$pdfSlickStore?.pdfSlick?.setAnnotationEditorParams([
												{
													type: AnnotationEditorParamsType.INK_COLOR,
													value: colors[name][s]
												}
											]);
										}}
									/>
								{/each}
							</div>
						{/each}
					</div>

					<div class="p-2 flex flex-col">
						<div class="py-1 flex space-x-2 items-center">
							<label for="inkThickness" class="text-sm w-20 font-medium text-gray-900"
								>Thickness</label
							>
							<div class="w-full flex flex-1 items-center">
								<input
									class="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
									bind:value={thickness}
									id="inkThickness"
									type="range"
									min={1}
									max={100}
								/>
							</div>
						</div>

						<div class="py-1 flex space-x-2 items-center">
							<label for="inkOpacity" class="text-sm w-20 font-medium text-gray-900">Opacity</label>
							<div class="w-full flex flex-1 items-center">
								<input
									class="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
									bind:value={opacity}
									id="inkOpacity"
									type="range"
									min={0}
									max={100}
								/>
							</div>
						</div>
					</div>
				</MenuItems>
			</div>
		{/if}
	</Menu> -->
</div>
