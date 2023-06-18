import {
  ActionRowBuilder,
  BaseInteraction,
  ButtonBuilder,
  ButtonInteraction,
  ButtonStyle,
  CacheType,
  ChatInputCommandInteraction,
  Collection,
  CollectorFilter,
  ComponentType,
  SlashCommandBuilder,
} from "discord.js";
import { wandSelector } from "lib/wand-selector";
import messages from "../../messages.json";

const createFilter =
  (
    interaction: BaseInteraction
  ): CollectorFilter<
    [
      ButtonInteraction<CacheType>,
      Collection<string, ButtonInteraction<CacheType>>
    ]
  > =>
  async (collectInteraction) => {
    await collectInteraction.deferUpdate();
    return collectInteraction.user.id === interaction.user.id;
  };

/**
 * Handles the wand selection interaction. Can be recursively used until a wand has been chosen.
 */
const handleWandSelectionInteraction = async (
  baseInteraction: ChatInputCommandInteraction,
  interaction: ButtonInteraction<CacheType>
) => {
  if (interaction.user.id !== baseInteraction.user.id) {
    await interaction.reply({
      content: messages.wrongUserInteraction,
      ephemeral: true,
    });

    return;
  }

  const filter = createFilter(baseInteraction);

  const { wood, core, length } = await wandSelector();

  const swing = new ButtonBuilder()
    .setCustomId("swing-wand")
    .setLabel("Swing the wand")
    .setStyle(ButtonStyle.Primary);

  const row = new ActionRowBuilder<ButtonBuilder>().addComponents(swing);

  const message = await interaction.editReply({
    content: messages.testTheWand
      .replace("{user}", baseInteraction.user.toString())
      .replace("{wood}", wood)
      .replace("{core}", core)
      .replace("{length}", (length / 10).toString()),
    components: [row],
  });

  try {
    const collectInteraction = await message.awaitMessageComponent({
      filter,
      componentType: ComponentType.Button,
      time: 60000,
    });

    if (Math.random() < 0.5) {
      await collectInteraction.editReply({
        content: "You got a wand!!!!!!!!!!!",
        components: [],
      });

      return;
    }
    await handleWandSelectionInteraction(baseInteraction, collectInteraction);
  } catch (error) {
    console.warn(`Something went wrong: ${error}`);
  }
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

    const filter = createFilter(interaction);

    const message = await interaction.reply({
      content: messages.startSelection,
      components: [row],
    });

    try {
      const collectInteraction = await message.awaitMessageComponent({
        filter,
        componentType: ComponentType.Button,
        time: 60000,
      });
      await handleWandSelectionInteraction(interaction, collectInteraction);
    } catch (error) {
      console.warn(`Something went wrong: ${error}`);
    }
  },
};
