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

const handleStartButtonInteraction = async (
  baseInteraction: ChatInputCommandInteraction,
  collectInteraction: ButtonInteraction<CacheType>
) => {
  if (collectInteraction.user.id !== baseInteraction.user.id) {
    collectInteraction.reply({
      content: "Does effe nie joh",
      ephemeral: true,
    });

    return;
  }

  collectInteraction.reply({
    content: `${baseInteraction.user} krijgt een wand!!!!!!!`,
  });
};

export default {
  data: new SlashCommandBuilder()
    .setName("ring")
    .setDescription("Calls Olivander to help you with your wand."),
  async execute(interaction: ChatInputCommandInteraction) {
    const confirm = new ButtonBuilder()
      .setCustomId("start-wand-selection")
      .setLabel("Geef mij een wandje")
      .setStyle(ButtonStyle.Success);

    const deny = new ButtonBuilder()
      .setCustomId("deny-wand-selection")
      .setLabel("Mijn voeten zijn mijn wands x")
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
      content: "Olivander is coming to help you with your wand!",
      components: [row],
    });
  },
};
