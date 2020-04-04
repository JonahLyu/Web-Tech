var express = require('express');
var router = express.Router();
var path = require('path');
var sqlite3 = require(path.join(__dirname , '../node_modules/sqlite3')).verbose();
var db = new sqlite3.Database(path.join(__dirname , '../database/user.sqlite3'));

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

router.get('/test', function(req, res, next) {
  res.send('hello');
});


module.exports = router;
