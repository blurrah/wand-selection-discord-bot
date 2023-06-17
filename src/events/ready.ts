import { Awaitable, ClientEvents, Events } from "discord.js";

/**
 * Handle client being ready to receive events
 */
export const readyHandler: (
  ...args: ClientEvents[Events.ClientReady]
) => Awaitable<void> = async (client) => {
  console.log(`Logged in as ${client.user?.tag}!`);
};
