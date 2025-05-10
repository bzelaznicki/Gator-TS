import { resetUsers } from "./lib/db/queries/users";

export async function handlerReset(cmdName: string, ...args: string[]) {
    try {
        await resetUsers();
        console.log("Users reset")
    } catch {
        throw new Error(`Failed to delete users`)
    }
}