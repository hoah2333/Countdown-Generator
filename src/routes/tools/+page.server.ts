import { env } from "$env/dynamic/private";
import { MongoClient } from "mongodb";

import type { pagesJsonType } from "$lib/types";
import type { Collection, WithId } from "mongodb";
import type { PageServerLoad } from "./$types";

const DB_LINK = env.DB_LINK || "";

const createDbCache = () => {
  if (!DB_LINK) {
    throw new Error("DB_LINK is not set");
  }
  let cache: WithId<pagesJsonType> | null = null;
  const getCache = (): WithId<pagesJsonType> | null => cache;
  const updateCache = async (): Promise<void> => {
    const client: MongoClient = new MongoClient(DB_LINK);
    const outputs: Collection<pagesJsonType> = client.db("backrooms-delete").collection("outputs");
    const freshData: WithId<pagesJsonType>[] = await outputs.find().sort({ _id: -1 }).limit(1).toArray();
    cache = freshData.length > 0 ? JSON.parse(JSON.stringify(freshData[0])) : null; // Deep Copy
    await client.close();
  };

  return { getCache, updateCache };
};

const { getCache, updateCache } = createDbCache();

await updateCache();
setInterval(updateCache, 30000);

export const load: PageServerLoad = async (): Promise<Record<string, WithId<pagesJsonType> | null>> => ({
  dbContent: getCache(),
});
