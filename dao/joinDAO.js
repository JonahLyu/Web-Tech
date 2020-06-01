var express = require('express');
var path = require('path');
var sqlite3 = require(path.join(__dirname , '../node_modules/sqlite3')).verbose();
var db = new sqlite3.Database(path.join(__dirname , '../database/user.db'));
// let table = `users`

function getPostsWithDetailsByCatID(catID, callback) {
    var stmt = db.prepare(`select posts.*, Username as Author, categories.Title as Category from posts
                            inner join users on users.UserID = posts.UserID
                            inner join categories on categories.CatID = posts.CatID
                            where posts.CatID = ? order by PostID desc`);
    stmt.all(catID, (err, rows) => {
        if (err) {
            stmt.finalize();
            throw err;
        } else {
            stmt.finalize();
            callback(rows);
        }
    });
}

function getPostsWithDetailsByUserID(userID, callback) {
    var stmt = db.prepare(`select posts.*, Username as Author, categories.Title as Category from posts
                            inner join users on users.UserID = posts.UserID
                            inner join categories on categories.CatID = posts.CatID
                            where posts.UserID = ? order by PostID desc`);
    stmt.all(userID, (err, rows) => {
        if (err) {
            stmt.finalize();
            throw err;
        } else {
            stmt.finalize();
            callback(rows);
        }
    });
}

var joinDAO = {
    getPostsWithDetailsByCatID : getPostsWithDetailsByCatID,
    getPostsWithDetailsByUserID : getPostsWithDetailsByUserID
}

module.exports = joinDAO;
