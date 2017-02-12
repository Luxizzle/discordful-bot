var IBase = require('./Base');
var _ = require('lodash');

class IUser extends IBase {
  constructor(id, options) {
    super(id);
    this.options = _.defaults(options || {}, {});


    this.id = id;
  }

  mention(nick) {
    return '<@' + (nick ? '!' : '') + this.raw + '>';
  }
}

module.exports = IUser;
