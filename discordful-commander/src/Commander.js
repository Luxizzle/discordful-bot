var low = require('lowdb');
var _ = require('lodash');

var Message = require('./Message');

class Commander {
  constructor(discordful, options) {
    this.options = _.defaults(options || {}, {
      db: 'db.json',
      prefix: '_MENTION',
      selfbot: false,
      discordful: null
    });

    this.discordful = options.discordful;

    this.db = low(options.db);
  }

  parse() {
    return this.parseRaw;
  }

  parseRaw(message) {
    var msg = new Message(message, this.options);


  }
}

module.exports = Commander;
