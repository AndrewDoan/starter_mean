var pgp = require('pg-promise')();
var connection = "postgres://Bloot@localhost/auth";
var db = pgp(connection);

function User(){
    var connection = "postgres://Bloot@localhost/auth";
    var db = pgp(connection);
    //this.name ='';
    this.photo ='';
    this.email = "";
    this.password= ""; //need to declare the things that i want to be remembered for each user in the database

    this.save = function(callback) {
        console.log(this.email +' will be saved');

            db.query('INSERT INTO users(email, password) VALUES($1, $2)', [this.email, this.password]).then(function(result){
            }).catch(function(result){
                console.log(result);
            });
            db.query('SELECT * FROM users WHERE email=$1', this.email).then(function(result){
                //if no rows were returned from query, then new user
                if (result){
                    return callback(result);
                }
            }).catch(function(result){
                console.log(result);
            });

            //whenever we call 'save function' to object USER we call the insert query which will save it into the database.
        //});
    };
        //User.connect

    //this.findById = function(u_id, callback){
    //    console.log("we are in findbyid");
    //    var user = new User();
    //    user.email= 'carol';
    //    user.password='gah';
    //    console.log(user);
    //
    //    return callback(null, user);
    //
    //};


}

User.findOne = function(email, callback){
    var isNotAvailable = false; //we are assuming the email is taking
    //var email = this.email;
    //var rowresult = false;
    console.log(email + ' is in the findOne function test');
    //check if there is a user available for this email;
    //client.connect(function(err) {
    ////    //console.log(this.photo);
    //    console.log(email);
    //    if (err) {
    //        return console.error('could not connect to postgres', err);
    //    }
    db.query("SELECT * from users where email=$1", email).then(function(result){
        //if no rows were returned from query, then new user
        if (result.length > 0){
            isNotAvailable = true; // update the user for return in callback
            ///email = email;
            //password = result.rows[0].password;
            console.log(email + ' is am not available!');
        }
        else{
            isNotAvailable = false;
            //email = email;
            console.log(email + ' is available');
        }
        //the callback has 3 parameters:
        // parameter err: false if there is no error
        //parameter isNotAvailable: whether the email is available or not
        // parameter this: the User object;

        return callback(false, isNotAvailable, result);
    }).catch(function(result){
        console.log(result);
    })
//});
};

User.findById = function(id, callback){
    console.log("we are in findbyid");

    db.query("SELECT * from users where u_id=$1",id).then(function(result){
        //if no rows were returned from query, then new user
        if (result.rows.length > 0){
            console.log(result.rows[0] + ' is found!');
            var user = new User();
            user.email= result.rows[0]['email'];
            user.password = result.rows[0]['password'];
            user.u_id = result.rows[0]['u_id'];
            console.log(user.email);
            return callback(null, user);
        }
    }).catch(function(result){
        console.log(result);
    });
};

module.exports = User;

