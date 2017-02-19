var sid = require('shortid');
var _ = require('lodash');

var CommandPrompt = require('./CommandPrompt');

class Command {
  constructor(trigger, uOptions, dOptions) {
    this.uOptions = _.defaults(uOptions || {}, {
      params: '',
      desc: ''
    });

    this.id = sid();

    this.dOptions = dOptions;
    this.self = dOptions.self;

    this.callStack = [];

    this.prompts = {};
  }

  callback(fn, returnId = true) {
    var fnId = sid();
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

  run() {

  }
}

module.exports = Command;

