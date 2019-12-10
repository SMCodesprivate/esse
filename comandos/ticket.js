const Discord = require("discord.js");
const Suport = require("../models/Suports.js");
const bot = new Discord.Client();
const Infos = require("../models/Bot");
exports.run = async (SMCodes, message, args) =>{
  message.delete();
  var inf = await Infos.findOne({ id: SMCodes.user.id });
  if(!args[0]) return message.reply("digite um sub-comando, dê ``"+inf.prefix+"ticket list`` e irá verificar a lista de sub-comandos");
  switch(args[0]) {
    case 'delete':
      if(args[1]) {
        if(!message.member.hasPermission("MANAGE_MESSAGES")) return message.reply("Você não tem permissão para excluir tickets de outros usuários.");
        var user = message.mentions.members.first() || message.guild.members.get(args[1]);
        var teste = await Suport.findOne({ user_id: user.user.id });
        if(!teste) return message.reply("o usuário mencionado não tem um ticket aberto.");
        var canal = SMCodes.channels.get(teste.channel_id);
        teste = await Suport.findOneAndDelete({ user_id: user.user.id });
        canal.delete();
        message.reply("você deletou o ticket de <@"+user.user.id+">.");
        return;
      }
      var teste = await Suport.findOne({ user_id: message.author.id });
      if(!teste) return message.reply("você não tem um ticket registrado em nosso sistema de ``"+inf.prefix+"ticket create``.");
      var canal = SMCodes.channels.get(teste.channel_id);
      teste = await Suport.findOneAndDelete({ user_id: message.author.id });
      canal.delete();
      message.reply("você deletou seu ticket caso queira criar outro digite ``"+inf.prefix+"ticket create``.");
      break;
    case 'create':
      var teste = await Suport.findOne({ user_id: message.author.id });
      if(teste != null || teste) return message.reply("você já tem um ticket solicitado espere até um staffer fechar ou feche você mesmo usando ``!ticket delete``.");
      teste = await message.guild.createChannel("ticket-"+message.author.id, "text", [{
            id: message.guild.id,
            deny: ['READ_MESSAGES'],
        },
        {
          id: message.author.id,
          allow: ['READ_MESSAGES']
        },
        {
          id: "623199190121447444",
          allow: ['READ_MESSAGES']
        },
        {
          id: "630537515299766282",
          allow: ['READ_MESSAGES']
        },
        {
          id: "630547830917955599",
          allow: ['READ_MESSAGES']
        },
        {
          id: "630548081598922793",
          allow: ['READ_MESSAGES']
        },
        {
          id: "636609124276109323",
          allow: ['READ_MESSAGES']
        }
      ]);
      message.channel.send(`Você criou um ticket agora envie sua dúvida, acesse clicando aqui: <#${teste.id}>`);
      var data = new Date;
      teste = await Suport.create({
        user_id: message.author.id,
        name_channel: "ticket-"+message.author.id,
        channel_id: teste.id,
        data: {
          year: data.getFullYear(),
          month: data.getMonth()+1,
          day: data.getDate()
        }
      });
      break;
    case 'list':
      if(!message.member.hasPermission("MANAGE_MESSAGES")) return message.reply("Você não tem permissão para executar esse comando.");
      var teste = await Suport.find();
      let autor = message.guild.members.get(message.author.id);
      var embed = new Discord.RichEmbed()
        .setTitle("Tickets disponíveis")
        .setColor("#333333")
        .addBlankField()
        .setTimestamp()
	      .setFooter(message.author.tag, autor.user.avatarURL);
      teste.map(t => {
        embed.addField("**Canal » **", '<#'+t.channel_id+'>')
        .addField("**Author » **", '<@'+t.user_id+'>')
        .addField("**Create date » **", t.data.day+"/"+t.data.month+"/"+t.data.year)
        .addBlankField();
      });
      message.channel.send("Carregando...").then(msg => {
        setTimeout(() => {
          msg.edit(embed);
        }, 5000)
      })
      break;
    case 'commands':
      let at = message.guild.members.get(message.author.id);
      var embed = new Discord.RichEmbed()
        .setTitle("Sub comandos do comando ticket")
        .setColor("#222222")
        .addBlankField()
        .addField("**"+inf.prefix+"ticket create**", "Esse sub-comando serve para você abrir um ticket.")
        .addField("**"+inf.prefix+"ticket delete**", "Esse sub-comando serve para deletar um ticket que você abriu anteriormente.")
        .addField("**"+inf.prefix+"ticket list**", "Esse sub-comando serve para um staffer ver a lista de tickets abertos.")
        .addBlankField()
        .setTimestamp()
	      .setFooter(message.author.tag, at.user.avatarURL);
      message.channel.send(embed);
      break;
    default:
      message.reply("Esse sub-comando não existe, dê ``"+inf.prefix+"ticket commands`` e irá verificar a lista de sub-comandos.");
      break;
  }
}
exports.config ={
    name: 'ticket',
    help: 'Esse comando possui vários sub-comandos que realizam funções sobre os ticket, use o sub-comando: commands, para saber todos os sub-comandos.',
    aliases: [],
    category:'random'
}