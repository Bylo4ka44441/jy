module.exports = {
  canModifyQueue(member) {
    const { channel } = member.voice;
    const botChannel = member.guild.me.voice.channel;

    if (channel !== botChannel) {
      member.send("Зайдите в голосовой канал!").catch(console.error);
      return false;
    }

    return true;
  }
};
