<script lang="ts">
	import type { TPDFDocumentOutline } from '@pdfslick/core';
	import { pdfSlickStore } from '$lib/store';

	export let level: number = 0;
	export let outline: TPDFDocumentOutline | null;
</script>

{#each outline ?? [] as item, ix}
	<ul class="w-full">
		{#if item.items && item.items?.length > 0}
			<li class="relative p-1 py-px">
				<input
					id={`${item.title}-${ix}`}
					type="checkbox"
					checked={false}
					class="peer absolute -top-[10000px] -left-[10000px]"
				/>
				<div class="flex items-start [&>label]:peer-checked:rotate-90">
					<label
						for={`${item.title}-${ix}`}
						class="cursor-pointer mt-1 hover:text-slate-900 rounded p-1 hover:bg-slate-200"
					>
						<iconify-icon height={16} icon="codicon:triangle-right"></iconify-icon>
					</label>

					<button
						class="flex-1 rounded text-left hover:text-slate-900 p-1 hover:bg-slate-200"
						on:click={() => {
							$pdfSlickStore?.pdfSlick?.linkService?.goToDestination(item.dest);
						}}
					>
						{item.title}
					</button>
				</div>
				<div class="hidden peer-checked:block pl-1">
					<svelte:self outline={item.items} level={level + 1} />
				</div>
			</li>
		{:else}
			<li class="relative p-1 py-px">
				<input
					id={`${item.title}-${ix}`}
					type="checkbox"
					checked={false}
					class="peer absolute -top-[10000px] -left-[10000px]"
				/>
				<div class="flex items-start [&>label]:peer-checked:rotate-90">
					<span class="block w-6"></span>
					<button
						class="flex-1 rounded text-left hover:text-slate-900 p-1 hover:bg-slate-200"
						on:click={() => {
							$pdfSlickStore?.pdfSlick?.linkService?.goToDestination(item.dest);
						}}
					>
						{item.title}
					</button>
				</div>
				<div class="hidden peer-checked:block pl-1"></div>
			</li>
		{/if}
	</ul>
{/each}
