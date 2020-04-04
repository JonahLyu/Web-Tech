var express = require('express');
var router = express.Router();
var path = require('path');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.sendFile(path.join(__dirname , '../public/welcome.html'));
});

router.post('/login', function(req, res, next) {
  var name = req.body.username;
  var password = req.body.password;


  if (name == "abc" && password == "123") {
      res.send('Success!!!');
  }
  else{
      res.send('Fail');
  }
});

module.exports = router;
