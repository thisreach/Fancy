import {
    AuditLogEvent,
    Message,
    EmbedBuilder,
    Colors,
    TextChannel,
} from "discord.js";
import { Event } from "../../structs/types/Event";

export default new Event({
    name: "messageDelete",
    async execute(message: Message) {
        if (!message.guild) return;

        const fetchedLogs = await message.guild.fetchAuditLogs({
            limit: 1,
            type: AuditLogEvent.MessageDelete,
        });

        const log = fetchedLogs.entries.first();
        if (!log) return;

        const { executor, target } = log;

        if (message.author?.bot) return;

        const isSelfDelete = executor?.id === message.author.id;

        let embed;

        if (isSelfDelete) {
            embed = new EmbedBuilder({
                title: "**Mensagem Deletada Pelo Próprio Usuário**",
                description: `O usuário **${message.author}** apagou sua própria mensagem.`,
                color: Colors.Red,
                footer: { text: `ID do usuário: ${message.author.id}` },
                fields: [
                    {
                        name: "Mensagem deletada",
                        value: message.content,
                        inline: true,
                    },
                ],
                timestamp: new Date(),
            });
        } else {
            embed = new EmbedBuilder({
                title: "**Mensagem Deletada**",
                description: `A mensagem de **${message.author}** foi deletada por: **${executor}**`,
                color: Colors.Red,
                footer: { text: `ID do usuário: ${message.author.id}` },
                fields: [
                    {
                        name: "Mensagem deletada",
                        value: message.content,
                        inline: true,
                    },
                ],
                timestamp: new Date(),
            });
        }

        const channel = message.guild.channels.cache.get('1129138769619058738') as TextChannel;

        channel.send({
            embeds: [embed],
        });
    },
});
