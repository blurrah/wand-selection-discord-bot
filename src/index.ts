import "dotenv/config";

import Discord from "discord.js";
import { interactionCreateHandler } from "events/interaction-create";
import { readyHandler } from "events/ready";
import { CustomClient } from "types";
import * as commands from "./commands";

const client: CustomClient = new Discord.Client({
  intents: [Discord.GatewayIntentBits.Guilds],
});

// Set up commands
client.commands = new Discord.Collection();

Object.values(commands).forEach((command) => {
  client.commands?.set(command.data.name, command);
});

// Set up events
client.on(Discord.Events.ClientReady, readyHandler);
client.on(Discord.Events.InteractionCreate, interactionCreateHandler);

client.login(process.env.DISCORD_TOKEN);
