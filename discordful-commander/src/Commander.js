var low = require('lowdb');
var _ = require('lodash');

var Message = require('./Message');
var util = require('./util');

/*
 * The Commander class
 * @class
 * @param {Discordful} discordful - The Discordful object
 * @param {Object} options - The options object
 * @param {String} options.db - A path to a json file as database
 * @param {String, Regexp} options.prefix - The prefix for your commands
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

    this.db = this.options.db = low(options.db);
  }

  parse() {
    return this.parseRaw;
  }

  parseRaw(message) {
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




    return message; // Return the original message for any plugins after this
  }
}

module.exports = Commander;
