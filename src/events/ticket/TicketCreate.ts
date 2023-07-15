import { ActionRowBuilder, ButtonBuilder, ButtonStyle, ChannelType, Colors, EmbedBuilder, PermissionFlagsBits } from "discord.js";
import { Event } from "../../structs/types/Event";

export default new Event({
    name: 'interactionCreate',
    async execute(interaction) {

        if (interaction.isStringSelectMenu()){
            if (interaction.customId === 'ticketMenu'){
                const options = interaction.values[0];

                switch (options) {
                  case "buy": {
                    const name = `compra-${interaction.user.username}`;
                    const ticketChannels = interaction.guild?.channels.cache.filter((channel) => {
                      if (
                        channel.type === ChannelType.GuildText &&
                        channel.name.includes(interaction.user.username)
                      ) {
                        return true;
                      }
                      return false;
                    });
        
                    if (ticketChannels && ticketChannels.size > 0) {
                      interaction.reply({
                        content: "Você já tem um ticket aberto.",
                        ephemeral: true,
                      });
                    } else {
                      const c = await interaction.guild?.channels.create({
                        name: name,
                        type: ChannelType.GuildText,
                        parent: "1129139831348412557",
                        permissionOverwrites: [
                          {
                            id: interaction.guild.id,
                            deny: [PermissionFlagsBits.ViewChannel],
                          },
                          {
                            id: interaction.user.id,
                            allow: [
                              PermissionFlagsBits.ViewChannel,
                              PermissionFlagsBits.SendMessages,
                              PermissionFlagsBits.AttachFiles,
                              PermissionFlagsBits.EmbedLinks,
                              PermissionFlagsBits.AddReactions,
                            ],
                          },
                        ],
                      }).then(channel => {
        
                      const embed = new EmbedBuilder({
                        description: `Olá ${interaction.user}, seu ticket foi aberto em ${channel}!`,
                        color: Colors.DarkButNotBlack
                      })
        
                      const embed2 = new EmbedBuilder({
                        description: `Olá, ${interaction.user}! seu ticket foi criado na categoria **Compra.**\n
                              Para agilizarmos o processo, por favor, forneça as seguintes informações:\n
                              > **Sua ideia**: [Insira oque você quer no seu bot]\n
                              Agradecemos por entrar em contato e estamos à disposição para auxiliá-lo! ✉️`,
                        color: Colors.DarkButNotBlack,
                      });
        
                      const button = new ButtonBuilder({
                        label: "Clique aqui!",
                        style: ButtonStyle.Link,
                        url: `${channel.url}`,
                      });
        
                      const button2 = new ButtonBuilder({
                        customId: "closeTicketButton",
                        label: "Fechar ticket",
                        emoji: "🗑️",
                        style: ButtonStyle.Danger,
                      });
        
                      const button3 = new ButtonBuilder({
                        customId: "addUserTicketButton",
                        label: "Adicionar pessoa",
                        emoji: "👨",
                        style: ButtonStyle.Primary,
                      });
        
                      const button4 = new ButtonBuilder({
                        customId: "toAssumeButton",
                        label: "Assumir ticket",
                        emoji: "⭐",
                        style: ButtonStyle.Secondary,
                      });
        
                      channel.send({
                        embeds: [embed2],
                        components: [
                          new ActionRowBuilder<ButtonBuilder>({
                            components: [button2, button3, button4],
                          }),
                        ],
                      }).then((message) => {
                        message.pin();
                      });
        
                      interaction.reply({
                        embeds: [embed],
                        components: [
                          new ActionRowBuilder<ButtonBuilder>({
                            components: [button],
                          }),
                        ],
                        ephemeral: true
                      });
                    })
                    }
                  }
                    break;
                case "suport":
                {

                  const name = `suporte-geral-${interaction.user.username}`;
                  const ticketChannels = interaction.guild?.channels.cache.filter((channel) => {
                    if (
                      channel.type === ChannelType.GuildText &&
                      channel.name.includes(interaction.user.username)
                    ) {
                      return true;
                    }
                    return false;
                  });
      
                  if (ticketChannels && ticketChannels.size > 0) {
                    interaction.reply({
                      content: "Você já tem um ticket aberto.",
                      ephemeral: true,
                    });
                  } else {
                    const c = await interaction.guild?.channels.create({
                      name: name,
                      type: ChannelType.GuildText,
                      parent: "1129139831348412557",
                      permissionOverwrites: [
                        {
                          id: interaction.guild.id,
                          deny: [PermissionFlagsBits.ViewChannel],
                        },
                        {
                          id: interaction.user.id,
                          allow: [
                            PermissionFlagsBits.ViewChannel,
                            PermissionFlagsBits.SendMessages,
                            PermissionFlagsBits.AttachFiles,
                            PermissionFlagsBits.EmbedLinks,
                            PermissionFlagsBits.AddReactions,
                          ],
                        },
                      ],
                    }).then(channel => {
      
                    const embed = new EmbedBuilder({
                      description: `Olá ${interaction.user}, seu ticket foi aberto em ${channel}!`,
                      color: Colors.DarkButNotBlack
                    })
      
                    const embed2 = new EmbedBuilder({
                      description: `Olá, ${interaction.user} seu ticket foi criado na categoria **Suporte geral.**\n
                      Para agilizarmos o processo, por favor, forneça as seguintes informações:\n
                      > Manda sua dúvida ou o motivo do ticket.\n
                      Agradecemos por entrar em contato e estamos à disposição para auxiliá-lo! :envelope:`,
                      color: Colors.DarkButNotBlack,
                    });
      
                    const button = new ButtonBuilder({
                      label: "Clique aqui!",
                      style: ButtonStyle.Link,
                      url: `${channel.url}`,
                    });
      
                    const button2 = new ButtonBuilder({
                      customId: "closeTicketButton",
                      label: "Fechar ticket",
                      emoji: "🗑️",
                      style: ButtonStyle.Danger,
                    });
      
                    const button3 = new ButtonBuilder({
                      customId: "addUserTicketButton",
                      label: "Adicionar pessoa",
                      emoji: "👨",
                      style: ButtonStyle.Primary,
                    });
      
                    const button4 = new ButtonBuilder({
                      customId: "toAssumeButton",
                      label: "Assumir ticket",
                      emoji: "⭐",
                      style: ButtonStyle.Secondary,
                    });
      
                    channel.send({
                      embeds: [embed2],
                      components: [
                        new ActionRowBuilder<ButtonBuilder>({
                          components: [button2, button3, button4],
                        }),
                      ],
                    }).then((message) => {
                      message.pin();
                    });
      
                    interaction.reply({
                      embeds: [embed],
                      components: [
                        new ActionRowBuilder<ButtonBuilder>({
                          components: [button],
                        }),
                      ],
                      ephemeral: true
                    });
                  })
                  }

                }
                break;
                  default:
                    break;
                }
            }
        }

    }
})