import { Client, Collection } from "discord.js";

/**
 * Custom client containing the commands collection
 */
export type CustomClient = Client<boolean> & {
  commands?: Collection<string, any>;
};
