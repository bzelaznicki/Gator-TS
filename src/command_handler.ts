type CommandHandler = (cmdName: string, ...args: string[]) => void;

export type CommandsRegistry = Record<string, CommandHandler>;

export function registerCommand(registry: CommandsRegistry, cmdName: string, handler: CommandHandler){
    return registry[cmdName] = handler;
}

export function runCommand(registry: CommandsRegistry, cmdName: string, ...args: string[]){
    if (!registry[cmdName]) {
        throw new Error (`Command not found: ${cmdName}`);
    }

    registry[cmdName](cmdName, ...args);
}