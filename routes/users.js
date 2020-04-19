var express = require('express');
var router = express.Router();
var path = require('path');
var sqlite3 = require(path.join(__dirname , '../node_modules/sqlite3')).verbose();
var db = new sqlite3.Database(path.join(__dirname , '../database/user.db'));

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.sendFile(path.join(__dirname , '../public/welcome.html'));
});

router.post('/login', function(req, res, next) {
    var username = req.body.username;
    var password = req.body.password;
    let sql = `select * from users where username = ? and password = ?`;

    db.all(sql, [username, password], (err, results) => {
      if (err) {
        throw err;
      }
      if (results.length == 0) {
          res.send('wrong username or password');
      }
      else {
          res.send("success");
          // res.redirect('/public/login_successs.html');
          results.forEach((result) => {
            console.log(result.username + ' ' + result.password);
          });

      }
    });

});

router.post('/register', function(req, res, next) {

  var username = req.body.username;
  var password = req.body.password;
  var birthday = null;
  var gender = null;
  var email = null;
  let sql = `select * from users where username = ?`;
  console.log("Want to reg");

  db.all(sql, [username], (err, results) => {
    if (err) {
      console.log("1");
      throw err;
    }
    if (results.length != 0) {
        console.log("2");
        res.send('Username in use');
    }
    else {
        sql = `insert into users values (?, ?, ?, ?, ?, ?)`
        db.run(sql, [null, username, password, birthday, gender, email], (err, results) => {
          if (err) {
            console.log("3");
            throw err;
          } else {
            res.send("success");
          }
        });

    }
  });

});

router.get('/test', function(req, res, next) {
  res.send('hello');
});


module.exports = router;
