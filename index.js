var Discordful = require('discordful');
var Commander = require('discordful-commander');
var glob = require('glob');
var requireUncached = require('require-uncached');


var debug = require('debug')('bot');
var debugMSG = require('debug')('bot-msg');

var bot = new Discordful({autoReconnect: true, throw: true});
bot.connect({token: require('./auth.js')});

var cmder = new Commander(bot, {
  prefix: 'k/'
});

cmder.reload = function() {
  cmder.commands = [];
  cmder.prompts = [];

  glob('./commands/**/*.js', {}, function(err, files) {
    if (err) throw err;
    files.forEach((file) => {
      debug('Loading command file: ' + file);
      requireUncached(file)(cmder);
    });
  });
};
cmder.reload();

bot.event('MESSAGE_CREATE')
  .use(cmder.parse())
  .use(function(success, message) {
    if (!success) return message;
    debugMSG(`${message.author.username}#${message.author.discriminator} - ${message.resolveContent()}`);
  });
