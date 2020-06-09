// function confirmDelete(UserID) {
//     if (confirm("Are you absolutely sure you want to delete this account? This cannot be undone.")) {
//         $.post(
//             "/users/deleteUser",
//             {
//                 userID: UserID
//             },
//             function(data) {
//                 // console.log(data);
//                 window.location.href = data;
//             }
//         );
//     } else {

//     }
// }

$(document).ready(function(){
    let userID = $("#thisUID").html()
    $.post(
        "/users/userInfo",
        {userID: userID},
        function(data) {
            let hash = md5(data.UserID)
            let avatarLink = "https://www.gravatar.com/avatar/" + hash + "?d=monsterid"
            $("#userAvatar").attr("src", avatarLink);
            $("#greeting").html("Welcome to " + data.Username + "'s Page!");
            $("#username").html(data.Username);
            $("#gender").html(data.Gender);
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
            }
        );
    }); 

});  