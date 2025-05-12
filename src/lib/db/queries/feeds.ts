import { eq } from "drizzle-orm";
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