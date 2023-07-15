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

        const { target } = log;

        if (message.author?.bot) return;

        const isSelfDelete = target.id === message.author.id;

        let executor;
        if (isSelfDelete) {
            executor = message.author;
        } else {
            executor = log.executor;
        }

        const embed = new EmbedBuilder({
            title: isSelfDelete ? "**Mensagem Deletada Pelo Próprio Usuário**" : "**Mensagem Deletada**",
            description: isSelfDelete ? `O usuário **${executor}** apagou sua própria mensagem.` : `A mensagem de **${message.author}** foi deletada por: **${executor}**`,
            color: isSelfDelete ? Colors.Red : Colors.DarkButNotBlack,
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

        const channel = message.guild.channels.cache.get('1129138769619058738') as TextChannel;

        channel.send({
            embeds: [embed],
        });
    },
});
