var chrono = require('chrono-node');
var _ = require('lodash');

class Message {
  constructor(msg, options) {
    options = _.defaults(options || {}, {
      chrono: chrono // Allow custom chrono parsers
    });

    this.discordful = options.discordful;

    this.id = msg.id;
    this.author = msg.author;
    this.content = msg.content;
    this.attachments = msg.attachments;
    this.embeds = msg.embeds;
    this.reactions = msg.reactions;

    this.message = msg;

    this.date = options.chrono.parse;


  }

  get isWebhook() { return this.author.isWebhook; }
  get isBot() { return this.author.bot; }

  get isPrivate() { return this.message.isPrivate; }
  get isDm() { return this.isPrivate; }

  get displayUsername() { return this.message.displayUsername; }
}



module.exports = {
  Message: Message
};
