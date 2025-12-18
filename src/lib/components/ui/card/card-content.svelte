<script lang="ts">
  import { cn } from "$lib/utils";

  import type { HTMLAttributes } from "svelte/elements";
  import type { WithElementRef } from "$lib/utils";

  let {
    ref = $bindable(null),
    class: className,
    children,
    ...restProps
  }: WithElementRef<HTMLAttributes<HTMLDivElement>> = $props();
</script>

<div bind:this={ref} data-slot="card-content" class={cn("px-6", className)} {...restProps}>
  {@render children?.()}
</div>
