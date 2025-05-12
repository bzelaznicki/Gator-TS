import { XMLParser } from "fast-xml-parser";
import { getNextFeedToFetch, markFeedFetched } from "./lib/db/queries/feeds";
import { Feed, NewPost } from "./lib/db/schema";
import { parseDuration } from "./time_parser";
import {errorHandler} from "./error_handler"
import { createPost } from "./lib/db/queries/posts";


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
  if (!feed.id) {
    throw new Error("Invalid feed");
  }
  await markFeedFetched(feed.id);

  const feedData = await fetchFeed(feed.url);
  
  console.log(
    `Feed ${feed.name} collected, ${feedData.channel.item.length} posts found`
  );
  
  let newPostCount = 0;
  for (const item of feedData.channel.item) {
    const now = new Date();
    try {
      await createPost({
        url: item.link,
        feedId: feed.id,
        title: item.title,
        createdAt: now,
        updatedAt: now,
        description: item.description,
        publishedAt: new Date(item.pubDate),
      } satisfies NewPost);
      
      newPostCount++;
    } catch (err) {
      if (err instanceof Error && 
          err.message.includes('duplicate key value violates unique constraint')) {
        // Silently ignore duplicate posts
      } else {
        console.error(`Error saving post "${item.title}":`, err);
      }
    }
  }

  console.log(`Added ${newPostCount} new posts from ${feed.name}`);
}