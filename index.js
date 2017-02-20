var Discordful = require('discordful');
var Commander = require('./discordful-commander');

var stringifyObject = require('stringify-object');

var debug = require('debug')('bot');
var debugMSG = require('debug')('bot-msg');

var bot = new Discordful({autoReconnect: true, throw: true});
bot.connect({token: require('./auth.js')});

var cmder = new Commander(bot, {
  prefix: 'k/'
});


bot.event('GATEWAY_READY')
  .use(function() {
    bot.discordie.Users.fetchMembers()
      .then(() => debug("Fetched all members"))
      .catch((err) => {throw err;});
  });

cmder.command('ping', {
  desc: 'Check if the bot is active'
}, function(msg) {
  this.reply('Pong!');
});

cmder.command('test', {
  desc: 'Test the message parsing ya'
}, function(msg) {
  var m = '```';
  msg.args.slice(1).forEach((v) => {
    m += `${v.raw} - ${v.type}\n`;
  });
  m += '```';
  this.reply(m);
});

cmder.command('servers', {}, function() {
  this.reply('```json\n'+stringifyObject(this.client.Guilds.map(v => { return {
    name: v.name,
    id: v.id,
    members: v.members.length
  }; }), {
    indent: ' '
  })+'\n```');
});

bot.event('MESSAGE_CREATE')
  .use(function(e) { return e.message; })
  .use(cmder.parse())
  .use(function(success, message) {
    if (!success) return message;
    debugMSG(`${message.author.username}#${message.author.discriminator} - ${message.resolveContent()}`);
  });
