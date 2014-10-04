// gulp-encrypt - A gulp plugin to encrypt a file using BadCipher
// jshint eqnull:true
var through     = require('through2');
var PluginError = require('gulp-util').PluginError;
var BadCipher   = require('./index');

function generateUUID() {
  var timestamp   = Date.now();
  var uuid        = '';
  var hexChars    = '0123456789abcdef';
  var uuidPattern = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx';
  var i, position;

  for (i = uuidPattern.length - 1; i >= 0; i -= 1) {
    position = uuidPattern[i];

    switch (position) {
      case 'x':
        uuid = hexChars.charAt(timestamp + Math.random() * 0xFF & 15) + uuid;
        break;
      case '-':
      case '4':
        uuid = position + uuid;
        break;
      default:
        uuid = hexChars.charAt(Math.random() * 4 + 8 | 0) + uuid;
    }

    timestamp >>= 2;
  }

  return uuid;
}

function encryptInfo(password) {
  if (password == null) password = generateUUID();

  return through.obj(function(file, enc, callback) {
    var data, edata;

    if (file.isStream()) {
      this.emit('error', new PluginError('gulp-encrypt', 'Streams not supported'));
    }

    if (file.isBuffer()) {
      try {
        data          = JSON.parse(file.contents.toString());
        edata         = BadCipher.encrypt(data, password);
        file.contents = new Buffer(JSON.stringify({edata: edata}));
        this.push(file);
      } catch (err) {
        this.emit('error', new PluginError('gulp-encrypt', err));
      }
    }

    callback();
  });
}

module.exports = encryptInfo;
/* vim:set ts=2 sw=2 et fdm=marker: */

