import { ApplicationCommandOptionType, ApplicationCommandType, Colors, EmbedBuilder, PermissionFlagsBits } from "discord.js";
import { Command } from "../../structs/types/Commands";
import { v4 as uuidv4 } from 'uuid';
import License from "../../schemas/licenseSchema";

export default new Command({
    name: 'keygen',
    description: 'Gerar uma licença.',
    type: ApplicationCommandType.ChatInput,
    defaultMemberPermissions: PermissionFlagsBits.Administrator,
    options: [
        {
            name: 'usuário',
            description: 'Selecione um usuário.',
            type: ApplicationCommandOptionType.User
        },
        {
            name: 'plugin',
            description: 'Selecione o plugin.',
            type: ApplicationCommandOptionType.String
        }
    ],
    async execute({ interaction, options }) {

        await interaction.deferReply({ ephemeral: false })

        const keyGen = uuidv4();
        const user = options.getUser("usuário") || interaction.user;
        const args = options.getString('plugin');
        const mention = user ? user.id : interaction.user.id;
        if (args != 'murder' && args != 'thebridge' && args != 'bedwars' && args != 'skywars') return interaction.editReply('Esse plugin não existe.');

        const embed = new EmbedBuilder({
            description: `A chave ${keyGen} para o plugin ${args} foi gerada com sucesso.`,
            color: Colors.DarkButNotBlack,
            timestamp: new Date,
            author: { name: interaction.user.username, iconURL: interaction.user.displayAvatarURL({ forceStatic: true })}
        })

        const newLicense = new License({
            userId: mention,
            plugin: args,
            license: keyGen,
            enderess: '127.0.0.1',
            activated: true,
        })

        newLicense.save().then(async () => {
            await interaction.editReply({
                embeds: [embed]
            })
        })
    }
})