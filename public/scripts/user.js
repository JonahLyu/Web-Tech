function confirmDelete(UserID) {
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