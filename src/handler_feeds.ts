import { getFeeds } from "./lib/db/queries/feeds";


export async function handlerFeeds(cmdName: string, ...args: string[]){
    const feeds = await getFeeds();

    if (feeds.length === 0) {
        console.log(`No feeds found.`);
        return;
      }
    console.log(`Current feeds:`)
    console.log(`--------------`)
    for (const feed of feeds){
        console.log(`Feed name: ${feed.feeds.name}`);
        console.log(`Feed URL: ${feed.feeds.url}`);
        console.log(`Created by: ${feed.users.name}`);
        console.log(`--------------`);
    }
}