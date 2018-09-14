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
  eventListenersInit: function(client) {
    const guild = client.guilds.get(guildId);
    if (functions.isMasterProcess()) {
      client.on('message', msg => {

        const textSplit = _.split(msg.content, " ")
        const authorId = msg.author.id;
        const member = guild.members.get(authorId);
        //Make sure we're talking to this portion of the bot

        if (authorId != botDiscordId && _.isEqual(textSplit[0],'!wr')) {
          //If they are needing the role added
          fs.readFile('./pass.txt', function(err, buf) {
            raidPass = buf.toString();
          });
          if (_.isEqual(textSplit[1], raidPass)) {
            member.addRole(raiderRoleId).then(function(resp) {
              client.channels.get(msg.channel.id).send("@" + msg.author.username + ". I have added the role. You may now join the voice channel.");
              msg.delete(500)
                .then(msg => console.log(`Deleted !resend from ${msg.author.username}`))
                .catch(function(err) {
                  console.log(err)
                });
            }).catch(function(err) {
              console.log(err);
            })
            //If we are setting the new raid pass
          } else if (_.isEqual(textSplit[1], "setpass") && !_.isEmpty(textSplit[1])) {
            if (member.roles.has(chiefRoleId) || member.roles.has(superBARoleId) || member.roles.has(hellBARoleId)) {
              fs.writeFile('./pass.txt', textSplit[1], {
                encoding: 'utf8',
                flag: 'w'
              });
              msg.delete(500)
                .then(msg => console.log(`Deleted !resend from ${msg.author.username}`))
                .catch(function(err) {
                  console.log(err)
                });
              client.channels.get(msg.channel.id).send("Raid Pass updated to: `" + textSplit[1] + "`");
            } else {
              client.channels.get(msg.channel.id).send("Insufficient permissions!");
            }
          }
          // If we are requesting the current raid pass
          else if (_.isEqual(textSplit[1], "getpass")) {
            if (member.roles.has(chiefRoleId) || member.roles.has(superBARoleId) || member.roles.has(hellBARoleId)) {
              msg.delete(500)
                .then(msg => console.log(`Deleted !resend from ${msg.author.username}`))
                .catch(function(err) {
                  console.log(err)
                });
              client.channels.get(msg.channel.id).send("Raid Pass: `" + raidPass + "`");
            } else {
              client.channels.get(msg.channel.id).send("Insufficient permissions!");
            }
          }
          // C
          else if (_.isEqual(textSplit[1], "getlink")) {
            if (member.roles.has(chiefRoleId) || member.roles.has(superBARoleId) || member.roles.has(hellBARoleId)) {
              msg.delete(500)
                .then(msg => console.log(`Deleted !resend from ${msg.author.username}`))
                .catch(function(err) {
                  console.log(err)
                });
              client.channels.get(msg.channel.id).send(`Please join our discord: https://discord.gg/hBqcPfU When you enter type "!wr ${raidPass}" in #general-public chat to be able to join the raid voice chat. Room is called wow-raid`);
            } else {
              client.channels.get(msg.channel.id).send("Insufficient permissions!");
            }
          }
        }
      })
      //New member join message
      client.on('guildMemberAdd', member => {
        member.send("Hi!. If you are here to join the raid. Please type the join key(EXAMPLE: `!wr raidkey123`) given in Instance chat in #public-general. Then join the voice channel: wow-raid");
      })
    }
  }
}
