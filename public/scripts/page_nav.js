var page = 1;
var pageSize = 5;
// var cols = ["yellow","red","blue"]
$(".paged").slice(0,pageSize).addClass('page1');
/* $("#wrap > div").slice(7,14).addClass('page2').css("background","red").hide();
$("#wrap > div").slice(14,21).addClass('page3').css("background","blue").hide(); */
var count = 2;
for (var i = pageSize; i < 21; i+=pageSize){
	$(".paged").slice(i,i+pageSize).addClass('page'+count++).hide();
}

var maxPage = Math.ceil(21/pageSize);;
$('.next').on('click',function(){
    if(page < maxPage) {
	    $(".paged:visible").hide();
        $('.page' + ++page).fadeIn(200);
    }
})
$('.prev').on('click',function(){
    if(page > 1) {
	    $(".paged:visible").hide();
        $('.page' + --page).fadeIn(200);
    }
})