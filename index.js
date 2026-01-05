module.exports = {
  decode: require('jsonwebtoken/decode'),
  verify: require('./verify'),
  sign: require('jsonwebtoken/sign'),
  JsonWebTokenError: require('jsonwebtoken/lib/JsonWebTokenError'),
  NotBeforeError: require('jsonwebtoken/lib/NotBeforeError'),
  TokenExpiredError: require('jsonwebtoken/lib/TokenExpiredError'),
};
