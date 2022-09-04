const { PrismaClient } = require('@prisma/client');

const { generateToken } = require('../utils/jwt');
const { comparePassword, hashPassword } = require('../utils/password');

const prisma = new PrismaClient();

const loginController = async (req, res) => {
  const data = req.body;

  const email = data.email;
  const password = data.password;

  const user = await prisma.user.findUnique({
    where: {
      email: email,
    },
  });

  if (!user) return res.status(403).json({ message: 'Invalid email' });

  const isCorrectPassword = await comparePassword(password, user.password);
  if (!isCorrectPassword)
    return res.status(403).json({ message: 'Invalid email or password' });

  const token = generateToken(user.id);

  res.status(200).json({ token });
};

const signupController = async (req, res) => {
  const data = req.body;

  const email = data.email;
  const password = data.password;
  delete data.role;

  const userExists = await prisma.user.findUnique({
    where: { email },
  });

  if (userExists)
    return res.status(400).json({ message: 'Email already registered' });

  const hashedPassword = await hashPassword(password);
  data.password = hashedPassword;

  const user = await prisma.user.create({
    data,
  });

  const token = generateToken(user.id);
  res.status(200).json({ token });
};

const profileController = (req, res) => {
  try {
    return res.json(req.user);
  } catch (err) {
    return res.status(err.status).json(err);
  }
};

module.exports = {
  loginController,
  signupController,
  profileController,
};
