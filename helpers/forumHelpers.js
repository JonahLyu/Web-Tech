var userDAO = require('../dao/userDAO')
var catDAO = require('../dao/catDAO')
var path = require('path');
var sqlite3 = require(path.join(__dirname , '../node_modules/sqlite3')).verbose();
var db = new sqlite3.Database(path.join(__dirname , '../database/user.db'));

function truncPosts(posts, maxLength) {
    for (var i = 0; i < posts.length; i++) {
        var text = posts[i].Content;
        var len = text.length;
        posts[i].Content = (len <= maxLength) ? text : text.substring(0,maxLength+1)+"...";
    }
    return posts;
}

// function postCount(cats, callback) {
//     var stmt = db.prepare("select distinct CatID, count(*) over(partition by CatID order by CatID asc) as count from posts order by CatID asc");
//     stmt.all((err, counts) => {
//         while(counts[0].CatID < cats[0].CatID) {
//             counts.shift();
//         }
//         if (err) {
//             stmt.finalize();
//             throw err;
//         } else {
//             stmt.finalize();
//             for (var i = 0; i < cats.length; i++) {
//                 if (counts.length > 0) {
//                     if (cats[i].CatID === counts[0].CatID) cats[i].PostCount = counts[0].count;
//                     else cats[i].PostCount = 0;
//                 } else cats[i].PostCount = 0;
//                 counts.shift();
//             }
//             callback(cats);
//         }
//     });
// }

var forumHelpers = {
    truncPosts : truncPosts
}

module.exports = forumHelpers;