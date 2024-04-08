<script lang="ts">
	export let type: string;

	type == 'generator';
</script>

<div id="sidebar">
	<span class="generator"
		>{#if type == 'generator'}> Generator{:else}<a href="/generator">Generator</a>{/if}</span
	>
	<br />
	<span class="tools"
		>{#if type == 'tools'}> Tools{:else}<a href="/tools">Tools</a>{/if}</span
	>
</div>

<style lang="scss" type="text/scss">
	@import './sidebar';
</style>
