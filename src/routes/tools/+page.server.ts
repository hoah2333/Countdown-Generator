import fs from "fs";

import type { pagesJsonType } from "$lib/types";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async () => {
  const pagesJson: pagesJsonType = JSON.parse(fs.readFileSync("../wd-delete/data.json", "utf-8"));

  return pagesJson;
};
