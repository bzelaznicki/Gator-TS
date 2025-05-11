import { readConfig } from "./config";
import { addFeed } from "./lib/db/queries/feeds";
import { getUserByName } from "./lib/db/queries/users";

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

    console.log(`Feed "${createdFeed.name}" with URL ${createdFeed.url} for user ${user.name} created!`);
}

