import { env } from "$env/dynamic/private";
import { MongoClient } from "mongodb";

import type { PagesJsonType } from "$lib/types";
import type { Collection, WithId } from "mongodb";
import type { PageServerLoad } from "./$types";

const DB_LINK = env.DB_LINK || "";

const createDbCache = () => {
  if (!DB_LINK) {
    throw new Error("DB_LINK is not set");
  }

  let cache: WithId<PagesJsonType> | null = null;

  // MongoDB 连接选项
  const clientOptions = {
    serverSelectionTimeoutMS: 5000,
    socketTimeoutMS: 45000,
    connectTimeoutMS: 10000,
    retryWrites: true,
    retryReads: true,
  };

  const getCache = (): WithId<PagesJsonType> | null => cache;

  const updateCache = async (retryCount = 0): Promise<void> => {
    const maxRetries = 3;
    let client: MongoClient | null = null;

    try {
      client = new MongoClient(DB_LINK, clientOptions);
      await client.connect();

      const outputs: Collection<PagesJsonType> = client.db("backrooms-delete").collection("outputs");
      const freshData: WithId<PagesJsonType>[] = await outputs.find().sort({ _id: -1 }).limit(1).toArray();
      cache = freshData.length > 0 ? JSON.parse(JSON.stringify(freshData[0])) : null; // Deep Copy
    } catch (error) {
      console.error(`更新缓存失败 (尝试 ${retryCount + 1}/${maxRetries}):`, error);

      if (retryCount < maxRetries) {
        const delay = Math.min(1000 * Math.pow(2, retryCount), 10000);
        await new Promise((resolve) => setTimeout(resolve, delay));
        return updateCache(retryCount + 1);
      } else {
        console.error("已达到最大重试次数，将在下次定时更新时继续尝试");
      }
    } finally {
      if (client) {
        try {
          await client.close();
        } catch (error) {
          console.error("关闭 MongoDB 连接时出错:", error);
        }
      }
    }
  };

  return { getCache, updateCache };
};

const { getCache, updateCache } = createDbCache();

await updateCache();

setInterval(updateCache, 300000);

export const load: PageServerLoad = async (): Promise<Record<string, WithId<PagesJsonType> | null>> => ({
  dbContent: getCache(),
});
