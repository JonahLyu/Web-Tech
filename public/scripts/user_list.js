let userList = document.querySelector("ol.userList")
//get all comments of a post
$.get(
    "/users/allProfiles",
    {},
    function(data) {
        console.log(data);
        $("#users-count").html("("+data.length+") Users");
        data.forEach((user) => {
            let deleteButtonHTML = ``;
            // if (comment.deleteButton) {
            //     // deleteButtonHTML = `<form class="form-inline" action="/forum/deleteCom" method="POST">
            //     //                         <input id="postid" name="comID" value=` + comment.CommentID + ` type="hidden">
            //     //                         <button class="btn btn-small" id="post" type="submit" name="submit">delete</button>
            //     //                     </form>`;
            //     deleteButtonHTML = `<button class="btn btn-small" id="comment_delete" onclick="confirmDelete(`+comment.CommentID+`)">delete</button>`;
            // }
            let hash = md5(user.UserID)
            let avatarLink = "https://www.gravatar.com/avatar/" + hash + "?d=monsterid"
            var oLi = document.createElement("li")
            oLi.className = `comment even thread-even depth-1 clean-list paged`
            oLi.innerHTML = `<article class="comment-shadow">
                    <a href="/forum/loadUser?id=${user.UserID}">
                        <img alt="" src=${avatarLink} class="avatar avatar-60 photo" height="60" width="60">
                    </a>
                    <div class="comment-meta">
                            <h5 class="author">
                                <cite class="fn">
                                    <a href="/forum/loadUser?id=${user.UserID}" class="url">${user.Username}</a>
                            </h5>
                            <p class="gender">
                                ${user.Gender}
                            </p>`
                            + deleteButtonHTML +
                    `</div><!-- end .comment-meta -->
            </article>`

            userList.appendChild(oLi)
        });
        setUpPaging();
    }
);