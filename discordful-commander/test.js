import test from 'ava';

var util = require('./src/util');

var sep = util.seperate;
var ft = util.findType;

test('util:seperate', t => {
  t.deepEqual(sep(`blab`), ["blab"]);
  t.deepEqual(sep(`blab bloob`), ["blab", "bloob"]);
  t.deepEqual(sep(`blab "bloob"`), ["blab", "\"bloob\""]);
  t.deepEqual(sep(`"blab bloob"`), ["\"blab bloob\""]);
});

test('util:findType', t => {
  t.deepEqual(ft('true'), {type: 'boolean', value: true});
  t.deepEqual(ft('bla'), {type: 'string', value: 'bla'});
});

