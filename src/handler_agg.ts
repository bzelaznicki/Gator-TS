import { XMLParser } from "fast-xml-parser";
import { getNextFeedToFetch, markFeedFetched } from "./lib/db/queries/feeds";
import { Feed } from "./lib/db/schema";
import { parseDuration } from "./time_parser";
import {errorHandler} from "./error_handler"


type RSSFeed = {
    channel: {
      title: string;
      link: string;
      description: string;
      item: RSSItem[];
    };
  };
  
  type RSSItem = {
    title: string;
    link: string;
    description: string;
    pubDate: string;
  };


  export async function handlerAgg(cmdName: string, ...args: string[]) {
    if (args.length !== 1){
        throw new Error(`Invalid arguments`);
    }

    const timeArg = args[0];
    const timeBetweenRequests = parseDuration(timeArg);

    if (!timeBetweenRequests){
        throw new Error(`invalid duration: ${timeArg}`);
    }

    console.log(`Collecting feeds every ${timeArg}.`)

    scrapeFeeds().catch(errorHandler);

    const interval = setInterval(() => {
        scrapeFeeds().catch(errorHandler);
    }, timeBetweenRequests);

    await new Promise<void>((resolve) => {
        process.on("SIGINT", () => {
            console.log("Stopping feed aggregation");
            clearInterval(interval);
            resolve();
        });
    });


}


export async function fetchFeed(feedURL: string): Promise<RSSFeed> {

    const response = await fetch(feedURL, {
        headers: {
            "User-Agent": "gator"
        }
    });
    if (!response.ok){
        throw new Error(`Failed to fetch feed: ${response.status}`);
    }
    const xmlText = await response.text();

    const parser = new XMLParser();
    const parsedObj = parser.parse(xmlText);

    const channelData = parsedObj.rss?.channel;

    if (!channelData) {
        throw new Error("Invalid RSS feed format: couldn't find channel data");
    }

    const title = channelData.title;
    const link = channelData.link;
    const description = channelData.description;
    if (!title || !link || !description) {
        throw new Error("Invalid RSS feed: missing required channel metadata");
    }
    

    let items: RSSItem[] = [];
    if (channelData.item && Array.isArray(channelData.item)) {
        items = (channelData.item as RSSItem[])
            .filter((item: RSSItem) => {
                return item.title && item.link && item.description && item.pubDate;
            })
            .map((item: RSSItem) => ({
                title: item.title,
                link: item.link,
                description: item.description,
                pubDate: item.pubDate
            }));
    } 

    return {
        channel: {
            title,
            link,
            description,
            item: items
    }
};

}

async function scrapeFeeds() {
    const nextFeed = await getNextFeedToFetch();

    if (!nextFeed){
        console.log("No feeds found.");
        return;
    }

    await scrapeFeed(nextFeed);
}


async function scrapeFeed(feed: Feed) {
    if (!feed.id){
        throw new Error ("Invalid feed");
    }
  await markFeedFetched(feed.id);

  const feedData = await fetchFeed(feed.url);

  console.log(
    `Feed ${feed.name} collected, ${feedData.channel.item.length} posts found`,
  );
      for (const item of feedData.channel.item) {
        console.log(`- ${item.title} (posted on ${item.pubDate}): ${item.link}`);
        console.log("========================")
    }
}