<script lang="ts">
	import { fly } from 'svelte/transition';
	import type { pagesJsonType } from '$lib/types';
	import { timerFunc } from '$lib/timer';
	import type { timerTextType } from '$lib/types';
	import Sidebar from '../Sidebar.svelte';

	export let data: pagesJsonType;
	let pagesJson: pagesJsonType = data;

	let deletedPagesLink: number[] = [];
	let deletedPagesType: string[] = [];
	pagesJson.deleted_pages.forEach((pages, index) => {
		deletedPagesType[index] = pages.page_type.includes('deleted') ? 'deleted' : pages.page_type[0];
		deletedPagesLink[index] = index;
	});

	let output: string = '';
	function clickOutputSaintafox() {
		let deletedLinks: string[] = [];
		let deletedOutput: string = '';
		let normalOutputs: string[] = [];
		let normalOutput: string = '';
		let minusThirtyOutputs: string[] = [];
		let minusThirtyOutput: string = '';
		let translateOutputs: string[] = [];
		let translateOutput: string = '';
		for (let i = 0; i < deletedPagesLink.length; i++) {
			let page = pagesJson.deleted_pages[deletedPagesLink[i]];
			let deleteSource = `\n[[collapsible show="+ 页面源代码" hide="- 收起"]]\n[[code]]\n${page.context}\n[[/code]]\n[[/collapsible]]\n\n`;

			if (deletedPagesType[deletedPagesLink[i]] == 'deleted') {
				deletedLinks.push(page.link);
			}
			if (deletedPagesType[deletedPagesLink[i]] == 'normal') {
				normalOutputs.push(
					`由于发布删除宣告时本页面已处于 ${page.release_score} 的低分，现已跌至 ${page.score} 分，且在宣告删除后的 ${page.time} 小时内无异议，故删除「${page.title}」。${deleteSource}`
				);
			}
			if (deletedPagesType[deletedPagesLink[i]] == 'minusThirty') {
				minusThirtyOutputs.push(
					`由于本页面已处于 ${page.score} 的低分，故立即删除「${page.title}」。${deleteSource}`
				);
			}
			if (deletedPagesType[deletedPagesLink[i]] == 'translate') {
				translateOutputs.push(
					`由于翻译质量不佳，且译者在宣告删除后的 ${page.time} 小时内无异议，故删除「${page.title}」。${deleteSource}`
				);
			}
		}
		deletedOutput =
			deletedLinks[0] == null ? '' : `直接删除原作者自删的页面：\n${deletedLinks.join('\n')}`;
		normalOutput = normalOutputs[0] == null ? '' : `\n${normalOutputs.join('\n')}`;
		minusThirtyOutput = minusThirtyOutputs[0] == null ? '' : `\n${minusThirtyOutputs.join('\n')}`;
		translateOutput = translateOutputs[0] == null ? '' : `\n${translateOutputs.join('\n')}`;

		output = `${deletedOutput}\n${normalOutput}\n${minusThirtyOutput}\n${translateOutput}`;
		copyHandler();
	}
	function clickOutputAmbersight() {
		let deletedOutputs: string[] = [];
		let deletedOutput: string = '';
		let normalOutputs: string[] = [];
		let normalOutput: string = '';
		let minusThirtyOutputs: string[] = [];
		let translateOutputs: string[] = [];
		for (let i = 0; i < deletedPagesLink.length; i++) {
			let page = pagesJson.deleted_pages[deletedPagesLink[i]];
			let deleteSource = `\n[[collapsible show="[+] 页面源代码" hide="[-] 关闭"]]\n[[code]]\n${page.context}\n[[/code]]\n[[/collapsible]]\n`;

			if (deletedPagesType[deletedPagesLink[i]] == 'deleted') {
				deletedOutputs.push(`* ${page.title}（[# /${page.link.split('/').pop()}]）`);
			}
			if (deletedPagesType[deletedPagesLink[i]] == 'normal') {
				normalOutputs.push(
					`[[li]]\n${page.title}（[# /${page.link.split('/').pop()}]）\n宣告时 ${page.release_score} 分，当前 ${page.score} 分，${page.time} 小时无异议。${deleteSource}[[/li]]`
				);
			}
			if (deletedPagesType[deletedPagesLink[i]] == 'minusThirty') {
				minusThirtyOutputs.push(
					`[[li]]\n${page.title}（[# /${page.link.split('/').pop()}]）\n当前 ${page.score} 分，直接删除。${deleteSource}[[/li]]`
				);
			}
			if (deletedPagesType[deletedPagesLink[i]] == 'translate') {
				translateOutputs.push(
					`[[li]]\n${page.title}（[# /${page.link.split('/').pop()}]）\n翻译质量不佳，${page.time} 小时无异议。${deleteSource}[[/li]]`
				);
			}
		}
		deletedOutput =
			deletedOutputs[0] == null ? '' : `直接删除原作者自删的页面：\n${deletedOutputs.join('\n')}`;
		normalOutput =
			normalOutputs[0] == null && minusThirtyOutputs[0] == null && translateOutputs[0] == null
				? ''
				: `删除以下待删除的页面：\n[[ul style="margin-bottom: -0.4em;"]]${`\n${normalOutputs.join('\n')}`}${minusThirtyOutputs[0] == null ? '' : `\n${minusThirtyOutputs.join('\n')}`}${translateOutputs[0] == null ? '' : `\n${translateOutputs.join('\n')}`}[[/ul]]`;

		output = `${deletedOutput}\n\n${normalOutput}`;
		copyHandler();
	}

	let isCopySucc: boolean;
	let isCopied: boolean;
	async function copyHandler() {
		isCopied = true;
		setTimeout(() => {
			isCopied = false;
		}, 3000);
		try {
			await navigator.clipboard.writeText(output);
			isCopySucc = true;
		} catch (e) {
			console.error('复制失败', e);
			isCopySucc = false;
		}
	}

	let timerTexts: timerTextType[] = [
		{
			warning: '',
			status: '',
			text: '',
			timer: ''
		}
	];
	pagesJson.pre_delete_pages.forEach((pages, index) => {
		timerTexts[index] = timerFunc(
			`${pages.timestamp == null ? '' : `time=${pages.timestamp * 1000}/`}type=delete`.split('/')
		);
		setInterval(() => {
			timerTexts[index] = timerFunc(
				`${pages.timestamp == null ? '' : `time=${pages.timestamp * 1000}/`}type=delete`.split('/')
			);
		}, 1000);
	});
</script>

<Sidebar type="tools" />

<div id="main-wrapper">
	<h1 class="title">倒计时生成器 - 工具页</h1>
	<div class="info">
		{#if typeof pagesJson === 'object'}
			<h4>
				页面上次更新时间：{new Date(pagesJson.update_timestamp * 1000).toLocaleString()}
			</h4>
		{/if}
	</div>
	<div id="component-wrapper">
		{#if typeof pagesJson === 'object'}
			<blockquote class="delete-source">
				<div class="buttons">
					<button type="button" on:click={clickOutputSaintafox}
						>点此生成并复制删除公告 - Saintafox 版</button
					>
					<button type="button" on:click={clickOutputAmbersight}
						>点此生成并复制删除公告 - Ambersight 版</button
					>
				</div>
				<br />
				<textarea id="delete-source">{output}</textarea>
			</blockquote>

			{#each pagesJson.deleted_pages as pages, index}
				<blockquote>
					<label for="{pages.link.split('/')[3]}-checkbox">
						<table>
							<tr>
								<th>是否勾选</th>
								<td>
									<input
										type="checkbox"
										name={pages.link.split('/')[3]}
										value={index}
										id="{pages.link.split('/')[3]}-checkbox"
										bind:group={deletedPagesLink}
									/>
								</td>
							</tr>
							<tr>
								<th>文章标题</th>
								<td>{pages.title}</td>
							</tr>
							<tr>
								<th>文章链接</th>
								<td><a href={pages.link}>{pages.link}</a></td>
							</tr>
							<tr>
								<th>文章源代码</th>
								<td><textarea id="page-source">{pages.context}</textarea></td>
							</tr>
							<tr>
								<th>页面分数</th>
								<td>{pages.release_score} -> {pages.score}</td>
							</tr>
							<tr>
								<th>文章类型</th>
								<td>
									{#each pages.page_type as types}
										{#if types == 'minusThirty'}
											<input
												type="radio"
												name={pages.link.split('/')[3]}
												id="{pages.link.split('/')[3]}-minusThirty"
												value="minusThirty"
												bind:group={deletedPagesType[index]}
											/><label for="{pages.link.split('/')[3]}-minusThirty">低于-30</label>
										{/if}
										{#if types == 'normal'}
											<input
												type="radio"
												name={pages.link.split('/')[3]}
												id="{pages.link.split('/')[3]}-normal"
												value="normal"
												bind:group={deletedPagesType[index]}
											/><label for="{pages.link.split('/')[3]}-normal">低分原创</label>
										{/if}
										{#if types == 'translate'}
											<input
												type="radio"
												name={pages.link.split('/')[3]}
												id="{pages.link.split('/')[3]}-translate"
												value="translate"
												bind:group={deletedPagesType[index]}
											/><label for="{pages.link.split('/')[3]}-translate">低质翻译</label>
										{/if}
										{#if types == 'deleted'}
											<input
												type="radio"
												name={pages.link.split('/')[3]}
												id="{pages.link.split('/')[3]}-deleted"
												value="deleted"
												bind:group={deletedPagesType[index]}
											/><label for="{pages.link.split('/')[3]}-deleted">自删页面</label>
										{/if}
									{/each}
									| {pages.time}小时后删除
								</td>
							</tr>
						</table>
					</label>
				</blockquote>
			{/each}
			<hr />
			{#each pagesJson.pre_delete_pages as pages, index}
				<blockquote>
					<table>
						<tr>
							<th>文章标题</th>
							<td>{pages.title}</td>
						</tr>
						<tr>
							<th>文章链接</th>
							<td
								><a href={pages.link} target="_blank" rel="noopener noreferrer">{pages.link}</a></td
							>
						</tr>
						<tr>
							<th>删除倒计时</th>
							<td class="countdown">
								<span class="warning">{timerTexts[index].warning}</span>
								<span class="text {timerTexts[index].status}">{timerTexts[index].text}</span><br />
								<span class="timer">{timerTexts[index].timer}</span>
							</td>
						</tr>
						<tr>
							<th>删除帖链接</th>
							<td
								><a
									href="{pages.discuss_link}#{pages.post_id}"
									target="_blank"
									rel="noopener noreferrer">{pages.discuss_link}#{pages.post_id}</a
								></td
							>
						</tr>
						<tr>
							<th>页面分数</th>
							<td>{pages.release_score} -> {pages.score}</td>
						</tr>
						<tr>
							<th>文章类型</th>
							<td>{pages.isOriginal ? '原创文章' : '翻译文章'} | {pages.time}小时后删除</td>
						</tr>
					</table>
				</blockquote>
			{/each}
		{:else}
			<blockquote>正在加载中，请稍候……</blockquote>
		{/if}
	</div>

	{#if isCopied}
		<div class="copy-text" transition:fly={{ x: 40, duration: 700 }}>
			{isCopySucc ? '复制成功！' : '复制失败！'}
		</div>
	{/if}
</div>

<style lang="scss" type="text/scss">
	@import './page';
</style>
