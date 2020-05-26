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
function createPost(id, catID, title, content, date){
    var postID = null;
    var likeCount = 0;
    let sql = `insert into ` + table + ` values (?, ?, ?, ?, ?, ?, ?)`;

    db.all(sql, [postID, id, content, date, title, catID, likeCount], (err, results) => {
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

function getAllPostsByUser(userID, callback) {
    var stmt = db.prepare(`select * from posts where UserID = ? order by PostID desc`);
    stmt.all(userID, (err, row) => {
        if (err) {
            stmt.finalize();
            throw err;
        } else {
            stmt.finalize();
            callback(row);
        }
    });
}

function getAllPostsByCat(catID, callback) {
    var stmt = db.prepare(`select * from posts where CatID = ? order by PostID desc`);
    stmt.all(catID, (err, row) => {
        if (err) {
            stmt.finalize();
            throw err;
        } else {
            stmt.finalize();
            callback(row);
        }
    });
}

function getPostByID(postID, callback) {
    var stmt = db.prepare(`select * from posts where PostID = ?`);
    stmt.get(postID, (err, row) => {
        if (err) {
            stmt.finalize();
            throw err;
        } else {
            stmt.finalize();
            callback(row);
        }
    });
}

function addPostLike(postID) {
    var stmt = db.prepare(`update posts set LikeCount = LikeCount + 1 where PostID = ?`);
    stmt.get(postID, (err, row) => {
        if (err) {
            stmt.finalize();
            throw err;
        } else {
            stmt.finalize();
            console.log("add post like: " + postID);
        }
    });
}

function validateCreator(postID, userID, callback) {
    var stmt = db.prepare(`select UserID from posts where PostID = ?`);
    stmt.get(postID, (err, user) => {
        if (err) {
            stmt.finalize();
            throw err;
        } else {
            stmt.finalize();
            callback(postID, user.UserID, (user.UserID === userID));
        }
    });
}

var postDAO = {
    createPost: createPost,
    deletePost: deletePost,
    getAllPostsByUser: getAllPostsByUser,
    getAllPostsByCat: getAllPostsByCat,
    getPostByID: getPostByID,
    addPostLike: addPostLike,
    validateCreator: validateCreator
}


module.exports = postDAO
