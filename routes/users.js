var express = require('express');
var router = express.Router();
var postDAO = require('../dao/postDAO')
var userDAO = require('../dao/userDAO')
var catDAO = require('../dao/catDAO')
var forumHelpers = require('../helpers/forumHelpers')
var path = require('path');
var sqlite3 = require(path.join(__dirname , '../node_modules/sqlite3')).verbose();
var db = new sqlite3.Database(path.join(__dirname , '../database/user.db'));

var ManagementClient = require('auth0').ManagementClient;

var management = new ManagementClient({
  domain: process.env.AUTH0_DOMAIN,
  clientId: process.env.AUTH0_CLIENT_ID,
  clientSecret: process.env.AUTH0_CLIENT_SECRET,
  scope: 'delete:users create:users'
});

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

router.get('/listUsers', secured, function(req, res, next) {
  res.render("user_list", {title: "Users",
                        userProfile: req.session.user,
                        level: req.session.user.level
  })
});

router.get('/allProfiles', secured, function(req,res,next) { 
  console.log(req.session.user);
  userDAO.getAllUser((users) => {
    //Add delete functionality
    res.send(users);
  });
})

router.get('/setting', secured, function(req, res, next) {
    const { _raw, _json, ...userProfile } = req.user;
    // var userID = req.session.user.id;
    var userID = req.session.user.id;
    if (req.query.id) { //If we recieve a query at all
      let access = ((req.session.user.level === 3) || (req.session.user.id === req.query.id)) && (req.query.id != -1) //Restrict access to admins, or people who own the page
      userID = (access) ? req.query.id : req.session.user.id; //If no access granted send user to their settings page
    }
    userDAO.getUser(userID, (result) => {
      if (!result) {
        res.render("setting", {title: "Setting",
          userID: userID,
          userProfile: userProfile,
          level: 1,
          accessLevel: req.session.user.level});
      } else {
        res.render("setting", {title: "Setting",
          userID: userID,
          userProfile: userProfile,
          username: result.Username,
          gender: result.Gender,
          birthday: result.Birthday,
          phone: result.Phone,
          level: result.Level,
          accessLevel: req.session.user.level});
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
  let access = ((req.session.user.level === 3) || (req.session.user.id === req.body.user_id)) //Restrict access to admins, or people who own the page
  if (!access) {
    res.status(403).send("/forum/home");
    return next();
  }
  var id = req.body.user_id;
  var username = req.body.username;
  var gender = req.body.gender;
  var birthday = req.body.birthday;
  var phone = req.body.phonenumber;
  let selfLevelChangeFlag = (req.session.user.id !== req.body.user_id); //Prevents an admin from changing their own level. Prevents case where all admins remove own privileges accidentally, preventing anyone granting these privileges again.
  var level = (req.session.user.level === 3 && selfLevelChangeFlag) ? req.body.level : req.session.user.level;
  level = (level) ? level : 1; //Ensures that if level is undefined it is set to default level: 1.
  let sql = `select * from users where UserID = ?`;
  req.session.user.level = (req.session.user.level) ? req.session.user.level : level;
  db.all(sql, [id], (err, results) => {
    if (err) {
      throw err;
    }
    console.log(results);
    if (results.length == 0) {
        userDAO.createUser(id, username, birthday ,gender, phone, level)
        res.status(201).send(201);
    }
    else {
        userDAO.updateUser(id, username, birthday ,gender, phone, level)
        res.status(201).send(201);
    }
  });
});


router.post("/userInfo", secured, (req, res) => {
    var userID = req.body.userID;
    userDAO.getOtherUser(userID, (result) => {
      res.send(result)
    });
})

router.post("/deleteUser", secured, (req, res) => {
  if (req.session.user.level === 3 || req.body.userID === req.session.user.id) {
    management.users.delete({ id: req.body.userID }, function (err) {
      if (err) {
        console.log(err)
      }
      console.log("User deleted");
      userDAO.deleteUser(req.body.userID);
      //Delete posts and comments
      if (req.session.user.level === 3) { //If admin, send to home page
        res.send("/");
      } else { //If user force re-log as only time we rach here is when user has deleted own account
        req.session.user = null;
        req.session.returnTo = "/";
        res.send("/login");
      }
    });
  }
})

module.exports = router;
