var express = require('express');
var router = express.Router();
var userDAO = require('../dao/userDAO')
var path = require('path');
var sqlite3 = require(path.join(__dirname , '../node_modules/sqlite3')).verbose();
var db = new sqlite3.Database(path.join(__dirname , '../database/user.db'));


const secured = (req, res, next) => {
    if (req.user) {
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
    userDAO.getUser(userProfile.id, (result) => {
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


router.get("/info", secured, (req, res) => {
    const { _raw, _json, ...userProfile } = req.user;
    userDAO.getUser(userProfile.id, (result) => {
      if (!result) { //No user found for logged in user, we need to save details
        res.redirect('/users/setting')
      } else {
        res.render("user", {title: "Profile",
          userProfile: userProfile,
          username: result.Username,
          gender: result.Gender,
          birthday: result.Birthday,
          phone: result.Phone});
      }
    });
})


router.post('/save_setting', secured, function(req, res, next) {
    const { _raw, _json, ...userProfile } = req.user;
  var id = userProfile.id;
  var username = req.body.username;
  var gender = req.body.gender;
  var birthday = req.body.birthday;
  var phone = req.body.phonenumber;
  let sql = `select * from users where UserID = ?`;

  db.all(sql, [id], (err, results) => {
    if (err) {
      throw err;
    }
    if (results.length == 0) {
        sql = `insert into users values (?, ?, ?, ?, ?)`
        db.run(sql, [id, username, birthday ,gender, phone], (err, results) => {
          if (err) {
            throw err;
          } else {
            // res.send("success!");
            res.redirect('/users/info');
          }
        });
    }
    else {
        sql = `update users set Username = ?, Birthday = ?, Gender = ?, Phone = ? where UserID = ?`
        db.run(sql, [username, birthday,gender, phone, id], (err, results) => {
          if (err) {
            throw err;
          } else {
            // res.send("success!");
            res.redirect('/users/info');
          }
        });
    }
  });
});

router.get('/newpost',secured, function(req, res, next) {
    const { _raw, _json, ...userProfile } = req.user;
    res.render("post", {title: "New Post", userProfile: userProfile});
});

router.get('/newcat',secured, function(req, res, next) {
  const { _raw, _json, ...userProfile } = req.user;
  res.render("category", {title: "New Category", userProfile: userProfile});
});

router.get('/listPosts',secured, function(req, res, next) {
    let sql = `select * from posts where UserID = ?`;
    const { _raw, _json, ...userProfile } = req.user
    var id = userProfile.id
    db.all(sql, [id], (err, results) => {
        if (err) {
            throw err;
        }
        else {
            res.render("listpost", {title: "AllPost", userProfile: userProfile, posts: results})
        }
    });
});


module.exports = router;
