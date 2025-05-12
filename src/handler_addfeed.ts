import { readConfig } from "./config";
import { createFeedFollow } from "./lib/db/queries/feed_follows";
import { addFeed } from "./lib/db/queries/feeds";
import { getUserByName } from "./lib/db/queries/users";
import {Feed, User } from "./lib/db/schema";

export async function handlerAddFeed(cmdName: string, ...args: string[]) {

        if (args.length < 2) {
            throw new Error ("Provide a feed name and URL");
    }

    const feedName = args[0];
    const url = args[1];

    const configUser = readConfig().currentUserName;

    if (!configUser){
        throw new Error ("Log in first!");
    }
    const user = await getUserByName(configUser);

    if (!user) {
        throw new Error ("User not found");
    }

    const createdFeed = await addFeed(feedName, url, user.id);

    const feedFollow = await createFeedFollow(user.id, createdFeed.id);

    console.log(`Feed created: `);
    printFeed(createdFeed, user);
}

function printFeed(feed: Feed, user: User){
    console.log(`* ID:            ${feed.id}`);
    console.log(`* Created:       ${feed.createdAt}`);
    console.log(`* Updated:       ${feed.updatedAt}`);
    console.log(`* name:          ${feed.name}`);
    console.log(`* URL:           ${feed.url}`);
    console.log(`* User:          ${user.name}`);
}