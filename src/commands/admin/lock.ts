import { ApplicationCommandOptionType, Colors, EmbedBuilder, PermissionFlagsBits, TextChannel } from "discord.js";
import { Command } from "../../structs/types/Commands";

export default new Command({
    name: "trancar",
    description: "Trancar um canal.",
    defaultMemberPermissions: PermissionFlagsBits.ManageChannels,
    options: [
        {
            name: "canal",
            description: "Selecione um canal",
            type: ApplicationCommandOptionType.Channel
        }
    ],

    async execute({ interaction, options }){

        await interaction.deferReply({ ephemeral: false })

        const channel = options.getChannel("canal") || interaction.channel

        const embed = new EmbedBuilder({
            description: `O canal ${channel} foi trancado por ${interaction.user.username}.`,
            color: Colors.DarkButNotBlack
        })

        await interaction.editReply({
            embeds: [embed]
        }).then(msg => {
            if (channel instanceof TextChannel && interaction.guild){
                channel.permissionOverwrites.edit(interaction.guild.id, {
                    SendMessages: false
                }).catch(error => console.log(error))
            }
        })

    }
})