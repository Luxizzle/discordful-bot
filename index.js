var Discordful = require('discordful');
var Commander = require('./discordful-commander');

var cmder = new Commander();

var debug = require('debug')('bot');

var bot = new Discordful({});
bot.connect({token: require('./auth.js')});

bot.event('GATEWAY_READY')
  .use(function() {
    bot.discordie.Users.fetchMembers()
      .then(() => debug("Fetched all members"))
      .catch((err) => {throw err;});
  });


bot.event('MESSAGE_CREATE')
  .use(cmder.parse());
