var express = require('express');
var path = require('path');
var sqlite3 = require(path.join(__dirname , '../node_modules/sqlite3')).verbose();
var db = new sqlite3.Database(path.join(__dirname , '../database/user.db'));
let table = `categories`

function Category(title, description){
  this.Title = title;
  this.Description = description;
}

//create a new Cat entry in database
function createCat(title, description){
    var catID = null;
    let sql = `insert into ` + table + ` values (?, ?, ?)`;

    db.all(sql, [catID, title, description], (err, results) => {
        if (err) {
            throw err;
        }
        else {
            console.log("Category created " + title);
        }
    });

}

//delete a Category in database by CatID
function deleteCat(catID){
    let sql = `delete from ` + table + ` where CatID = ?`;

    db.all(sql, [catID], (err, results) => {
        if (err) {
            throw err;
        }
        else {
            console.log("Category deleted " + catID);
        }
    });
}

function clearCat(catID){
    let sql = `delete from posts where CatID = ?`;

    db.all(sql, [postID], (err, results) => {
        if (err) {
            throw err;
        }
        else {
            console.log("category cleared deleted " + postID);
        }
    });

}


async function getAllCat(getCallback) { //Needs the callback to allow proper execution, otherwise function doesn't have time to execute
    var sql = db.prepare(`select * from ` + table);
    sql.all((err, row) => {
        if (err) {
            sql.finalize();
            throw err;
        } else {
            sql.finalize();
            getCallback(row);
        }
    });
}

//select a Category in database by CatID
async function getCatByID(catID, getCallback) { //Needs the callback to allow proper execution, otherwise function doesn't have time to execute
    let sql = `select * from ` + table + ` where CatID = ?`;
    db.get(sql, [catID], (err, results) => {
        if (err) {
            throw err;
        }
        else {
            console.log("category loaded: " + results.Title);
            getCallback(results)
        }
    });
}


var catDAO = {
    createCat: createCat,
    deleteCat: deleteCat,
    clearCat: clearCat,
    getAllCat: getAllCat,
    getCatByID: getCatByID
}


module.exports = catDAO
