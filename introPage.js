var start;
var logo;
$(document).ready(function () {

    start=$("#startButton").append('<img src = "StartButton.png" onclick="nextPage()">');
     logo=$("#Logo").append('<p id= "title"> Potential</p><p id= "subtitle"> An interactive story adventure!</p>');
});



var nextPage = function(){
	start.remove();
	logo.remove();

}