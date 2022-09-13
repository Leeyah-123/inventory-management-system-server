const Joi = require('joi');

const schemas = {
  user: Joi.object().keys({
    firstName: Joi.string().min(3).required(),
    lastName: Joi.string().min(3).required(),
    email: Joi.string()
      .email({
        minDomainSegments: 2,
        tlds: { allow: ['com', 'net'] },
      })
      .required(),
    phoneNumber: Joi.string()
      .pattern(new RegExp('[0-1]{1}[7-9]{1}[0-1]{1}[0-9]{8}'))
      .required(),
    password: Joi.string()
      .pattern(
        new RegExp(
          '^(((?=.*[a-z])(?=.*[A-Z]))|((?=.*[a-z])(?=.*[0-9]))|((?=.*[A-Z])(?=.*[0-9])))'
        )
      )
      .min(5)
      .required(),
    confirmPassword: Joi.ref('password'),
  }),
  category: Joi.object().keys({
    categoryName: Joi.string().min(3).required(),
  }),
  product: Joi.object().keys({
    code: Joi.string().alphanum().min(3).required(),
    title: Joi.string().min(3).required(),
    description: Joi.string().min(3),
    category: Joi.string().min(3).required(),
    price: Joi.number().required(),
    brandName: Joi.string().min(3),
    costPrice: Joi.number().required(),
    quantity: Joi.number().min(1).required(),
  }),
  purchase: Joi.object().keys({
    refNo: Joi.string().alphanum().min(3).required(),
    supplierId: Joi.number().required(),
    description: Joi.string().alphanum().required(),
    purchaseStatus: Joi.string().required(),
    total: Joi.number().required(),
    paid: Joi.number().required(),
    paymentStatus: Joi.string().required(),
    paymentDate: Joi.date(),
  }),
  sale: Joi.object().keys({
    customerId: Joi.string().required(),
    productCode: Joi.string().alphanum().required(),
    quantity: Joi.number().required(),
    total: Joi.number(),
    paid: Joi.number().required(),
    salesDate: Joi.date().greater('now'),
    status: Joi.string().required(),
    billerId: Joi.any().required(),
    tax: Joi.any().required(),
  }),
  supplier: Joi.object().keys({
    name: Joi.string().min(3).required(),
    phoneNumber: Joi.number().max(11).min(11).required(),
    email: Joi.string()
      .email({
        minDomainSegments: 2,
        tlds: { allow: ['com', 'net'] },
      })
      .required(),
    address: Joi.string().alphanum().min(10).required(),
    city: Joi.string().min(3).required(),
    state: Joi.string().min(3).required(),
    country: Joi.string().min(3).required(),
  }),
};

module.exports = schemas;
