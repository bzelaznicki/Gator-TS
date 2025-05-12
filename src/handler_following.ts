import { readConfig } from "./config";
import { getFeedFollowsForUser } from "./lib/db/queries/feed_follows";
import { getUserByName } from "./lib/db/queries/users";

export async function handlerFollowing(cmdName: string, ...args: string[]) {
    const configUser = readConfig().currentUserName;
 
    if (!configUser){
         throw new Error ("Log in first!");
     }
     const user = await getUserByName(configUser);
 
     if (!user) {
         throw new Error ("User not found");
     }

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