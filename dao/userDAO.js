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
function createUser(id, username, birthday ,gender, phone, level){
    sql = `insert into users values (?, ?, ?, ?, ?, ?)`
    db.run(sql, [id, username, birthday ,gender, phone, level], (err, results) => {
        if (err) {
            throw err;
        } else {
            console.log("user " + id + " info created!");
        }
    });

}
function updateUser(id, username, birthday ,gender, phone, level){
    sql = `update users set Username = ?, Birthday = ?, Gender = ?, Phone = ?, Level = ? where UserID = ?`
    db.run(sql, [username, birthday, gender, phone, level, id], (err, results) => {
        if (err) {
            throw err;
        } else {
            console.log("user " + id + " info updated!");
        }
    });
}

function getAccessLevel(userID, callback) {
    var stmt = db.prepare(`select Level from users where UserID = ?`);
    stmt.get(userID, (err, level) => {
        if (err) {
            stmt.finalize();
            throw err;
        } else {
            stmt.finalize();
            if (level) callback(level);
            else callback(1);
        }
    })
}

function getAllUser(callback) {
    var stmt = db.prepare(`select UserID, Username, Gender from users`);
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


async function getUser(userID, getCallback) { //Needs the callback to allow proper execution, otherwise function doesn't have time to execute
    var stmt = db.prepare(`select * from users where UserID = ?`);
    stmt.get(userID, (err, row) => {
        if (err) {
            stmt.finalize()
            throw err
        } else {
            stmt.finalize()
            getCallback(row)
        }
    });
}

async function getMultiUser(userIDs, getCallback) { //Needs the callback to allow proper execution, otherwise function doesn't have time to execute
    var stmt = db.prepare(`select * from users where UserID in (?)`);
    stmt.all(userIDs, (err, rows) => {
        if (err) {
            stmt.finalize()
            throw err;
        } else {
            stmt.finalize()
            getCallback(rows)
        }
    });
}

async function getOtherUser(userID, getCallback) { //Needs the callback to allow proper execution, otherwise function doesn't have time to execute
    var stmt = db.prepare(`select UserID, Username, Gender from users where UserID = ?`);
    stmt.get(userID, (err, row) => {
        if (err) {
            stmt.finalize()
            throw err
        } else {
            stmt.finalize()
            getCallback(row)
        }
    });
}

var userDAO = {
    createUser: createUser,
    updateUser: updateUser,
    getAccessLevel: getAccessLevel,
    getAllUser: getAllUser,
    getUser: getUser,
    getMultiUser: getMultiUser,
    getOtherUser: getOtherUser
}

module.exports = userDAO
