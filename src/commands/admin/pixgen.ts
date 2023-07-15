import { ActionRowBuilder, ApplicationCommandOptionType, ApplicationCommandType, ButtonBuilder, ButtonStyle, Colors, ComponentType, EmbedBuilder, Message, PermissionFlagsBits } from "discord.js";
import { Command } from "../../structs/types/Commands";
import { Utils } from "../../utils/Utils";

export default new Command({
    name: 'pix',
    description: 'Gerar o pix para pagamento.',
    type: ApplicationCommandType.ChatInput,
    defaultMemberPermissions: PermissionFlagsBits.Administrator,
    options: [
        {
            name: 'preço',
            description: 'Selecione um preço',
            type: ApplicationCommandOptionType.Number,
            required: true
        },
        {
            name: 'descrição',
            description: 'Selecione uma descrição',
            type: ApplicationCommandOptionType.String,
            required: true
        }
    ],
    async execute({ interaction, options }) {

        const BRcode = await Utils.PasteAndCopy(options.getNumber('preço') as number, options.getString('descrição') as string);

        Utils.genPix(options.getNumber('preço') as number, options.getString('descrição')?.replace('user', interaction.user.username) as string).then(async image => {
            
            const button = new ButtonBuilder({
                customId: 'PasteAndCopy',
                style: ButtonStyle.Primary,
                label: 'Copiar e colar',
            })

            await interaction.reply({
                content: 'Pix gerado com sucesso.',
                ephemeral: true
            })

            const msg = await interaction.channel?.send({
                files: [{ attachment: image.toBuffer(), name: 'qrcode.png' }],
                components: [new ActionRowBuilder<ButtonBuilder>({
                    components: [button]
                })]
            }) as Message

            const collector = msg.createMessageComponentCollector({componentType: ComponentType.Button, time: 30_000 })
            collector.on("collect", async subInteraction => {
                
                const embed = new EmbedBuilder({
                    description: `\`\`\`TS\n${BRcode}\n\`\`\``,
                    color: Colors.DarkButNotBlack
                })

                subInteraction.reply({
                    embeds: [embed],
                    ephemeral: true
                })

            })
        })
    }
})
