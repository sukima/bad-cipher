// BadCipher - A really bad cipher for obscurity not security
// jshint eqnull:true
require('buffer');
var crypto = require('crypto');
var xor    = require('bitwise-xor');

function BadCipher(data, key) {
  if (data instanceof BadCipher) return data;

  this.data = !Buffer.isBuffer(data) ?
    new Buffer(data, 'utf8') :
    data;

  if (key != null && !Buffer.isBuffer(key)) {
    this.key = new Buffer(key, 'binary');
  } else {
    this.key = key;
  }
}

BadCipher.prototype.bind = function(fn) {
  var result = fn(this.data, this.key);

  return result != null ?
    new BadCipher(result, this.key) :
    this;
};

BadCipher.prototype.toString = function(encoding) {
  return this.data.toString(encoding);
};

BadCipher.prototype.xor = function() {
  return this.bind(function(data, key) {
    return xor(data, key);
  });
};

BadCipher.prototype.interleave = function() {
  return this.bind(function(data, key) {
    var i, len, newData = [];

    for (i = 0, len = data.length; i < len; i++) {
      newData.push(data[i]);
      newData.push(key[i]);
    }

    return new Buffer(newData);
  });
};

BadCipher.prototype.deinterleave = function() {
  return this.bind(function(data, key) {
    var i, len, newKey = [], newData = [];

    for (i = 0, len = data.length; i < len; i += 2) {
      newData.push(data[i]);
      newKey.push(data[i + 1]);
    }

    return new BadCipher(new Buffer(newData, 'binary'), new Buffer(newKey, 'binary'));
  });
};

BadCipher.encrypt = function(data, password) {
  var itemsBuf = new Buffer(JSON.stringify(data), 'utf8');
  var keyBuf   = crypto.pbkdf2Sync(password, '', 500, itemsBuf.length);
  return new BadCipher(itemsBuf, keyBuf)
    .xor()
    .interleave()
    .toString('base64');
};

BadCipher.decrypt = function(data) {
  var dataBuf = new Buffer(data, 'base64');
  return new BadCipher(dataBuf)
    .deinterleave()
    .xor()
    .toString('utf8');
};

module.exports = BadCipher;
/* vim:set ts=2 sw=2 et fdm=marker: */
