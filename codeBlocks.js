function init() {
	// var canvas = document.getElementById("demoCanvas");
	var stage = new createjs.Stage("demoCanvas");

	var codeComponents = [];
	var codeTypes = [];

	// Initializing dimensions of spawn and drop space.
	var topSpawn = 1200;
	var topDrop = 600;
	var bottomDrop = 0;
	var leftSide = 800;
	var rightSide = 1600;

	var xPointList = [topDrop];
	var yPointList = [leftSide];

	var createRepeatBlock = function() {
		var repeatBlock = new createjs.Shape();
		repeatBlock.graphics.beginFill("DeepSkyBlue").drawRect(0,0,200,20);
		repeatBlock.x = 10;
		repeatBlock.y = 100;
		stage.addChild(repeatBlock);
		stage.update();
		codeComponents.push(repeatBlock);
		codeTypes.push("repeatBlock");
		//console.log(codeComponents);
	}

	createRepeatBlock();

	// Checks if the mouse (and therefore your component) is out of the working space.
	var outOfBounds = function() {
		if(MouseEvent.stageX < 200 && MouseEvent.stageY > 200) {
			return true;
		}
		else {
			return false;
		}
	}

	// Snaps block to anything that exists in the working space
	var snapTo = function(index) {
		var block = codeComponents[index];

		// console.log(block);
		// var originalX = block.x;
		// var originalY = block.y;
		while(mouseDown === 1) {
			for(var num = 0; num < xPointList.length; num++) {
				// Determine the distance from the mouse position to the point
				var diffX = Math.abs(MouseEvent.stageX - xPointList[num]);
				var diffY = Math.abs(MouseEvent.stageY - yPointList[num]); 
				var d = Math.sqrt(diffX*diffX + diffY*diffY);        

				// If the current point is closeEnough and the closest (so far)
				// Then choose it to snap to.
				var snapDistance = 100;
				var neighbour;
				var closest = (d<snapDistance && (dist == null || d < dist));
				if (closest) {
				     neighbour = block;
				}          
			}
		}

		// If there is a close neighbour, snap to it. <<WE ARE BRITISH, NEIGHBOUR HAS A U
		if (neighbour) {
		    codeComponents[index].x = neighbour.x;
		    codeComponents[index].y = neighbour.y;
		}
		// If out of bounds, delete object
		else if (outOfBounds() == true) {
			stage.removeChild(codeComponents[index])
			codeTypes.splice(index, 1);
			createRepeatBlock();
		}
		// Otherwise snap to wherever it is at the moment
		else {
		    codeComponents[index].x = MouseEvent.stageX;
	    	codeComponents[index].y = MouseEvent.stageY;
		}
	};

	snapTo(0);
}

// Mouse down checker nonfunctional. It doesn't make any logical sense either.
var mouseDown = 1;
// 0;
// document.body.onmousedown = function() { 
//     mouseDown = 1;
// }
// document.body.onmouseup = function() {
//     mouseDown = 0;
// }