import fs, { read } from "fs";
import os from "os";
import path from "path";

export type Config = {
    dbUrl: string;
    currentUserName: string | null;
}

export function readConfig() {
    const configPath = getConfigFilePath();
    if (!fs.existsSync(configPath)){
        throw new Error(`config file not found at ${configPath}`);
    }

    const rawData = fs.readFileSync(configPath, "utf8");

    const rawConfig = JSON.parse(rawData);
    return validateConfig(rawConfig);
}

export function setUser(user: string): void {
    const currentConfig = readConfig();

    currentConfig.currentUserName = user;

    writeConfig(currentConfig);
}

function writeConfig(cfg: Config): void {
    const configPath = getConfigFilePath();
    if (!fs.existsSync(configPath)){
        throw new Error(`config file not found at ${configPath}`);
    }   

    const jsonData = {
        db_url: cfg.dbUrl,
        current_user_name: cfg.currentUserName
    }
    const jsonString = JSON.stringify(jsonData, null, 2);
    fs.writeFileSync(configPath, jsonString);

}

function getConfigFilePath(): string {
    const homeDir = os.homedir();
    return path.join(homeDir, ".gator-ts-config.json");
}

function validateConfig(rawConfig: any): Config {
    if (!rawConfig || typeof rawConfig !== 'object') {
        throw new Error('Config must be an object');
      }
      if (!('db_url' in rawConfig) || typeof rawConfig.db_url !== 'string') {
        throw new Error('Config must contain a db_url string');
      }

      const config: Config = {
        dbUrl: rawConfig.db_url,
        currentUserName: rawConfig.current_user_name || null
      }
      return config;
}