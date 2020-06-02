var express = require('express');
var router = express.Router();
var userDAO = require('../dao/userDAO')
var postDAO = require('../dao/postDAO')
var catDAO = require('../dao/catDAO')
var joinDAO = require('../dao/joinDAO')
var comDAO = require('../dao/comDAO')
var forumHelpers = require('../helpers/forumHelpers')
var moment = require('moment')


const secured = (req, res, next) => {
    if (req.session.user) {
        return next();
    }
    req.session.returnTo = req.originalUrl;
    res.redirect("/login");
};

router.get('/home',secured, function(req, res, next) {
    // let sql = `select * from posts where UserID = ? order by PostID desc`;
    const { _raw, _json, ...userProfile } = req.user
    var id = req.session.user.id;
    userDAO.getUser(id, (result) => {
      if (result) {
        joinDAO.getPopularPostsWithDetails((popularPosts) => {
          catDAO.getAllCat((allCats) => {
            forumHelpers.truncPosts(popularPosts, 200);
            console.log(result);
            console.log(req.session.user.level);
            res.render("home", {title: "Home",
                                    userProfile: userProfile,
                                    level: req.session.user.level,
                                    posts: popularPosts,
                                    cats: allCats})
          });
        });
      } else {
        res.redirect('/users/setting')
      }
    });
});


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
        if (bool || (req.session.user.level === 3)) { //Allow creator or admin to delete post
            postDAO.deletePost(post);
        }
        res.redirect('back');
    })
});

router.post('/deleteUserPost', secured, function(req, res, next) {
    var postID = req.body.postid;
    var userID = req.session.user.id;
    postDAO.validateCreator(postID, userID, (post, user, bool) => {
        if (bool || (req.session.user.level === 3)) { //Allow creator or admin to delete post
            postDAO.deletePost(post);
        }
        res.redirect('/');
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
    if (req.session.user.level === 3) {
        catDAO.clearCat(catID);
        catDAO.deleteCat(catID, () => {
            res.send(req.get('referer'));
        });
    }
});


router.get('/loadCategory', secured, function(req, res, next) {
    // console.log(req.session.user);
    joinDAO.getPostsWithDetailsByCatID(req.query.id, (posts) => {
        forumHelpers.truncPosts(posts, 200);
        res.render("posts", {title: req.query.title,
                                userProfile: req.session.user,
                                level: req.session.user.level, //Included seperately to specify we want the elvel from the session
                                posts: posts,
                                cat: req.query})
    })
});

router.get('/loadPost', secured, function(req, res, next) {
    postDAO.getPostByID(req.query.id, (post) => {
        if (post == null) res.send(404)
        else{
            catDAO.getCatByID(post.CatID, (cat) => {
                res.render("single", {title: "Post",
                                        userProfile: req.session.user,
                                        post: post,
                                        cat: cat})
            })
        }
    })
});

router.post('/addPostLike', secured, function(req, res, next) {
    var postID = req.body.postid
    postDAO.addPostLike(postID)
    postDAO.getPostByID(postID, (post) => {
        res.json({likeCount: post.LikeCount})
    })
});

//comment routes
router.post('/addComLike', secured, function(req, res, next) {
    var comID = req.body.comID
    comDAO.addPostLike(comID)
    comDAO.getComLikeByID(comID, (result) => {
        res.json({likeCount: result.LikeCount})
    })
});

router.post('/createCom', secured, function(req, res, next) {
    var userID = req.session.user.id;
    var postID = req.body.postID
    var content = req.body.content
    var formattedContent = ((content.replace(/<(.+?)>/gi,"&lt;$1&gt;")).replace(/ /gi,"&nbsp;")).replace(/\n/gi,"<br/>");
    var date = moment().format("MMM Do YY, h:mm:ss a")
    comDAO.createCom(postID, formattedContent, userID, date)
    res.redirect('back');
});

router.post('/deleteCom', secured, function(req, res, next) {
    var comID = req.body.comID
    var userID = req.session.user.id
    var bypass = (req.session.user.level >= 2);
    comDAO.deleteCom(comID, userID, bypass);
    res.redirect('back');
});

router.post('/getComByPostID', secured, function(req, res, next) {
    var postID = req.body.postID
    var userID = req.session.user.id
    comDAO.getComByPostID(postID, (comments)=>{
        res.send(comments)
    })
});

router.get('/loadUser', secured, function(req, res, next) {
    var userID = req.query.id
    joinDAO.getPostsWithDetailsByUserID(userID, (posts) => {
        forumHelpers.truncPosts(posts, 200);
        var editAccess = (req.session.user.level === 3) || (req.session.user.id === userID);
        res.render("user", {title: "UserPage",
                                userProfile: req.session.user,
                                posts: posts,
                                editAccess: editAccess,
                                thisUserID: userID})
    })
});

router.get('/search', secured, function(req, res, next) {
    var input = req.query.input
    joinDAO.search(input, (posts) => {
        forumHelpers.truncPosts(posts, 200);
        res.render("search", {title: "Search Result",
                                userProfile: req.session.user,
                                posts: posts,
                                searchInput: input,
                                resultCount: posts.length})
    })
});



module.exports = router;
