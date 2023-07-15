import { Event } from "../../structs/types/Event";

export default new Event({
    name: 'guildMemberAdd',
    async execute(member) {
        const roleId = '1129141535221493761';
        const role = member.guild.roles.cache.get(roleId);

        if (role) {
            try {
                member.roles.add(role);
            } catch (error) {
                console.log('Algo deu errado ao adicionar a função: ' + role.name);
            }
        } else {
            console.log('A função com ID ' + roleId + ' não foi encontrada.');
        }
    }
});
