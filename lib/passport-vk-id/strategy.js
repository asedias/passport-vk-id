/**
 * Module dependencies.
 */
var util = require('util')
    , OAuth2Strategy = require('passport-oauth').OAuth2Strategy
    , InternalOAuthError = require('passport-oauth').InternalOAuthError

function Strategy(options, verify) {
    options = options || {};
    options.authorizationURL = options.authorizationURL || 'https://id.vk.com/authorize';
    options.tokenURL = options.tokenURL || 'https://id.vk.com/oauth2/auth';
    options.scope = options.scope.join(" ") || "vkid.personal_info"
    options.state = true;
    options.pkce = true;
    OAuth2Strategy.call(this, options, verify);
    this.name = 'vk-id';
    this._clientID = options.clientID;
}

/**
 * Inherit from `OAuth2Strategy`.
 */
util.inherits(Strategy, OAuth2Strategy);


Strategy.prototype.authenticate = function (req, _options) {
    var options = {
        device_id: req.query.device_id,
        state: req.query.state,
    }
    return OAuth2Strategy.prototype.authenticate.call(this, req, options);
}

Strategy.prototype.tokenParams = function (options) {
    return {
        device_id: options.device_id,
        state: options.state,
    };
}

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
 *   - `email`                  Email
 *   - `sex`                    Gender. Possible values: Possible values: 1 - female, 2 - male, 0 - gender not specified
 *   - `verified`               Profile verification status
 *
 * @param {String} accessToken
 * @param {Function} done
 */

Strategy.prototype.userProfile = function (accessToken, done) {
    var url = 'https://id.vk.com/oauth2/user_info';

    if (!this._clientID) return done(new Error('vk-id strategy requires a clientID option'))

    var headers = new Headers();
    headers.append("Content-Type", "application/x-www-form-urlencoded");

    var urlencoded = new URLSearchParams();
    urlencoded.append("access_token", accessToken);
    urlencoded.append("client_id", this._clientID);

    var requestOptions = {
        method: "POST",
        headers: headers,
        body: urlencoded,
        redirect: "follow"
    };

    fetch("https://id.vk.com/oauth2/user_info", requestOptions)
        .then((response) => response.json())
        .then(({user}) => {
            var profile = {provider: 'vk-id'};
            profile.user_id = user.user_id;
            profile.first_name = user.first_name;
            profile.last_name = user.last_name;
            profile.phone = user.phone;
            profile.avatar = user.avatar;
            profile.email = user.email;
            profile.sex = user.sex;
            profile.verified = user.verified;
            profile._json = user;
            done(null, profile);
        })
        .catch((error) => {
            done(new InternalOAuthError('Failed to fetch user profile', error));
        });
}


/**
 * Expose `Strategy`.
 */
module.exports = Strategy;
