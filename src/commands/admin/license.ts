import { ActionRowBuilder, ApplicationCommandOptionType, ApplicationCommandType, ButtonBuilder, ButtonStyle, Colors, ComponentType, EmbedBuilder, StringSelectMenuBuilder, StringSelectMenuOptionBuilder } from "discord.js";
import { Command } from "../../structs/types/Commands";
import License from "../../schemas/licenseSchema";

export default new Command({
    name: "licença",
    description: "Comandos de licença.",
    type: ApplicationCommandType.ChatInput,
    options: [
        {
            name: "gerenciar",
            description: "Veja as suas licenças.",
            type: ApplicationCommandOptionType.Subcommand,
        },
    ],
    async execute({ interaction, options }) {
        const subCommand = options.getSubcommand(true);

        switch (subCommand) {
            case "gerenciar": {

                await interaction.deferReply({ ephemeral: true })

                const licenseProfile = await License.find({
                    userId: interaction.user.id
                })

                if (licenseProfile.length < 1) return interaction.editReply('Você não tem nenhuma licença.')

                const embed = new EmbedBuilder({
                    description: `Você tem um total de \`${licenseProfile.length}\` ${licenseProfile.length > 1 ? 'licenças' : 'licença'}`,
                    color: Colors.DarkButNotBlack,
                    timestamp: new Date(),
                })

                const menu = new StringSelectMenuBuilder()
                    .setCustomId('selectMenuKeys')
                    .setOptions(licenseProfile.map(keys => new StringSelectMenuOptionBuilder({
                        label: `${keys.plugin}`,
                        value: keys.license
                    })))

                await interaction.editReply({
                    embeds: [embed],
                    components: [new ActionRowBuilder<StringSelectMenuBuilder>({
                        components: [menu]
                    })]
                })

            }
        }
    },
});
