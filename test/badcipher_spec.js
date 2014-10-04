var chai      = require('chai');
var expect    = chai.expect;
var BadCipher = require('../index');

describe('BadCipher', function() {
  describe('#encrypt', function() {
    it('accepts string data', function() {
      var result = BadCipher.encrypt('foobar', '12345');

      expect(result)
        .to.equal('DC5vCavEYg0Qchh594Xe/A==');
    });

    it('accepts an object', function() {
      var result = BadCipher.encrypt({test: 'foobar'}, '12345');

      expect(result)
        .to.equal('VS4rCbDEaA0Bcg15p4XG/AQmcxUyXY/gBmTTsumb+dtxDA==');
    });
  });

  describe('#decrypt', function() {
    it('returns an object from an encrypted/interleaved/base64 string', function() {
      var result = BadCipher.decrypt('VS4rCbDEaA0Bcg15p4XG/AQmcxUyXY/gBmTTsumb+dtxDA==');
      result = JSON.parse(result);

      expect(result)
        .to.have.property('test')
        .and.equal('foobar');
    });
  });
});
