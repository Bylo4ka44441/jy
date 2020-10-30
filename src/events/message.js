const cooldown = new Set();
module.exports = async (client, message) => {
  if (message.author.bot) return;
  if (typeof(message.content) === 'string') message.content = message.content.replace(/\u8203/g,'').replace(/\uB200/g,'').replace("\\uB200",''); // Remove zero-width characters

  var settings;

  if(message.guild) {
    settings = message.settings = client.getSettings(message.guild.id) || client.defaultSettings;
  } else {
    settings= client.config.defaultSettings;
  }

  var prefix = settings.prefix;

  if(client.devmode == true) {
    prefix = settings.devprefix;
  }

  let blacklisted = false;

  if(message.guild) {

    perms = message.channel.permissionsFor(client.user);

    var modRole = message.guild.roles.cache.get(settings.modRole);
    var adminRole = message.guild.roles.cache.get(settings.adminRole);
    var autorole = message.guild.roles.cache.get(settings.autorole);
    var welcomeChannel = message.guild.channels.cache.get(settings.welcomeChannel);

    if(!welcomeChannel && settings.welcomeChannel != "off" || !adminRole && settings.adminRole != "Не установлено." || !modRole && settings.modRole != "Не установлено." || !autorole && settings.autorole != "off") { 

      var adminReset = false;
      var modReset = false;
      var mutedReset = false;
      var autoReset = false;
      var welcomeReset = false;

      if(!adminRole && settings.adminRole != "Не установлено.") {
        var role = message.guild.roles.cache.find(r => r.name === settings.adminRole);
        if(!role) {
          adminReset = true;
          client.settings.set(message.guild.id, client.config.defaultSettings.adminRole, "adminRole");
        } else {
          client.settings.set(message.guild.id, role.id, "adminRole");
        };
      };
    
      if(!modRole && settings.modRole != "Не установлено.") {
        var role = message.guild.roles.cache.find(r => r.name === settings.modRole);
        if(!role) {
          modReset = true;
          client.settings.set(message.guild.id, client.config.defaultSettings.modRole, "modRole");
        } else {
          client.settings.set(message.guild.id, role.id, "modRole");
        };
      };

      if(!autorole && settings.autorole != "off") {
        var role = message.guild.roles.cache.find(r => r.name === settings.autorole);
        if(!role) {
          autoReset = true;
          client.settings.set(message.guild.id, client.config.defaultSettings.autorole, "autorole");
        } else {
          client.settings.set(message.guild.id, role.id, "autorole");
        };
      };

      if(!welcomeChannel && settings.welcomeChannel != "off") {
        var channel = message.guild.channels.cache.find(c => c.name === settings.welcomeChannel);
        if(!channel) {
          welcomeReset = true;
          client.settings.set(message.guild.id, client.config.defaultSettings.welcomeChannel, "welcomeChannel");
        } else {
          client.settings.set(message.guild.id, channel.id, "welcomeChannel");
        };
      };

      var errors = "";
      if(adminReset == true) {
        adminReset = false;
        errors += ", `admin role`";
      };

      if(modReset == true) {
        modReset = false;
        errors += ", `mod role`";
      };

      if(autoReset == true) {
        autoReset = false;
        errors += ", `autorole`";
      };

      if(welcomeReset == true) {
        welcomeReset = false;;
        errors += ", `join/leave channel`";
      };

      if(errors.length > 1) {
        var errors = errors.substr(2);
        message.channel.send(`<:error:466995152976871434> A role or channel was deleted, and the following settings have been restored to their default values: ${errors}`);
      };
    };

    if (!message.member) {
      await message.guild.members.fetch(message.author);
    };

    if(message.settings.blacklisted != "ARRAY" && settings.blacklisted.length > 0) {
      settings.blacklisted.forEach(function(ID) {
        if(ID == message.author.id) {
          blacklisted = true;
        }
      });
    };
  };
  
  //const prefixMention = new RegExp(`^<@!?${client.user.id}>( |)$`);
  const myMention = `<@&${client.user.id}>`;
  const myMention2 = `<@!${client.user.id}>`;
  
  if (message.content.startsWith(myMention) || message.content.startsWith(myMention2)) {
    if(message.content.length > myMention.length + 1 && (message.content.substr(0, myMention.length + 1) == myMention + ' ' || message.content.substr(0, myMention2.length + 1) == myMention2 + ' ')) {
      prefix = message.content.substr(0, myMention.length) + ' ';
    } else {
      return message.channel.send(`Префикс: \`${prefix}\``);
    };
  };

  if (message.content.indexOf(prefix) !== 0) return;

  const args = message.content.slice(prefix.length).trim().split(/ +/g);
  const command = args.shift().toLowerCase();
  const cmd = client.commands.get(command) || client.commands.get(client.aliases.get(command));

  if (!cmd) return;

  if (cooldown.has(message.author.id)) {
    return message.channel.send(
      `Подождите 2 секунды!`
    ).then(msg => {
      msg.delete({timeout: 2000});
    });
  };

  if (message.guild && !perms.has('SEND_MESSAGES')) {
    return message.author.send(`<:error:466995152976871434> I don't have permission to speak in **#${message.channel.name}**, Please ask a moderator to give me the send messages permission!`);
  };

  if (!cmd.conf.enabled) {
    return message.channel.send('<:error:466995152976871434> This command has been disabled by my developers.')
  }

  if(message.guild && blacklisted == true) {
    try {
      return message.author.send(
        `<:denied:466995195150336020> You have been blocked from using commands in \`${message.guild.name}\``
      );
    } catch(err) {
      client.logger.log(err, "error")
    };
  };

  if (cmd && !message.guild && cmd.conf.guildOnly)
    return message.channel.send("<:denied:466995195150336020> This command is unavailable in DM's. Try running it in a server I'm in!");

  if (message.guild) {
    var missing = cmd.conf.requiredPerms.filter(p => !perms.has(p))
    if(missing.length > 0) {
      missing = "`" + (missing.join("`, `")) + "`";
      return message.channel.send(`<:error:466995152976871434> Missing permissions: ${missing}`)
    };
  };
  
  const level = client.permlevel(message);

  if(cmd.conf.permLevel == "Developer") {
    var isDeveloper;
    if(message.client.config.owners.includes(message.author.id)) {
      isDeveloper = true;
    }
    if(isDeveloper != true) {
      return message.channel.send("Вы не разработчик бота!")
    }
  }

  if (level < client.levelCache[cmd.conf.permLevel]) {
    var usrlvl = client.levelCache[cmd.conf.permLevel];
    if (usrlvl === 1) var displevel = "Moderator";
    if (usrlvl === 2) var displevel = "Administrator";
    if (usrlvl === 3) var displevel = "Server Owner";

  if (!modRole && usrlvl < 2 && cmd.conf.permLevel == "Moderator" && message.guild) {
    return message.channel.send("Роль модератора не установлена! Установите её при помощи команды `" + message.settings.prefix + "settings modrole <роль> либо попросите у администратора установить её`")
  }

  if (!adminRole && usrlvl < 3 && cmd.conf.permLevel == "Administrator" && message.guild) {
    return message.channel.send("Роль администратора не установлена! Установите её при помощи команды `" + message.settings.prefix + "settings adminrole <роль>` либо попросите у администратора установить её")
  }

    var englesh = "a";
    if (displevel === "Administrator") englesh = "an";
    if (displevel === "Server Owner") englesh = "the";
    return message.channel.send(`<:denied:466995195150336020> You need to be ${englesh} ${displevel} to run this command!`);
  }

  message.author.permLevel = level;
  
  message.flags = [];
  while (args[0] && args[0][0] === "-") {
    message.flags.push(args.shift().slice(1));
  };
  
  cooldown.add(message.author.id);

  setTimeout(() => {
    cooldown.delete(message.author.id);
  }, 2000);

  client.logger.cmd(`${client.config.permLevels.find(l => l.level === level).name} ran command ${cmd.help.name}`);
  
  cmd.run(client, message, args, level);
};
