const { verifyJwt } = require('../utils/jwt');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

module.exports = async (req, res, next) => {
  const token = req.header('Authorization');
  if (!token)
    return res
      .status(401)
      .json({ message: 'Token is missing or not provided' });

  try {
    const tokenData = verifyJwt(token);
    let user = {};

    user = await prisma.user.findUnique({
      where: { id: tokenData.id },
    });

    if (!user) return res.status(401).json({ message: 'Invalid token' });
    delete user.password;
    req.user = user;

    next('');
  } catch (err) {
    return res
      .status(403)
      .json({ message: 'Invalid or malfunctioned token provided' });
  }
};
