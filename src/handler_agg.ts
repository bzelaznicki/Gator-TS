import { XMLParser } from "fast-xml-parser";


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
    const feedURL = "https://www.wagslane.dev/index.xml";

    try {
        const feed = await fetchFeed(feedURL);
        console.log(JSON.stringify(feed, null, 2));
    } catch (error) {
        console.error("Error fetching feed:", error);
        process.exit(1); 
    }
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