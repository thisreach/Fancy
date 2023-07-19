import { EmbedBuilder, PermissionsBitField } from "discord.js";
import { Event } from "../../structs/types/Event";

export default new Event({
    name: "messageCreate",
    execute(message){
        
        if (!message.guild?.members.me?.permissions.has(PermissionsBitField.Flags.ManageMessages)) return;
        if (message.member?.permissions.has(PermissionsBitField.Flags.Administrator)) return;

        const regexUrl = /((([(https)(http)]{3,9}:(?:\/\/)?)(?:[\-;:&=\+\$,\w]+@)?[A-Za-z0-9\.\-]+|(?:www\.|[\-;:&=\+\$,\w]+@)[A-Za-z0-9\.\-]+)((?:\/[\+~%\/\.\w\-_]*)?\??(?:[\-\+=&;%@\.\w_]*)#?(?:[\.\!\/\\\w]*))?)/;

        setTimeout(() => {
            if (regexUrl.test(message.content) || message.content.includes('discord.gg/')) {
                message.channel.send({ content: `${message.member}, aqui não é permitido links` }).then(mg => setTimeout(mg.delete.bind(mg), 10000))
                message.delete();

                return;
            }
        }, 5000);


    }
})