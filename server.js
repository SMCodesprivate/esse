const http = require('http');
const express = require('express');
const app = express();
app.get("/", (req, res) => {
  return res.send("Status: ONLINE");
});
app.listen(process.env.PORT);
console.log(`http://${process.env.PROJECT_DOMAIN}.glitch.me/`);
setInterval(() => {
  http.get(`http://${process.env.PROJECT_DOMAIN}.glitch.me/`);
}, 280000);
const Discord = require("discord.js");
const config = require("./config.json");
const SMCodes = new Discord.Client(); 
const fs = require('fs');
const Infos = require("./models/Bot");
const Sugestoes = require("./models/Sugestoes");
const Avaliacoes = require("./models/avaliacoes");
const func = require("./funcoes");
const cooldown = require("./cooldown");
const mongoose = require("mongoose");
const Suport = require("./models/Suports.js");
SMCodes.commands = new Discord.Collection();
SMCodes.aliases = new Discord.Collection();
mongoose.connect('Aqui tu coloca acesso ao banco de dados', {
	useNewUrlParser: true,
	useUnifiedTopology: true
});
fs.readdir('./comandos', function(err,file) {
	if(err) console.log(err);
	let jsfile = file.filter(f => f.split('.').pop() === 'js');
	if(jsfile.length < 0) {
			console.log('comando nao encontrado.');
	}

	jsfile.forEach(function (f, i) {
			let pull = require(`./comandos/${f}`);
			SMCodes.commands.set(pull.config.name, pull);
			pull.config.aliases.forEach(function(alias) {
				SMCodes.aliases.set(alias, pull.config.name);
			})
	})
});

function getColor() {
  var letters = "0123456789ABCDEFGHIJKLMNOPQRSTUVWYZ";
  var color = "";
  for (var i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}
async function enviarAvaliation(id) {
    var seg = await Avaliacoes.findOne({ _id: id });
    const ch = SMCodes.channels.get("647555747454124068");
    var color = getColor();
    var user = ch.guild.members.get(seg.user_id);
    var avaliado = ch.guild.members.get(seg.user_id_avaliado);
    console.log(user.user.avatarURL);
    console.log(avaliado.user.avatarURL);
    var embed = new Discord.RichEmbed()
      .setTitle("Avaliação de "+user.user.tag)
      .setColor("#"+color)
      .addBlankField()
    	.setThumbnail(user.user.avatarURL)
      .addField("**Avaliado » **", "**"+avaliado.user.tag+"**")
      .addField("**Avaliado por » **", "**"+user.user.tag+"**")
      .addField("**Motivo » **", "**"+seg.motivo+"**")
      .addField("**Nota » **", "**"+seg.level+"**")
      .addBlankField()
    	.setImage(avaliado.user.avatarURL)
      .setTimestamp()
	    .setFooter("DLHostBr - Copyright ©", "https://cdn.discordapp.com/icons/622969651093307392/f6c516a78c996a2f8536ca3061e37f1e.png?size=128");
    ch.send(embed);
}
async function carregarSugestion() {
  var testet = await Infos.findOne({ id: SMCodes.user.id });
  var canal = SMCodes.channels.get("647624040244051987");
  var teste = await Sugestoes.find();
  var embed = new Discord.RichEmbed()
    .setTitle("Sugestões")
    .setColor("#222222")
    .addBlankField()
    .setTimestamp()
	  .setFooter("DLHostBr - Copyright ©", "https://cdn.discordapp.com/icons/622969651093307392/f6c516a78c996a2f8536ca3061e37f1e.png?size=128");;
  if(!teste || teste === null || teste.length === 0) {
    embed.addField("**Não encontramos nenhuma sugestão em nosso sistema.**", "**Use ``"+testet.prefix+"sugerir {sugestão}``**").addBlankField();
    canal.fetchMessage('647624225187823616').then(message => {
      message.edit(embed)
    })
    return;
  }
  teste.map(t => {
    var a = canal.guild.members.get(t.id);
    embed
      .addField("**User » **", a.user.tag)
      .addField("**Date » **", t.data.day+"/"+t.data.month+"/"+t.data.year)
      .addField("**Sugestão » **", t.message)  
      .addBlankField();
  });
  canal.fetchMessage('647624225187823616').then(message => {
    message.edit(embed)
  })
}

SMCodes.on('raw', async dados => {
    if(dados.t !== "MESSAGE_REACTION_ADD" && dados.t !== "MESSAGE_REACTION_REMOVE") return
    if(dados.d.message_id != "652525742264942603") return

    let servidor = SMCodes.guilds.get("622969651093307392");
    let membro = servidor.members.get(dados.d.user_id);

    if(dados.t === "MESSAGE_REACTION_ADD") {
        if(dados.d.emoji.name === "✔"){
          var teste = await Suport.findOne({ user_id: membro.user.id });
          if(teste != null || teste) return membro.send("você já tem um ticket solicitado espere até um staffer fechar ou feche você mesmo usando ``!ticket delete``.");
          teste = await servidor.createChannel("ticket-"+membro.user.id, "text", [{
                id: "622969651093307392",
                deny: ['READ_MESSAGES'],
            },
            {
              id: membro.user.id,
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
          membro.send(`Você criou um ticket agora envie sua dúvida, acesse clicando aqui: <#${teste.id}>`);
          var data = new Date;
          teste = await Suport.create({
            user_id: membro.user.id,
            name_channel: "ticket-"+membro.user.id,
            channel_id: teste.id,
            data: {
              year: data.getFullYear(),
              month: data.getMonth()+1,
              day: data.getDate()
            }
          });
        } else if(dados.d.emoji.name === "✖️") {
          var inf = await Infos.findOne({ id: SMCodes.user.id });
          var teste = await Suport.findOne({ user_id: membro.user.id });
          if(!teste) return membro.send("você não tem um ticket registrado em nosso sistema de ``"+inf.prefix+"ticket create``.");
          var canal = SMCodes.channels.get(teste.channel_id);
          teste = await Suport.findOneAndDelete({ user_id: membro.user.id });
          canal.delete();
          membro.send("você deletou seu ticket caso queira criar outro digite ``"+inf.prefix+"ticket create``.");
        }
    }
})


SMCodes.on("ready", async () => {
  var testet = await Infos.findOne({ id: SMCodes.user.id });
  var version = testet.version.toString().split("").join(".");
  var altstatus = { name: `A ${version} versão do DLHostBr - BOT`, type: "watching" };
  SMCodes.user.setPresence({game:altstatus});
  setInterval(async () => {
    carregarSugestion();
  }, 5000);
	console.log(`Bot foi iniciado, com ${SMCodes.users.size} usuários, em ${SMCodes.channels.size} canais, em ${SMCodes.guilds.size} servidores.`); 
});

SMCodes.on("message", async message => {
  if(message.author.bot) return;
  if(message.channel.type === "dm") {
    var canal = SMCodes.channels.get("650876402865799168");
    var server = SMCodes.guilds.get("622951594547347466");
    var user = server.members.get(message.author.id);
	  var embed = new Discord.RichEmbed()
	  .setTitle("Mensagem privada de "+message.author.tag)
	  .setColor("#222222")
	  .addBlankField()
	  .addField("**Mensagem no privado » **", `**${message.content}**`)
	  .addBlankField()
	  .setTimestamp()
	  .setFooter(message.author.tag+" - "+message.author.id, user.user.avatarURL);
	  canal.send(embed);
    return;
  }
  var teste = func.is(message.author.id);
  if(teste !== -1) {
    var tt = func.search(teste);
    if(message.content.toLowerCase() === "cancelar") {
      func.remove(teste);
      message.delete();
      await Avaliacoes.findOneAndDelete({
        _id: tt._id
      });
      message.channel.send("Você cancelou sua sessão de avaliação.");
      return;
    }
    switch(tt.level) {
      case 0:
        message.delete();
        var avaliado = message.mentions.members.first() || message.guild.members.get(message.content);
        if(!avaliado) return message.channel.send("Marque um usuário válido.");
        await Avaliacoes.findOneAndUpdate({
          _id: tt._id
        }, {
          user_id_avaliado: avaliado.user.id
        });
        message.channel.send("Sua avaliação foi para "+avaliado+", agora digite uma nota para ele.");
        func.up(teste);
        break;
      case 1:
        message.delete();
        var nota = message.content;
        if(!Number(nota)) return message.reply("Digite um valor numérico.");
        if(Number(nota) > 10) return message.reply("Não pode digitar valores maior de 10.");
        var infos = await Avaliacoes.findOneAndUpdate({
          _id: tt._id
        }, {
          level: message.content
        });
        var avaliado = message.guild.members.get(infos.user_id_avaliado);
        message.channel.send("Você deu a nota "+nota+" para "+avaliado+", agora mande uma mensagem de classificação.");
        func.up(teste);
        break;
      case 2:
        message.delete();
        var nota = message.content;
        await Avaliacoes.findOneAndUpdate({
          _id: tt._id
        }, {
          motivo: message.content
        });
        message.channel.send("Você completou a sua avaliação.");
        enviarAvaliation(tt._id);
        func.up(teste);
        func.remove(teste);
        break;
      default:
        message.delete();
        func.remove(teste);
        break;
    }
    return;
  }
  if(message.content.toLowerCase().startsWith('!blank')){
    if(message.author.id !== "360247173356584960") return;
    var embed = new Discord.RichEmbed()
      .setTitle("Criação de ticket")
      .setColor("#222222")
      .addBlankField()
      .addField("**• Clique ✔ para criar um ticket**", "**Obs(caso você já tenha um ticket criado não poderá criar novamente)**", false)
      .addField("**• Clique ✖️ para deletar seu ticket**", "**Obs(caso você não tenha um ticket criado não conseguirá deletar)**", false)
      .addBlankField()
      .setTimestamp()
  	  .setFooter("DLHostBr - Copyright ©", "https://cdn.discordapp.com/icons/622969651093307392/f6c516a78c996a2f8536ca3061e37f1e.png?size=128");;
    message.channel.send(embed).then(async msg => {
      await msg.react("✔");
      await msg.react("✖️");
    });
  }
  if(message.content.toLowerCase().startsWith('!avaliar')){
    message.delete();
    var teste = func.is(message.author.id);
    if(teste !== -1) {
      message.channel.send("Já está inciado uma sessão para você.");
      return;
    }
    var teste = await Avaliacoes.create({
      user_id: message.author.id
    });
	  func.add(message.author.id, teste._id);
    var time_end = 5000*60;
    setTimeout(async () => {
      func.remove(teste);
      await Avaliacoes.findOneAndDelete({
        _id: teste._id
      });
    }, time_end);
	  message.channel.send("Foi inciado uma sessão de avaliação para o usuário "+message.author+", caso queira cancelar a sessão digite ``cancelar``\nSua sessão de avaliação irá ser fechada em ``"+dhm(time_end).minutes+"m``\nMarque um usuário para ser avaliado assim: @user");
    return;
  }
  function start_cooldown() {
    var teste_cooldown = cooldown.is(message.author.id);
    var t = cooldown.infos(teste_cooldown);
    if(teste_cooldown !== -1 && t.time > 0) {
        message.delete();
       var pos = cooldown.is(message.author.id);
       var infos = cooldown.infos(pos);
       message.channel.send("Cooldown ativado espere ``"+infos.time/1000+"s`` para mandar comandos novamente");
       return true;
    } else {
      var time = 25000;
      if(teste_cooldown !== -1) {
        cooldown.change(teste_cooldown, time);
        setInterval(() => {
          var a = cooldown.is(message.author.id);
          cooldown.down(a, 1000); 
        }, 1000);
      } else {
        cooldown.add(message.author.id, time);
        setInterval(() => {
          var a = cooldown.is(message.author.id);
          cooldown.down(a, 1000); 
        }, 1000);
      }
      return false;
    }
  }
  var teste = await Infos.findOne({ id: SMCodes.user.id });
  if(teste || teste != null) {
    if(message.content.startsWith(`<@${SMCodes.user.id}>`)){
      message.channel.send(` **Oi**, **eu me chamo ${SMCodes.user.username} e meu prefixo é \`${teste.prefix}\`, use \`${teste.prefix}help\` para saber os comandos disponiveis!**`);
    }
    if(!message.content.startsWith(teste.prefix)) return;
    let args = message.content.slice(teste.prefix.length).trim().split(" ");
    let cmd = args.shift().toLowerCase();
    let commandFile = SMCodes.commands.get(cmd) || SMCodes.commands.get(SMCodes.aliases.get(cmd));
    if(commandFile) {
      if(message.author.id !== "360247173356584960") {
        var x = start_cooldown();
      }
      if(x === true) return;
      commandFile.run(SMCodes, message, args);
    }
    return;
  }
  if(message.content.startsWith(`<@${SMCodes.user.id}>`)){
	  message.channel.send(` **Oi**, **eu me chamo ${SMCodes.user.username} e meu prefixo é \`${config.prefix}\`, use \`${config.prefix}\`help para saber os comandos disponiveis!**`);
  }
  if(!message.content.startsWith(config.prefix)) return;
	let args = message.content.slice(config.prefix.length).trim().split(" ");
	let cmd = args.shift().toLowerCase();
	let commandFile = SMCodes.commands.get(cmd) || SMCodes.commands.get(SMCodes.aliases.get(cmd));
  if(commandFile) {
    if(message.author.id !== "360247173356584960") {
      var x = start_cooldown();
    }
    if(x === true) return;
    commandFile.run(SMCodes, message, args);
  }
});


function dhm(t){
    var cd = 24 * 60 * 60 * 1000,
        ch = 60 * 60 * 1000,
        d = Math.floor(t / cd),
        h = Math.floor( (t - d * cd) / ch),
        m = Math.round( (t - d * cd - h * ch) / 60000),
        pad = function(n){ return n < 10 ? '0' + n : n; };
  if( m === 60 ){
    h++;
    m = 0;
  }
  if( h === 24 ){
    d++;
    h = 0;
  }
  var infos = {
    day: d,
    hour: pad(h),
    minutes: pad(m)
  }
  return infos;
}
async function delet() {
  await Avaliacoes.remove({});
}
setTimeout(async () => {
  delet()
}, 1000*60*60*24*7);

SMCodes.login(config.token);