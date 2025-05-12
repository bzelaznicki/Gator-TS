import { createFeedFollow } from "./lib/db/queries/feed_follows";
import { addFeed } from "./lib/db/queries/feeds";
import {Feed, User } from "./lib/db/schema";

export async function handlerAddFeed(cmdName: string, user: User, ...args: string[]) {

        if (args.length < 2) {
            throw new Error ("Provide a feed name and URL");
    }

    const feedName = args[0];
    const url = args[1];


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