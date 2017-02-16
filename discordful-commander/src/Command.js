var genId = require('./util').genId;
var _ = require('lodash');

class Command {
  constructor(trigger, uOptions, dOptions, replyId) {
    this.uOptions = _.defaults(uOptions || {}, {
      params: '',
      desc: '',
      ignorePrefix: false,
      customPrefix: false
    });
    this.replyId = replyId;
    this.id = genId();

    this.dOptions = dOptions;
    this.self = dOptions.self;

    this.callStack = [];
  }

  reply(trigger, options) {
    return this.self.reply(this.id, trigger, options);
  }

  callback(fn, returnId = true) {
    var fnId = genId();
    this.callStack.push({
      fn: fn,
      id: fnId
    });

    return returnId ? fnId : fn;
  }

  removeCallback(id, isFn = false) {
    this.callStack = this.callStack.filter((fn) => {
      if (isFn) return fn.fn !== id;

      return fn.id !== id;
    });
  }
}

module.exports = Command;
