<script lang="ts">
	import { page } from '$app/stores';
	import { fly } from 'svelte/transition';

	let whenTypes: string = 'delete';
	let afterTypes: string = 'delete';

	let now: Date = new Date();

	let selectedDate: string = `${now.getFullYear()}-${now.getMonth() + 1 < 10 ? `0${now.getMonth() + 1}` : now.getMonth() + 1}-${now.getDate() < 10 ? `0${now.getDate()}` : now.getDate()}`;
	let seletedTime: string = `${now.getHours() < 10 ? `0${now.getHours()}` : now.getHours()}:${now.getMinutes() < 10 ? `0${now.getMinutes()}` : now.getMinutes()}`;

	let yearOptions: number[] = [];
	for (let i = 0; i <= 20; i++) {
		yearOptions.push(i);
	}

	let monthOptions: number[] = [];
	for (let i = 0; i <= 12; i++) {
		monthOptions.push(i);
	}

	let dateOptions: number[] = [];
	for (let i = 0; i <= 31; i++) {
		dateOptions.push(i);
	}

	let hourOptions: number[] = [];
	for (let i = 0; i <= 24; i++) {
		hourOptions.push(i);
	}

	let minuteOptions: number[] = [];
	for (let i = 0; i <= 60; i++) {
		minuteOptions.push(i);
	}

	let aftertimes: number[] = [0, 0, 3, 0, 0];

	let whenCustom: string[] = ['', ''];
	let afterCustom: string[] = ['', ''];
	let generated: boolean = false;
	let outputLink: string = '';

	let isCopySucc: boolean;
	let isCopied: boolean;
</script>

<svelte:head>
	<title>倒计时生成器</title>
</svelte:head>

<div id="main-wrapper">
	<h1 class="title">倒计时生成器</h1>
	<div class="info"></div>
	<div id="component-wrapper">
		<div class="whentime">
			<fieldset id="whentime-field">
				<legend>在特定时间到达时删除</legend>
				<div class="timer-type">
					<span>计时器类型：</span>
					{#each [{ type: 'delete', name: '删除计时器 —' }, { type: 'ban', name: '封禁计时器 —' }, { type: 'custom', name: '自定义计时器' }] as types}
						<input
							type="radio"
							id="when-{types.type}"
							value={types.type}
							bind:group={whenTypes}
						/><label for="when-{types.type}">{types.name}</label>
					{/each}
				</div>
				{#if whenTypes == 'custom'}
					<div class="timer-custom">
						<span>自定义文本 - 计时结束前：</span>
						<input
							type="text"
							name="whentime"
							id="when-custom-before"
							placeholder="该计时器将在以下时间后到期："
							bind:value={whenCustom[0]}
						/>
						<br />
						<span>自定义文本 - 计时结束后：</span>
						<input
							type="text"
							name="whentime"
							id="when-custom-after"
							placeholder="该计时器已在以下时间前到期："
							bind:value={whenCustom[1]}
						/>
					</div>
				{/if}
				<div class="timer-time">
					<span>
						{whenTypes == 'delete'
							? '页面删除时间：'
							: whenTypes == 'ban'
								? '封禁到期时间：'
								: '计时器结束时间：'}
					</span>

					<input type="date" bind:value={selectedDate} />
					<input type="time" bind:value={seletedTime} />
				</div>
				<button
					type="button"
					on:click={() => {
						generated = true;
						let outputDate = new Date(`${selectedDate} ${seletedTime}`).toISOString();
						outputLink =
							`${$page.url.origin}/timer/time=${outputDate}/type=${whenTypes}` +
							(whenCustom[0] == '' ? '' : `/customBefore=${whenCustom[0]}`) +
							(whenCustom[1] == '' ? '' : `/customAfter=${whenCustom[1]}`);
					}}>生成！</button
				>
			</fieldset>
		</div>
		<br />
		<div class="aftertime">
			<fieldset id="aftertime-field">
				<legend>在特定时间段之后删除</legend>
				<div class="timer-type">
					<span>计时器类型：</span>
					{#each [{ type: 'delete', name: '删除计时器 —' }, { type: 'ban', name: '封禁计时器 —' }, { type: 'custom', name: '自定义计时器' }] as types}
						<input
							type="radio"
							id="after-{types.type}"
							value={types.type}
							bind:group={afterTypes}
						/><label for="after-{types.type}">{types.name}</label>
					{/each}
				</div>
				{#if afterTypes == 'custom'}
					<div class="timer-custom">
						<span>自定义文本 - 计时结束前：</span>
						<input
							type="text"
							name="aftertime"
							id="after-custom-before"
							placeholder="该计时器将在以下时间后到期："
							bind:value={afterCustom[0]}
						/>
						<br />
						<span>自定义文本 - 计时结束后：</span>
						<input
							type="text"
							name="aftertime"
							id="after-custom-after"
							placeholder="该计时器已在以下时间前到期："
							bind:value={afterCustom[1]}
						/>
					</div>
				{/if}
				<div class="timer-time">
					<span
						>{afterTypes == 'delete'
							? '在以下时间段后删除页面：'
							: afterTypes == 'ban'
								? '在以下时间段后解除封禁：'
								: '在以下时间段后结束计时：'}</span
					>
					{#each [{ id: 0, type: 'year', string: '年', options: yearOptions }, { id: 1, type: 'month', string: '月', options: monthOptions }, { id: 2, type: 'date', string: '日', options: dateOptions }, { id: 3, type: 'hour', string: '时', options: hourOptions }, { id: 4, type: 'minute', string: '分', options: minuteOptions }] as times}
						<select name={times.type} id="after-{times.type}" bind:value={aftertimes[times.id]}>
							{#each times.options as options}
								<option value={options}>{options}</option>
							{/each}
						</select><label for="after-{times.type}">{times.string}</label>
					{/each}
				</div>
				<button
					type="button"
					on:click={() => {
						generated = true;
						now = new Date();
						let outputDate = new Date(
							now.getFullYear() + aftertimes[0],
							now.getMonth() + aftertimes[1],
							now.getDate() + aftertimes[2],
							now.getHours() + aftertimes[3],
							now.getMinutes() + aftertimes[4],
							now.getSeconds()
						).toISOString();
						outputLink =
							`${$page.url.origin}/timer/time=${outputDate}/type=${afterTypes}` +
							(afterCustom[0] == '' ? '' : `/customBefore=${afterCustom[0]}`) +
							(afterCustom[1] == '' ? '' : `/customAfter=${afterCustom[1]}`);
					}}>生成！</button
				>
			</fieldset>
		</div>

		{#if generated}
			<div class="generated">
				<hr />
				{#each [`[[iframe ${outputLink} style="width:400px;height:65px"]]`, `由于条目的分数为-X分，现根据[[[deletions-policy|删除政策]]]，宣告将删除此页：\n[[iframe ${outputLink} style="width:400px;height:65px"]]\n如果你不是作者又想要重写该条目，请在此帖回复申请。请先取得作者的同意，并将原文的源代码复制至沙盒里。除非你是工作人员，否则请勿就申请重写以外的范围回复此帖。`, `由于翻译质量不佳，宣告删除。\n[[iframe ${outputLink} style="width: 400px; height: 65px;"]]`] as outputs}
					<blockquote>
						<a
							href="/"
							on:click={async (event) => {
								event.preventDefault();
								isCopied = true;
								setTimeout(() => {
									isCopied = false;
								}, 3000);
								try {
									await navigator.clipboard.writeText(outputs);
									isCopySucc = true;
								} catch (e) {
									console.error('复制失败', e);
									isCopySucc = false;
								}
							}}>{outputs}</a
						>
					</blockquote>
				{/each}
				<iframe
					title="generated-iframe"
					src={outputLink}
					frameborder="0"
					width="400px"
					height="65px"
				/>
			</div>
		{/if}

		{#if isCopied}
			<div class="copy-text" transition:fly={{ x: 40, duration: 700 }}>
				{isCopySucc ? '复制成功！' : '复制失败！'}
			</div>
		{/if}
	</div>
</div>

<style lang="scss" type="text/scss">
	@import './page';
</style>
