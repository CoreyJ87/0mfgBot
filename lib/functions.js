require('dotenv').config();
const _ = require('lodash')
const raiderRoleId = process.env.RAIDER_ROLE_ID;
const chiefRoleId = process.env.CHIEF_ROLE_ID;
const superBARoleId = process.env.SUPER_BA_ROLE_ID;
const hellBARoleId = process.env.HELLA_BA_ROLE_ID;


var self = module.exports = {
  isMasterProcess: function() {
    if (_.has(process.env, 'NODE APP INSTANCE')) {
      return _.get(process.env, 'NODE APP INSTANCE') === '0';
    } else if (_.has(process.env, 'NODE_APP_INSTANCE')) {
      return _.get(process.env, 'NODE_APP_INSTANCE') === '0';
    } else {
      return cluster.isMaster;
    }
  },

  setRole: async function(msg,guild){
    return new Promise(function(resolve, reject) {
    const authorId = msg.author.id;
    const member = guild.members.get(authorId);

    member.addRole(raiderRoleId).then(function(resp) {
      member.send("@" + msg.author.username + ". I have added the role. You may now join the voice channel.");
      msg.delete(500)
        .then(msg =>  {
          console.log(`Deleted !resend from ${msg.author.username}`)
          resolve()
      })
        .catch(function(err) {
          console.log(err)
          reject(err)
        });
    }).catch(function(err) {
      console.log(err);
      reject(err)
    })
  })
},

  setPass: async function(client,msg,guild) {
    return new Promise(function(resolve, reject) {
    const authorId = msg.author.id;
    const member = guild.members.get(authorId);
    const textSplit = _.split(msg.content, " ");

    if (member.roles.has(chiefRoleId) || member.roles.has(superBARoleId) || member.roles.has(hellBARoleId)) {
          console.log("Raid pass matched adding role to user: "+msg.author.username);
      fs.writeFile('./pass.txt', textSplit[2], {
        encoding: 'utf8',
        flag: 'w'
      });
      msg.delete(500)
        .then(msg => console.log(`Deleted !resend from ${msg.author.username}`))
        .catch(function(err) {
          console.log(err)
        });
      client.channels.get(msg.channel.id).send("Raid Pass updated to: `" + textSplit[2] + "`");
      resolve()
    }
    })
  },


  getPass: async function(client,msg,guild){
    const authorId = msg.author.id;
    const member = guild.members.get(authorId);
      return new Promise(function(resolve, reject) {
    if (member.roles.has(chiefRoleId) || member.roles.has(superBARoleId) || member.roles.has(hellBARoleId)) {
      fs.readFile('./pass.txt', function(err, buf) {
        raidPass = buf.toString();
      });
      msg.delete(500)
        .then(msg => console.log(`Deleted !resend from ${msg.author.username}`))
        .catch(function(err) {
          console.log(err)
        });

      client.channels.get(msg.channel.id).send("Raid Pass: `" + raidPass + "`");
    } else {
      client.channels.get(msg.channel.id).send("Insufficient permissions!");
    }
    resolve()
  })
  },

  getLink: async functuon(client,msg,guild){
    const authorId = msg.author.id;
    const member = guild.members.get(authorId);
      return new Promise(function(resolve, reject) {
    if (member.roles.has(chiefRoleId) || member.roles.has(superBARoleId) || member.roles.has(hellBARoleId)) {
      msg.delete(500)
        .then(msg => console.log(`Deleted !resend from ${msg.author.username}`))
        .catch(function(err) {
          console.log(err)
        });
      client.channels.get(msg.channel.id).send(`Please join our discord: https://discord.gg/hBqcPfU When you enter type "!wr ${raidPass}" in #general-public chat to be able to join the raid voice chat. Room is called wow-raid`);
    } else {
    member.send("Insufficient permissions!");
    }
      resolve()
  });
  },
}
