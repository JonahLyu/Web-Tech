$(function(){
    $("#login_btn").click(function(){
      var n = $("#username").val();
      var p = $("#password").val();
      var page = "users/login";
      $.post(
          page,
          { username: n, password: p },
          function(result){
              if (result != "success"){
                  $("#checkResult").html(result);
              }
              else {
                  window.location.href = "login_success.html";
              }
       });

    });

    $("#register_btn").click(function(){
     window.location.href = "register.html";
    });

 });