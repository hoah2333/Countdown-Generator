<script lang="ts">
	import { page } from '$app/stores';
	import { timerFunc } from '$lib/timer';
	import type { timerTextType } from '$lib/types';
	import { onDestroy } from 'svelte';

	let timerTexts: timerTextType = {
		warning: '',
		status: '',
		text: '',
		timer: ''
	};

	const interval = setInterval(() => {
		timerTexts = timerFunc($page.params.params.split('/'));
	}, 1000);

	onDestroy(() => {
		clearInterval(interval);
	});
</script>

<div id="countdown-wrapper">
	{#if typeof timerTexts === 'object'}
		<span class="warning">{timerTexts.warning}</span>
		<span class="text {timerTexts.status}">{timerTexts.text}</span><br />
		<span class="timer">{timerTexts.timer}</span>
	{/if}
</div>

<style lang="scss" type="text/scss">
	@import './page';
</style>
