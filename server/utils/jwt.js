const { sign, verify } = require('jsonwebtoken');
require('dotenv').config();

const { JWT_KEY } = process.env;

const signJwt = (payload) => {
  return sign(payload, JWT_KEY);
};

const verifyJwt = (token) => {
  return verify(token, JWT_KEY);
};

const generateToken = (id) => signJwt({ id });

module.exports = { signJwt, verifyJwt, generateToken };
