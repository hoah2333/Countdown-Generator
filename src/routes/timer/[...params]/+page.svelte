<script lang="ts">
  import { Timer } from "$lib/components/timer";
  import { page } from "$app/state";

  import type { TimerComponentType } from "$lib/types";

  let { params }: { params: { params: string } } = $props();

  interface URLParamsType {
    name: string;
    value: string;
  }

  let paramsArray = $derived(
    params.params
      .split("/")
      .map((param: string): URLParamsType => ({ name: param.split("=")[0], value: param.split("=")[1] })),
  );

  const setType = (type: string): "ban" | "delete" | "custom" => {
    switch (type) {
      case "ban":
        return "ban";
      case "delete":
        return "delete";
      default:
        return "custom";
    }
  };

  let componentParams: TimerComponentType = $derived({
    type: setType(paramsArray.find((param: URLParamsType) => param.name == "type")?.value ?? ""),
    time: paramsArray.find((param: URLParamsType) => param.name == "time")?.value ?? "",
    custom: {
      before: paramsArray.find((param: URLParamsType) => param.name == "customBefore")?.value,
      after: paramsArray.find((param: URLParamsType) => param.name == "customAfter")?.value,
    },
  });

  let site: string = $state("");
  const frameId = page.url.href.replace(/^.*\//, "/").replace(/^\/+/, "");
  let iframe: HTMLDivElement | null = $state(null);
  let pageHeight: number = $state(0);
  $effect(() => {
    site = document.referrer;
    if (iframe && pageHeight === 0) {
      pageHeight = iframe.getBoundingClientRect().top;
      if (pageHeight) {
        pageHeight += 1;
      }
    }
  });
</script>

<Timer type={componentParams.type} time={componentParams.time} custom={componentParams.custom} />

<div bind:this={iframe}>
  {#if site.includes("wikidot")}
    <iframe
      class="hidden"
      src="{site}/common--javascript/resize-iframe.html?#{pageHeight}/{frameId}"
      title="resize-iframe"
    ></iframe>
  {/if}
</div>
