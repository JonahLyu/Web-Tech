$(function(){
    $("#save_btn").click(function(){
        var id = $("#id").text();
        var n = $("#username").val();
        var g = $("#gender").val();
        var dob = $("#date_of_birth").val();
        var p = $("#phoneNumber").val();
        var l = $("#accessLevel").val();
        //Need to add way to validate phone number
        //General validation needed
        if (n == "" || dob == "") {
            $("#save_btn").attr("class","btn btn-danger") ;
            if (dob == "") {
                $("#save_btn").html("Date is wrong");
                $("#date_of_birth").css("background-color","pink");
                }
            if (n == "") {
                $("#save_btn").html("Display name can not be empty");
                $("#username").css("background-color","pink");
                }
            
        }
        else{
            var page = "/users/save_setting";
            $.post(
            page,
            {user_id: id, username: n, gender: g, birthday: dob , phonenumber: p, level: l},
            function(result){
                console.log(result);
                if (result.localeCompare("Created") === 0) {
                    $("#save_btn").attr("class","btn btn-success") ;
                    $("#save_btn").html("success!") ;
                    $("#username").css("background-color","white");
                    $("#date_of_birth").css("background-color","white");
                } else {
                    console.log(result);
                }
            }).fail((result) => {
                window.location.href = result.responseText;
            });
        }    
    });
});