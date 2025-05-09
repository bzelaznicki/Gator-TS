import { setUser } from "./config";
import { getUserByName } from "./lib/db/queries/users";
import { createUser } from "./lib/db/queries/users";

export async function handlerRegister(cmdName: string, ...args: string[]){
    if (args.length === 0) {
        throw new Error ("Provide an username");
    }

    const userName = args[0];
    
    const registeredUser = await getUserByName(userName);

    if (registeredUser) {
        throw new Error (`User ${userName} already exists`)
    }

    const createdUser = await createUser(userName);
    setUser(userName)

    console.log(`User ${createdUser.name} (id ${createdUser.id}) has been registered.`)

}