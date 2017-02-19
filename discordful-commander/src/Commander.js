var low = require('lowdb');
var _ = require('lodash');

var Message = require('./Message');
var Command = require('./Command');
var CommandPrompt = require('./CommandPrompt');
var util = require('./util');

/*
 * The Commander class
 * @class
 * @param {Discordful} discordful - The Discordful object
 * @param {Object} options - The options object
 * @param {String} options.db - A path to a json file as database
 * @param {String, RegExp} options.prefix - The prefix for your commands
 * @param {String, Regexp} options.seperator - The seperator to seperate stuff
 * @param {Boolean} options.selfbot - IF true, bot only reacts to you
 * @param {Discordful} options
*/

class Commander {
  constructor(discordful, options) {
    this.options = _.defaults(options || {}, { // I could use Object.assign but i wanna be cool
      db: 'db.json',
      prefix: '/',
      selfbot: false,
      promptMention: false
    });

    this.discordful = discordful || null;
    options.discordful = this.discordful;
    options.self = this;

    this.commands = [];
    this.prompts = [];

    this.db = low(options.db);
    this.db
      .defaults({
        users: []
      })
      .write();
  }

  registerUser(user) {
    var _this = this;
    var id = user.id;

    var inDb = this.db
      .get('users')
      .find({ id: id })
      .isUndefined()
      .value();

    if (!inDb) {
      _this.db.get('users')
        .push({
          id: id
        })
        .write();
    }
  }

  parse() {
    return this.parseRaw;
  }

  // rewrite this because of the Command.options.ignorePrefix and -customPrefix things
  parseRaw(message) {
    //var _this = this;

    this.registerUser(message.author); // Register the user in the database

    if (this.checkPrompt(message)) return message;

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

    // NOTE:
    // replies are out of the window and will now
    // try something close to Inquirer.js's prompt feature

    /*

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

    */

    return message; // Return the original message for any plugins after this
  }

  checkPrompt(message) {
    var user = message.author;
    var promptId = this.db
      .get('users')
      .find({ id: user.id })
      .get('prompt');

    if ( !promptId ) return false;

    var content = message.content; // just get these for the ease of reading
    var contentSplit = util.seperate(content, this.options);
    if (contentSplit.length === 0) return message; // Shouldnt really happen, but just a check
    var msg = new Message(message, contentSplit, this.options);


  }

  command(trigger, options) {
    var cmd = new Command(trigger, options, this.options);
    this.commands.push({
      cmd: cmd,
      id: cmd.id,
    });
    return cmd;
  }

  _prompt(question, options, callback) {
    var pmt = new CommandPrompt(question, options, callback);
    this.prompts.push({
      prompt: pmt,
      id: pmt.id
    });
    return pmt;
  }
}

module.exports = Commander;
