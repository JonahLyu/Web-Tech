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
       
});   