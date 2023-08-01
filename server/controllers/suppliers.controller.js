const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

const getSuppliers = async (req, res) => {
  try {
    const suppliers = await prisma.supplier.findMany();
    res.status(200).json(suppliers);
  } catch (err) {
    res.status(400).json({ message: 'An error occurred' });
  }
};

const getSupplierById = async (req, res) => {
  const id = req.params.id;
  try {
    const supplier = await prisma.supplier.findUnique({
      where: {
        id: parseInt(id),
      },
    });

    if (!supplier)
      return res.status(404).json({ message: 'Supplier does not exist' });

    res.status(200).json(supplier);
  } catch (err) {
    res.status(400).json({ message: 'An error occurred' });
  }
};

const addSupplier = async (req, res) => {
  const data = req.body;
  const email = data.email;

  try {
    const emailExists = await prisma.supplier.findUnique({
      where: {
        email,
      },
    });

    if (emailExists)
      return res.status(400).json({ message: 'Email already exists' });
    const supplier = await prisma.supplier.create({
      data,
    });
    res.status(201).json(supplier);
  } catch (err) {
    console.log(err);
    res.status(400).json({ message: 'An error occurred' });
  }
};

const updateSupplierById = async (req, res) => {
  const id = req.params.id;
  const data = req.body;
  const email = data.email;

  delete data.id;

  try {
    const emailExists = await prisma.supplier.findUnique({
      where: {
        email,
      },
    });
    console.log(emailExists);

    if (emailExists && emailExists.id !== parseInt(id))
      return res.status(400).json({ message: 'Email already exists' });

    const supplier = await prisma.supplier.update({
      where: {
        id: parseInt(id),
      },
      data,
    });

    if (!supplier)
      return res.status(404).json({ message: 'Supplier does not exist' });

    res.status(200).json(supplier);
  } catch (err) {
    res.status(400).json({ message: 'An error occurred' });
  }
};

const deleteSupplierById = async (req, res) => {
  const id = req.params.id;

  try {
    const supplier = await prisma.supplier.delete({
      where: {
        id: parseInt(id),
      },
    });

    if (!supplier)
      return res.status(404).json({ message: 'Supplier does not exist' });

    res.status(204).json(supplier);
  } catch (err) {
    if ((JSON.stringify(err).code = 'P2003')) {
      res.status(400).json({
        message:
          'Supplier has been referenced by one or more purchases, pleease delete them to continue',
      });
    } else res.status(400).json({ message: 'An error occurred' });
  }
};

module.exports = {
  getSuppliers,
  getSupplierById,
  addSupplier,
  updateSupplierById,
  deleteSupplierById,
};
