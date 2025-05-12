import { readConfig } from "./config";
import { getUserByName } from "./lib/db/queries/users";
import { User } from "./lib/db/schema";

type CommandHandler = (cmdName: string, ...args: string[]) => Promise<void>;

export type CommandsRegistry = Record<string, CommandHandler>;

export function registerCommand(registry: CommandsRegistry, cmdName: string, handler: CommandHandler){
    return registry[cmdName] = handler;
}

export async function runCommand(registry: CommandsRegistry, cmdName: string, ...args: string[]){
    if (!registry[cmdName]) {
        throw new Error (`Command not found: ${cmdName}`);
    }

    await registry[cmdName](cmdName, ...args);
}

export type UserCommandHandler = (
    cmdName: string, 
    user: User,
    ...args: string[]
) => Promise<void>;

export type middlewareLoggedIn = (handler: UserCommandHandler) => CommandHandler;

export const middlewareLoggedIn = (handler: UserCommandHandler): CommandHandler => {
    const wrappedHandler: CommandHandler = async (cmdName: string, ...args: string[]): Promise<void> => {
        const configUser = readConfig().currentUserName;
       
        if (!configUser){
            throw new Error("Log in first!");
        }
        const user = await getUserByName(configUser);
       
        if (!user) {
            throw new Error(`User ${configUser} not found`);
        }
        
        await handler(cmdName, user, ...args);
    };
    return wrappedHandler;
};