<script lang="ts">
  import { cn } from "$lib/utils";

  import type { HTMLAttributes } from "svelte/elements";
  import type { WithElementRef } from "$lib/utils";

  let {
    ref = $bindable(null),
    class: className,
    children,
    ...restProps
  }: WithElementRef<HTMLAttributes<HTMLParagraphElement>> = $props();
</script>

<p bind:this={ref} data-slot="card-description" class={cn("text-sm text-muted-foreground", className)} {...restProps}>
  {@render children?.()}
</p>
