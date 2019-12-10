const Discord = require("discord.js")
exports.run = async (SMCodes, message, args) =>{
  message.delete();
  const sayMessage = args.join(" ");
  message.channel.send(sayMessage);
}
exports.config ={
    name: 'say',
    help: 'Esse comando re-envia uma mensagem em meu nome.',
    aliases: [],
    category:'random'
}