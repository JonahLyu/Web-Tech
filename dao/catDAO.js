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
    let sql = `delete from ` + table + ` where catID = ?`;

    db.all(sql, [catID], (err, results) => {
        if (err) {
            throw err;
        }
        else {
            console.log("Category deleted " + catID);
        }
    });
}

//delete a Category in database by CatID
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


var catDAO = {
    createCat: createCat,
    deleteCat: deleteCat,
    getAllCat: getAllCat
}


module.exports = catDAO
