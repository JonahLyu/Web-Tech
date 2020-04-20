$(function(){
    $("#register_btn").click(function(){
      var n = $("#username").val();
      var p = $("#password").val();
      var page = "users/register";
      console.log("Yo");
      $.post(
          page,
          { username: n, password: p },
          function(result){
              if (result != "success"){
                  $("#checkResult").html(result); //Change this to adding warnings about username or password inue, too short/long etc.
              }
              else {
                  window.location.href = "welcome.html";
              }
       });

    });

 });