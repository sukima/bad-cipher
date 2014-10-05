# Really Bad Cipher [![Build Status](https://travis-ci.org/sukima/bad-cipher.svg)](https://travis-ci.org/sukima/bad-cipher)

Just as the name suggests, this is a **really bad** cipher. It is XOR'ing to a
random key. The *key* is then interlaced into the output.

Yes you read that correctly the key is **embedded** in the output!

So it goes without saying: do not use this for any security!

## Crypto

Here is the algorithm I used to encrypt; and in reverse to decrypt:

1. Read the content info from a JSON file
2. Reformat the contact info into a *compressed* string of data (essentially
   remove whitespace)
3. Generate a random [UUID Version 4][1] (includes timestamp as part of the
   generation process)
4. Use `pbkdf2` with the UUID as the password and an empty seed to make a key
   the same length as the data
5. XOR the data and the key
6. Interleave the key into the now encrypted data (data: `abc`, key: `xyz`
   becomes `axbycz`)
7. Base64 encode
8. Wrap the base64 string in a JSON object

[1]: http://en.wikipedia.org/wiki/Universally_unique_identifier#Version_4_.28random.29

## Usage

```javascript
BadCipher.encrypt('foobar'); // => [base64 from random password]

BadCipher.encrypt('foobar', '12345');          // => DC5vCavEYg0Qchh594Xe/A==
BadCipher.decrypt('DC5vCavEYg0Qchh594Xe/A=='); // => 'foobar'

// BadCipher is a monad:
var result = new BadCipher('foobar', '12345');
   .xor()
   .interleave()
   .bind(function(data, key) {
      // data and key are buffers
      return {
         data:    data.toString('base64'),
         keySize: key.length
      };
   });

result.data; // => {data: 'DC5vCavEYg0Qchh594Xe/A==', keySize: 5}
```

## Gulp

There is an included gulp plugin (`gulp-encrypt`) which will take in a file and
output an encypted version:

```javascript
var encrypt = require('badcipher/gulp-encrypt');

gulp.task('encrypt', function() {
  return gulp.src('secret.json')
    // For a random password:
    .pipe(encrypt())
    // To specify password:
    // .pipe(encrypt('secret-password'))
    .pipe(gulp.dest('dist'));
    // Creates `{"edata":"..."}` in `dist/secret.json`
});
```

## Why?!

Because at 3:00 AM on a Saturday there was no-one there to stop me.

If you are interested in preventing me from doing things like this again
[contact me][2] and give me a fun puzzle to work on instead.

[2]: http://tritarget.org/devin/#contact

## License

```
             DO WHAT YOU WANT TO PUBLIC LICENSE
                  Version 3, December 2012

 Copyright (C) 2012 Devin Weaver <suki@tritarget.org>

 Everyone is permitted to copy and distribute verbatim or modified
 copies of this license document, and changing it is allowed as long
 as the name and author are changed.

             DO WHAT YOU WANT TO PUBLIC LICENSE
 TERMS AND CONDITIONS FOR COPYING, DISTRIBUTION AND MODIFICATION

  0. You just DO WHAT YOU WANT TO.

  1. Attribution is OPTIONAL, however, APPRECIATED.

 TERMS AND CONDITIONS FOR FITNESS FOR PURPOSE

  0. USAGE of any material, in whole or in part, comes WITHOUT WARRANTY.

  1. To the extent permitted by applicable law, This license offers no
     claim of FITNESS FOR PURPOSE.
```
