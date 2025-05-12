import { eq, sql } from "drizzle-orm";
import { db } from "..";
import { feeds, users } from "../schema";


export async function addFeed(name: string, url: string, userId: string) {
    const [result] = await db.insert(feeds).values({ name: name, url: url, userId: userId }).returning();
    return result;
}

export async function getFeeds() {
    const result = await db.select().from(feeds).innerJoin(users,eq(feeds.userId, users.id));
    return result;
}

export async function getFeedByURL(url: string) {
    const [result] = await db.select().from(feeds).where(eq(feeds.url, url));
    return result;
}

export async function markFeedFetched(feedId: string) {
  const [result] = await db.update(feeds)
    .set({ lastFetchedAt: new Date() })
    .where(eq(feeds.id, feedId))
    .returning();
  return result;
}

export async function getNextFeedToFetch() {
  const result = await db.query.feeds.findFirst({
    orderBy: (columns) => sql`${columns.lastFetchedAt} ASC NULLS FIRST`
  });
  return result;
}