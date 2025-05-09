import { setUser, readConfig } from "./config";
import { CommandsRegistry, registerCommand, runCommand } from "./command_handler";
import { handlerLogin } from "./handler_login";

function main() {
    
    const registry: CommandsRegistry ={};
    registerCommand(registry, "login", handlerLogin);

    const args = process.argv.slice(2);

    if (args.length === 0) {
      console.error("Error: no command provided");
      process.exit(1);
    }

    const cmdName = args[0];
    const cmdArgs = args.slice(1);

    try {
      runCommand(registry, cmdName, ...cmdArgs);
    } catch (error) {
      if (error instanceof Error) {
        console.error(error.message);
      } else {
        console.error("An unknown error occurred");
      }
      process.exit(1);
    }
  }
  
  main();