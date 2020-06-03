function confirmDelete(PostID) {
    if (confirm("Are you sure you want to delete this post and all comments? This cannot be undone.")) {
        $.post(
            "/forum/deletePost",
            {
                postID: PostID
            },
            function(data) {
                // console.log(data);
                window.location.href = data;
            }
        );
    } else {

    }
}