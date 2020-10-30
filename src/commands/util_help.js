const Discord = require('discord.js')
exports.run = (client, message, args, level) => {
  let embed = new Discord.MessageEmbed();
  embed.setColor(client.embedColour(message));

  var ran = false;
  var output = "";
  var commands = 0;
  var prefix;
  var currentCategory;

  if(message.guild) {
    prefix = message.settings.prefix;
  } else {
    prefix = client.config.defaultSettings.prefix;
  };

  if(!args[0]) {
    embed.setTitle(`Помощь`);
	embed.setColor('RANDOM')
    embed.setDescription(`
Я каманда`);
    embed.setFooter("help")
    message.channel.send(embed)
  }

  if(args[0]) {
    let command = args.shift().toLowerCase();
    let cmd = client.commands.get(command) || client.commands.get(client.aliases.get(command));
    
    if(!client.commands.has(command)) {
      return message.channel.send("Команда не найдена!")
    };

    command = client.commands.get(command);

    var requiredPerms = "";

    if(cmd.conf.requiredPerms.length > 0 ) {
      requiredPerms = "`" + cmd.conf.requiredPerms.join("`, `") + "`";
    } else {
      requiredPerms = "None";
    };

    var aliases = "";

    if(cmd.conf.aliases.length > 0 ) {
      aliases = "`" + cmd.conf.aliases.join("`, `") + "`";
    } else {
      aliases = "None";
    };

    

    embed.setTitle(prefix + command.help.name);
    embed.setDescription(
      `Описание: ${command.help.description}\nИспользование: ${prefix + command.help.usage}\nПрава: ${requiredPerms}`
      );
    embed.setFooter("Help");
    
    message.channel.send(embed);

    return;
  }
};

exports.conf = {
  enabled: true,
  guildOnly: true,
  aliases: [],
  permLevel: "User",
  requiredPerms: ["EMBED_LINKS"]
};

exports.help = {
  name: "help",
  category: "Утилиты",
  description: "Показывает все команды.",
  usage: "help <команда>"
};