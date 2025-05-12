import { createFeedFollow } from "./lib/db/queries/feed_follows";
import { getFeedByURL } from "./lib/db/queries/feeds";
import { User } from "./lib/db/schema";

export async function handlerFollow(cmdName: string, user: User, ...args: string[]){

    if (args.length === 0) {
        throw new Error ("Provide a feed URL");
    }

    const feedUrl = args[0];


    const feed = await getFeedByURL(feedUrl);

    if (!feed) {
        throw new Error ("Feed not found");
    }


    try {
    const createdFollow = await createFeedFollow(user.id, feed.id);
        console.log("Feed followed:")
        console.log(`ID: ${createdFollow.followId}`);
        console.log(`Followed at: ${createdFollow.followedAt}`);
        console.log(`Username: ${createdFollow.userName}`);
        console.log(`Feed name: ${createdFollow.feedName}`);
        console.log(`Feed URL: ${createdFollow.feedUrl}`);
    } catch {
        throw new Error ("Failed to follow feed");
    }

}