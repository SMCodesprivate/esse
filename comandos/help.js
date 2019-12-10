const Discord = require("discord.js");
const Infos = require("../models/Bot");
const fs = require("fs");
exports.run = async (SMCodes, message, args) => {
  message.delete();
  var teste = await Infos.findOne({ id: SMCodes.user.id });
  if(!teste || teste === null) return message.reply("o meu criador não iniciou o help desse bot");
  var version = teste.version.toString();
  version = version[0]+"."+version[1]+"."+version[2];
  var embed = new Discord.RichEmbed()
    .setTitle("Comandos do bot "+SMCodes.user.username)
    .setColor("#222222")
    .setDescription("**- Versão atual do bot » "+version+"\n- Name do bot » "+SMCodes.user.username+"\n- ID do bot » "+teste.id+"\n- Quantidade de comandos » "+teste.commands.length+"**")
    .addBlankField()
    .setTimestamp()
	  .setFooter("DLHostBr - Copyright ©", "https://cdn.discordapp.com/icons/622969651093307392/f6c516a78c996a2f8536ca3061e37f1e.png?size=128");
  fs.readdir('./comandos', function(err,file) {
    var x = 0;
    var command = "";
    while(x <= file.length-1) {
      var top = {};
      top[file[x]] = require("./"+file[x]);
      var { name, help } = top[file[x]].config;
      embed.addField(`**${teste.prefix}${name} » **`, `**${help}**`).addBlankField();
      x++;
    }
  });
  message.channel.send("Carregando...").then(msg => {
    setTimeout(() => {
      msg.edit(embed);
    }, teste.commands.length * 75);
  })
}
exports.config ={
    name: 'help',
    help: 'Esse comando você vê a lista de comandos registrado na versão atual.',
    aliases: [],
    category:'random'
}