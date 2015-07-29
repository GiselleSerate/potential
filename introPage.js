$(document).ready(function () {
	 $("#startButton").append('<img src = "StartButton.png" onclick="nextPage()">');
     $("#Logo").append('<p id= "title"> Potential</p><p id= "subtitle"> An interactive story adventure!</p>');
});



var nextPage = function(){
	document.getElementById("Logo").style.visibility = "hidden";
	document.getElementById("startButton").style.visibility = "hidden";
	document.getElementById("background1").style.visibility = "hidden";
	document.getElementById("cutscene1").style.visibility = "visible";
	document.getElementById("textBox1").style.visibility  = "visible";
}