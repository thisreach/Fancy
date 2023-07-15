import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  EmbedBuilder,
  ModalBuilder,
  PermissionFlagsBits,
  TextChannel,
  TextInputBuilder,
  TextInputStyle,
} from "discord.js";
import { Event } from "../../structs/types/Event";
export default new Event({
  name: "interactionCreate",
  once: false,
  async execute(interaction) {
    const isButton = interaction.isButton()

    if (isButton) {
      switch (interaction.customId) {
        case "closeTicketButton":
          {
            await interaction.deferReply({ ephemeral: false });

            if (
              !interaction.memberPermissions?.has(
                PermissionFlagsBits.ManageChannels
              )
            )
              return interaction.editReply({
                content: "Você não tem permissão para fechar o ticket.",
              });

            await interaction.editReply({
              content: "Esse canal será excluído em 5 segundos.",
            });

            setTimeout(() => {
              try {
                interaction.channel?.delete();
              } catch (error) {
                console.log(error);
              }
            }, 5000);
          }
          break;
        case "addUserTicketButton": {
          if (
            !interaction.memberPermissions?.has(
              PermissionFlagsBits.ManageChannels
            )
          )
            return interaction.reply({
              content: "Você não tem permissão para fechar o ticket.",
            });

          const modal = new ModalBuilder({
            customId: "addUserModal",
            title: "Adicione um usuário ao ticket.",
          });

          const textInput = new TextInputBuilder({
            customId: "addUserInput",
            label: "Coloque o id do usuário.",
            style: TextInputStyle.Short,
            required: true,
          });

          modal.addComponents(
            new ActionRowBuilder<TextInputBuilder>({
              components: [textInput],
            })
          );

          await interaction.showModal(modal);
        }
        case "toAssumeButton":
          {
            const embed = new EmbedBuilder({
              description: `O ${interaction.user} assumiu esse ticket. 👤\n\nQualquer dúvida ou questionamento, por favor, direcione-a para ele. Estamos aqui para ajudar! 🤝✉️              `,
            });
            embed.setColor("#2C2F33");

            interaction.channel?.send({
              embeds: [embed],
            });

            interaction.update({
              components: [
                new ActionRowBuilder<ButtonBuilder>({
                  components: [
                    new ButtonBuilder({
                      customId: "closeTicketButton",
                      label: "Fechar ticket",
                      emoji: "🗑️",
                      style: ButtonStyle.Danger,
                    }),
                    new ButtonBuilder({
                      customId: "addUserTicketButton",
                      label: "Adicionar pessoa",
                      emoji: "👨",
                      style: ButtonStyle.Primary,
                    }),
                    new ButtonBuilder({
                      customId: "toAssumeButton",
                      label: "Assumir ticket",
                      emoji: "⭐",
                      style: ButtonStyle.Secondary,
                      disabled: true,
                    }),
                  ],
                }),
              ],
            });
          }
          break;
        default:
          break;
      }
    } else {
      // Handle caso não tenha button
    }

    if (interaction.isModalSubmit()) {
      if (interaction.customId === "addUserModal") {
        const userId = interaction.fields.getTextInputValue("addUserInput");
        const user = interaction.guild?.members.fetch(userId);

        const channel = interaction.channel as TextChannel

        channel.permissionOverwrites.edit(userId, {
          ViewChannel: true, SendMessages: true, ReadMessageHistory: true, AttachFiles: true
        }).catch(e => {
          console.log(e)
          interaction.reply({ content: `Ops, algo deu ao tentar adicionar pessoa.` })
        })

        await interaction.reply({
          content: "Adicionei o usuário com sucesso.",
          ephemeral: true
        })

      }
    }
  },
});
