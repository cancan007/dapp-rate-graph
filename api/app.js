var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var cors = require('cors');  // this is necessary to connect to React with node.js

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var ethUsdRouter = require('./routes/provide-eth-usd');
var ethUsdRouterEx = require('./routes/provide-eth-usd-ex');
var btcEurRouter = require('./routes/provide-btc-eur');
var ethEurRouter = require('./routes/provide-eth-eur');
var cryptoRouter = require('./routes/provideCryptRate');
var btcUsdRouterEx = require('./routes/provide-btc-usd-ex');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(cors());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, '../front_end/build')));  // to use React's static files

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/eth-usd', ethUsdRouter);
app.use('/eth-eur', ethEurRouter);
app.use('/eth-usd-ex', ethUsdRouterEx);
app.use('/btc-usd', cryptoRouter("BTC", "USD")); // do not common router, they all provide same last datas, this time, BTC-EUR
app.use('/btc-usd-ex', btcUsdRouterEx);
app.use('/btc-eur', btcEurRouter);


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
  res.render('error');
});

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../front_end/build/index.html'));  // to show React's front end in this server
});

module.exports = app;
