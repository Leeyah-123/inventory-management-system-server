const createError = require('http-errors');
const express = require('express');
const logger = require('morgan');
const cors = require('cors');
const bodyParser = require('body-parser');

// router imports
const authRouter = require('./routes/auth.routes');
const productRouter = require('./routes/products.routes');
const categoryRouter = require('./routes/categories.routes');
const purchaseRouter = require('./routes/purchases.routes');
const saleRouter = require('./routes/sales.routes');
const supplierRouter = require('./routes/suppliers.routes');
const usersRouter = require('./routes/users.routes');

// user authentication middleware import
const auth = require('./middleware/auth');

// for fetching environmental variables
require('dotenv').config();

var app = express();

// middlewares
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cors());

// routers
app.use(authRouter);
app.use(auth, productRouter);
app.use(auth, categoryRouter);
app.use(auth, purchaseRouter);
app.use(auth, saleRouter);
app.use(auth, supplierRouter);
app.use(auth, usersRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.json(err);
});

// setting up server port
const port = process.env.PORT || 5000;
const host = process.env.HOST || '0.0.0.0';

app.listen(port, host, () => {
  console.log('Server started successfully');
});
