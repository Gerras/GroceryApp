// app/model/user.js

var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var bcrypt = require('bcrypt');
var saltWorkFactor = 10;


var UserSchema = new Schema({
    name: String,
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    admin: Boolean,
    location: String,
    meta: {
        age: Number,
        website: String    
    },
    created_at: Date,
    updated_at: Date,
});


UserSchema.pre('save', function (next) {
    var user = this;
    
    var currentDate = new Date();
    
    user.updated_at = currentDate;
    
    if (!user.created_at) {
        user.created_at = currentDate;
    }
});


UserSchema.methods('setHash', function (password, callback) {
    var self = this;

    bcrypt.genSalt(saltWorkFactor, function (err, salt) {
        if (err) return callback(err);
        
        //hash password
        bcrypt.hash(self.password, salt, function (err, hash) {
            if (err) return callback(err);
            
            //override cleartext with hashed password
            self.password = hash;
            callback();
        });
    });
});

UserSchema.method('validatePassword', function (password, callback) {
    bcrypt.compare(password, this.password, callback);
});

UserSchema.static('authenticate', function (username, password, callback) {
    this.findOne({ username: username }, function (err, user) {
        if (err) {
            //Mongoose error
            return callback(err);
        }

        if (!user) {
            //Account not found.
            return callback(null)
        }

        user.validatePassword(password, function (err, correct) {
            if (err) {
                //bcrypt error
                return callback(err);
            }

            if (!correct) {
                //Invalid password.
                return callback(null, false);
            }

            //Valid password

            if (bcrypt.getRounds(user.password) !== saltWorkFactor) {
                //Different number of rounds has been specified, update the password hash.
                user.setHash(password, function (err) {
                    if (err) {
                        return callback(err);
                    }

                    user.save(function (err) {
                        if (err) {
                            //Mongoose error
                            return callback(err);
                        }

                        //Hash updated, proceed as planned.
                        return callback(null, user);
                    });
                });
            }
        });
    });
});

var User = mongoose.model('User', UserSchema);

module.exports = User;