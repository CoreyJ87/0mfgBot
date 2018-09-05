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
fs.readFile('./pass.txt', function(err, buf) {
  console.log(buf.toString());
  raidPass = buf.toString();
});

var self = module.exports = {
  eventListenersInit: function(client) {
    const guild = client.guilds.get(guildId);
    if (functions.isMasterProcess()) {
      client.on('message', msg => {
        const textSplit = _.split(msg.content, " ")
        const authorId = msg.author.id;
        const member = guild.members.get(authorId);
        //Make sure we're talking to this portion of the bot

        if (authorId != botDiscordId && _.isEqual(textSplit[0], "!wr")) {
          //If they are needing the role added
          if (_.isEqual(textSplit[1].toString(), raidPass)) {
            member.addRole(raiderRoleId).then(function(resp) {
              client.channels.get(msg.channel.id).send("@" + msg.author.nickname + ". I have added the role. You may now join the voice channel.");
              msg.delete(500)
                .then(msg => console.log(`Deleted !resend from ${msg.author.username}`))
                .catch(function(err) {
                  console.log(err)
                });
            }).catch(function(err) {
              console.log(err);
            })
            //If we are setting the new raid pass
          } else if (_.isEqual(textSplit[1], "setpass") && !_.isEmpty(textSplit[2])) {
            if (member.roles.has(chiefRoleId) || member.roles.has(superBARoleId) || member.roles.has(hellBARoleId)) {
              fs.writeFile('./pass.txt', textSplit[2], {
                encoding: 'utf8',
                flag: 'w'
              });
              msg.delete(500)
                .then(msg => console.log(`Deleted !resend from ${msg.author.username}`))
                .catch(function(err) {
                  console.log(err)
                });
              client.channels.get(msg.channel.id).send("Raid Pass updated to: " + textSplit[2]);
            } else {
              client.channels.get(msg.channel.id).send("Insufficient permissions!");
            }
          }
        }
      })
      //New member join message
      client.on('guildMemberAdd', member => {
        client.channels.get(publicChannelId).send("Hi!. If you are here to join the raid. Please type the join key given in Instance chat in #public-general. EXAMPLE: `!wr <KEY>` Then join the voice channel: wow-raid");
      })
    }
  }
}