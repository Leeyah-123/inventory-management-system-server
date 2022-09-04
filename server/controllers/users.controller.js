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

const updateUserById = async (req, res) => {
  const userDetails = req.user;
  const userRole = userDetails.role;

  const id = req.params.id;
  const data = req.body;
  const role = data.role;
  const email = data.email;

  delete data.role;

  try {
    if (userRole === 'admin') {
      if (role) {
        await prisma.user.update({
          where: {
            id,
          },
          data: {
            role,
          },
        });
      }
    }

    if (!id === userDetails.id)
      return res
        .status(400)
        .json({ message: 'You do not have access to this resource' });

    if (email) {
      const emailExists = await prisma.user.findUnique({
        where: {
          email,
        },
      });

      if (emailExists && emailExists.id !== parseInt(id))
        return res.status(400).json({ message: 'Email already exists' });
    }

    const user = await prisma.user.update({
      where: {
        id: parseInt(id),
      },
      data,
    });

    if (!user) return res.status(404).json({ message: 'User does not exist' });

    delete user.password;
    res.status(200).json(user);
  } catch (err) {
    res.status(400).json({ message: 'An error occurred' });
  }
};

const deleteProfileById = async (req, res) => {
  const id = req.params.id;

  const userId = req.user.id;

  try {
    if (!(userId === id) && role !== 'admin')
      return res
        .status(403)
        .json({ message: 'You do not have access to this resource' });
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

module.exports = {
  getUsers,
  getUserById,
  updateUserById,
  deleteProfileById,
};
