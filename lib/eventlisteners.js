require('dotenv').config();
const functions = require('./functions.js');
const guildId = process.env.GUILD_ID;
const raiderRoleId = process.env.RAIDER_ROLE_ID;
const guildId = process.env.GUILD_ID;

var self = module.exports = {
  eventListenersInit: function(client) {
    var guild = client.guilds.get(guildId);
    if (functions.isMasterProcess()) {
      client.on('message', msg => {
        if (msg.content == '!wowraid') {
          var member = guild.members.get(msg.author.id);
          member.addRole(raiderRoleId).then(function(resp) {
            msg.author.send("Role added. Please join the voice channel.");
            msg.delete(2000)
              .then(msg => console.log(`Deleted !resend from ${msg.author.username}`))
              .catch(function(err) {
                console.log(err)
              });
          }).catch(function(err) {
            console.log(err);
          })

        }
      })
      client.on('guildMemberAdd', member => {
        member.send("Hi!. If you are joining to raid. Please type !wowraid in #public-general. Then join the voice channel: wow-raid");
      })
    }
  }
}