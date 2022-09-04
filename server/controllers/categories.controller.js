const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

const getAllCategories = async (req, res) => {
  try {
    const categories = await prisma.category.findMany();
    res.status(200).json(categories);
  } catch (err) {
    res.status(400).json({ message: 'An error occurred' });
  }
};

const getCategoryById = async (req, res) => {
  const id = req.params.id;

  try {
    const category = await prisma.category.findUnique({
      where: {
        id: parseInt(id),
      },
    });

    if (!category)
      return res.status(404).json({ message: 'Category does not exist' });
    res.status(200).json(category);
  } catch (err) {
    console.log(err);
    res.status(400).json({ message: 'An error occurred' });
  }
};

const addCategory = async (req, res) => {
  const data = req.body;
  const categoryName = data.categoryName;

  try {
    const categoryExist = await prisma.category.findUnique({
      where: {
        categoryName,
      },
    });

    if (categoryExist)
      return res.status(400).json({ message: 'Category name already exists' });

    const category = await prisma.category.create({
      data,
    });
    res.status(200).json(category);
  } catch (err) {
    res.status(400).json({ message: 'An error occurred' });
  }
};

const updateCategoryById = async (req, res) => {
  const id = req.params.id;
  const data = req.body;
  const categoryName = data.categoryName;

  delete data.id;

  try {
    const categoryExist = await prisma.category.findUnique({
      where: {
        categoryName,
      },
    });

    if (categoryExist && categoryExist !== parseInt(id))
      return res.status(400).json({ message: 'Category name already exists' });

    const category = await prisma.category.update({
      where: {
        id: parseInt(id),
      },
      data,
    });

    if (!category)
      return res.status(404).json({ message: 'Category does not exist' });
    res.status(200).json(category);
  } catch (err) {
    res.status(400).json({ message: 'An error occurred' });
  }
};

const deleteCategoryById = async (req, res) => {
  const id = req.params.id;

  try {
    const category = await prisma.category.delete({
      where: {
        id: parseInt(id),
      },
    });

    if (!category)
      return res.status(404).json({ message: 'Category does not exist' });
    res.status(200).json(category);
  } catch (err) {
    if ((JSON.stringify(err).code = 'P2003')) {
      res.status(400).json({
        message:
          'Category has been referenced by one or more products, pleease delete them to continue',
      });
    } else res.status(400).json({ message: 'An error occurred' });
  }
};

module.exports = {
  getAllCategories,
  getCategoryById,
  addCategory,
  updateCategoryById,
  deleteCategoryById,
};
