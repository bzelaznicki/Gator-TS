import { readConfig } from "./config";
import { getUsers } from "./lib/db/queries/users";

export async function handlerUsers(cmdName: string, ...args: string[]){
    const users = await getUsers();
    const config = readConfig();

    for (const user of users) {
        console.log(`* ${user.name} ${user.name === config.currentUserName ? "(current)" : ""}`)
    }
}