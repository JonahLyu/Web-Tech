function confirmDelete(catID) {
    console.log(catID);
    if (confirm("Are you sure you want to delete this category and all posts it contains? This cannot be undone.")) {
        $.post(
            "/forum/deleteCategory",
            {
                cat_id: catID
            },
            function(data) {
                // console.log(data);
                window.location.href = data;
            }
        );
    } else {

    }
}