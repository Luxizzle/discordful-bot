var Discordful = require('discordful');
var Commander = require('./discordful-commander');

var bot = new Discordful({});
bot.connect({token: require('./auth.js')});
