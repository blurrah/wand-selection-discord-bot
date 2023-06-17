import { Awaitable, ClientEvents, Events } from "discord.js";
import { CustomClient } from "types";

export const interactionCreateHandler: (
  ...args: ClientEvents[Events.InteractionCreate]
) => Awaitable<void> = async (interaction) => {
  if (!interaction.isChatInputCommand()) return;

  const client = interaction.client as CustomClient;

  const command = client.commands?.get(interaction.commandName);

  if (!command) {
    console.warn(`No command matching ${interaction.commandName} found.`);
    return;
  }

  try {
    await command?.execute(interaction);
  } catch (error) {
    console.error(error);
    if (interaction.replied || interaction.deferred) {
      await interaction.followUp({
        content: "There was an error while executing this command!",
        ephemeral: true,
      });
    } else {
      await interaction.reply({
        content: "There was an error while executing this command!",
        ephemeral: true,
      });
    }
  }
};
