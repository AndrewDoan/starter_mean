//all the routes for our application
var formidable = require('formidable');
var pgp = require('pg-promise')();
var util = require('util');
var fs = require('fs-extra');
var connection = "postgres://Bloot@localhost/auth";
var db = pgp(connection);
var User            = require('../server/models/user');
module.exports = function(app, passport) {

    // =====================================
    // HOME PAGE (with login links) ========
    // =====================================
    app.get('/', function(req, res) {
        res.render('index.ejs'); // load the index.ejs file
    });

    // =====================================
    // LOGIN ===============================
    // =====================================
    // show the login form
    app.get('/login', function(req, res) {
        res.render('login.ejs', { message: req.flash('loginMessage') });
    });

    app.post('/login', passport.authenticate('local-login', {
        successRedirect : '/profile', // redirect to the secure profile section
        failureRedirect : '/login', // redirect back to the signup page if there is an error
        failureFlash : true // allow flash messages
    }));

    // =====================================
    // SIGNUP ==============================
    // =====================================

    app.get('/signup', function(req, res) {
        res.render('signup.ejs', { message: req.flash('signupMessage') });
    });

    app.post('/signup', passport.authenticate('local-signup', {
        successRedirect : '/profile', // redirect to the secure profile section
        failureRedirect : '/signup', // redirect back to the signup page if there is an error
        failureFlash : true // allow flash messages
    }));

    // =====================================
    // PROFILE SECTION =====================
    // =====================================
    // we will want this protected so you have to be logged in to visit
    // we will use route middleware to verify this (the isLoggedIn function)
    app.get('/profile', isLoggedIn, function(req, res) {
        res.render('profile.ejs', {
            user : req.user // get the user out of session and pass to template
        });
    });

    // =====================================
    // FACEBOOK ROUTES =====================
    // =====================================
    // route for facebook authentication and login
    // app.get('/auth/facebook', passport.authenticate('facebook', { scope : 'email' }));

    // // handle the callback after facebook has authenticated the user
    // app.get('/auth/facebook/callback',
    //     passport.authenticate('facebook', {
    //         successRedirect : '/profile',
    //         failureRedirect : '/'
    //     }));


// =====================================
    // LOGOUT ==============================
    // =====================================
    app.get('/logout', function(req, res) {
        req.logout();
        res.redirect('/');
    });

    app.post('/upload', function(req,res){
        var form = new formidable.IncomingForm();
        form.parse(req, function (err, fields, files) {
            res.redirect('/profile');
            res.end(util.inspect({ fields: fields, files: files }));
        });

        form.on('end', function (fields, files) {
            /* Temporary location of our uploaded file */
            var temp_path = this.openedFiles[0].path;
            /* The file name of the uploaded file */
            var file_name = this.openedFiles[0].name;
            /* Location where we want to copy the uploaded file */
            var new_location = 'uploads/';

            db.query('INSERT INTO users(photo) VALUES($1)', new_location + file_name).then(function(result){
                fs.copy(temp_path, new_location + file_name, function (err) {
                    if (err) {
                        console.error(err);
                    } else {
                        console.log("success!")
                    }
                });
            }).catch(function(result){
                console.log(result);
            });

        });
    })
};

// route middleware to make sure a user is logged in
function isLoggedIn(req, res, next) {

    // if user is authenticated in the session, carry on
    if (req.isAuthenticated()) {
        console.log('isLoggedin');
        return next();
    }
    console.log('is not logged in');

    // if they aren't redirect them to the home page
    res.redirect('/');
}