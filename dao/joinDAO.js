var express = require('express');
var path = require('path');
var sqlite3 = require(path.join(__dirname , '../node_modules/sqlite3')).verbose();
var db = new sqlite3.Database(path.join(__dirname , '../database/user.db'));
// let table = `users`

function getPostsWithDetailsByCatID(catID, callback) {
    var stmt = db.prepare(`select posts.*, Username as Author, categories.Title as Category,
                            (select count(*) from comments where comments.PostID = posts.PostID) as CommentCount
                            from posts
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
    var stmt = db.prepare(`select posts.*, Username as Author, categories.Title as Category,
                            (select count(*) from comments where comments.PostID = posts.PostID) as CommentCount
                            from posts
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

function getPopularPostsWithDetails(callback) {
    var stmt = db.prepare(`select posts.*, Username as Author, categories.Title as Category,
                            (select count(*) from comments where comments.PostID = posts.PostID) as CommentCount
                            from posts
                            inner join users on users.UserID = posts.UserID
                            inner join categories on categories.CatID = posts.CatID
                            where posts.LikeCount = (select max(LikeCount) from posts)`);
    stmt.all((err, rows) => {
        if (err) {
            stmt.finalize();
            throw err;
        } else {
            stmt.finalize();
            callback(rows);
        }
    });
}

function search(s, callback) {
    let input = `%${s}%`
    let sql = `select posts.*, Username as Author, categories.Title as Category,
                (select count(*) from comments where comments.PostID = posts.PostID) as CommentCount
                from posts
                inner join users on users.UserID = posts.UserID
                inner join categories on categories.CatID = posts.CatID
                where
                	posts.Title like ?
                	or Content like ?
                	or categories.Title like ?;`
    var stmt = db.prepare(sql);
    stmt.all([input, input, input], (err, row) => {
        if (err) {
            stmt.finalize();
            throw err;
        } else {
            stmt.finalize();
            callback(row);
        }
    });
}

var joinDAO = {
    getPostsWithDetailsByCatID : getPostsWithDetailsByCatID,
    getPostsWithDetailsByUserID : getPostsWithDetailsByUserID,
    getPopularPostsWithDetails : getPopularPostsWithDetails,
    search : search
}

module.exports = joinDAO;
