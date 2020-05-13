var express = require('express');
var router = express.Router();
var postDAO = require('../dao/postDAO')
var catDAO = require('../dao/catDAO')
var moment = require('moment')


const secured = (req, res, next) => {
    if (req.user) {
        return next();
    }
    req.session.returnTo = req.originalUrl;
    res.redirect("/login");
};


//create a new post entry in database
router.post('/createPost', secured, function(req, res, next) { //We'll want to add a title for posts that aren't replies or just treat them differently
    const { _raw, _json, ...userProfile } = req.user
    var catID = req.body.category
    var content = req.body.content
    var title = req.body.title
    var time = moment().format("MMM Do YY, h:mm:ss a")
    postDAO.createPost(userProfile.id, catID, title, content, time)
    // res.redirect('/users/home')
    res.redirect('back');
});

//delete a post in database
router.post('/deletePost', secured, function(req, res, next) {
    var postID = req.body.postid
    postDAO.deletePost(postID)
    res.redirect('/users/home')
});

//create a category in database
router.post('/createCategory', secured, function(req, res, next) {
    var title = req.body.title
    var description = req.body.description
    catDAO.createCat(title, description)
    catDAO.getAllCat((result) => {
       res.cookie('categories', JSON.stringify(result))
    })
});

//get all categories in database
router.get('/getCategory', secured, function(req, res, next) {
    catDAO.getAllCat((result) => {
        if (!result) {
          res.send('empty')
        } else {
          res.json(result)
        }
    })
});

router.get('/loadCategory', secured, function(req, res, next) {
    // console.log(req.query)
    // console.log(req.session.user);
    postDAO.getAllPostsByCat(req.query.id, (posts) => {
        res.render("posts", {title: req.query.title,
                                userProfile: req.session.user,
                                posts: posts,
                                cat: req.query})
    })
});

router.get('/loadPost', secured, function(req, res, next) {
    console.log(req.query);
    console.log(req.hostname);
});

module.exports = router;
