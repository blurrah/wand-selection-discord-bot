import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonInteraction,
  ButtonStyle,
  CacheType,
  ChatInputCommandInteraction,
  ComponentType,
  SlashCommandBuilder,
} from "discord.js";
import { wandSelector } from "lib/wand-selector";
import messages from "../../messages.json";

const handleStartButtonInteraction = async (
  baseInteraction: ChatInputCommandInteraction,
  collectInteraction: ButtonInteraction<CacheType>
) => {
  console.log("hello");
  if (collectInteraction.user.id !== baseInteraction.user.id) {
    await collectInteraction.reply({
      content: messages.wrongUserInteraction,
      ephemeral: true,
    });

    return;
  }

  const { wood, core, length } = await wandSelector();

  await collectInteraction.reply({
    content: messages.getsAWand
      .replace("{user}", baseInteraction.user.toString())
      .replace("{wood}", wood)
      .replace("{core}", core)
      .replace("{length}", (length / 10).toString()),
  });
};

export default {
  data: new SlashCommandBuilder()
    .setName("ring")
    .setDescription(messages.ringCommandDescription),
  async execute(interaction: ChatInputCommandInteraction) {
    const confirm = new ButtonBuilder()
      .setCustomId("start-wand-selection")
      .setLabel(messages.buttonConfirm)
      .setStyle(ButtonStyle.Success);

    const deny = new ButtonBuilder()
      .setCustomId("deny-wand-selection")
      .setLabel(messages.buttonDeny)
      .setStyle(ButtonStyle.Danger);

    const row = new ActionRowBuilder<ButtonBuilder>().addComponents(
      confirm,
      deny
    );

    const collector = interaction.channel?.createMessageComponentCollector({
      componentType: ComponentType.Button,
      time: 15000,
    });

    collector?.on("collect", (collectInteraction) =>
      handleStartButtonInteraction(interaction, collectInteraction)
    );

    await interaction.reply({
      content: messages.startSelection,
      components: [row],
    });
  },
};
