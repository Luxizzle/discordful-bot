var _ = require('lodash');

var IUser = require('./MessageInterfaces/User');

function findType(value, options) {
  value = value.trim().toLowerCase();

  switch(value) {
    case 'true':
      return {type: 'boolean', value: true};
    case 'false':
      return {type: 'boolean', value: false};
  }

  if ( !isNaN(Number(value)) ) return {type: 'number', value: new Number(value)};

  if ( IUser.test(value) ) return { type: 'user', value: new IUser(value, options, true)};

  return {type: 'string', value: value};
}

function seperate(content, options) {
  options = _.defaults(options || {}, {
    preParse: function(v) { return v; },
    postParse: function(args) {
      args.forEach((arg, i) => {
        args[i] = arg.match(/(?="?)[^"]*(?="?)/g)[0]; // converts "\"hi there\"" to "hi there"
      });
      return args;
    },
    seperator: /(?:[^\s"]+|"[^"]*")+/g,
    split: false // use split instead of match
  });

  var argsPre = options.preParse(content);
  var argsMid = options.split ? argsPre.trim().split(options.seperator) : argsPre.trim().match(options.seperator);
  var argsPost = options.postParse(argsMid); // this whole pre- post parse this is just to satisfy my insanity created with regex

  return argsPost;
}

module.exports = {
  seperate: seperate,
  findType: findType
};
