var express = require('express');
var router = express.Router();
var postDAO = require('../dao/postDAO')
var moment = require('moment')


const secured = (req, res, next) => {
    if (req.user) {
        return next();
    }
    req.session.returnTo = req.originalUrl;
    res.redirect("/login");
};


//create a new post entry in database
router.post('/createPost', secured, function(req, res, next) {
    const { _raw, _json, ...userProfile } = req.user
    var content = req.body.content
    var time = moment().format("MMM Do YY, h:mm:ss a")
    postDAO.createPost(userProfile.id, content, time)
    res.redirect('/users/newpost')
});

//delete a post in database
router.post('/deletePost', secured, function(req, res, next) {
    var postID = req.body.postid
    postDAO.deletePost(postID)
    res.redirect('/users/listPosts')
});

module.exports = router;
