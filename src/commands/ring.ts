import { db } from "db";
import { users, wands } from "db/schema";
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
import { eq } from "drizzle-orm";
import { wandSelector } from "lib/wand-selector";
import messages from "../../messages.json";

// Array containing win chances after each attempt
const chances = [0.2, 0.4, 0.6, 0.8, 1] as const;
const attemptLines = [
  messages.testTheWand1,
  messages.testTheWand2,
  messages.testTheWand3,
  messages.testTheWand4,
  messages.testTheWand5,
] as const;

const thumbnail = {
  url: process.env.NPC_THUMBNAIL_URL,
};

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
  interaction: ButtonInteraction<CacheType>,
  attempt: number = 0
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
    .setLabel(messages.swingWand)
    .setStyle(ButtonStyle.Primary);

  const row = new ActionRowBuilder<ButtonBuilder>().addComponents(swing);

  const message = await interaction.editReply({
    content: attemptLines[attempt]
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

    if (Math.random() <= chances[attempt]) {
      await db.insert(users).values({
        id: baseInteraction.user.id,
        guildId: baseInteraction.guildId!,
      });

      await db.insert(wands).values({
        userId: baseInteraction.user.id,
        wood,
        core,
        length,
      });

      await collectInteraction.editReply({
        components: [],
        content: "",
        embeds: [
          {
            title: messages.gotTheWandTitle,
            description: messages.gotTheWand,
            fields: [
              {
                name: messages.wood,
                value: wood,
                inline: true,
              },
              {
                name: messages.core,
                value: core,
                inline: true,
              },
              {
                name: messages.length,
                value: `${length / 10} cm`,
              },
            ],
            thumbnail,
          },
        ],
      });

      return;
    }
    await handleWandSelectionInteraction(
      baseInteraction,
      collectInteraction,
      ++attempt
    );
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

    await interaction.deferReply();

    const user = await db.query.users.findFirst({
      with: {
        wand: true,
      },
      where: eq(users.id, interaction.user.id),
    });

    if (user) {
      await interaction.followUp({
        content: "",
        embeds: [
          {
            title: messages.yourWand,
            description: messages.alreadyHasWand
              .replace("{user}", interaction.user.toString())
              .replace("{wood}", user.wand.wood)
              .replace("{core}", user.wand.core)
              .replace("{length}", (user.wand.length / 10).toString()),
            fields: [
              {
                name: messages.wood,
                value: user.wand.wood,
                inline: true,
              },
              {
                name: messages.core,
                value: user.wand.core,
                inline: true,
              },
              {
                name: messages.length,
                value: `${user.wand.length / 10} cm`,
              },
            ],
            thumbnail,
          },
        ],
      });

      return;
    }

    const filter = createFilter(interaction);

    const message = await interaction.followUp({
      content: "",
      embeds: [
        {
          description: messages.startSelection,
          thumbnail,
        },
      ],
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
