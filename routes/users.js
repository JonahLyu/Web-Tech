var express = require('express');
var router = express.Router();
var comDAO = require('../dao/comDAO')
var postDAO = require('../dao/postDAO')
var userDAO = require('../dao/userDAO')
var path = require('path');
var sqlite3 = require(path.join(__dirname , '../node_modules/sqlite3')).verbose();
var db = new sqlite3.Database(path.join(__dirname , '../database/user.db'));
var xss = require('xss');

var ManagementClient = require('auth0').ManagementClient;

// var management = new ManagementClient({
//   domain: process.env.AUTH0_DOMAIN,
//   clientId: process.env.AUTH0_CLIENT_ID,
//   clientSecret: process.env.AUTH0_CLIENT_SECRET,
//   scope: 'delete:users create:users'
// });

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
  try {
    userDAO.getAllUser((users) => {
      //Add delete functionality
      res.send(users);
    });
  } catch (err) {
    res.send();
  }
})

router.get('/setting', secured, function(req, res, next) {
    // const { _raw, _json, ...userProfile } = req.user;
    var userProfile = req.session.user;
    // var userID = req.session.user.id;
    var userID = req.session.user.id;
    if (req.query.id) { //If we recieve a query at all
      let access = ((req.session.user.level === 3) || (req.session.user.id === req.query.id)) && (req.query.id != -1) //Restrict access to admins, or people who own the page
      userID = (access) ? req.query.id : req.session.user.id; //If no access granted send user to their settings page
    } else {
      // res.redirect('/forum/home');
      // return next();
    }
    try {
      userDAO.getUser(userID, (result) => {
        if (!result) { //User sets up own page
          res.render("setting", {title: "Setting",
            userID: userID,
            userProfile: userProfile,
            level: 1,
            accessLevel: req.session.user.level});
        } else if (result) {
          res.render("setting", {title: "Setting",
            userID: userID,
            userProfile: userProfile,
            username: result.Username,
            gender: result.Gender,
            birthday: result.Birthday,
            phone: result.Phone,
            level: result.Level,
            accessLevel: req.session.user.level});
        } else {
          console.log("Can't edit non-existant profile")
        }
      });
    } catch (err) {
      console.log(err);
      res.redirect('/forum/home');
    }
    // res.render("setting", {title: "Setting", userProfile: userProfile});
});


router.post("/info", secured, (req, res) => {
    // req.session.user == userProfile.id now
    // const { _raw, _json, ...userProfile } = req.user;
    try {
      var userID = req.session.user.id;
      userDAO.getUser(userID, (result) => {
        res.send(result)
      });
    } catch (err) {
      console.log(err);
      res.send();
    }
})


router.post('/save_setting', secured, function(req, res, next) {
  //More validation here
  const { _raw, _json, ...userProfile } = req.user;
  if (!req.body.user_id || !req.body.username || !req.body.gender || !req.body.birthday || !req.body.level) {
    res.status(403).send("/forum/home");
    return next();
  }
  let access = ((req.session.user.level === 3) || (req.session.user.id === req.body.user_id)) //Restrict access to admins, or people who own the page
  if (!access) {
    res.status(403).send("/forum/home");
    return next();
  }
  var id = req.body.user_id;
  var username = xss(req.body.username);
  var gender = req.body.gender;
  var birthday = req.body.birthday;
  var phone = xss(req.body.phonenumber); //Validate phone number
  let selfLevelChangeFlag = (req.session.user.id !== req.body.user_id); //Prevents an admin from changing their own level. Prevents case where all admins remove own privileges accidentally, preventing anyone granting these privileges again.
  var level = (req.session.user.level === 3 && selfLevelChangeFlag) ? req.body.level : req.session.user.level;
  level = (level) ? level : 1; //Ensures that if level is undefined it is set to default level: 1.
  let sql = `select * from users where UserID = ?`;
  req.session.user.level = (req.session.user.level) ? req.session.user.level : level;
  try {
    db.all(sql, id, (err, results) => {
      if (err) {
        throw err;
      }
      console.log(id);
      console.log(results);
      if (results.length == 0 && req.session.user.id === req.body.user_id) {
          //send the original auth id to the createUser function
          userDAO.createUser(id, username, birthday ,gender, phone, level, req.session.user.user_id)
          res.status(201).send(201);
      }
      else if (results.length != 0){
          userDAO.updateUser(id, username, birthday ,gender, phone, level)
          res.status(201).send(200);
      }
      else {
        console.log("User needs to create profile first")
      }
    });
  } catch (err) {
    console.log(err);
    res.status(403).send("/forum/home");
  }
});


router.post("/userInfo", secured, (req, res) => {
    if (!req.body.userID) {
      res.send();
      return next();
    }
    var userID = req.body.userID;
    try {
      userDAO.getOtherUser(userID, (result) => {
        res.send(result)
      });
    } catch (err) {
      res.send();
    }
})

router.post("/deleteUser", secured, (req, res) => {
  if (!req.body.userID) {
    res.send("/");
    return next();
  }
  var management = new ManagementClient({
    domain: process.env.AUTH0_DOMAIN,
    clientId: process.env.AUTH0_CLIENT_ID,
    clientSecret: process.env.AUTH0_CLIENT_SECRET,
    scope: 'delete:users create:users'
  });
  if (req.session.user.level === 3 || req.body.userID === req.session.user.id) {
    try {
      userDAO.getUser(req.body.userID, (user) => {
        console.log(user.Username);
        management.users.delete({ id: user.AuthID }, function (err) {
          if (err) {
            console.log(err)
          }
          console.log("User deleted");
          userDAO.deleteUser(req.body.userID);
          postDAO.deletePostByUser(req.body.userID);
          comDAO.deleteComByUserID(req.body.userID);
          if (req.session.user.level === 3 && req.body.userID !== req.session.user.id) { //If admin, send to home page
            res.send("/");
          } else { //If user force re-log as only time we rach here is when user has deleted own account
            req.session.user = null;
            req.session.returnTo = "/";
            res.send("/login");
          }
        });
      })
    } catch (err) {
      res.send("/login");
    }
  } else {
    res.send("/");
  }
})

module.exports = router;
