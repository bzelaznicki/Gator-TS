import { setUser, readConfig } from "./config";
import { CommandsRegistry, registerCommand, runCommand } from "./command_handler";
import { handlerLogin } from "./handler_login";
import { handlerRegister } from "./handler_register";
import { handlerReset } from "./handler_reset";
import { handlerUsers } from "./handler_users";
import { handlerAgg } from "./handler_agg";
import { handlerAddFeed } from "./handler_addfeed";

async function main() {
    
    const registry: CommandsRegistry ={};
    registerCommand(registry, "login", handlerLogin);
    registerCommand(registry, "register", handlerRegister);
    registerCommand(registry, "reset", handlerReset);
    registerCommand(registry, "users", handlerUsers);
    registerCommand(registry, "agg", handlerAgg);
    registerCommand(registry, "addfeed", handlerAddFeed);

    const args = process.argv.slice(2);

    if (args.length === 0) {
      console.error("Error: no command provided");
      process.exit(1);
    }

    const cmdName = args[0];
    const cmdArgs = args.slice(1);

    try {
      await runCommand(registry, cmdName, ...cmdArgs);
    } catch (error) {
      if (error instanceof Error) {
        console.error(error.message);
      } else {
        console.error("An unknown error occurred");
      }
      process.exit(1);
    }

    process.exit(0);
  }
  
  main();