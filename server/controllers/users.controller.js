const { PrismaClient } = require('@prisma/client');
const fs = require('fs');

const prisma = new PrismaClient();

const cloudinary = require('../utils/cloudinary');
const { hashPassword, comparePassword } = require('../utils/password');

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
  delete data.role;

  if (data.password) {
    const hashedPassword = await hashPassword(data.password);
    data.password = hashedPassword;
  }

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
    console.log(err);
    res.status(400).json({ message: 'An error occurred' });
  }
};

const deleteProfileImage = async (req, res) => {
  const id = req.user.id;

  try {
    const user = await prisma.user.findUnique({
      where: {
        id,
      },
      select: {
        profileImageId: true,
      },
    });

    let response;
    const public_id = user.profileImageId;

    if (public_id !== 'Uploads/blank-profile-picture-973460_640_m0rod') {
      response = await cloudinary.destroy(public_id);
      if (!response.result === 'ok')
        return res.status(400).json({ message: response.result });
      else return res.status(204).json({ message: response.result });
    } else return res.status(204).json({ message: 'No action performed' });
  } catch (err) {
    console.log(err);
    res.status(400).json({ message: 'An error occurred' });
  }
};

const updateProfileImage = async (req, res) => {
  const file = req.file;

  try {
    const uploader = async (path) => await cloudinary.uploads(path, 'Uploads');

    const { path } = file;
    const response = await uploader(path);
    fs.unlinkSync(path);
    if (!response.url)
      return res.status(400).json({ message: 'Upload unsuccessful' });
    res.status(200).json(response);
  } catch (err) {
    console.log(err);
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
    res.status(204).json(user);
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
    res.status(204).json(user);
  } catch (err) {
    res.status(400).json({ message: 'An error occurred' });
  }
};

const confirmPassword = async (req, res) => {
  const password = req.body.password;
  const id = req.user.id;

  try {
    const user = await prisma.user.findUnique({
      where: {
        id,
      },
    });

    const savedPassword = user.password;

    if (await comparePassword(password, savedPassword))
      res.status(200).json({ message: 'ok' });
    else res.status(401).json({ message: 'Invalid password' });
  } catch (err) {
    res.status(400).json({ message: 'An error occurred' });
  }
};

module.exports = {
  getUsers,
  getUserById,
  confirmPassword,
  updateUserRoleById,
  updateProfile,
  updateProfileImage,
  deleteProfileImage,
  deleteUserById,
  deleteProfile,
};
