var sqlite3 = require("sqlite3");
var path = require('path');
var db;

create();

async function create() {
    try {
        db = new sqlite3.Database(path.join(__dirname , 'user.sqlite3'))
        db.all("drop table users");
        db.run("create table users (id primary key, username not null, password not null)");
        db.run("insert into users values ('abc','123')");
    } catch (e) { console.log(e); }
}
