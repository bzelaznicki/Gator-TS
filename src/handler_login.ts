import { setUser } from "./config";
import { getUserByName } from "./lib/db/queries/users";

export async function handlerLogin(cmdName: string, ...args: string[]){
    if (args.length === 0) {
        throw new Error ("Provide an username");
    }
    const userName = args[0];
    const user = await getUserByName(userName)

    if (!user) {
        throw new Error ("User not found");
    }
    setUser(userName);
    console.log(`Logged in as ${userName}`);
}