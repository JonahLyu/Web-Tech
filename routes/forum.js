var express = require('express');
var router = express.Router();
var create = require('../dao/postDAO')
var moment = require('moment')


const secured = (req, res, next) => {
    if (req.user) {
        return next();
    }
    req.session.returnTo = req.originalUrl;
    res.redirect("/login");
};


//create a new post entry in database
router.post('/post',secured, function(req, res, next) {
    const { _raw, _json, ...userProfile } = req.user
    var content = req.body.content
    var time = moment().format("MMM Do YY, h:mm:ss a")
    create(userProfile.id, content, time)
    res.redirect('/users/newpost')
});


module.exports = router;
