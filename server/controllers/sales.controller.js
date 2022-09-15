const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

const getSales = async (req, res) => {
  try {
    const sales = await prisma.sale.findMany({
      orderBy: {
        salesDate: 'desc',
      },
    });
    res.status(200).json(sales);
  } catch (err) {
    res.status(400).json({ message: 'An error occurred' });
  }
};

const getSaleById = async (req, res) => {
  const id = req.params.id;

  try {
    const sale = await prisma.sale.findUnique({
      where: {
        id: parseInt(id),
      },
    });

    if (!sale)
      return res.status(404).json({ message: 'Sale Id does not exist' });
    res.status(200).json(sale);
  } catch (err) {
    res.status(400).json({ message: 'An error occurred' });
  }
};

const makeSale = async (req, res) => {
  const data = req.body;
  const paid = data.paid;
  const quantity = data.quantity;
  const code = data.productCode;
  const tax = data.tax;

  try {
    // getting the product with specified productCode
    const product = await prisma.product.findUnique({
      where: {
        code,
      },
    });

    // throwing error if product does not exist
    if (!product) res.status(400).json({ message: 'Product does not exist' });

    if (product.quantity < parseInt(quantity))
      return res
        .status(400)
        .json({ message: 'Quantity not available in stock' });

    // checking if the amount paid is greater than sale price of item
    if (
      parseInt(paid) - parseInt(tax) >
      parseInt(product.price) * parseInt(quantity)
    )
      return res.status(400).json({ message: 'Payment greater than required' });

    // calculating the balance of payment
    const balance =
      parseInt(product.price) * parseInt(quantity) -
      (parseInt(paid) - parseInt(tax));

    // setting the balance
    data.balance = balance;

    data.paid = parseFloat(paid);
    data.quantity = parseFloat(quantity);
    data.tax = parseFloat(tax);

    // setting payment status
    if (balance === 0) data.status = 'paid';
    else data.status = 'pending';

    // committing the sale
    const sale = await prisma.sale.create({
      data,
    });

    // updating the number of times a product has been purchased and reducing quantity available in stock
    await prisma.product.update({
      where: {
        code,
      },
      data: {
        purchased: product.purchased + parseInt(quantity),
        quantity: product.quantity - parseInt(quantity),
      },
    });

    res.status(200).json(sale);
  } catch (err) {
    res.status(400).json({ message: 'An error occurred' });
  }
};

const updateSaleById = async (req, res) => {
  const id = req.params.id;
  const data = req.body;
  const paid = data.paid;
  const quantity = data.quantity;
  const code = data.productCode;
  const tax = data.tax;

  delete data.id;

  try {
    if (code) {
      // getting the product with specified productCode
      const product = await prisma.product.findUnique({
        where: {
          code,
        },
      });

      // throwing error if product does not exist
      if (!product) res.status(400).json({ message: 'Product does not exist' });

      // checking if the amount paid is greater than sale price of item
      if (
        parseInt(paid) - parseInt(tax) >
        parseInt(product.price) * parseInt(quantity)
      )
        return res
          .status(400)
          .json({ message: 'Payment greater than required' });

      // calculating the balance of payment
      const balance =
        parseInt(product.price) * parseInt(quantity) -
        (parseInt(paid) - parseInt(tax));

      // setting the balance
      data.balance = balance;

      data.paid = parseFloat(paid);
      data.quantity = parseFloat(quantity);
      data.tax = parseFloat(tax);

      if (balance === 0) data.status = 'paid';
      else data.status = 'pending';
    }

    const sale = await prisma.sale.update({
      where: {
        id: parseInt(id),
      },
      data,
    });

    if (!sale)
      return res.status(404).json({ message: 'Sale Id does not exist' });
    res.status(200).json(sale);
  } catch (err) {
    console.log(err);
    res.status(400).json({ message: 'An error occurred' });
  }
};

const deleteSaleById = async (req, res) => {
  const id = req.params.id;

  try {
    const sale = await prisma.sale.delete({
      where: {
        id: parseInt(id),
      },
    });

    if (!sale)
      return res.status(404).json({ message: 'Sale Id does not exist' });
    res.status(200).json(sale);
  } catch (err) {
    res.status(400).json({ message: 'An error occurred' });
  }
};

module.exports = {
  getSales,
  getSaleById,
  makeSale,
  updateSaleById,
  deleteSaleById,
};
