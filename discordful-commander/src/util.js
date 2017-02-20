var _ = require('lodash');

var IUser = require('./MessageInterfaces/User');
var INumber = require('./MessageInterfaces/Number');
var IString = require('./MessageInterfaces/String');
var IBoolean = require('./MessageInterfaces/Boolean');

function findType(value, options) {
  value = value.replace(/"/g, '');
  var rvalue = value.trim().toLowerCase().replace(/"/g, '');

  switch(rvalue) {
    case 'true':
      return new IBoolean(value, true, options);
    case 'false':
      return new IBoolean(value, false, options);
  }

  if ( !isNaN(Number(rvalue)) ) return new INumber(value, options);

  if ( IUser.test(rvalue) ) return new IUser(value, true, options);

  return new IString(value, options);
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
