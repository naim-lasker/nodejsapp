"use strict";

var session = require('express-session');
var User = require('../models/user.js');

module.exports = function (app) {
    app.get('/login', function (req, res) {
        res.render('login', {
            title: "Login"
        });
    });

    app.post('/login', function (req, res, next) {
        if (req.body.email && req.body.password) {
            User.authenticate(req.body.email, req.body.password, function (error, user) {
                if (error || !user) {
                    var err = new Error("Wrong email or password");
                    err.status = 401;
                    return next(err);
                } else {
                    req.session.userId = user._id;
                    return res.redirect('/dashboard');
                }
            });
        } else {
            var passError = new Error("Email or Password is required");
            passError.status = 401;
            return next(passError);
        }
    });

    app.get('/signup', function (req, res) {
        res.render('signup.ejs', {
            title: "Sign Up"
        });
    });

    app.post('/signup', function (req, res, next) {
        if (req.body.name &&
            req.body.email &&
            req.body.favoriteBook &&
            req.body.password &&
            req.body.confirmPassword) {
            if (req.body.password !== req.body.confirmPassword) {
                var passwordMatchErr = new Error("Password do not match");
                passwordMatchErr.status = 400;
                return next(passwordMatchErr);
            }

            var userData = {
                name: req.body.name,
                email: req.body.email,
                favoriteBook: req.body.favoriteBook,
                password: req.body.password
            }

            User.create(userData, function (error, user) {
                if (error) {
                    return next(error);
                } else {
                    return res.redirect('/login');
                }
            });
        } else {
            var err = new Error("All fields are required");
            err.status = 400;
            return next(err);
        }
    });
}