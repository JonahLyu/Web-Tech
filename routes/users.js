var express = require('express');
var router = express.Router();
var postDAO = require('../dao/postDAO')
var userDAO = require('../dao/userDAO')
var catDAO = require('../dao/catDAO')
var path = require('path');
var sqlite3 = require(path.join(__dirname , '../node_modules/sqlite3')).verbose();
var db = new sqlite3.Database(path.join(__dirname , '../database/user.db'));


const secured = (req, res, next) => {
    if (req.session.user) {
        return next();
    }
    req.session.returnTo = req.originalUrl;
    res.redirect("/login");
};

/* GET users listing. */
router.get('/', secured, function(req, res, next) {
    res.redirect('/users/info');
});

router.get('/setting', secured, function(req, res, next) {
    const { _raw, _json, ...userProfile } = req.user;
    var userID = req.session.user.id;
    userDAO.getUser(userID, (result) => {
      if (!result) {
        res.render("setting", {title: "Setting",
          userProfile: userProfile});
      } else {
        res.render("setting", {title: "Setting",
          userProfile: userProfile,
          username: result.Username,
          gender: result.Gender,
          birthday: result.Birthday,
          phone: result.Phone});
      }
    });
    // res.render("setting", {title: "Setting", userProfile: userProfile});
});


router.post("/info", secured, (req, res) => {
    // req.session.user == userProfile.id now
    const { _raw, _json, ...userProfile } = req.user;
    var userID = req.session.user.id;
    userDAO.getUser(userID, (result) => {
      res.send(result)
    });
})


router.post('/save_setting', secured, function(req, res, next) {
  const { _raw, _json, ...userProfile } = req.user;
  var id = req.session.user.id;
  var username = req.body.username;
  var gender = req.body.gender;
  var birthday = req.body.birthday;
  var phone = req.body.phonenumber;
  var level = 1; //default user lever is 1
  let sql = `select * from users where UserID = ?`;

  db.all(sql, [id], (err, results) => {
    if (err) {
      throw err;
    }
    if (results.length == 0) {
        userDAO.createUser(id, username, birthday ,gender, phone, level)
        res.send("success!")
    }
    else {
        userDAO.updateUser(id, username, birthday ,gender, phone)
        res.send("success!")
    }
  });
});


router.get('/newcat',secured, function(req, res, next) {
  const { _raw, _json, ...userProfile } = req.user;
  res.render("category", {title: "New Category", userProfile: userProfile});
});

router.get('/home',secured, function(req, res, next) {
    // let sql = `select * from posts where UserID = ? order by PostID desc`;
    const { _raw, _json, ...userProfile } = req.user
    var id = req.session.user.id;
    postDAO.getAllPostsByUser(id, (userPosts) => {
      catDAO.getAllCat((allCats) => {
        console.log(allCats[0]);
        res.render("home", {title: "Home",
                                userProfile: userProfile,
                                posts: userPosts,
                                cats: allCats})
      });
    });
    // db.all(sql, [id], (err, results) => {
    //     if (err) {
    //         throw err;
    //     }
    //     else {
    //         res.render("listpost", {title: "AllPost",
    //                                 userProfile: userProfile,
    //                                 posts: results})
    //     }
    // });
});

module.exports = router;
