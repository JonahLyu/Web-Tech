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

function confirmDeletePost(PostID) {
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

function confirmDeleteCom(ComID) {
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

function confirmDeleteAcc(UserID) {
    if (confirm("Are you absolutely sure you want to delete this account? This cannot be undone.")) {
        $.post(
            "/users/deleteUser",
            {
                userID: UserID
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
    btns = document.getElementsByClassName("DelPost");
    for (let i=0, btn; btn = btns[i]; i++) {
        btn.addEventListener('click', () => {
            confirmDeletePost(btn.value);
        });
    }
    // btns = document.getElementsByClassName("DelCom");
    // for (let i=0, btn; btn = btns[i]; i++) {
    //     console.log("Hi");
    //     btn.addEventListener('click', () => {
    //         confirmDeleteCom(btn.value);
    //     });
    // }
    btns = document.getElementsByClassName("DelAcc");
    for (let i=0, btn; btn = btns[i]; i++) {
        btn.addEventListener('click', () => {
            confirmDeleteAcc(btn.value);
        });
    }
}

function addComBtns() {
    var btns = document.getElementsByClassName("DelCom");
    for (let i=0, btn; btn = btns[i]; i++) {
        console.log("Hi");
        btn.addEventListener('click', () => {
            confirmDeleteCom(btn.value);
        });
    }
}