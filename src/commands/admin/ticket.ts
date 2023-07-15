import { ActionRowBuilder, Colors, EmbedBuilder, PermissionFlagsBits, StringSelectMenuBuilder } from "discord.js";
import { Command } from "../../structs/types/Commands";

export default new Command({
  name: "ticket",
  description: "Setar o ticket",
  defaultMemberPermissions: PermissionFlagsBits.Administrator,

  async execute({ interaction }) {
    const embed = new EmbedBuilder({
      title: "SkyCode",
      description:
        "> Estamos aqui para fazer suas ideias. 😊\n> Para receber suporte ou negociar sua idade, basta abrir um ticket. \nㅤ\n",
      fields: [
        {
          name: ":alarm_clock: Horário de atendimento:",
          value: "Seg. á Sex. 08:00 ás 18:30",
          inline: true,
        },
        {
          name: "📖 Regras:",
          value: "[Clique aqui](https://discord.com/channels/1129133724865396837/1129137502729556019)",
          inline: true,
        },
      ],
      footer: {
        text: "O abuso do ticket poderá resultar em futuras punições.",
      },
      color: Colors.DarkButNotBlack,
    });

    const menu = new StringSelectMenuBuilder({
      customId: "ticketMenu",
      placeholder: "Selecione um menu",
      options: [
        {
          label: "🙋‍♂️ | Suporte Geral",
          value: "suport",
          description: "Abra um ticket na categoria suporte.",
        },
        {
          label: "🛒 | Comprar",
          value: "buy",
          description: "Abra um ticket para negociar o seu bot.",
        },
      ],
    });

    const actionRow = new ActionRowBuilder<StringSelectMenuBuilder>().addComponents(menu);

    interaction.channel?.send({
      embeds: [embed],
      components: [actionRow],
    });

    interaction.reply({
      content: "Enviei o ticket com sucesso.",
      ephemeral: true,
    });
  },
});
