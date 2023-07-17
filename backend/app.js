var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

//import session module, write express session name
var session = require('express-session')

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

// import express session module
var app = express();

// set up session in node application
app.use(session({
  // generate random unique string key, used to authenticate session
  secret : 'weblesson',
  resave : true,
  saveUninitialized : true
}));

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);

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

module.exports = app;


app.get("/api", (req, res) => {
  res.json({
    success: 1,
    message: "This is rest APIs working"
  });
});

app.listen(3000,()=>{
  console.log("Server up and running");
})