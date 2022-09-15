const { PrismaClient } = require('@prisma/client');
const fs = require('fs');

const prisma = new PrismaClient();

const cloudinary = require('../utils/cloudinary');

const getAllProducts = async (req, res) => {
  try {
    const products = await prisma.product.findMany();
    res.status(200).json(products);
  } catch (err) {
    res.status(400).json({ message: 'An error occurred' });
  }
};

const getProductByCode = async (req, res) => {
  const code = req.params.id;

  try {
    const product = await prisma.product.findUnique({
      where: {
        code,
      },
    });

    if (!product)
      return res.status(404).json({ message: 'Product does not exist' });
    res.status(200).json(product);
  } catch (err) {
    res.status(400).json({ message: 'An error occurred' });
  }
};

const addProduct = async (req, res) => {
  const data = req.body;
  const code = data.code;
  if (data.productImg === '')
    data.productImg =
      'https://res.cloudinary.com/leeyah/image/upload/v1663003590/red-rubber-stamp-icon-on-transparent-background-vector-id918650450_ldqrym.jpg';

  try {
    const productExists = await prisma.product.findUnique({
      where: {
        code,
      },
    });

    if (productExists)
      return res.status(400).json({ message: 'Product code already exists' });

    data.price = parseInt(data.price);
    data.costPrice = parseInt(data.costPrice);
    data.quantity = parseInt(data.quantity);

    const product = await prisma.product.create({
      data,
    });
    res.status(200).json(product);
  } catch (err) {
    console.log(err);
    res.status(400).json({ message: 'An error occurred' });
  }
};

const uploadProductImage = async (req, res) => {
  try {
    const uploader = async (path) => await cloudinary.uploads(path, 'Uploads');

    const file = req.file;

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

const updateProductImage = async (req, res) => {
  const code = req.params.id;

  try {
    const product = await prisma.product.findUnique({
      where: {
        code,
      },
      select: {
        productImageId: true,
      },
    });

    let response;
    const public_id = product.productImageId;
    if (
      public_id !==
      'red-rubber-stamp-icon-on-transparent-background-vector-id918650450_ldqrym'
    ) {
      response = await cloudinary.destroy(public_id);
    }

    if (response.result === 'ok') {
      const uploader = async (path) =>
        await cloudinary.uploads(path, 'Uploads');

      const file = req.file;

      const { path } = file;
      const response = await uploader(path);
      fs.unlinkSync(path);
      if (!response.url)
        return res.status(400).json({ message: 'Upload unsuccessful' });
      res.status(200).json(response);
    } else {
      console.log(response);
    }
  } catch (err) {
    console.log(err);
    res.status(400).json({ message: 'An error occurred' });
  }
};

const updateProductByCode = async (req, res) => {
  const code = req.params.id;
  const data = req.body;

  delete data.code;

  try {
    data.price = parseInt(data.price);
    data.costPrice = parseInt(data.costPrice);
    data.quantity = parseInt(data.quantity);

    const product = await prisma.product.update({
      where: {
        code,
      },
      data,
    });

    if (!product)
      return res.status(404).json({ message: 'Product does not exist' });
    res.status(200).json(product);
  } catch (err) {
    res.status(400).json({ message: 'An error occurred' });
  }
};

const deleteProductByCode = async (req, res) => {
  const code = req.params.id;

  try {
    const savedProduct = await prisma.product.findUnique({
      where: {
        code,
      },
      select: {
        productImageId: true,
      },
    });

    let response;
    const public_id = savedProduct.productImageId;
    if (
      public_id !==
      'red-rubber-stamp-icon-on-transparent-background-vector-id918650450_ldqrym'
    ) {
      response = await cloudinary.destroy(public_id);
    }

    if (response.result !== 'ok') {
      return res.status(400).json({ message: 'Product Image delete failed' });
    }

    const product = await prisma.product.delete({
      where: {
        code,
      },
    });

    if (!product)
      return res.status(404).json({ message: 'Product does not exist' });
    res.status(200).json(product);
  } catch (err) {
    if ((JSON.stringify(err).code = 'P2003')) {
      res.status(400).json({
        message:
          'Product has been referenced by one or more sales, pleease delete them to continue',
      });
    } else res.status(400).json({ message: 'An error occurred' });
  }
};

module.exports = {
  getAllProducts,
  getProductByCode,
  addProduct,
  uploadProductImage,
  updateProductImage,
  updateProductByCode,
  deleteProductByCode,
};
