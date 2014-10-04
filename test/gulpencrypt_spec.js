var util    = require('util');
var stream  = require('stream');
var chai    = require('chai');
var expect  = chai.expect;
var gutil   = require('gulp-util');
var encrypt = require('../gulp-encrypt');

function TestStream(file) {
  stream.Readable.call(this, {objectMode: true});
  this.file = file;
}
util.inherits(TestStream, stream.Readable);
TestStream.prototype._read = function() {
  this.push(this.file);
  this.push(null);
};

describe('gulp-encrypt', function() {
  beforeEach(function() {
    this.file = new gutil.File({
      base:     __dirname,
      cwd:      __dirname,
      path:     __dirname + '/foobar.txt',
      contents: new Buffer('"foobar"', 'utf8')
    });
  });

  it('outputs a JSON string with an `edata` property', function(done) {
    var result;

    new TestStream(this.file)
      .pipe(encrypt('12345'))
      .on('error', done)
      .on('data', function(file) { result = file; })
      .on('end', function() {
        try {
          expect(JSON.parse(result.contents))
            .to.have.property('edata')
            .and.equal('DC5vCavEYg0Qchh594Xe/A==');
          done();
        } catch (err) {
          done(err);
        }
      });
  });
});
