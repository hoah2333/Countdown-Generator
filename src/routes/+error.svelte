<script lang="ts">
	import { page } from '$app/stores';
</script>

<h3>
	糟糕！这个页面出现了 <a href="https://developer.mozilla.org/zh-CN/docs/Web/HTTP/Status/{$page.status}">{$page.status}</a> 错误！原因为：{$page.error ? $page.error.message : ''}！
	<br />
	如果这不是有意为之的，请向工具作者
	<a href="http://www.wikidot.com/account/messages#/new/4915183">hoah2333</a> 报告！
</h3>

<a href="/generator">点此返回倒计时生成器</a>
