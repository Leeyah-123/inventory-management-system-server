const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

const employee = async (req, res, next) => {
  const id = req.user.id;
  const userDetails = await prisma.user.findUnique({
    where: {
      id,
    },
  });
  if (userDetails.role === 'user')
    return res
      .status(403)
      .json({ message: 'You do not have access to this resource' });
  next('');
};

const admin = async (req, res, next) => {
  const id = req.user.id;
  const userDetails = await prisma.user.findUnique({
    where: {
      id,
    },
  });
  if (userDetails.role !== 'admin')
    return res
      .status(403)
      .json({ message: 'You do not have access to this resource' });
  next('');
};

module.exports = {
  employee,
  admin,
};
