var counter = 1;
$(document).ready(function () {
	$("#startButton").append('<img src = "StartButton.png" onclick="nextPage()">');
    $("#Logo").append('<p id= "title"> Potential</p><p id= "subtitle"> An interactive story adventure!</p>');
});


var nextPage = function(){
	counter = counter + 1
	console.log(counter)
	document.querySelector(".pages").style.visibility = "hidden";
	if (counter === 2){
		document.getElementById("secondPage").style.visibility = "visible";
	}
	if (counter === 3) {
		document.getElementById("secondPage").style.visibility = "hidden";
		document.getElementById("thirdPage").style.visibility = "visible";
	}
	if (counter === 4) {
		document.getElementById("thirdPage").style.visibility = "hidden";
		document.getElementById("fourthPage").style.visibility = "visible";
	}
}

$(document).keydown(function(e) {
    switch(e.which) {
        case 39: // right
        nextPage();
        break;

        default: return; // exit this handler for other keys
    }
    e.preventDefault(); // prevent the default action (scroll / move caret)
});