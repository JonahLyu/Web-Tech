var express = require('express');
var path = require('path');
var sqlite3 = require(path.join(__dirname , '../node_modules/sqlite3')).verbose();
var db = new sqlite3.Database(path.join(__dirname , '../database/user.db'));
let table = `posts`

function Post(id, content, date){
  this.UserID = id;
  this.Content = content;
  this.Date = date;
}

//create a new post entry in database
function createPost(id, content, date){
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

//delete a new post entry in database
function deletePost(postID){
    let sql = `delete from ` + table + ` where postID = ?`;

    db.all(sql, [postID], (err, results) => {
        if (err) {
            throw err;
        }
        else {
            console.log("post deleted " + postID);
        }
    });

}

var postDAO = {
    createPost: createPost,
    deletePost: deletePost
}


module.exports = postDAO
