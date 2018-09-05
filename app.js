require('dotenv').config();
const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const Discord = require('discord.js');
const guildId = process.env.GUILD_ID;
const botToken = process.env.BOT_TOKEN;

const functions = require('./lib/functions.js');
const eventListeners = require('./lib/eventlisteners.js')
const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');

var app = express();
var client = new Discord.Client();

const initDiscord = function(req, res, next) {
  req.client = client;
  console.log('Initialized Discord Client');
  client.login(botToken);

  client.on('ready', () => {
    client.user.setPresence({
      game: {
        name: 'with 0mfg permissions'
      },
      status: 'online'
    })
    console.log(`Logged in as ${client.user.tag}!`);
    if (functions.isMasterProcess())
      eventListeners.eventListenersInit(client);
  });
  next();
}

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({
  extended: false
}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


app.use(initDiscord);
app.use('/', indexRouter);
app.use('/users', usersRouter);


console.log('Initialized Discord Client');
client.login(botToken);

client.on('ready', () => {
  client.user.setPresence({
    game: {
      name: 'with RG user permissions'
    },
    status: 'online'
  })
  console.log(`Logged in as ${client.user.tag}!`);
  if (functions.isMasterProcess())
    eventListeners.eventListenersInit(client);
});

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