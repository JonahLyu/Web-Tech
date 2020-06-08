$(document).ready(function(){

  $("span.like-count").click(function(){
      var doc = $(this)
      let postID = doc.attr("data-postid")
      
      $.post(
          "/forum/addPostLike",
          {postid: postID},
          function(data) {
              doc.html(data.likeCount);
              $("span.like-it").html(data.likeCount);
          }
      );
  });

});