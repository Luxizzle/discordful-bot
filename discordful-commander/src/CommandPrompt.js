var sid = require('shortid');
var _ = require('lodash');

var Sandbox = require('./CommandSandbox');

class CommandPrompt {
  constructor(question, options, callback = null) {
    var _this = this;
    this.options = _.defaults(options || {}, {
      type: 'input', // The type of question
      choices: [], // The choices
      mention: false, // If bot needs to be mentioned
      abort: ['x', 'abort', 'exit'] // the content to abort the prompt
    });

    this.id = sid();

    if ( callback ) {
      _this.callback(callback);
    }

    this.callStack = [];
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

  run(message) {
    var sb = new Sandbox(this, message);
    this.callStack.forEach((cb) => {
      cb.apply(sb, [message].concat(message.contentSplit.slice(1)));
    });
  }
}

module.exports = CommandPrompt;
