const Discord = require("discord.js");

module.exports = (client, message) => {
  if (message.author.bot) return;

  const settings = (message.settings = client.getSettings(message.guild.id));

  if (settings.chatlogsChannel !== "off") {
    const channel = message.guild.channels.cache.find(
      channel => channel.name === settings.chatlogsChannel
    )
    
    var msg = message.content;
  
  if(!message.member) {
    return;
  }
  
  if(msg.length + message.member.user.username.length + message.member.user.id.length + message.channel.name.length + 2 > 2048) {
    return;
  }
  
    if (channel) {
      let embed = new Discord.MessageEmbed();
      embed.setColor("RANDOM");
      embed.setAuthor("Сообщение удалено!", message.member.user.avatarURL({dynamic: true}));
      if (msg == "") {
        msg = "[ИЗОБРАЖЕНИЕ]"
      } else {
        msg = `\`${msg}\``
      }// image-only; maybe we can add image logging too but depends privacy (if someone sends like personal stuff accidentally)
      embed.setDescription(`Удалил: ${message.member}\nВ канале: ${message.channel}\nСообщение: ${msg}`)
      try {
        channel.send({ embed });
      } catch (err) {
        // probably no permissions to send messages/embeds there
      };
    };
  };
};
