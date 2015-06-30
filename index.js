var fs = require('fs');
var xtend = require('xtend');

var defaults = {
  path: '.env',
  loadTo: process.env,
  override: false,
  encoding: 'utf8',
  log: function() { }
};

module.exports.load = load;

function load(opts) {
  if (typeof opts === 'string') {
    opts = { path: opts };
  }

  opts = xtend(defaults, opts);
  var file = fs.readFileSync(opts.path, { encoding: opts.encoding });
  lines(file).forEach(onLine);

  function onLine(line) {
    var name;
    var value;
    var pattern = /^\s*(?:export)?\s*([\w\-]+)(?:\s*=\s*(.*))?\s*$/i;

    var match = line.match(pattern);
    if (match) {
      name = match[1];
      value = match[2];
      assign(opts.loadTo, opts.override, name, value);
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
      value = obj[isVariable[1]];
    }

    var n = trim(name);
    var v = trim(value);
    opts.log('[config.env] %s=%s', n, value);
    obj[n] = v;
  }
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
