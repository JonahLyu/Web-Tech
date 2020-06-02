var express = require('express');
var router = express.Router();
var postDAO = require('../dao/postDAO')
var userDAO = require('../dao/userDAO')
var catDAO = require('../dao/catDAO')
var forumHelpers = require('../helpers/forumHelpers')
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
    res.redirect('/users/home');
});

router.get('/setting', secured, function(req, res, next) {
    const { _raw, _json, ...userProfile } = req.user;
    var userID = req.session.user.id;
    userDAO.getUser(userID, (result) => {
      if (!result) {
        res.render("setting", {title: "Setting",
          userProfile: userProfile,
          level: req.session.user.level});
      } else {
        res.render("setting", {title: "Setting",
          userProfile: userProfile,
          username: result.Username,
          gender: result.Gender,
          birthday: result.Birthday,
          phone: result.Phone,
          level: req.session.user.level});
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
  console.log(req.body.level);
  console.log(req.session.user.level);
  var level = (req.session.user.level) ? req.session.user.level : 1; //default user lever is 1
  let sql = `select * from users where UserID = ?`;
  req.session.user.level = level;
  db.all(sql, [id], (err, results) => {
    if (err) {
      throw err;
    }
    if (results.length == 0) {
        userDAO.createUser(id, username, birthday ,gender, phone, level)
        res.send("success!")
    }
    else {
        userDAO.updateUser(id, username, birthday ,gender, phone, level)
        res.send("success!")
    }
  });
});


router.get('/newcat',secured, function(req, res, next) {
  const { _raw, _json, ...userProfile } = req.user;
  res.render("category", {title: "New Category", userProfile: userProfile});
});


router.post("/userInfo", secured, (req, res) => {
    var userID = req.body.userID;
    userDAO.getOtherUser(userID, (result) => {
      res.send(result)
    });
})

module.exports = router;
