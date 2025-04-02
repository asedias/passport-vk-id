# Passport-VK-ID

[Passport](http://passportjs.org/) strategy for authenticating with [VK ID](https://id.vk.com/about/business/go/docs/ru/vkid/latest/methods)
using the OAuth 2.0 API.

## Installation

    $ npm install passport-vk-id

## Usage

#### Configure Strategy

The VK ID authentication strategy authenticates users using a VK/Mail.ru/OK.ru
account and OAuth 2.0 tokens.  The strategy requires a `verify` callback, which
accepts these credentials and calls `done` providing a user, as well as
`options` specifying a client ID, client secret, and callback URL.

    passport.use(new VKStrategy({
        clientID: VK_APP_CLIENT_ID,
        clientSecret: VK_APP_CLIENT_SECRET,
        callbackURL: "http://127.0.0.1:3000/auth/vk/callback"
        scope: ["vkid.personal_info", "email"], // optional
        provider: "vkid", // optional (values: "vkid", "mail_ru", "ok_ru") 
        lang_id: 1,
        scheme: "light"
      },
      function(accessToken, refreshToken, profile, done) {
        User.findOrCreate({ id: profile.user_id }, function (err, user) {
          return done(err, user);
        });
      }
    ));

#### Authenticate Requests

Use `passport.authenticate()`, specifying the `'vk-id'` strategy, to
authenticate requests.

For example, as route middleware in an [Express](http://expressjs.com/)
application:

    app.get('/auth/vk',
      passport.authenticate('vk-id'),
      function(req, res){
        // The request will be redirected to VK ID for authentication, so
        // this function will not be called.
      });

    app.get('/auth/vk/callback', 
      passport.authenticate('vk-id', { failureRedirect: '/login' }),
      function(req, res) {
        // Successful authentication, redirect home.
        res.redirect('/');
      });

## Credits

  - [asedias](http://github.com/asedias)
  - [onceamore](http://github.com/onceamore)

## License

(The MIT License)

Copyright (c) 2024

Permission is hereby granted, free of charge, to any person obtaining a copy of
this software and associated documentation files (the "Software"), to deal in
the Software without restriction, including without limitation the rights to
use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of
the Software, and to permit persons to whom the Software is furnished to do so,
subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS
FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR
COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER
IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN
CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
