const md5 = require("js-md5")

var sqlite3 = require("sqlite3").verbose();
var db = new sqlite3.Database('../database/user.db');

function getAllUser(callback) {
  var stmt = db.prepare(`select UserID from comments`);
  stmt.all((err, rows) => {
      if (err) {
          stmt.finalize()
          throw err
      } else {
          stmt.finalize()
          callback(rows)
      }
  });
}

function updateUser(id, newID){
  console.log(id + " "+ newID);
  sql = `update comments set UserID = ? where UserID = ?`
  db.run(sql, [newID, id], (err, results) => {
      if (err) {
          throw err;
      } else {
          console.log("user " + id + " info updated!");
      }
  });
}

getAllUser((results)=>{
  results.forEach(result => {
    updateUser(result.UserID, md5(result.UserID))
  });
  
})


