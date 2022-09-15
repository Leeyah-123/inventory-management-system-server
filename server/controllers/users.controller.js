const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

const getUsers = async (req, res) => {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        firstName: true,
        lastName: true,
        phoneNumber: true,
        email: true,
        role: true,
      },
    });
    res.status(200).json(users);
  } catch (err) {
    res.status(400).json({ message: 'An error occurred' });
  }
};

const getUserById = async (req, res) => {
  const id = req.params.id;

  try {
    const user = await prisma.user.findUnique({
      where: {
        id,
      },
    });

    if (!user) return res.status(404).json({ message: 'User does not exist' });

    delete user.password;
    res.status(200).json(user);
  } catch (err) {
    res.status(400).json({ message: 'An error occurred' });
  }
};

const updateUserRoleById = async (req, res) => {
  const id = req.params.id;
  const data = req.body;
  const role = data.role;

  try {
    const user = await prisma.user.update({
      where: {
        id,
      },
      data: {
        role,
      },
    });

    delete user.password;
    res.status(200).json(user);
  } catch (err) {
    res.status(400).json({ message: 'An error occurred' });
  }
};

const updateProfile = async (req, res) => {
  const id = req.user.id;
  const data = req.body;

  delete data.id;

  try {
    const user = await prisma.user.update({
      where: {
        id,
      },
      data,
    });

    delete user.password;
    res.status(200).json(user);
  } catch (err) {
    res.status(400).json({ message: 'An error occurred' });
  }
};

const deleteUserById = async (req, res) => {
  const id = req.params.id;

  try {
    const user = await prisma.user.delete({
      where: {
        id,
      },
    });

    if (!user) return res.status(404).json({ message: 'User does not exist' });

    delete user.password;
    res.status(200).json(user);
  } catch (err) {
    console.log(err);
    res.status(400).json({ message: 'An error occurred' });
  }
};

const deleteProfile = async (req, res) => {
  const id = req.user.id;

  try {
    const user = await prisma.user.delete({
      where: {
        id,
      },
    });

    delete user.password;
    res.status(200).json(user);
  } catch (err) {
    res.status(400).json({ message: 'An error occurred' });
  }
};

module.exports = {
  getUsers,
  getUserById,
  updateUserRoleById,
  updateProfile,
  deleteUserById,
  deleteProfile,
};
