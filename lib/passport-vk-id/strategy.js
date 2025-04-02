/**
 * Module dependencies.
 */
var util = require('util')
  , OAuth2Strategy = require('passport-oauth').OAuth2Strategy
  , InternalOAuthError = require('passport-oauth').InternalOAuthError
  , Crypto = require('crypto');

function getCodeChallengeS256(codeVerifier) {
  const hash = crypto.createHash('sha256').update(codeVerifier, 'ascii').digest();
  return hash.toString('base64');
}

function generateCodeVerifier() {
  return crypto.randomBytes(32).toString('base64');
}

function generateState() {
  return crypto.randomBytes(16).toString('base64');
}

function Strategy(options, verify) {
  options = options || {};
  options.authorizationURL = options.authorizationURL || 'https://id.vk.com/authorize';
  options.tokenURL = options.tokenURL || 'https://id.vk.com/oauth2/auth';
  options.state = true;
  options.pkce = true;

  OAuth2Strategy.call(this, options, verify);
  this.name = 'vk-id';
  this._clientID = options.clientID;
  this._oauth2.setAccessTokenName("id_token");
}

/**
 * Inherit from `OAuth2Strategy`.
 */
util.inherits(Strategy, OAuth2Strategy);


/**
 * Retrieve user profile from VK ID.
 *
 * This function constructs a normalized profile, with the following properties:
 *
 *   - `provider`               always set to `vk-id`
 *   - `user_id`                User ID
 *   - `first_name`             Username
 *   - `last_name`              User's last name
 *   - `phone`                  User's phone number
 *   - `avatar`                 Link to profile photo. The format depends on the query parameter.cs: with its help you can independently adjust the image size.
 *   - `sex`                    Gender. Possible values: Possible values: 1 - female, 2 - male, 0 - gender not specified
 *   - `verified`               Profile verification status
 *
 * @param {String} accessToken
 * @param {Function} done
 */
Strategy.prototype.userProfile = function(accessToken, done) {
  var url = 'https://id.vk.com/oauth2/user_info';

  if(!this._clientID) return done(new Error('vk-id strategy requires a clientID option'))
  url += `?client_id=${this._clientID}`;

  this._oauth2.get(url, accessToken, function (err, body, res) {
    var json;

    if (err) {
      if (err.data) {
        try {
          json = JSON.parse(err.data);
        } catch (_) {}
      }

      if (json && json.error) {
        return done(new InternalOAuthError(json.error, json.error_description, json.state));
      }
      return done(new InternalOAuthError('Failed to fetch user profile', err));
    }

    try {
      json = JSON.parse(body);

      var profile = { provider: 'vk-id' };
      profile.user_id = json.user_id;
      profile.first_name = json.first_name;
      profile.last_name = json.last_name;
      profile.phone = json.phone;
      profile.avatar = json.avatar;
      profile.email = json.email;
      profile.sex = json.sex;
      profile.verified = json.verified;

      profile._raw = body;
      profile._json = json;

      done(null, profile);
    } catch(e) {
      done(e);
    }
  });
}


/**
 * Expose `Strategy`.
 */
module.exports = Strategy;
