const config = {
  // ID's
  "owners": ['719635862744465528', '765525243132641322'], // Adding your ID here will give you access to dangerous commands like eval. Please be careful with who you add here! Eval can be used to modify the host machine.

    // Host options
    "devmodeEnabled": false, // true or false
    "loggingServer": "", // server ID, or blank to disable
    "startupLogs": "", // Channel ID, or blank to disable
    "consoleLogs": "", // Channel ID, or blank to disable

  // Tokens
  "token": "NzcxNzY3OTU2NDE3OTM3NDA4.X5w66w.0Y15DkzDmtlaI8OSRyXWxv0iaFE", // Your bot's token.
  "devtoken": "", // (optional) another token, meant for a bot used for development
  "dblkey": "", // (optional) top.gg key, sends bot statistics to top.gg. You do not need this.

  // Default per-server settings 
  "defaultSettings" : {
    "prefix": ".",
    "devprefix": ".",
    "modRole": "Не установлено.",
    "adminRole": "Не установлено.",
    "mutedRole": "Не установлено.",
    "autorole": "off",
    "welcomeChannel": "off",
    "welcomeMessage": "off",
    "chatlogsChannel": "off",
    "currency": "🎃",
    "blacklisted": "ARRAY",
    "botChannels": "ARRAY",
    "AFK": "ARRAY",
    "SAR": "ARRAY",
    "customCommands": "ARRAY",    
  },

  // Perm levels
  permLevels: [
    { level: 0,
      name: "User", 
      check: () => true
    },

    { level: 1,
      name: "Moderator",
      check: (message) => {
        try {
          if (message.member.roles.cache.has(message.settings.modRole)) return true;
        } catch (e) {
          return false;
        }
      }
    },

    { level: 2,
      name: "Administrator", 
      check: (message) => {
        try {
          if (message.member.roles.cache.has(message.settings.adminRole) || message.member.permissions.has("ADMINISTRATOR")) return true;
        } catch (e) {
          return false;
        }
      }
    },

    { level: 3,
      name: "Server Owner", 
      check: (message) => message.channel.type === "text" ? (message.guild.ownerID === message.author.id ? true : false) : false
    },
  ]
};

module.exports = config;
