const Discord = require("discord.js");
const Sugestoes = require("../models/Sugestoes");
exports.run = async (SMCodes, message, args) =>{
  message.delete();
  const sayMessage = args.join(" ");
  var autor = message.guild.members.get(message.author.id);
  var data = new Date;
  var teste = await Sugestoes.create({
    id: message.author.id,
    message: sayMessage,
    data: {
      year: data.getFullYear(),
      month: data.getMonth()+1,
      day: data.getDate()
    }
  });
  var mes = data.getMonth() + 1;
  var embed = new Discord.RichEmbed()
    .setTitle("Sugestão")
    .setColor("#222222")
    .setDescription("**Sugestão de "+message.author.tag+"**")
    .addBlankField()
    .addField("**Sugestão » **", sayMessage)
    .addField("**Date » **", data.getFullYear()+"/"+mes+"/"+data.getDate())
    .addBlankField()
    .setTimestamp()
    .setFooter(message.author.tag, autor.user.avatarURL);
  message.channel.send(embed);
}
exports.config = {
    name: 'sugerir',
    help: 'Esse comando faz com que a pessoa que executa sugere alguma coisa para os staffers fazer.',
    aliases: [],
    category:'random'
}