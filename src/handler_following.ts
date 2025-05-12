import { getFeedFollowsForUser } from "./lib/db/queries/feed_follows";
import { User } from "./lib/db/schema";

export async function handlerFollowing(cmdName: string, user: User, ...args: string[]) {

    const followedFeeds = await getFeedFollowsForUser(user.id);

    if (followedFeeds.length === 0) {
        console.log("You're not following any feeds yet.");
        return;
    }
    console.log(`You're currently following ${followedFeeds.length} feeds:`)
    for (const feed of followedFeeds){
        console.log(`* ${feed.feedName}`);
    }

}