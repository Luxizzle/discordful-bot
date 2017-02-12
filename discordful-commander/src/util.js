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

  if ( /<@!?\d+>/.test(value) ) return { type: 'user', value: new IUser(value, options)};


  return {type: 'string', value: value};

}

function seperate(content, options) {
  options = _.defaults(options || {}, {
    seperator: /(?:[^\s"]+|"[^"]*")+/g,
    split: false // use split instead of match
  });

  return options.split ? content.trim().split(options.seperator) : content.trim().match(options.seperator);
}

module.exports = {
  seperate: seperate,
  findType: findType
};
