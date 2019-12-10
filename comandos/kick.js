const Discord = require("discord.js");
exports.run = async (SMCodes, message, args) =>{
    message.delete().catch(O_o=>{});
    if(!message.member.hasPermission("ADMINISTRATOR")) return message.reply("Você não tem permissão para executar esse comando.");
    let member = message.mentions.members.first() || message.guild.members.get(args[0]);
    if(!member)
        return message.reply("Por favor mencione um membro válido deste servidor");
    if(!member.kickable)
        return message.reply("Eu não posso expulsar este usuário! Eles pode ter um cargo mais alto ou eu não tenho permissões de expulsar?");
    let reason = args.slice(1).join(' ');
    if(!reason) reason = "Nenhuma razão fornecida";
    member.kick(reason)
        .catch(error => message.reply(`Desculpe ${message.author} não consegui expulsar o membro devido o: ${error}`));
    message.reply(`${member.user.tag} foi kickado por ${message.author.tag} Motivo: ${reason}`);
};
exports.config ={
    name: 'kick',
    help: 'Esse comando você expulsa um membro de seu servidor, mas ele poderá entrar novamente.',
    aliases: ['kickar', 'expulsar'],
    category: 'random',
}