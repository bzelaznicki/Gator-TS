import { and, eq } from "drizzle-orm";
import { db } from "..";
import { feeds, users, feed_follows } from "../schema";

export async function createFeedFollow(userId: string, feedId: string) {
  const [inserted] = await db
    .insert(feed_follows)
    .values({ userId, feedId })
    .returning({ id: feed_follows.id });

  const [result] = await db
    .select({
      followId: feed_follows.id,
      followedAt: feed_follows.createdAt,
      userName: users.name,
      feedName: feeds.name,
      feedUrl: feeds.url,
    })
    .from(feed_follows)
    .where(eq(feed_follows.id, inserted.id))
    .innerJoin(users, eq(feed_follows.userId, users.id))
    .innerJoin(feeds, eq(feed_follows.feedId, feeds.id));

  return result;
}


export async function getFeedFollowsForUser(userId: string) {
    const result = await db.select({
      followId: feed_follows.id,
      followedAt: feed_follows.createdAt,
      feedName: feeds.name,
      feedUrl: feeds.url,
    })
    .from(feed_follows)
    .where(eq(feed_follows.userId, userId))
    .innerJoin(feeds, eq(feed_follows.feedId, feeds.id));
    return result;
}

export async function deleteFollow(userId: string, feedId: string){
  await db.delete(feed_follows).where(and(eq(feed_follows.userId, userId),eq(feed_follows.feedId, feedId)));
}