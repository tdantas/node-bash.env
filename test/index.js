var assert = require('chai').assert;
var path = require('path');

var env = require('../');

function file(name) {
  return path.resolve(__dirname, name);
}

describe('.env', function() {
  var loadTo = {};

  beforeEach(function(){
    loadTo = { };
  });

  it('throw when do not find the file', function(){
    assert.throws(function() {
      env.load({ path: 'not.exist' });
    }, /ENOENT/);
  });

  it('load default .env file', function() {
    env.load({ loadTo: loadTo, path: file('.env') });
    assert.equal(loadTo.NODE_TEST, 'test');
    assert.equal(loadTo.DB_URL, 'mongo://localhost:27017');
    assert.equal(loadTo.API_SECRET, '123131232');
  });

  it('loads .custom.env file', function() {
    env.load({ path: file('.custom.env'), loadTo: loadTo });
    assert.equal(loadTo['CUSTOM-VAR'], 'custom value');
  });

  it('override environment variable', function() {
    loadTo.OVERRIDE = 1;
    env.load({ loadTo: loadTo, path: file('.override.env') , override: true});
    assert.equal(loadTo.OVERRIDE, '2');
  });

  it('do not override environment variable [default behavior]', function() {
    loadTo.OVERRIDE = 1;
    env.load({ loadTo: loadTo, path: file('.no.override.env') });
    assert.equal(loadTo.OVERRIDE, 1);
  });

  it('default to process.env', function() {
    env.load({ path: file('.env')});
    assert.equal(process.env.NODE_TEST, 'test');
    assert.equal(process.env.DB_URL, 'mongo://localhost:27017');
    assert.equal(process.env.API_SECRET, '123131232');
  });

  it('loads without bash export keyword', function() {
    env.load({ loadTo: loadTo, path: file('.no.export.env')});
    assert.equal(loadTo.NODE_TEST, 'test');
    assert.equal(loadTo.DB_URL, 'mongo://localhost:27017');
    assert.equal(loadTo.API_SECRET, '123131232');
    assert.equal(loadTo.NAME, '.env');
  });

  it('as syntatic sugar accept file path', function() {
    env.load(file('.sugar.env'));
    assert.equal(process.env.NODE_SUGAR, 'sugar');
  });

  it('do not ignore flag environment variable', function() {
    env.load(file('.flag.env'));
    assert.isDefined(process.env.VERBOSE);
  });

  it('ignores comment', function(){
    env.load({ path: file('.comments.env'), loadTo: loadTo });
    assert.isUndefined(loadTo.IGNORE);
    assert.equal(loadTo.COMMENT, 'true');
  });

  it('reuse defined variable', function(){
    env.load({ path: file('.reuse.variable.env'), loadTo: loadTo });
    assert.equal(loadTo.AGE, 10);
    assert.equal(loadTo.MY_AGE, 10);
    assert.equal(loadTo.OUR_AGE, 10);
  });

  it('logs to function', function(){
    var output = [];
    function log(msg) {
      output.push(msg);
    }

    env.load({ path: file('.env'), loadTo: loadTo, log: log });
    assert.equal(output.length, 3);
  });
});
