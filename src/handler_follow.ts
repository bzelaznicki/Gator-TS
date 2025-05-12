import { readConfig } from "./config";
import { createFeedFollow } from "./lib/db/queries/feed_follows";
import { getFeedByURL } from "./lib/db/queries/feeds";
import { getUserByName } from "./lib/db/queries/users";

export async function handlerFollow(cmdName: string, ...args: string[]){

    if (args.length === 0) {
        throw new Error ("Provide a feed URL");
    }

    const feedUrl = args[0];

    const configUser = readConfig().currentUserName;

    if (!configUser){
        throw new Error ("Log in first!");
    }
    const user = await getUserByName(configUser);

    if (!user) {
        throw new Error ("User not found");
    }

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