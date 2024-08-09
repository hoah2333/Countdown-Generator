import type { pagesJsonType } from "$lib/types";
import type { PageServerLoad } from "./$types";
import fs from "fs";

export const load: PageServerLoad = async ({ fetch }) => {
    let pagesJson: pagesJsonType = JSON.parse(
        fs.readFileSync("../WikidotpagesAutomanager/data.json", "utf-8")
    );

    return pagesJson;
};
