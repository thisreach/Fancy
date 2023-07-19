import { ApplicationCommandOptionType, ApplicationCommandType, Colors, EmbedBuilder, PermissionFlagsBits, ActionRowBuilder, StringSelectMenuBuilder, StringSelectMenuOptionBuilder, ComponentType, Collection } from "discord.js";
import { Command } from "../../structs/types/Commands";
import { v4 as uuidv4 } from 'uuid';
import License from "../../schemas/licenseSchema";

const newCache: Collection<string, string> = new Collection();

export default new Command({
    name: 'admin',
    description: 'Comandos de admin.',
    type: ApplicationCommandType.ChatInput,
    defaultMemberPermissions: PermissionFlagsBits.Administrator,
    options:
        [
            {
                name: 'keygen',
                description: 'Gerar uma nova licença.',
                type: ApplicationCommandOptionType.Subcommand,
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
            },
            {
                name: 'ver',
                description: 'Visualizar licença do usuário.',
                type: ApplicationCommandOptionType.Subcommand,
                options: [
                    {
                        name: 'usuário',
                        description: 'Selecione um usuário.',
                        type: ApplicationCommandOptionType.User,
                        required: true
                    },
                ],
            },
            {
                name: 'deletar',
                description: 'Deletar uma licença.',
                type: ApplicationCommandOptionType.Subcommand,
                options: [
                    {
                        name: 'licença',
                        description: 'Selecione a licença.',
                        type: ApplicationCommandOptionType.String,
                        required: true
                    },
                ],
            },
        ],
    async execute({ interaction, options }) {

        const subCommand = options.getSubcommand(true);

        switch (subCommand) {
            case "keygen":
                {

                    await interaction.deferReply({ ephemeral: true })

                    const keyGen = uuidv4();
                    const user = options.getUser("usuário") || interaction.user;
                    const args = options.getString('plugin');
                    const mention = user ? user.id : interaction.user.id;
                    if (args != 'murder' && args != 'thebridge' && args != 'bedwars' && args != 'skywars') return interaction.editReply('Esse plugin não existe.');

                    const embed = new EmbedBuilder({
                        description: `A chave ${keyGen} para o plugin ${args} foi gerada com sucesso.`,
                        color: Colors.DarkButNotBlack,
                        timestamp: new Date,
                        author: { name: interaction.user.username, iconURL: interaction.user.displayAvatarURL({ forceStatic: true }) }
                    })

                    const newLicense = new License({
                        userId: mention,
                        plugin: args,
                        license: keyGen,
                        enderess: '127.0.0.1',
                    })

                    newLicense.save().then(async () => {
                        await interaction.editReply({
                            embeds: [embed]
                        })
                    })

                }
                break;
            case "ver":
                {
                    await interaction.deferReply({ ephemeral: true })

                    const user = options.getUser('usuário');

                    const licenseProfile = await License.find({
                        userId: user?.id
                    })

                    if (licenseProfile.length < 1) return interaction.editReply('Esse usuário não tem nenhum licença.')

                    const embed = new EmbedBuilder({
                        description: `${user} tem o total de \`${licenseProfile.length}\` ${licenseProfile.length > 1 ? 'licenças' : 'licença'}`,
                        color: Colors.DarkButNotBlack,
                        timestamp: new Date(),
                    })

                    const menu = new StringSelectMenuBuilder()
                        .setCustomId('selectMenuKeysAdmin')
                        .setOptions(licenseProfile.map(keys => new StringSelectMenuOptionBuilder({
                            label: `${keys.plugin}`,
                            value: keys.license
                        })))

                    const msg = await interaction.editReply({
                        embeds: [embed],
                        components: [new ActionRowBuilder<StringSelectMenuBuilder>({
                            components: [menu]
                        })]
                    })

                    const collector = msg.createMessageComponentCollector({ componentType: ComponentType.StringSelect })
                    collector.on("collect", async subInteraction => {

                        const licenseProfile = await License.findOne({
                            license: subInteraction.values[0]
                        })

                        newCache.set(interaction.user.id, subInteraction.values[0]);

                        const embed = new EmbedBuilder({
                            description: `Você está visualizando as chaves de ${user}.`,
                            color: Colors.DarkButNotBlack,
                            timestamp: new Date(),
                            fields: [
                                {
                                    name: 'Nome do plugin: ',
                                    value: `${licenseProfile?.plugin}`,
                                    inline: true
                                },
                                {
                                    name: 'Chave: ',
                                    value: `${licenseProfile?.license}`,
                                    inline: true
                                },
                                {
                                    name: 'Endereço: ',
                                    value: `${licenseProfile?.enderess}`,
                                },
                                {
                                    name: 'Author: ',
                                    value: `${user}`,
                                }
                            ]
                        });
                        subInteraction.update({
                            embeds: [embed],

                        })
                    })
                }
                break;
            case "deletar":
                {

                    await interaction.deferReply({ ephemeral: false })

                    const args = options.getString('licença')

                    const deleteKey = await License.findOneAndDelete({
                        license: args
                    }).then(async () => {
                        const embed = new EmbedBuilder({
                            description: 'Deletei essa chave com sucesso.',
                            color: Colors.Red
                        });

                        await interaction.editReply({
                            embeds: [embed],
                        });
                    }).catch((error) => {
                        console.error('Erro ao excluir o documento:', error);
                    });
                }
                break;
        }
    },
})