var express = require('express');
var router = express.Router();
var postDAO = require('../dao/postDAO')
var catDAO = require('../dao/catDAO')
var joinDAO = require('../dao/joinDAO')
var forumHelpers = require('../helpers/forumHelpers')
var moment = require('moment')


const secured = (req, res, next) => {
    if (req.session.user) {
        return next();
    }
    req.session.returnTo = req.originalUrl;
    res.redirect("/login");
};


//create a new post entry in database
router.post('/createPost', secured, function(req, res, next) { //We'll want to add a title for posts that aren't replies or just treat them differently
    // const { _raw, _json, ...userProfile } = req.user
    var userID = req.session.user.id;
    var catID = req.body.category
    var content = req.body.content
    var title = req.body.title
    var time = moment().format("MMM Do YY, h:mm:ss a")
    postDAO.createPost(userID, catID, title, content, time)
    // res.redirect('/users/home')
    res.redirect('back');
});

//delete a post in database
router.post('/deletePost', secured, function(req, res, next) {
    var postID = req.body.postid;
    var userID = req.session.user.id;
    postDAO.validateCreator(postID, userID, (post, user, bool) => {
        if (bool) {
            postDAO.deletePost(post);
        }
        res.redirect('back');
    })
});

//create a category in database
router.post('/createCategory', secured, function(req, res, next) {
    var title = req.body.title
    var description = req.body.description
    catDAO.createCat(title, description)
    res.send("success!")
});

router.post('/deleteCategory', secured, function(req, res, next) {
    var catID = req.body.cat_id;
    // console.log(req.body.cat_id);
    //Add in admin validation check here,
    catDAO.clearCat(catID);
    catDAO.deleteCat(catID, () => {
        res.send(req.get('referer'));
    });
});


router.get('/loadCategory', secured, function(req, res, next) {
    // console.log(req.session.user);
    joinDAO.getPostsWithDetailsByCatID(req.query.id, (posts) => {
        forumHelpers.truncPosts(posts, 200);
        // console.log(posts);
        res.render("posts", {title: req.query.title,
                                userProfile: req.session.user,
                                posts: posts,
                                cat: req.query})
    })
});

router.get('/loadPost', secured, function(req, res, next) {
    postDAO.getPostByID(req.query.id, (post) => {
        catDAO.getCatByID(post.CatID, (cat) => {
            console.log("load post id = " + req.query.id);
            console.log(post);
            res.render("single", {title: req.query.title,
                                    userProfile: req.session.user,
                                    post: post,
                                    cat: cat})
        })
    })
});

router.post('/addPostLike', secured, function(req, res, next) {
    var postID = req.body.postid
    postDAO.addPostLike(postID)
    postDAO.getPostByID(postID, (post) => {
        res.json({likeCount: post.LikeCount})
    })
});

module.exports = router;
