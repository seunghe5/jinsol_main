module.exports = {
  decode: require('jsonwebtoken/decode'),
  verify: require('./verify'),
  sign: require('jsonwebtoken/sign'),
  JsonWebTokenError: require('./lib/JsonWebTokenError'),
  NotBeforeError: require('./lib/NotBeforeError'),
  TokenExpiredError: require('./lib/TokenExpiredError'),
};
