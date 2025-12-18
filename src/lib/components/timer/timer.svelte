<script lang="ts">
  import humanizeDuration from "humanize-duration";

  import type { TimerComponentType } from "$lib/types";

  interface StatusTextType {
    before: string;
    after: string;
  }

  interface StatusTextMapType {
    delete: StatusTextType;
    ban: StatusTextType;
    custom: StatusTextType;
  }

  let { type, time, custom }: TimerComponentType = $props();

  let inputTime: Date = $derived(isNaN(Number(time)) ? new Date(time) : new Date(Number(time)));
  let nowTime: Date = $state(new Date());

  let statusText: StatusTextMapType = $derived({
    delete: { before: "该页面将在以下时间后被删除：", after: "该页面已在以下时间前可被删除：" },
    ban: { before: "该用户将在以下时间后被封禁：", after: "该用户已在以下时间前可被封禁：" },
    custom: {
      before: custom?.before ?? "该计时器将在以下时间后到期：",
      after: custom?.after ?? "该计时器已在以下时间前到期：",
    },
  });

  let timerTime = $state(0);

  $effect(() => {
    timerTime = nowTime.getTime() - inputTime.getTime();

    const interval: NodeJS.Timeout = setInterval(() => {
      nowTime = new Date();
    }, 1000);

    return (): void => {
      if (interval) clearInterval(interval);
    };
  });

  const timerConvert = humanizeDuration.humanizer({
    language: "zh_CN",
    units: ["d", "h", "m", "s"],
    languages: { zh_CN: { d: () => "天", h: () => "时", m: () => "分", s: () => "秒" } },
    conjunction: " ",
    delimiter: " ",
    serialComma: false,
    maxDecimalPoints: 0,
  });
</script>

<div>
  {#if time !== ""}
    <div class={timerTime < 0 ? "text-red-500" : "text-green-500"}>
      {statusText[type][timerTime < 0 ? "before" : "after"]}
    </div>
    <div class="text-xl font-bold">
      {timerConvert(timerTime < 0 ? -timerTime : timerTime)}
    </div>
  {:else}
    <div class="text-xl text-red-500">缺少参数：time，请检查链接参数。</div>
  {/if}
</div>
