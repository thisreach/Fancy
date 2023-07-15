import {
  ApplicationCommandOptionType,
  ApplicationCommandType,
  Guild,
  EmbedBuilder,
  ButtonBuilder,
  ButtonStyle,
  ActionRowBuilder,
} from "discord.js";
import { Command } from "../../structs/types/Commands";

export default new Command({
  name: "server",
  description: "Opções do servidor.",
  type: ApplicationCommandType.ChatInput,
  options: [
    {
      name: "info",
      description: "Informações do servidor.",
      type: ApplicationCommandOptionType.Subcommand,
    },
    {
      name: "icon",
      description: "Ícone do servidor.",
      type: ApplicationCommandOptionType.Subcommand,
    },
  ],

  async execute({ interaction, options }) {
    if (!interaction.isChatInputCommand() || !interaction.inCachedGuild())
      return;

    const subCommands = options.getSubcommand();

    switch (subCommands) {
      case "info":
        await interaction.deferReply({ ephemeral: true })

        {
          const guild: Guild | null = interaction.guild;
          if (guild) {
            const members: number = guild.memberCount;

            const embed = new EmbedBuilder({
              title: `${interaction.guild.name}`,
              thumbnail: { url: `${interaction.guild.iconURL()}` },
              timestamp: new Date(),
              fields: [
                { name: "📌 Principais:", value: `👑 Dono(a) <@!${interaction.guild.ownerId}>\nMembros: \`${members + 1}\`\nImpulsos: \`${guild.premiumSubscriptionCount}\`\nID: \`${interaction.guild.id}\``, inline: false },
                { name: "📅 Data de criação:", value: `\`${guild.createdAt.toLocaleDateString("pt-br")}\``, inline: false },
              ]
            })
            .setColor("#2C2F33")

            await interaction.editReply({
              embeds: [embed]
            })
          }
        }
        break;
      case "icon":
        {
          await interaction.deferReply({ ephemeral: true })

          const embed = new EmbedBuilder({
              title: `${interaction.guild.name}`,
              image: {url: `${interaction.guild.iconURL()}`}
          })
          embed.setColor("#2C2F33")

          const button = new ButtonBuilder({label: "Abra no navegador!", style: ButtonStyle.Link, url: `${interaction.guild.iconURL()}`})

          await interaction.editReply({
            embeds: [embed],
            components: [new ActionRowBuilder<ButtonBuilder>().addComponents(button)]
          })

        }
      break;
      default:
        break;
    }
  },
});
