var express = require('express');
var path = require('path');
var sqlite3 = require(path.join(__dirname , '../node_modules/sqlite3')).verbose();
var db = new sqlite3.Database(path.join(__dirname , '../database/user.db'));
let table = `users`

// function Post(id, content, date){
//   this.UserID = id;
//   this.Content = content;
//   this.Date = date;
// }

//create a user entry in database
function createUser(id, content, date){
    // var postID = null;
    let sql = `insert into ` + table + ` values (?, ?, ?, ?)`;

    db.all(sql, [postID, id, content, date], (err, results) => {
        if (err) {
            throw err;
        }
        else {
            console.log("user created " + date);
        }
    });

}

// //delete a user entry in database
// function deleteUser(userID){
//     let sql = `delete from ` + table + ` where UserID = ?`;

//     db.all(sql, [postID], (err, results) => {
//         if (err) {
//             throw err;
//         }
//         else {
//             console.log("user deleted " + postID);
//         }
//     });

// }

async function getUser(userID, getCallback) { //Needs the callback to allow proper execution, otherwise function doesn't have time to execute
    var stmt = db.prepare(`select * from users where UserID = ?`);
    stmt.get(userID, (err, row) => {
        if (err) {
            stmt.finalize();
            throw err;
        } else {
            stmt.finalize();
            getCallback(row);
        }
    });
}

async function getMultiUser(userIDs, getCallback) { //Needs the callback to allow proper execution, otherwise function doesn't have time to execute
    var stmt = db.prepare(`select * from users where UserID in (?)`);
    stmt.all(userIDs, (err, rows) => {
        if (err) {
            stmt.finalize();
            throw err;
        } else {
            stmt.finalize();
            getCallback(rows);
        }
    });
}

var userDAO = {
    createUser: createUser,
    getUser: getUser,
    getMultiUser: getMultiUser
    // deleteUser: deleteUser
}


module.exports = userDAO
