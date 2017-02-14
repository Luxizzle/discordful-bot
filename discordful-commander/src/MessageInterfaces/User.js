var IBase = require('./Base');
var _ = require('lodash');

class IUser extends IBase {
  constructor(id, options, formatted = false) {
    var raw = id;
    if (formatted) {
      id = raw.match(/\d+/)[0];
    }
    super(raw);
    var _this = this;
    this.options = _.defaults(options || {}, {});

    if (options.discordful) {
      _this.discordful = options.discordful;


    }

    this.id = id;
  }

  mention(nick = false) {
    return '<@' + (nick ? '!' : '') + this.raw + '>';
  }
}

IUser.test = function(value) {
  return /<@!?\d+>/.test(value);
};

module.exports = IUser;
