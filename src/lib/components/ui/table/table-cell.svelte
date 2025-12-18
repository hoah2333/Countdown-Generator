<script lang="ts">
  import { cn } from "$lib/utils";

  import type { WithElementRef } from "$lib/utils";
  import type { HTMLTdAttributes } from "svelte/elements";

  let { ref = $bindable(null), class: className, children, ...restProps }: WithElementRef<HTMLTdAttributes> = $props();
</script>

<td
  bind:this={ref}
  data-slot="table-cell"
  class={cn(
    "border-x bg-clip-padding p-2 align-middle font-normal whitespace-nowrap last:border-r-0 [&:has([role=checkbox])]:pe-0",
    className,
  )}
  {...restProps}
>
  {@render children?.()}
</td>
