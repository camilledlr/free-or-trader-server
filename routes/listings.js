var express = require('express');
var router = new express.Router();
var listingModel = require('../models/Listing');
var userModel = require('../models/User');
const uploader = require("../config/cloudinary");

/* GET users listing. */
router.get('/', function (req, res, next) {
    listingModel.find().populate('author')
        .then(ads => res.status(200).json(ads))
        .catch(next)
});

router.get("/search", async (req, res, next) => {
    // const regExp = new RegExp(req.query.q, "i");
    // const category = req.query.category;
    var queryDB = {}
    for (let prop in req.query) {
        if (prop==="q" && req.query.q!=="") queryDB.title =  new RegExp(req.query.q, "i");
        else if (prop==="type" && req.query.type!=="") queryDB.adType = req.query.type;
        else if (req.query[prop] !== "") queryDB[prop] = req.query[prop];
    }

    // var queryObject = JSON.parse(`{and: [${queryDB}]}`)
    const isEmptyQuery = Boolean(Object.keys(queryDB).length)
    
    if (isEmptyQuery) { 
        listingModel.find({$and: [queryDB]})
         .then(dbRes => {
            console.log(dbRes)
        res.json({ dbRes })
    })
    .catch(next)}
    else listingModel.find()
    // const adsSearch = adModel
    // .find({$and: [{$or: [{title: regExp}, {description: regExp}, {availabitlity: regExp}]}, {category: category}]}) //JSON.parse
    .then(dbRes => {
        console.log(dbRes);
        res.json({ dbRes })
    })
    .catch(next);
})

router.get('/:id', function (req, res, next) {
    listingModel.findById(req.params.id).populate('author')
        .then(ad => res.status(200).json(ad))
        .catch(next)
});


router.post('/', uploader.single("image"), (req, res, next) => {
    const {
        title,
        category,
        description,
        type,
        isFree
    } = req.body;

    const newAd = {
        title,
        category,
        description,
        type,
        isFree
    }
    newAd.author = req.user._id
    console.log( 'req.file', req.file)
    if (req.file) newAd.image = req.file.secure_url;
    listingModel.create(newAd)
        .then(newAdInDB =>
            userModel.findByIdAndUpdate(req.user._id, {
                $push: {
                    listings: newAdInDB.id
                }
            })
            .then(dbRes => {
                res.status(200).json('ad created')
            })
            .catch(next)
        )
        .catch(next)
});

router.patch('/:id', function (req, res, next) {
    listingModel.findByIdAndUpdate(req.params.id, req.body, {
            new: true
        })
        .then(updatedAd => res.status(201).json(updatedAd))
        .catch(next)
});

router.delete('/:id', function (req, res, next) {
    listingModel.findByIdAndDelete(req.params.id)
        .then(deletedAd =>
            userModel.findByIdAndUpdate(deletedAd.author, {
                $pull: {
                    // "configuration.links": deletedAd.id
                    ads: deletedAd.id
                }
            }, {
                new: true
            })
            .then(user => res.status(200).json(user))
            .catch(next))
        .catch(next)
});

module.exports = router;