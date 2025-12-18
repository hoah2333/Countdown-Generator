<script lang="ts">
  import Sidebar from "../Sidebar.svelte";
  import ChevronDownIcon from "@lucide/svelte/icons/chevron-down";

  import { page } from "$app/state";
  import { Button } from "$lib/components/ui/button";
  import { Tabs, TabsContent, TabsList, TabsTrigger } from "$lib/components/ui/tabs";
  import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "$lib/components/ui/card";
  import { Label } from "$lib/components/ui/label";
  import { RadioGroup, RadioGroupItem } from "$lib/components/ui/radio-group";
  import { Separator } from "$lib/components/ui/separator";
  import { Calendar } from "$lib/components/ui/calendar";
  import { Input } from "$lib/components/ui/input";
  import { Popover, PopoverTrigger, PopoverContent } from "$lib/components/ui/popover";
  import { CalendarDate, today, getLocalTimeZone, CalendarDateTime, parseTime, now } from "@internationalized/date";
  import { toast } from "svelte-sonner";

  let selectedType: string = $state("delete");

  let whenCalendarValue: CalendarDate = $state(today(getLocalTimeZone()));
  let isWhenCalendarOpen: boolean = $state(false);
  let whenTimeString: string = $state(new Date().toLocaleTimeString());

  let afterPeriod = $state({ years: 0, months: 0, days: 0, hours: 0, minutes: 0, seconds: 0 });

  let customText: { before: string; after: string } = $state({ before: "", after: "" });

  let outputLink: string = $state("");
  const generate = (type: "when" | "after"): void => {
    let whenOutputCalendar = new CalendarDateTime(
      whenCalendarValue.year,
      whenCalendarValue.month,
      whenCalendarValue.day,
      parseTime(whenTimeString).hour,
      parseTime(whenTimeString).minute,
      parseTime(whenTimeString).second,
    );
    const whenOutputTime = whenOutputCalendar.toDate(getLocalTimeZone()).toISOString();
    const afterOutputTime = now(getLocalTimeZone()).add(afterPeriod).toDate().toISOString();

    outputLink =
      `${page.url.origin}/timer/time=${type === "when" ? whenOutputTime : afterOutputTime}/type=${selectedType}` +
      (selectedType === "custom" ?
        (customText.before && `/customBefore=${customText.before}`) +
        (customText.after && `/customAfter=${customText.after}`)
      : "");
  };

  const outputText = $derived(() => [
    `[[iframe ${outputLink} style="width: 400px; height: 65px;"]]`,
    `由于条目的分数为-X分，现根据[[[deletions-policy|删除政策]]]，宣告将删除此页：\n[[iframe ${outputLink} style="width: 400px; height: 65px;"]]\n如果你不是作者又想要重写该条目，请在此帖回复申请。请先取得作者的同意，并将原文的源代码复制至沙盒里。除非你是工作人员，否则请勿就申请重写以外的范围回复此帖。`,
    `由于翻译质量不佳，宣告删除。\n[[iframe ${outputLink} style="width: 400px; height: 65px;"]]`,
    `由于条目的分数为X分，且距离发布时间已满1个月，现根据[[[deletions-policy|删除政策]]]，宣告将删除此页：\n[[iframe ${outputLink} style="width: 400px; height: 65px;"]]\n如果你不是作者又想要重写该条目，请在此帖回复申请。请先取得作者的同意，并将原文的源代码复制至沙盒里。除非你是工作人员，否则请勿就申请重写以外的范围回复此帖。`,
  ]);

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

{#snippet cardBlock(type: "when" | "after")}
  <Card>
    <CardContent class="flex flex-col gap-6">
      <div class="flex flex-col gap-3">
        <Label class="mb-2">计时器类型：</Label>
        <RadioGroup
          value={selectedType}
          onValueChange={(value: string): string => (selectedType = value)}
          class="flex h-5 justify-between"
        >
          <Label><RadioGroupItem value="delete" /><span>删除计时器</span></Label>
          <Separator orientation="vertical" />
          <Label><RadioGroupItem value="ban" /><span>封禁计时器</span></Label>
          <Separator orientation="vertical" />
          <Label><RadioGroupItem value="custom" /><span>自定义计时器</span></Label>
        </RadioGroup>
      </div>
      <div class="flex flex-col gap-3">
        {#if selectedType === "custom"}
          <div class="flex flex-col gap-3">
            <Label>自定义文本：</Label>
            <div class="flex flex-col gap-3">
              <Input type="text" placeholder="计时结束前" bind:value={customText.before} />
              <Input type="text" placeholder="计时结束后" bind:value={customText.after} />
            </div>
          </div>
        {/if}

        {#if type === "when"}
          {@render whenSelect()}
        {/if}
        {#if type === "after"}
          {@render afterSelect()}
        {/if}
      </div>
    </CardContent>
    <CardFooter>
      <Button onclick={(): void => generate(type)}>生成！</Button>
    </CardFooter>
  </Card>
{/snippet}

{#snippet whenSelect()}
  <Label>
    {selectedType === "delete" ? "页面删除时间："
    : selectedType === "ban" ? "封禁到期时间："
    : "计时器结束时间："}
  </Label>
  <div class="flex gap-4">
    <Popover bind:open={isWhenCalendarOpen}>
      <PopoverTrigger>
        <Button variant="outline" class="w-32 justify-between font-normal">
          {whenCalendarValue ? whenCalendarValue.toDate(getLocalTimeZone()).toLocaleDateString() : "请选择日期"}
          <ChevronDownIcon />
        </Button>
      </PopoverTrigger>
      <PopoverContent class="w-auto overflow-hidden p-0" align="start">
        <Calendar
          type="single"
          bind:value={whenCalendarValue}
          onValueChange={() => (isWhenCalendarOpen = false)}
          captionLayout="dropdown"
        />
      </PopoverContent>
    </Popover>
    <Input
      type="time"
      step="1"
      bind:value={whenTimeString}
      class="appearance-none border-ring bg-secondary [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:appearance-none"
    />
  </div>
{/snippet}

{#snippet afterSelect()}
  <Label>
    在以下时间段后{selectedType === "delete" ? "删除页面"
    : selectedType === "ban" ? "解除封禁"
    : "结束计时"}：
  </Label>
  <div class="flex flex-col gap-4">
    <div class="flex items-center gap-2">
      <Input class="max-w-16" type="number" step="1" min="0" bind:value={afterPeriod.years} />年
      <Input class="max-w-16" type="number" step="1" min="0" bind:value={afterPeriod.months} />月
      <Input class="max-w-16" type="number" step="1" min="0" bind:value={afterPeriod.days} />日
    </div>
    <div class="flex items-center gap-2">
      <Input class="max-w-16" type="number" step="1" min="0" bind:value={afterPeriod.hours} />时
      <Input class="max-w-16" type="number" step="1" min="0" bind:value={afterPeriod.minutes} />分
      <Input class="max-w-16" type="number" step="1" min="0" bind:value={afterPeriod.seconds} />秒
    </div>
  </div>
{/snippet}

<div class="flex flex-col justify-center gap-4 md:flex-row">
  <Sidebar type="generator" />

  <div class="align-center mt-4 flex w-3xl max-w-full flex-col items-center justify-center">
    <h1 class="text-2xl font-bold">倒计时生成器</h1>
    <div class="mt-2 text-sm">
      <div>
        原作者：<Button class="p-0" variant="link" href="http://aelanna.com/Tools/deletion-time.html" target="_blank">
          Aelanna（http://aelanna.com/Tools/deletion-time.html）
        </Button>
      </div>
      <div>重制版作者：hoah2333</div>
    </div>

    <div class="mt-4">
      <Tabs value="when">
        <TabsList>
          <TabsTrigger value="when">在特定时间到达时删除</TabsTrigger>
          <TabsTrigger value="after">在特定时间段之后删除</TabsTrigger>
        </TabsList>
        <TabsContent value="when">
          {@render cardBlock("when")}
        </TabsContent>
        <TabsContent value="after">
          {@render cardBlock("after")}
        </TabsContent>
      </Tabs>
    </div>

    {#if outputLink}
      <Separator class="mt-8" />
      <div class="mt-4">
        <div class="font-bold">点击文本框复制</div>
        {#each outputText() as text}
          <Button variant="ghost" class="rounded-md border-2 border-gray-400 my-2 whitespace-pre-wrap flex justify-start h-max items-start text-start w-full text-base font-normal" onclick={() => copyHandler(text)}>{text}</Button>
        {/each}
        <iframe title="generated-iframe" src={outputLink} frameborder="0" width="400px" height="65px"></iframe>
      </div>
    {/if}
  </div>
</div>
