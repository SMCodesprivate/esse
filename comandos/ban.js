const Discord = require("discord.js");
exports.run = async (SMCodes, message, args) =>{
    message.delete().catch(O_o=>{});
    if(!message.member.hasPermission("ADMINISTRATOR")) return message.reply("Você não tem permissão para executar esse comando.");
    let member = message.mentions.members.first();
    if(!member)
      return message.reply("Por favor mencione um membro válido deste servidor");
    if(!member.bannable)
      return message.reply("Eu não posso banir este usuário! Eles pode ter um cargo mais alto ou eu não tenho permissões de banir?");
    let reason = args.slice(1).join(' ');
    if(!reason) reason = "Nenhuma razão fornecida";
    await member.ban(reason)
      .catch(error => message.reply(`Desculpe ${message.author} não consegui banir o membro devido o : ${error}`));
    message.reply(`${member.user.tag} foi banido por ${message.author.tag} Motivo: ${reason}`);
};
exports.config ={
    name: 'ban',
    help: 'Esse comando você expulsa um membro de seu servidor, sem ele poder entrar novamente até que seja desbanido.',
    aliases: ['banir'],
    category: 'random'
}