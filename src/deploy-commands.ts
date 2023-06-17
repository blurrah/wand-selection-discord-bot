import "dotenv/config";

import { REST, Routes } from "discord.js";
import * as commands from "./commands";

console.log(Object.values(commands).map((item) => item.data.toJSON()));

const commandsList = Object.values(commands).map((item) => item.data.toJSON());

const rest = new REST().setToken(process.env.DISCORD_TOKEN ?? "");

/**
 * Deploy commands needed to run this bot to Discord
 */
try {
  console.info(
    `Started refreshing ${commandsList.length} application (/) commands.`
  );

  const data = (await rest.put(
    Routes.applicationCommands(process.env.CLIENT_ID ?? ""),
    { body: commandsList }
  )) as any[];

  console.log(`Successfully reloaded ${data.length} application (/) commands.`);
} catch (error) {
  console.error(error);
}
