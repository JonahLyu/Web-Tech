let postID = Number(document.getElementById("postid").innerHTML)
let commentList = document.querySelector("ol.commentlist")
//get all comments of a post
$.post(
    "/forum/getComByPostID",
    {postID: postID},
    function(data) {
        // console.log(data);
        $("#comments-title").html("("+data.length+") Comments");
        data.forEach((comment) => {
            let hash = md5(comment.UserID)
            let avatarLink = "https://www.gravatar.com/avatar/" + hash + "?d=monsterid"
            var oLi = document.createElement("li")
            oLi.className = `comment even thread-even depth-1`
            oLi.innerHTML = `<article id="comment-2">
                    <a href="/forum/loadUser?id=${comment.UserID}">
                        <img alt="" src=${avatarLink} class="avatar avatar-60 photo" height="60" width="60">
                    </a>
                    <div class="comment-meta">
                            <h5 class="author">
                                <cite class="fn">
                                    <a href="/forum/loadUser?id=${comment.UserID}" class="url">${comment.Username}</a>
                            </h5>
                            <p class="date">
                                <time datetime="2013-02-26T13:18:47+00:00">${comment.Date}</time>
                            </p>
                    </div><!-- end .comment-meta -->
                    <div class="comment-body">
                            <p class="content">${comment.Content}</p>
                    </div><!-- end of comment-body -->
            </article>`

            commentList.appendChild(oLi)
        });
    }
);

$(document).ready(function(){
    $.post(
        "/users/info",
        function(data) {
            let hash = md5(data.UserID)
            let avatarLink = "https://www.gravatar.com/avatar/" + hash + "?d=monsterid"
            $("#userAvatar").attr("src", avatarLink);
            $("#greeting").html("Howdy, " + data.Username + "!");
            $("#username").html(data.Username);
            $("#birthday").html(data.Birthday);
            $("#gender").html(data.Gender);
            $("#phone").html(data.Phone);
        }
    );

    $("span.like-count").click(function(){
        var doc = $(this)
        var postID = doc.attr("value")
        $.post(
            "/forum/addPostLike",
            {postid: postID},
            function(data) {
                doc.html(data.likeCount);
                $("span.like-it").html(data.likeCount);
            }
        );
    });

    $("span.like-it").click(function(){
        var doc = $(this)
        var postID = doc.attr("value")
        $.post(
            "/forum/addPostLike",
            {postid: postID},
            function(data) {
                doc.html(data.likeCount);
                $("span.like-count").html(data.likeCount);
            }
        );
    });
});
