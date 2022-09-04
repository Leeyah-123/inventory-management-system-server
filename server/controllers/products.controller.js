const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

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

  try {
    const productExists = await prisma.product.findUnique({
      where: {
        code,
      },
    });

    if (productExists)
      return res.status(400).json({ message: 'Product code already exists' });

    const product = await prisma.product.create({
      data,
    });
    res.status(200).json(product);
  } catch (err) {
    res.status(400).json({ message: 'An error occurred' });
  }
};

const updateProductByCode = async (req, res) => {
  const code = req.params.id;
  const data = req.body;

  delete data.code;

  try {
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
  updateProductByCode,
  deleteProductByCode,
};
