import { setUser } from "./config";

export function handlerLogin(cmdName: string, ...args: string[]){
    if (args.length === 0) {
        throw new Error ("Provide an username");
    }
    const userName = args[0];
    setUser(userName);
    console.log(`Logged in as ${userName}`);
}