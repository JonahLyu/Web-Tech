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

var forumHelpers = {
    truncPosts : truncPosts
}

module.exports = forumHelpers;