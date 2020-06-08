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
            let deleteButtonHTML = ``;
            if (comment.deleteButton) {
                // deleteButtonHTML = `<form class="form-inline" action="/forum/deleteCom" method="POST">
                //                         <input id="postid" name="comID" value=` + comment.CommentID + ` type="hidden">
                //                         <button class="btn btn-small" id="post" type="submit" name="submit">delete</button>
                //                     </form>`;
                deleteButtonHTML = `<button class="btn btn-mini btn-danger"
                                    onclick="confirmDelete(`+comment.CommentID+`)" title="Delete this comment">Delete</button>`;
            }
            let hash = md5(comment.UserID)
            let avatarLink = "https://www.gravatar.com/avatar/" + hash + "?d=monsterid"
            var oLi = document.createElement("li")
            oLi.className = `comment even thread-even depth-1`
            oLi.innerHTML = `<article>
                    <a href="/forum/loadUser?id=${comment.UserID}">
                        <img alt="" src=${avatarLink} class="avatar avatar-60 photo" height="60" width="60">
                    </a>
                    <div class="comment-meta">
                            <h5 class="author">
                                <cite class="fn">
                                    <a href="/forum/loadUser?id=${comment.UserID}" class="url">${comment.Username}</a>
                                ${deleteButtonHTML}
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
        let postID = Number(document.getElementById("postid").innerHTML)
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
        let postID = Number(document.getElementById("postid").innerHTML)
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

function confirmDelete(ComID) {
    console.log(ComID);
    if (confirm("Are you sure you want to delete this comment? This cannot be undone.")) {
        $.post(
            "/forum/deleteCom",
            {
                comID: ComID
            },
            function(data) {
                // console.log(data);
                window.location.href = data;
            }
        );
    } else {

    }
}

function confirmDeletePost(PostID, CatID, CatTitle) {
    if (confirm("Are you sure you want to delete this comment? This cannot be undone.")) {
        $.post(
            "/forum/deleteUserPost",
            {
                postID: PostID,
                catID: CatID,
                catTitle: CatTitle
            },
            function(data) {
                // console.log(data);
                window.location.href = data;
            }
        );
    } else {

    }
}
