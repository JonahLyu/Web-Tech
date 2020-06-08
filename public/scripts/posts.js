$(document).ready(function(){
    
    $("span.like-count").click(function(){
        var doc = $(this)
        // console.log(doc);
        var postID = doc.find("likeID").value;
        console.log(postID);
        $.post(
            "/forum/addPostLike",
            {postid: postID},
            function(data) {
                doc.html(data.likeCount);
            }
        );
    }); 

}); 