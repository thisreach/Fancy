import { ActionRowBuilder, ButtonBuilder, ButtonStyle, Collection, Colors, EmbedBuilder, ModalBuilder, PermissionFlagsBits, StringSelectMenuBuilder, StringSelectMenuOptionBuilder, TextInputBuilder, TextInputStyle } from "discord.js";
import { Event } from "../../structs/types/Event";
import { FormatUtils } from "../../utils/FormatUtils";
import License from "../../schemas/licenseSchema";

const cache: Collection<string, string> = new Collection();

export default new Event({
    name: 'interactionCreate',
    async execute(interaction) {

        if (interaction.isStringSelectMenu()) {
            const customId = interaction.customId;

            switch (customId) {
                case 'selectMenuKeys': {
                    if (interaction.isStringSelectMenu()) {
                        const option = interaction.values[0]
                        const licenseProfile = await License.findOne({ license: option });

                        cache.set(interaction.user.id, option);

                        const embed = new EmbedBuilder({
                            description: `Você está editando o plugin.`,
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
                                    value: `${FormatUtils.userMention(licenseProfile?.userId as string)}`,
                                }
                            ]
                        });

                        const button = new ButtonBuilder({
                            customId: 'backButton',
                            label: 'Voltar',
                            style: ButtonStyle.Danger
                        });

                        const button2 = new ButtonBuilder({
                            customId: `changeEnderessButton`,
                            label: 'Trocar endereço',
                            style: ButtonStyle.Success
                        });

                        const button3 = new ButtonBuilder({
                            customId: `showLicenseButton`,
                            label: 'Ver sua licença',
                            style: ButtonStyle.Primary
                        });

                        const button4 = new ButtonBuilder({
                            label: 'Download',
                            style: ButtonStyle.Link,
                            url: `http://164.152.48.107:3000/licenses/api/checker/${licenseProfile?.plugin}/${licenseProfile?.license}`
                        })

                        interaction.update({
                            embeds: [embed],
                            components: [
                                new ActionRowBuilder<ButtonBuilder>({
                                    components: [button2, button3, button4, button]
                                })
                            ]
                        });
                    }
                }
                    break;
            }
        }

        if (interaction.isButton()) {
            const customid = interaction.customId;

            switch (customid) {
                case 'backButton': {
                    const licenseProfile = await License.find({ userId: interaction.user.id });

                    const embed = new EmbedBuilder({
                        description: `Você tem um total de \`${licenseProfile.length}\` ${licenseProfile.length > 1 ? 'licenças' : 'licença'}`,
                        color: Colors.DarkButNotBlack,
                        timestamp: new Date(),
                    });

                    const menu = new StringSelectMenuBuilder()
                        .setCustomId('selectMenuKeys')
                        .setOptions(licenseProfile.map(keys => new StringSelectMenuOptionBuilder({
                            label: `${keys.plugin}`,
                            value: keys.license
                        })));

                    interaction.update({
                        embeds: [embed],
                        components: [
                            new ActionRowBuilder<StringSelectMenuBuilder>({
                                components: [menu]
                            })
                        ]
                    });
                }
                    break;
                case "changeEnderessButton": {
                    const key = cache.get(interaction.user.id)
                    const licenseProfile = await License.findOne({
                        license: key
                    })

                    const modal = new ModalBuilder({
                        customId: 'modalEnderess',
                        title: 'Troque o endereço da sua key.'
                    });

                    const textInput = new TextInputBuilder({
                        customId: 'textInputEnderess',
                        label: 'Coloque o IP aqui!',
                        placeholder: `${licenseProfile?.enderess}`,
                        style: TextInputStyle.Short
                    });

                    modal.addComponents(
                        new ActionRowBuilder<TextInputBuilder>({
                            components: [textInput]
                        })
                    );

                    await interaction.showModal(modal);
                }
                    break;

                case "showLicenseButton": {
                    const key = cache.get(interaction.user.id)
                    const embed = new EmbedBuilder({
                        description: `\`\`\`TS\n${key}\n\`\`\``,
                        color: Colors.DarkButNotBlack,
                    });


                    await interaction.reply({
                        embeds: [embed],
                        ephemeral: true,
                    });
                }
                    break;
            }
        }

        if (interaction.isModalSubmit()) {
            if (interaction.customId === "modalEnderess") {

                const key = cache.get(interaction.user.id);
                const newIp = interaction.fields.getTextInputValue('textInputEnderess');

                const licenseProfile = await License.findOne({
                    license: key
                })

                if (licenseProfile) {
                    licenseProfile.enderess = newIp;
                    await licenseProfile.save();
                }

                const replyEmbed = new EmbedBuilder({
                    description: 'O endereço IP foi atualizado com sucesso.',
                    color: Colors.Green
                });
                await interaction.reply({
                    embeds: [replyEmbed],
                    ephemeral: true
                });
            }
        }
    }
});
