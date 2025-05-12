import { deleteFollow } from "./lib/db/queries/feed_follows";
import { getFeedByURL } from "./lib/db/queries/feeds";
import { User } from "./lib/db/schema";

export async function handlerUnfollow(cmdName: string, user: User, ...args: string[]){

    if (args.length === 0) {
        throw new Error ("Provide a feed URL");
    }

    const feedUrl = args[0];


    const feed = await getFeedByURL(feedUrl);

    if (!feed) {
        throw new Error ("Feed not found");
    }


    try {
        await deleteFollow(user.id, feed.id);
        console.log(`Feed ${feed.name} unfollowed.`)
    } catch {
        throw new Error ("Failed to unfollow feed");
    }

}