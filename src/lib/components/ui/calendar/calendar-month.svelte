<script lang="ts">
  import { cn } from "$lib/utils";

  import type { HTMLAttributes } from "svelte/elements";
  import type { WithElementRef } from "$lib/utils";

  let {
    ref = $bindable(null),
    class: className,
    children,
    ...restProps
  }: WithElementRef<HTMLAttributes<HTMLElement>> = $props();
</script>

<div {...restProps} bind:this={ref} class={cn("flex flex-col", className)}>
  {@render children?.()}
</div>
