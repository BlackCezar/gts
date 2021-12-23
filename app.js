const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const sessions = require('express-session')
const bodyParser = require('body-parser')

const indexRouter = require('./routes/index');
const SubscribersRouter = require('./routes/subscribers');
const ATSRouter = require('./routes/ats');
const TelephonesRouter = require('./routes/telephones');
const AdminRouter = require('./routes/admin');
const oneDay = 1000 * 60 * 60 * 24;
const dotenv = require('dotenv').config()

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(sessions({
  secret: 'secret',
  saveUninitialized:true,
  cookie: { maxAge: oneDay },
  resave: false
}))
app.use(bodyParser.urlencoded({ extended: false }))


app.use('/', indexRouter);
app.use('/admin', AdminRouter);
app.use('/telephones', TelephonesRouter);
app.use('/ats', ATSRouter);
app.use('/subscribers', SubscribersRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

const db = require('./db')
db.connect()

module.exports = app;
