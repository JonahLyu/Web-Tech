var express = require('express');
var path = require('path');
var sqlite3 = require(path.join(__dirname , '../node_modules/sqlite3')).verbose();
var db = new sqlite3.Database(path.join(__dirname , '../database/user.db'));
let table = `comments`

//create a new comment entry in database
function createCom(postID, content, userID, date){
    var comID = null;
    var likeCount = 0;
    let sql = `insert into ` + table + ` values (?, ?, ?, ?, ?, ?)`;

    db.all(sql, [comID, postID, content, userID, likeCount, date], (err, results) => {
        if (err) {
            throw err;
        }
        else {
            console.log("comDAO: comment for " + postID +" created " + date);
        }
    });

}

//delete a new comment in database with user validation
function deleteCom(comID, userID){
    let sql = `select UserID from ` + table + ` where CommentID = ?`;

    db.get(sql, [comID], (err, result) => {
        if (err) {
            throw err;
        }
        else if (result == null) {
            console.log("comDAO: cannot find " + comID);
        }
        else if (result.UserID === userID){
            let sql = `delete from ` + table + ` where CommentID = ?`;

            db.all(sql, [comID], (err, results) => {
                if (err) {
                    throw err;
                }
                else {
                    console.log("comDAO: comment deleted " + comID);
                }
            });
        }
        else {
            console.log("comDAO: no access to delete comment " + comID);
        }
    });
}

function getComByPostID(postID, callback) {
    let sql = `select comments.*, Username from ${table}
                inner join users on users.UserID = comments.UserID
                where comments.PostID = ?`
    var stmt = db.prepare(sql);
    stmt.all(postID, (err, row) => {
        if (err) {
            stmt.finalize();
            throw err;
        } else {
            stmt.finalize();
            console.log("comDAO: get comments of post " + postID);
            callback(row);
        }
    });
}

function addComLike(comID) {
    let sql = `update ` + table + ` set LikeCount = LikeCount + 1 where CommentID = ?`;
    var stmt = db.prepare(sql);
    stmt.get(comID, (err, row) => {
        if (err) {
            stmt.finalize();
            throw err;
        } else {
            stmt.finalize();
            console.log("comDAO: add comment like: " + comID);
        }
    });
}

function getComLikeByID(comID, callback) {
    let sql = `select LikeCount from ` + table + ` where CommentID = ?`;
    var stmt = db.prepare(sql);
    stmt.get(comID, (err, result) => {
        if (err) {
            stmt.finalize();
            throw err;
        } else {
            stmt.finalize();
            console.log("comDAO: get comment " + comID + " like count" );
            callback(result);
        }
    });
}

var comDAO = {
    createCom: createCom,
    deleteCom: deleteCom,
    getComByPostID: getComByPostID,
    addComLike: addComLike,
    getComLikeByID: getComLikeByID
}


module.exports = comDAO
