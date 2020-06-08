function confirmDeleteCat(catID) {
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

"use strict"
addEventListener('load', setDeleteCategoryEvent);

function setDeleteCategoryEvent() {
    var btns = document.getElementsByClassName("DelCat");
    for (let i=0, btn; btn = btns[i]; i++) {
        // btn.addEventListener('click', confirmDeleteCat(btn.value));
        btn.addEventListener('click', () => {
            confirmDeleteCat(btn.value);
        });
    }
}