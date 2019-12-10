const Discord = require("discord.js")
const Infos = require("../models/Bot.js");
exports.run = async (SMCodes, message, args) =>{
  message.delete();
  var teste = await Infos.findOne({ id: SMCodes.user.id });
  if(!args[0] && teste) return message.channel.send("Meu prefixo é ``"+teste.prefix+"``");
  if(!args[0]) return message.channel.send("Meu prefixo é ``!``");
  if(message.author.id !== "360247173356584960") return message.reply("Você não é o meu criador, então não poderá usar esse comando.");
  if(args[0]) {
    if(args[1]) return message.reply("O prefixo não pode conter espaços.");
    if(args[0].length >= 4) return message.reply("Você pode utilizar no máximo 3 caractere.");
    if(!teste) return message.reply("Precisa iniciar o bot para trocar o prefixo, para iniciar use ``!atualizar``.");
    teste = await Infos.findOneAndUpdate({
      id: SMCodes.user.id
    }, {
      prefix: args[0]
    });
    message.reply("Você trocou o prefixo do bot geral para: ``"+args[0]+"``");
  }
}
exports.config ={
    name: 'prefix',
    help: 'Com esse comando você pode ver meu prefixo nesse servidor, ou trocar meu prefixo.',
    aliases: [],
    category:'random'
}