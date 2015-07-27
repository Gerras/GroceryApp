var express = require('express');
var router = express.Router();

var User = require('../models/user.js');

router.route('/register').post(function (request, response) {
    var user = new User();
    user.name = request.body.name;
    user.username = request.body.username;

    User.setHash(request.body.password, function (error) {
        if (error) {
            response.send(error);
        }
        User.save(function (error) {
            if (error) {
                if (error.name === 'MongoError' && error.code === 11000) {
                    response.send('Username already in use', 403);
                } else {
                    response.send(error);
                }
            }
            response.send('Successfully created Account!', 201);
        });
    });
});

router.route('/authenticate').post(function (request, response) { 

});