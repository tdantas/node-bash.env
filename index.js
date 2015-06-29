var fs = require('fs');
var xtend = require('xtend');

var defaults = {
  path: '.env',
  loadTo: process.env,
  override: false
};

module.exports.load = load;

function load(opts) {
  if (typeof opts === 'string') {
    opts = { path: opts };
  }

  opts = xtend(defaults, opts);

  var file = fs.readFileSync(opts.path, { encoding: 'utf8' });
  lines(file).forEach(onLine);

  function onLine(line) {
    var pattern = /^\s*(?:export)?\s*([^=]*)(?:\s*=\s*(.*))?\s*$/i;
    var match = line.match(pattern);
    if (match) {
      assign(opts.loadTo, opts.override, match[1], match[2]);
    }
  }

  function assign(obj, override, name, value) {
    value = removeQuote(trim(value));

    var exists = obj[name];
    if (exists && !override) {
      return;
    }

    var isVariable = value.match(/\$(.*)\s*$/i);
    if (isVariable) {
      value = obj[isVariable[1]] || '';
    }

    obj[trim(name)] = trim(value);
  }

  function trim(value) {
    return (value || '').trim();
  }

  function removeQuote(value) {
    return value.replace(/(^['"]|['"]$)/g, '').trim();
  }

  function lines(content) {
    return content.split('\n');
  }
}
