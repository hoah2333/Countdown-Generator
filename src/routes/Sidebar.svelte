<script lang="ts">
  import { Button } from "$lib/components/ui/button";

  let { type }: { type: string } = $props();

  const linkList = ["generator", "tools"];
  const linkTextList = ["Generator", "Tools"];
</script>

<div class="mt-4 h-min rounded-md border-2 border-gray-400 bg-white px-4 py-1">
  {#each linkList as link, index}
    <div>
      {#if type == link}
        <Button variant="link" class="p-0" disabled>&gt; {linkTextList[index]}</Button>
      {:else}
        <Button variant="link" class="p-0" href={`/${link}`}>{linkTextList[index]}</Button>
      {/if}
    </div>
  {/each}
</div>
