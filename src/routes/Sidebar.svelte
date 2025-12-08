<script lang="ts">
  let { type }: { type: string } = $props();

  const linkList = ["generator", "tools"];
  const linkTextList = ["Generator", "Tools"];
</script>

<div class="fixed top-4 left-4 xl:left-[calc((100vw-960px)/2-7rem)] border-2 border-gray-400 bg-white p-1 z-10">
  {#each linkList as link, index}
    <div>
      {#if type == link}
        &gt; {linkTextList[index]}
      {:else}
        <a href={`/${link}`}>{linkTextList[index]}</a>
      {/if}
    </div>
  {/each}
</div>
