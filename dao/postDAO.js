var express = require('express');
var path = require('path');
var sqlite3 = require(path.join(__dirname , '../node_modules/sqlite3')).verbose();
var db = new sqlite3.Database(path.join(__dirname , '../database/user.db'));
let table = `posts`
//create a new post entry in database
function create(id, content, date){
    var postID = null;
    let sql = `insert into ` + table + ` values (?, ?, ?, ?)`;

    db.all(sql, [postID, id, content, date], (err, results) => {
        if (err) {
            throw err;
        }
        else {
            console.log("post created " + date);
        }
    });

}



module.exports = create
