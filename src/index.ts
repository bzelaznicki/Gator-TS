import { setUser, readConfig } from "./config";

function main() {
    
    setUser("Bartek");
    const newConfig = readConfig();

    console.log(`currentUserName: ${newConfig.currentUserName}`);
    console.log(`dbUrl: ${newConfig.dbUrl}`);
  }
  
  main();