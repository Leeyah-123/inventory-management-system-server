const { compare, hash } = require('bcrypt');

const hashPassword = async (password) => await hash(password, 10);
const comparePassword = async (password, hashedPassword) =>
  await compare(password, hashedPassword);

module.exports = { hashPassword, comparePassword };
