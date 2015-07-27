// app/routes/groceryItemRoutes.js

var express = require('express');
var router = express.Router();

var GroceryItem = require('../models/groceryItem.js');

router.use(function (req, res, next) {
    //logging
    console.log("We are entering the Grocery section of the API.");
    next();
});


//router.get('/', function (req, res) {
//    res.json({ message: 'hooray! welcome to our api!' });
//});

router.route('/').post(function (req, res) {  // create a grocery item (accessed at POST /api/items)
    var item = new GroceryItem();
    item.name = req.body.name;
    item.type = req.body.type;
    if (req.body.date) {
        item.date = req.body.date;
    }
    item.save(function (err) {
        if (err) {
            res.send(err);
        }
        res.json({ message: "Created Grocery Item!" });
    });
    
})
.get(function (req, res) {
    GroceryItem.find(function (err, items) {
        if (err) {
            res.send(err);
        }
        res.json(items);
    });
});

router.route('/:groceryitem_id')
    // GET /api/groceryitems/:groceryitem_id
    .get(function (req, res) {
    GroceryItem.findById(req.params.groceryitem_id, function (err, groceryItem) {
        if (err) {
            res.send(err);
        }
        res.json(groceryItem);
    });
    // PUT /api/groceryitems/:groceryitem_id
}).put(function (req, res) {
    GroceryItem.findById(req.params.groceryitem_id, function (err, groceryItem) {
        if (err) {
            res.send(err);
        }
        groceryItem.name = req.body.name;
        groceryItem.type = req.body.type;
        if (req.body.date) {
            groceryItem.date = req.body.date;
        }
        
        groceryItem.save(function (err) {
            if (err) {
                res.send(err);
            }
            res.json({ message: 'Grocery Item Successfully Updated!' })
        });
    });
    // DELETE /api/groceryitems/:groceryitem_id   
}).delete(function (req, res) {
    GroceryItem.remove({
        _id: req.params.groceryitem_id
    }, function (err, groceryItem) {
        if (err) {
            res.send(err);
        }
        res.json({ message: 'Successfully Deleted Grocery Item.' });
    });
});

module.exports = router