var loadingHTML = `<div id="loadingDiv" class="loading-wrapper" style="display: block;">
                    <div id="loadingBody" class="spinner" style="display: block;" >
                      <div class="double-bounce1"></div>
                      <div class="double-bounce2"></div>
                    </div>
                    <h3 id="loadingInfo" class="loading-info" style="display: block;" >Loading the page...</h1>
                  </div>`


document.write(loadingHTML);

//remove loading
function completeLoading() {  
  document.getElementById("loadingInfo").style.display="none";
  document.getElementById("loadingBody").style.display="none";
  document.getElementById("loadingDiv").style.display="none";
}
//show loading
function showLoading()
{
  document.getElementById("loadingDiv").style.display="block";
} 

function pausecomp(millis)
{
    var date = new Date();
    var curDate = null;
    do { curDate = new Date(); }
    while(curDate-date < millis);
}

$(document).ready(function(){
  pausecomp(2000)
  completeLoading();
});