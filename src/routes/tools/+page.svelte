<script lang="ts">
  import Sidebar from "../Sidebar.svelte";

  import { Button } from "$lib/components/ui/button";
  import { Checkbox } from "$lib/components/ui/checkbox";
  import { Label } from "$lib/components/ui/label";
  import { RadioGroup, RadioGroupItem } from "$lib/components/ui/radio-group";
  import { Table, TableBody, TableCell, TableHead, TableRow } from "$lib/components/ui/table";
  import { Textarea } from "$lib/components/ui/textarea";
  import { Timer } from "$lib/components/timer";
  import { toast } from "svelte-sonner";

  import type { PagesJsonType, DeletedPagesType, TimerTextType } from "$lib/types";

  let { data = $bindable() }: { data: Record<string, PagesJsonType | null> } = $props();

  let pagesJson: PagesJsonType | null = $derived(data.dbContent);

  let selectedPagesIndex: number[] = $state([]);
  let selectedPagesType: string[] = $state([]);

  $effect(() => {
    if (pagesJson && selectedPagesIndex.length === 0) {
      selectedPagesIndex = pagesJson.deleted_pages.map((_, index) => index);
    }
    if (pagesJson && selectedPagesType.length === 0) {
      selectedPagesType = pagesJson.deleted_pages.map((page: DeletedPagesType) =>
        page.page_type.includes("deleted") ? "deleted" : page.page_type[0],
      );
    }
  });

  let output: string = $state("");
  async function clickOutputSaintafox(): Promise<void> {
    if (!pagesJson) return;

    const outputPage: { page: DeletedPagesType; pageType: string }[] = selectedPagesIndex
      .map((index: number) => ({ page: pagesJson.deleted_pages[index], pageType: selectedPagesType[index] }))
      .sort((a, b) => a.pageType.localeCompare(b.pageType));

    output = outputPage.reduce(
      (acc: string, { page, pageType }: { page: DeletedPagesType; pageType: string }, index: number) => {
        const deleteSource = `[[collapsible show="+ 页面源代码" hide="- 收起"]]\n[[code]]\n${page.context}\n[[/code]]\n[[/collapsible]]\n`;

        switch (pageType) {
          case "deleted":
            if (index === 0) {
              return `直接删除原作者自删的页面：\n${page.link}\n`;
            }
            return acc + `${page.link}\n`;
          case "normal":
            return (
              acc +
              `\n\n由于发布删除宣告时本页面已处于 ${page.release_score} 的低分，现已跌至 ${page.score} 分，且在宣告删除后的 ${page.time} 小时内无异议，故删除「${page.title}」。${deleteSource}`
            );
          case "minusThirty":
            return acc + `\n\n由于本页面已处于 ${page.score} 的低分，故立即删除「${page.title}」。${deleteSource}`;
          case "translate":
            return (
              acc +
              `\n\n由于翻译质量不佳，且译者在宣告删除后的 ${page.time} 小时内无异议，故删除「${page.title}」。${deleteSource}`
            );
          default:
            return acc;
        }
      },
      "",
    );

    await copyHandler(output);
  }
  async function clickOutputAmbersight(): Promise<void> {
    if (!pagesJson) return;

    const outputPage: { page: DeletedPagesType; pageType: string }[] = selectedPagesIndex
      .map((index) => ({ page: pagesJson.deleted_pages[index], pageType: selectedPagesType[index] }))
      .sort((a, b) => a.pageType.localeCompare(b.pageType));

    let hasOpenList: boolean = false;

    output = outputPage.reduce(
      (acc: string, { page, pageType }: { page: DeletedPagesType; pageType: string }, index: number) => {
        const deleteSource = `\n[[collapsible show="[+] 页面源代码" hide="[-] 关闭"]]\n[[code]]\n${page.context}\n[[/code]]\n[[/collapsible]]\n`;

        if (pageType !== "deleted" && (index === 0 || outputPage[index - 1].pageType === "deleted")) {
          acc += `\n删除以下待删除的页面：\n[[ul style="margin-bottom: -0.4em;"]]`;
          hasOpenList = true;
        }

        switch (pageType) {
          case "deleted":
            const deletedFormat = `* ${page.title}（[# /${page.link.split("/").pop()}]）\n`;
            if (index === 0) {
              return acc + `直接删除原作者自删的页面：\n${deletedFormat}`;
            }
            return acc + deletedFormat;
          case "normal":
            return (
              acc +
              `[[li]]\n${page.title}（[# /${page.link.split("/").pop()}]）\n宣告时 ${page.release_score} 分，当前 ${page.score} 分，${page.time} 小时无异议。${deleteSource}[[/li]]`
            );
          case "minusThirty":
            return (
              acc +
              `[[li]]\n${page.title}（[# /${page.link.split("/").pop()}]）\n当前 ${page.score} 分，直接删除。${deleteSource}[[/li]]`
            );
          case "translate":
            return (
              acc +
              `[[li]]\n${page.title}（[# /${page.link.split("/").pop()}]）\n翻译质量不佳，${page.time} 小时无异议。${deleteSource}[[/li]]`
            );
          default:
            return acc;
        }
      },
      "",
    );

    if (hasOpenList) {
      output += `\n[[/ul]]`;
    }

    await copyHandler(output);
  }

  async function copyHandler(output: string): Promise<void> {
    try {
      if (!navigator.clipboard) {
        throw new Error("浏览器不支持剪贴板API");
      }

      await navigator.clipboard.writeText(output);
      toast.success("复制成功！");
    } catch (error) {
      console.error("复制失败:", error);
      toast.error("复制失败，请手动复制");
    }
  }
</script>

<div class="flex flex-col justify-center gap-2 md:flex-row">
  <Sidebar type="tools" />

  <div class="align-center mt-4 flex flex-col items-center justify-center">
    <h1 class="text-2xl font-bold">倒计时生成器 - 工具页</h1>

    <div class="mt-2">
      {#if pagesJson}
        <div class="text-sm">
          页面上次更新时间：{new Date(pagesJson.update_timestamp).toLocaleString()}
        </div>
      {/if}
    </div>
    <div class="relative w-full max-w-4xl" id="component-wrapper">
      {#if pagesJson}
        <div class="relative my-4 flex flex-col rounded-md border-2 border-gray-400 p-2 text-center">
          <div class="flex flex-wrap justify-center gap-2">
            <Button variant="outline" type="button" onclick={clickOutputSaintafox}>
              点此生成并复制删除公告 - Saintafox 版
            </Button>
            <Button variant="outline" type="button" onclick={clickOutputAmbersight}>
              点此生成并复制删除公告 - Ambersight 版
            </Button>
          </div>
          <Textarea class="mt-4 max-h-100 w-full min-w-[min(80vw,50rem)]" bind:value={output} />
        </div>

        {#each pagesJson.deleted_pages as pages, index}
          <blockquote class="relative my-4 flex flex-col rounded-md border-2 border-gray-400 p-2">
            <Label>
              <Table class="w-[calc(100%-1rem)]">
                <TableBody class="[&_td]:w-full">
                  <TableRow>
                    <TableHead>是否勾选</TableHead>
                    <TableCell>
                      <Checkbox
                        bind:checked={
                          () => selectedPagesIndex.includes(index),
                          (checked) => {
                            if (checked) {
                              selectedPagesIndex = [...selectedPagesIndex, index];
                            } else {
                              selectedPagesIndex = selectedPagesIndex.filter((i) => i !== index);
                            }
                          }
                        }
                      />
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableHead>文章标题</TableHead>
                    <TableCell>{pages.title}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableHead>文章链接</TableHead>
                    <TableCell>
                      <Button variant="link" class="px-0" href={pages.link} target="_blank" rel="noopener noreferrer">
                        {pages.link}
                      </Button>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableHead>文章源代码</TableHead>
                    <TableCell>
                      <Textarea class="max-h-4 w-full max-w-full" value={pages.context} />
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableHead>页面分数</TableHead>
                    <TableCell>{pages.release_score} -&gt; {pages.score}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableHead>文章类型</TableHead>
                    <TableCell>
                      <div class="flex gap-2">
                        <RadioGroup
                          class="flex gap-2"
                          value={selectedPagesType[index]}
                          onValueChange={(value: string): string => (selectedPagesType[index] = value)}
                        >
                          {#if pages.page_type.includes("minusThirty")}
                            <Label><RadioGroupItem value="minusThirty" /> <span>低于-30</span></Label>
                          {/if}
                          {#if pages.page_type.includes("normal")}
                            <Label><RadioGroupItem value="normal" /> <span>低分原创</span></Label>
                          {/if}
                          {#if pages.page_type.includes("translate")}
                            <Label><RadioGroupItem value="translate" /> <span>低质翻译</span></Label>
                          {/if}
                          {#if pages.page_type.includes("deleted")}
                            <Label><RadioGroupItem value="deleted" /> <span>自删页面</span></Label>
                          {/if}
                        </RadioGroup>
                        <span>| {pages.time}小时后删除</span>
                      </div>
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </Label>
          </blockquote>
        {/each}
        <hr />
        {#each pagesJson.pre_delete_pages as pages}
          <blockquote class="relative my-4 flex flex-col rounded-md border-2 border-gray-400 p-2">
            <Table>
              <TableBody class="[&_td]:w-full">
                <TableRow>
                  <TableHead>文章标题</TableHead>
                  <TableCell>{pages.title}</TableCell>
                </TableRow>
                <TableRow>
                  <TableHead>文章链接</TableHead>
                  <TableCell>
                    <Button variant="link" class="px-0" href={pages.link} target="_blank" rel="noopener noreferrer">
                      {pages.link}
                    </Button>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableHead>删除倒计时</TableHead>
                  <TableCell>
                    <Timer type="delete" time={new Date(pages.timestamp * 1000)} />
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableHead>删除帖链接</TableHead>
                  <TableCell>
                    <Button
                      variant="link"
                      class="px-0"
                      href="{pages.discuss_link}#{pages.post_id}"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {pages.discuss_link}#{pages.post_id}
                    </Button>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableHead>页面分数</TableHead>
                  <TableCell>{pages.release_score} -> {pages.score}</TableCell>
                </TableRow>
                <TableRow>
                  <TableHead>文章类型</TableHead>
                  <TableCell>{pages.isOriginal ? "原创文章" : "翻译文章"} | {pages.time}小时后删除</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </blockquote>
        {/each}
      {:else}
        <blockquote>正在加载中，请稍候……</blockquote>
      {/if}
    </div>
  </div>
</div>
