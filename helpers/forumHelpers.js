var userDAO = require('../dao/userDAO')
var catDAO = require('../dao/catDAO')

function truncPosts(posts, maxLength) {
    for (var i = 0; i < posts.length; i++) {
        var text = posts[i].Content;
        var len = text.length;
        posts[i].Content = (len <= maxLength) ? text : text.substring(0,maxLength+1)+"...";
    }
    return posts;
}

function addPostAuthor(posts, callback) {
    var userIDs = []
    for (var i = 0; i < posts.length; i++) {
        if (userIDs.indexOf(posts[i].UserID) === -1) userIDs.push(posts[i].UserID);
    }
    // console.log(userIDs.join());
    userDAO.getMultiUser(userIDs.join(), (users) => {
        // console.log(posts);
        // for (var i = 0; i < posts.length; i++) {
        //     for (var j )
        // }
    })
    // while(count < posts.length) console.log(count);
}

function addPostCategory(posts) {
    for (var i = 0; i < posts.length; i++) {
        catDAO.getCatByID(posts[i].CatID, (cat) => {
            // posts[i].author = user.
            console.log(cat);
        });
    }
}

function addPostDetails(posts, callback) { //Don't know how to get these working
    addPostAuthor(posts);
    // addPostCategory(posts);
}

var forumHelpers = {
    truncPosts : truncPosts,
    addPostDetails : addPostDetails
}

module.exports = forumHelpers;