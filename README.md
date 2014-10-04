# Really Bad Cipher

Just as the name suggests, this is a **really bad** cipher. It is XOR'ing to a
random key. the *key* is then interlaced into the output.

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

## Why?!

Because at 3:00 AM on a Saturday there was no-one there to stop me.

If you are interested in preventing me from doing things like this again
[contact me][2] and give me a fun puzzle to work on instead.

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

[1]: http://en.wikipedia.org/wiki/Universally_unique_identifier#Version_4_.28random.29
[2]: http://tritarget.org/devin/#contact
