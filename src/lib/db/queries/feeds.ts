import { eq } from "drizzle-orm";
import { db } from "..";
import { feeds } from "../schema";


export async function addFeed(name: string, url: string, userId: string) {
    const [result] = await db.insert(feeds).values({ name: name, url: url, userId: userId }).returning();
    return result;
}