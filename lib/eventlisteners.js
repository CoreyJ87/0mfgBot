require('dotenv').config();
const functions = require('./functions.js');
const _ = require('lodash');
const fs = require('fs');
const guildId = process.env.GUILD_ID;
const raiderRoleId = process.env.RAIDER_ROLE_ID;
const botDiscordId = process.env.BOT_DISCORD_ID;
const publicChannelId = process.env.PUBLIC_CHANNEL_ID;
const chiefRoleId = process.env.CHIEF_ROLE_ID;
const superBARoleId = process.env.SUPER_BA_ROLE_ID;
const hellBARoleId = process.env.HELLA_BA_ROLE_ID;

var raidPass = "";


var self = module.exports = {
  eventListenersInit: async(client) {
    const guild = client.guilds.get(guildId);
    if (functions.isMasterProcess()) {
      client.on('message', msg => {
        const textSplit = _.split(msg.content, " ");
        if (authorId != botDiscordId && _.isEqual(textSplit[0],'!omfg')) {
          fs.readFile('./pass.txt', function(err, buf) {
            raidPass = buf.toString();
          });
          if (_.isEqual(textSplit[1], raidPass)) {
            var resp = await functions.setRole(msg,guild)
          } else if (_.isEqual(textSplit[1], "setpass") && !_.isEmpty(textSplit[2])) {
            var resp = await functions.setPass(client,msg,guild);
            } else {
              client.channels.get(msg.channel.id).send("Insufficient permissions!");
            }
          }
          // If we are requesting the current raid pass
          else if (_.isEqual(textSplit[1], "getpass")) {
           var resp = await functions.getPass(client,msg,guild);
          }
          // C
          else if (_.isEqual(textSplit[1], "getlink")) {
             var resp = await functions.getLink(client,msg,guild);
          }
        }
      })
      //New member join message
      client.on('guildMemberAdd', member => {
        member.send("Hi!. If you are here to join the raid. Please type the join key(EXAMPLE: `!omfg raidkey123`) given in Instance chat in #public-general. Then join the voice channel: wow-raid");
      })
    }
  }
}
