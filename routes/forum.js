var express = require('express');
var router = express.Router();
var userDAO = require('../dao/userDAO')
var postDAO = require('../dao/postDAO')
var catDAO = require('../dao/catDAO')
var joinDAO = require('../dao/joinDAO')
var comDAO = require('../dao/comDAO')
var forumHelpers = require('../helpers/forumHelpers')
var moment = require('moment')

//Middleware to require account
const secured = (req, res, next) => {
    if (req.session.user) {
        return next();
    }
    req.session.returnTo = req.originalUrl;
    res.redirect("/login");
};

router.get('/home',secured, function(req, res, next) {
    // let sql = `select * from posts where UserID = ? order by PostID desc`;
    // const { _raw, _json, ...userProfile } = req.user
    var id = req.session.user.id;
    userDAO.getUser(id, (result) => {
      if (result) {
        joinDAO.getRecentPostWithDetails((popularPosts) => {
          catDAO.getAllCat((allCats) => {
            forumHelpers.truncPosts(popularPosts, 200);
            console.log(result);
            console.log(req.session.user.level);
            res.render("home", {title: "Home",
                                    userProfile: req.session.user,
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
    var title = req.body.title
    var content = req.body.content
    //do not create a post with empty cat or title or content
    if (catID == -1 || title == null || content == null) {
        console.log("fail to create a post");
    }
    else{
        var time = moment().format("MMM Do YY, h:mm:ss a")
        postDAO.createPost(userID, catID, title, content, time)
    }
    // res.redirect('/users/home')
    res.redirect('back');
});

//delete a post in database
router.post('/deletePost', secured, function(req, res, next) {
    var postID = req.body.postID;
    var userID = req.session.user.id;
    postDAO.validateCreator(postID, userID, (post, user, bool) => {
        if (bool || (req.session.user.level === 3)) { //Allow creator or admin to delete post
            postDAO.deletePost(post);
            comDAO.deleteComByPostID(post);
        }
        // res.redirect('back');
        res.send(req.get('referer'));
    })
});

router.post('/deleteUserPost', secured, function(req, res, next) {
    var postID = req.body.postID;
    var userID = req.session.user.id;
    postDAO.validateCreator(postID, userID, (post, user, bool) => {
        if (bool || (req.session.user.level === 3)) { //Allow creator or admin to delete post
            postDAO.deletePost(post);
            comDAO.deleteComByPostID(post);
        }
        res.send('/forum/loadCategory?id='+req.body.catID+'&title='+req.body.catTitle);
    })
});

// router.get('/newcat',secured, function(req, res, next) {
//     const { _raw, _json, ...userProfile } = req.user;
//     res.render("category", {title: "New Category", userProfile: userProfile});
//   });

//create a category in database
router.post('/createCategory', secured, function(req, res, next) {
    var title = req.body.title
    var description = req.body.description
    if (req.session.user.level === 3) {
        catDAO.createCat(title, description);
        // res.redirect("/")
    }
    res.redirect("/")
});

router.post('/deleteCategory', secured, function(req, res, next) {
    var catID = req.body.cat_id;
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
    joinDAO.getPostWithDetailsByPostID(req.query.id, (post) => {
        if (post == null) res.send(404)
        else{
            console.log(post);
            res.render("single", {title: "Post",
                                    userProfile: req.session.user,
                                    post: post,
                                    level: req.session.user.level
            })
        }
    })
});

router.post('/addPostLike', secured, function(req, res, next) {
    try {
        if (!req.body.postid) throw "Post ID undefined"
        var postID = req.body.postid
        postDAO.addPostLike(postID)
        postDAO.getPostByID(postID, (post) => {
            if (!post) {
                throw "Post was undefined";
            }
            res.json({likeCount: post.LikeCount})
        })
    } catch(err) {
        console.log(err);
    }
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
    var date = moment().format("MMM Do YY, h:mm:ss a")
    comDAO.createCom(postID, content, userID, date)
    res.redirect('back');
});

router.post('/deleteCom', secured, function(req, res, next) {
    var comID = req.body.comID
    var userID = req.session.user.id
    var bypass = (req.session.user.level >= 2);
    comDAO.deleteCom(comID, userID, bypass);
    // res.redirect('back');
    res.send(req.get('referer'));
});

router.post('/getComByPostID', secured, function(req, res, next) {
    var postID = req.body.postID
    var userID = req.session.user.id
    comDAO.getComByPostID(postID, (comments)=>{
        for (let i = 0; i < comments.length; i++) {
            if (comments[i].UserID === req.session.user.id || req.session.user.level >= 2) comments[i].deleteButton = true;
            else comments[i].deleteButton = false;
        }
        // console.log(comments);
        res.send(comments)
    })
});

router.get('/loadUser', secured, function(req, res, next) {
    var userID = req.query.id
    joinDAO.getPostsWithDetailsByUserID(userID, (posts) => {
        forumHelpers.truncPosts(posts, 200);
        let editAccess = (req.session.user.level === 3) || (req.session.user.id === userID);
        let editID = (editAccess) ? userID : -1;
        res.render("user", {title: "UserPage",
                                userID: editID,
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
                                level: req.session.user.level,
                                posts: posts,
                                searchInput: input,
                                resultCount: posts.length})
    })
});



module.exports = router;
