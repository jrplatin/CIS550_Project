var db = require('../database/database.js');
var express = require('express')

// middleware that checks if user is authenticated
function isAuthenticated(req, res, next) {
    if (req.session.authenticated)
        return next();
    
    // if not authenticated then redirect to login
    res.redirect('/');
}

/*
 * Route for checking login credentials
 */
let login = function(req, res, next) {
    //Attempt to login the user with credentials given
    var username = req.body.email;
    var password = req.body.password;
    console.log("Login attempt for " + username + " with password " + password);
    
    db.validateLogin(username, password, function(data, err) {
        if(data == null && err != null){
            //send error with login
            res.json({success: false, err: err});
        }else{
            console.log(data)
            //save user logged in to session
            req.session.user = username;
            req.session.authenticated = true;

            //return success
            res.json({success: true, res: data['username']});
        }
    });
}

/*
 * Route for creating a user when signing up
 */
let signup = function(req, res, next) {
	var username = req.body.email;
	var password = req.body.password;
	var name = req.body.name;

	db.createAccount(username, password, name, function(data, err) {
		if(data == null && err != null){
			//error signing up
			res.json({success: false, err: err});
		}else{
			//save user logged in to session
            req.session.user = username;
            req.session.authenticated = true;
            
            //return success
            res.json({success: true, res: data['username']});
		}
  	});
};

module.exports = { 
    login:login,
    signup: signup,
    isAuthenticated:isAuthenticated
}