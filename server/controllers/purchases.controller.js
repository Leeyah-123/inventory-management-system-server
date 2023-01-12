const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

const getPurchases = async (req, res) => {
  try {
    const purchases = await prisma.purchase.findMany({
      orderBy: {
        purchaseDate: 'desc',
      },
    });
    res.status(200).json(purchases);
  } catch (err) {
    res.status(400).json({ message: 'An error occurred' });
  }
};

const getPurchaseById = async (req, res) => {
  const id = req.params.id;

  try {
    const purchase = await prisma.purchase.findUnique({
      where: {
        id: parseInt(id),
      },
    });

    if (!purchase)
      return res.status(404).json({ message: 'Purchase Id does not exist' });
    res.status(200).json(purchase);
  } catch (err) {
    res.status(400).json({ message: 'An error occurred' });
  }
};

const makePurchase = async (req, res) => {
  const data = req.body;
  const refNo = data.refNo;

  const total = parseInt(data.total);
  const paid = parseInt(data.paid);

  try {
    const refNumberExists = await prisma.purchase.findUnique({
      where: {
        refNo,
      },
    });

    if (refNumberExists)
      return res
        .status(400)
        .json({ message: 'Reference Number already exists' });

    if (total === paid) data.paymentStatus = 'paid';
    else if (total < paid) {
      console.log(total - paid);
      return res
        .status(400)
        .json({ message: 'Amount paid cannot be more than cost of product' });
    } else data.paymentStatus = 'pending';

    data.total = total;
    data.paid = paid;
    data.balance = total - paid;

    const purchase = await prisma.purchase.create({
      data,
    });
    res.status(200).json(purchase);
  } catch (err) {
    console.log(err);
    res.status(400).json({ message: 'An error occurred' });
  }
};

const updatePurchaseById = async (req, res) => {
  const id = req.params.id;
  const data = req.body;

  const total = parseInt(data.total);
  const paid = parseInt(data.paid);

  delete data.id;
  delete data.refNo;

  try {
    if (total === paid) data.paymentStatus = 'paid';
    else if (total < paid)
      return res.status(400).json({
        message: 'Amount paid cannot be more than cost of product',
      });
    else data.paymentStatus = 'pending';

    data.total = total;
    data.paid = paid;
    data.balance = total - paid;

    const purchase = await prisma.purchase.update({
      where: {
        id: parseInt(id),
      },
      data,
    });

    if (!purchase)
      return res.status(404).json({ message: 'Purchase Id does not exist' });
    res.status(200).json(purchase);
  } catch (err) {
    console.log(err);
    res.status(400).json({ message: 'An error occurred' });
  }
};

const deletePurchaseById = async (req, res) => {
  const id = req.params.id;

  try {
    const purchase = await prisma.purchase.delete({
      where: {
        id: parseInt(id),
      },
    });

    if (!purchase)
      return res.status(404).json({ message: 'Purchase Id does not exist' });

    res.status(200).json(purchase);
  } catch (err) {
    res.status(400).json({ message: 'An error occurred' });
  }
};

module.exports = {
  getPurchases,
  getPurchaseById,
  makePurchase,
  updatePurchaseById,
  deletePurchaseById,
};
