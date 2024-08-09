export function timerFunc(paramsOri: string[]) {
    let warning: string = "";

    let timeParam: string | number = "",
        typeParam: string = "",
        customParam: string[] = ["", ""];

    for (let i = 0; i < paramsOri.length; i++) {
        let paramName = paramsOri[i].split("=")[0];
        let paramValue = paramsOri[i].split("=")[1];

        timeParam =
            paramName == "time"
                ? /^[\d.]+$/.test(paramValue)
                    ? parseInt(paramValue)
                    : paramValue
                : timeParam;
        typeParam = paramName == "type" ? paramValue : typeParam;
        customParam[0] = paramName == "customBefore" ? paramValue : customParam[0];
        customParam[1] = paramName == "customAfter" ? paramValue : customParam[1];
    }

    let params = {
        time: timeParam,
        type: typeParam,
        custom: [customParam[0], customParam[1]]
    };

    if (params.time == "") {
        warning = "缺少参数：time，请检查链接参数。";
    }

    let text: string = "";
    let timer: string = "";
    let now: number = new Date().getTime();
    let time: number = new Date(params.time).getTime();
    let outputs = outputTimer(now, time, text, params, timer);

    return {
        warning: warning,
        text: outputs.text,
        timer: outputs.timer,
        status: time > now ? "before" : "after"
    };
}

function outputTimer(
    now: number,
    time: number,
    text: string,
    params: { time: string | number; type: string; custom: string[] },
    timer: string
) {
    const second = 1000;
    const minute = second * 60;
    const hour = minute * 60;
    const day = hour * 24;
    now = new Date().getTime();
    let remainTime: number = time > now ? time - now : now - time;
    let remainDay: number = Math.floor(remainTime / day);
    let remainHour: number = Math.floor((remainTime % day) / hour);
    let remainMinute: number = Math.floor(((remainTime % day) % hour) / minute);
    let remainSecond: number = Math.floor((((remainTime % day) % hour) % minute) / second);

    if (time > now) {
        text =
            params.custom[0] != ""
                ? params.custom[0]
                : params.type == "delete"
                  ? "该页面将在以下时间后被删除："
                  : params.type == "ban"
                    ? "该用户将在以下时间后解除封禁："
                    : "该计时器将在以下时间后到期：";

        timer =
            (remainDay == 0 ? "" : `${remainDay} 日 `) +
            (remainHour == 0 && remainDay == 0 ? "" : `${remainHour} 时 `) +
            (remainMinute == 0 && remainHour == 0 && remainDay == 0
                ? ""
                : `${remainMinute < 10 ? `0${remainMinute}` : remainMinute} 分 `) +
            (remainSecond == 0 && remainMinute == 0 && remainHour == 0 && remainDay == 0
                ? ""
                : `${remainSecond < 10 ? `0${remainSecond}` : remainSecond} 秒`);
    } else {
        text =
            params.custom[1] != ""
                ? params.custom[1]
                : params.type == "delete"
                  ? "该页面已在以下时间前可被删除："
                  : params.type == "ban"
                    ? "该用户已在以下时间前可被解除封禁："
                    : "该计时器已在以下时间前到期：";
        timer =
            (remainDay == 0 ? "" : `${remainDay} 日 `) +
            (remainHour == 0 && remainDay == 0 ? "" : `${remainHour} 时 `) +
            (remainMinute == 0 && remainHour == 0 && remainDay == 0
                ? ""
                : `${remainMinute < 10 ? `0${remainMinute}` : remainMinute} 分 `) +
            (remainSecond == 0 && remainMinute == 0 && remainHour == 0 && remainDay == 0
                ? ""
                : `${remainSecond < 10 ? `0${remainSecond}` : remainSecond} 秒前`);
    }
    return {
        text: text,
        timer: timer
    };
}
