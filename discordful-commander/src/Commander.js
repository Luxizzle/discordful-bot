var low = require('lowdb');
var _ = require('lodash');

var Message = require('./Message');
var Command = require('./Command');
var util = require('./util');

/*
 * The Commander class
 * @class
 * @param {Discordful} discordful - The Discordful object
 * @param {Object} options - The options object
 * @param {String} options.db - A path to a json file as database
 * @param {String} options.prefix - The prefix for your commands
 * @param {String, Regexp} options.seperator - The seperator to seperate stuff
 * @param {Boolean} options.selfbot - IF true, bot only reacts to you
 * @param {Discordful} options
*/

class Commander {
  constructor(discordful, options) {
    this.options = _.defaults(options || {}, { // I could use Object.assign but i wanna be cool
      db: 'db.json',
      prefix: '/',
      selfbot: false
    });

    this.discordful = discordful || null;
    options.discordful = this.discordful;
    options.self = this;

    this.commands = [];

    this.db = low(options.db);
    this.db
      .defaults({
        users: []
      })
      .write();
  }

  parse() {
    return this.parseRaw;
  }

  // rewrite this because of the Command.options.ignorePrefix and -customPrefix things
  parseRaw(message) {
    var _this = this;

    /*
    var prefix = this.options.prefix;
    var content = message.content; // just get these for the ease of reading
    var contentSplit = util.seperate(content, this.options);
    if (contentSplit.length === 0) return message; // Shouldnt really happen, but just a check

    // First check for the prefix, its a waste of recources to already parse the message

    var isPrefix = false;
    if (typeof prefix === 'string') {
      isPrefix = contentSplit[0].startsWith(prefix);
    } else if (prefix instanceof RegExp) {
      isPrefix = prefix.test(contentSplit[0]);
    }
    if (!isPrefix) return message; // Message doesnt contain the prefix so just ignore it
    // Returns the original message so that it doesnt mess with any plugins after this

    // Create the modified content to not include the prefix
    contentSplit[0].replace(prefix, ''); // Replace the prefix with an empty string
    var msg = new Message(message, contentSplit, this.options); // Generate our message object
    */

    var authorId = message.author.id;
    var inDb = this.db
      .get('users')
      .find({ id: authorId })
      .isUndefined()
      .value();

    if (!inDb) {
      _this.db.get('users')
        .push({
          id: authorId
        })
        .write();
    }


    var content = message.content; // just get these for the ease of reading
    var contentSplit = util.seperate(content, this.options);
    if (contentSplit.length === 0) return message; // Shouldnt really happen, but just a check

    var msg = new Message(message, contentSplit, this.options);

    this._parseBasePrefix(msg);
    this._parseCustomPrefix(msg);
    this._parseNoPrefix(msg);

    return message; // Return the original message for any plugins after this
  }

  _parseBasePrefix(message) {
    var author = message.author;
    var content = message.content;

    var cmds = this.commands
      .filter((c) => !c.cmd.uOptions.ignorePrefix) // filter out the commands that do ignore
      .filter((c) => c.cmd.uOptions.customPrefix === false); // filter out with a custom prefix

    var prefix = this.options.prefix;

    if (!content.startsWith(prefix)) return; // content doesnt start with prefix, abort

    var replyId = this.db
      .get('users')
      .find({id: author.id})
      .get('replyId')
      .value();

    // reply
    if (replyId !== undefined) {
      var c = _.find(cmds, {replyId: replyId});
      if (c) {
        c.cmd.run(); // do whatever the run stuff does in the future
      }
    }

    // normal
    cmds = cmds.filter((c) => c.reply = false);
    cmds.forEach((c) => {

    });

  }

  _parseCustomPrefix(message) {
    var author = message.author;
    var content = message.content;
    // reply

    // normal

  }

  _parseNoPrefix(message) {
    var author = message.author;
    var content = message.content;
    // reply

    // normal

  }

  command(trigger, options) {
    var cmd = new Command(trigger, options, this.options);
    this.commands.push({
      cmd: cmd,
      id: cmd.id,
      reply: false
    });
  }

  reply(replyId, trigger, options) {
    var cmd = new Command(trigger, options, this.options, replyId);
    this.commands.push({
      command: cmd,
      id: cmd.id,
      replyId: replyId,
      reply: true
    });
  }
}

module.exports = Commander;
