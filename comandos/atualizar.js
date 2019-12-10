const Discord = require("discord.js")
const Infos = require("../models/Bot");
const fs = require("fs");
exports.run = async (SMCodes, message, args) =>{
  message.delete()
  if(message.author.id !== "360247173356584960") return message.reply("Você não é o meu criador, então não poderá usar esse comando.");
  var teste = await Infos.findOne({ id: SMCodes.user.id });
  if(!teste) {
    var comandos = [];
    var f = '';
    function verificar() {
      var x = 0;
      fs.readdir('./comandos', function(err,file) {
        while(x <= file.length-1) {
          comandos.push(file[x]);
          x += 1;
        }
      });
    }
    verificar();
    setTimeout(async () => {
      teste = await Infos.create({
        id: SMCodes.user.id,
        version: 100,
        prefix: "!",
        commands: comandos
      });
      console.log(teste);
      var version = teste.version.toString();
      version = version[0]+"."+version[1]+"."+version[2];
      var embed = new Discord.RichEmbed()
        .setTitle("O bot "+SMCodes.user.username+" foi criado")
        .setColor("#222222")
        .addBlankField()
        .addField("**Bot id » **", SMCodes.user.id)
        .addField("**Bot version » **", version)
        .addField("**Bot prefix » **", teste.prefix)
        .addField("**Bot commands » **", teste.commands.length)
        .addBlankField()
        .setTimestamp()
        .setFooter("DLHostBr - Copyright ©", "https://cdn.discordapp.com/icons/622969651093307392/f6c516a78c996a2f8536ca3061e37f1e.png?size=128");
      return message.channel.send(embed);
    }, 2000);;
  } else {
    function verificar() {
      var x = 0;
      var y = 0;
      var z = false;
      fs.readdir('./comandos', async function(err,file) {
        while(y <= file.length-1) {
          var index = teste.commands.indexOf(file[y]);
          if(index == -1) {
            z = true;
          }
          y++;
        }
        if(z == true) {
          while(x <= file.length-1) {
            if(teste.commands.indexOf(file[x]) == -1) {
              var t = teste.commands;
              var comandos = t+","+file[x];
              comandos = comandos.split(",")
              var newVersion = teste.version + 1;
              teste = await Infos.findOneAndUpdate({
                id: SMCodes.user.id
              }, {
                commands: comandos,
                version: newVersion
              });
            }
            x += 1;
          }
          teste = await Infos.findOne({ id: SMCodes.user.id });
          var version = teste.version.toString();
          version = version[0]+"."+version[1]+"."+version[2];
          var embed = new Discord.RichEmbed()
            .setTitle("Atualizado new version")
            .setColor("#222222")
            .addBlankField()
            .addField("**Bot id » **", SMCodes.user.id)
            .addField("**Bot version » **", version)
            .addField("**Bot prefix » **", teste.prefix)
            .addField("**Bot commands » **", teste.commands.length)
            .addBlankField()
            .setTimestamp()
            .setFooter("DLHostBr - Copyright ©", "https://cdn.discordapp.com/icons/622969651093307392/f6c516a78c996a2f8536ca3061e37f1e.png?size=128");
          message.channel.send(embed);
        } else {
          message.channel.send("Não tem nenhum comando novo não tem como atualizar.");
        }
      });
    }
    verificar();
    return;
  }
}
exports.config ={
    name: 'update',
    help: 'Esse comando atualiza o bot caso houver um novo comando.',
    aliases: ['atualizar'],
    category:'random'
}