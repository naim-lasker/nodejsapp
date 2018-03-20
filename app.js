"use strict";

const express = require('express');
var mongoose = require('mongoose');
const bodyParser = require('body-parser');
var session = require('express-session');
const app = express();

app.use(session({
  secret: "i am naim",
  resave: true,
  saveUninitialized: false
}));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

var User = require('./app/models/user.js');

const engine = require('ejs-locals');
var userController = require('./app/controllers/userController.js')

app.engine('ejs', engine);
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.use('/static', express.static(__dirname + '/static'));
mongoose.connect("mongodb://localhost:27017/mynodejsapp");
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));

userController(app);

app.get('/', function (req, res) {
  res.redirect('/login');
});

app.get('/dashboard', function (req, res, next) {
  if (!req.session.userId) {
    return res.redirect('/login');
  }
  User.findById(req.session.userId)
    .exec(function (error, user) {
      if (error) {
        return next(error);
      } else {
        res.render('dashboard', {
          title: "Dashboard",
          email: user.email
        });
      }
    });
});

app.get('/about-us', function (req, res) {
  if (!req.session.userId) {
    return res.redirect('/login');
  }
  res.render('about-us', {
    title: "About Us"
  });
});

app.get('/contact-us', function (req, res) {
  if (!req.session.userId) {
    return res.redirect('/login');
  }
  res.render('contact-us', {
    title: "Contact Us"
  });
});

app.listen(3000, function () {
  console.log("Server is running at port " + 3000);
});
