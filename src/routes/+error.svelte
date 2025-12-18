<script lang="ts">
  let { status, error }: { status: number; error: Error & { message?: string } } = $props();
</script>

<div class="flex min-h-[60vh] flex-col items-center justify-center gap-4 px-4 text-center">
  <h1 class="text-4xl font-bold text-red-500">
    糟糕！这个页面出现了 {status} 错误！
  </h1>

  <p class="text-base text-gray-700 dark:text-gray-200">
    错误原因为：{error?.message ?? "未知错误"}。
  </p>

  <p class="text-sm text-gray-500 dark:text-gray-400">
    错误代码说明请参考
    <a
      class="text-blue-600 underline underline-offset-4 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
      href={"https://developer.mozilla.org/zh-CN/docs/Web/HTTP/Status/" + status}
      target="_blank"
      rel="noreferrer">MDN 文档</a
    >。
  </p>

  <p class="text-sm text-gray-500 dark:text-gray-400">
    如果这不是有意为之的，请向工具作者
    <a
      class="text-blue-600 underline underline-offset-4 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
      href="http://www.wikidot.com/account/messages#/new/4915183"
      target="_blank"
      rel="noreferrer">hoah2333</a
    >
    报告！
  </p>

  <a
    href="/generator"
    class="mt-6 inline-flex items-center rounded-md bg-blue-600 px-5 py-2.5 text-sm font-medium text-white shadow-sm transition hover:bg-blue-700 focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 focus-visible:outline-none dark:bg-blue-500 dark:hover:bg-blue-400"
  >
    点此返回倒计时生成器
  </a>
</div>
