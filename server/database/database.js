const mysql = require('mysql');
const bcrypt = require('bcrypt');

const con = mysql.createConnection({
    host: "cis550proj.cimxsfsxttk4.us-east-1.rds.amazonaws.com",
    user: "admin",
    password: "penn1741",
    port: 1521,
    database: 'cis550proj'
});

con.connect(function(err) {
    if (err) throw err;
    console.log("Connected to DB!");
});

/*
 * Function to check login credentials
 */
var myDB_validateLogin = function(username, password, route_callbck){

    if(username === "" || password === ""){
        route_callbck(null, "Please fill in username & password!");
    }

    //query db for user
    con.query(`SELECT user_id, password FROM Users WHERE name = ?;`, [username],  function(err, result, fields) {
        if (err){
            route_callbck(null, "Database lookup error: "+err);
            throw (err);
        } 
        if(result && Array.isArray(result) && result.length < 1){
            route_callbck(null, "This user does not exist!");
        }
        else {
            bcrypt.compare(password, result[0].password, function(err, res) {
                if(res) {
                 // Passwords match
                 route_callbck({ username : username, user_id : result[0].user_id}, null);
                } else {
                 // Passwords don't match
                 route_callbck(null, "Incorrect password!");
                } 
            });
        }
    });
};

/*
 * Function to create an account if it does not exists
 */
var myDB_createAccount = function(username, password, name, route_callbck){

    if(username === "" || password === "" || name === ""){
        route_callbck(null, "Please fill in all fields!");
    }

    con.query(`SELECT password FROM Users WHERE name = ?;`, [username],  function(err, result, fields) {
        if (err){
            route_callbck(null, "Database lookup error: "+err);
            throw (err);
        } 
        if(result && Array.isArray(result) && result.length < 1){
            //user doens't already exist
            bcrypt.hash(password, 10, function(err, hash) {
                // Store user in database
                //TODO the user_id should be something unquie to each person like an email
                let user = {name: username, user_id: username, password: hash}
                console.log("passwrd: " + hash)
                con.query('INSERT INTO Users SET ?', user, function(err, result, fields) {
                    if (err){
                        route_callbck(null, "Database lookup error: "+err);
                        throw (err);
                    }
                    if (result){
                        route_callbck({ username : username, user_id : username}, null);
                    } 
                });
            });
        }
        else {
            route_callbck(null, "This user already exists!");
        }
    });
};

/*
 * Function to get businesses to display on map for an area
 * @Return list of business objects
 */
var myDB_getBusinessForArea = function(area, route_callbck){
    
    if(area.lat1 === "" || area.lng1 === "" || area.lat2 === "" || area.lng2 === ""){
        route_callbck(null, "Please fill in area!");
    }

    let minLat = Math.min(area.lat1, area.lat2)
    let maxLat = Math.max(area.lat1, area.lat2)
    let minLng = Math.min(area.lng1, area.lng2)
    let maxLng = Math.max(area.lng1, area.lng2)

    //query db for business with location inside bounds
    con.query(`SELECT * FROM Business b WHERE b.latitude BETWEEN `+minLat+ `and `+maxLat+` AND b.longitude BETWEEN `+minLng+` and `+maxLng+` LIMIT 10;`,  function(err, result, fields) {
        if (err){
            route_callbck(null, "Database lookup error: "+err);
            throw (err);
        } 
        if(result && Array.isArray(result) && result.length > 0){
            //return list
            route_callbck(result, null);
        }
    });
}

/*
 * Function to get business info
 * @Return business 
 */
var myDB_getBusinessInfo = function(id, route_callbck){
    
    if(id.id === ""){
        route_callbck(null, "No id provided!");
    }

    //query db
    con.query(`SELECT * FROM Business b WHERE b.business_id="`+id.id+`";`,  function(err, result, fields) {
        if (err){
            route_callbck(null, "Database lookup error: "+err);
            throw (err);
        } 
        if(result && Array.isArray(result) && result.length > 0){
            //return first in list
            route_callbck(result[0], null);
        }
    });
}

/*
 * Function to get reviews for a business
 * @Return list of review objects
 */
var myDB_getReviewsForBusiness = function(id, route_callbck){
    
    if(id.id === ""){
        route_callbck(null, "Please provide a business id!");
    }

    //query db for reviews
    con.query(`SELECT * FROM Reviews r WHERE r.business_id="`+id.id+`";`,  function(err, result, fields) {
        if (err){
            route_callbck(null, "Database lookup error: "+err);
            throw (err);
        } 
        if(result){
            //return list
            route_callbck(result, null);
        }
    });
}

var database = {
    validateLogin: myDB_validateLogin,
    createAccount: myDB_createAccount,
    getBusinessForArea: myDB_getBusinessForArea,
    getBusinessInfo: myDB_getBusinessInfo,
    getReviewsForBusiness: myDB_getReviewsForBusiness
  };
  
  module.exports = database;