function init() {

	// Mouse down checker unnecessary
	var mouseDown = 0;
	document.body.onmousedown = function() { 
	    mouseDown = 1;
	}
	document.body.onmouseup = function() {
	    mouseDown = 0;
	}

	// var canvas = document.getElementById("demoCanvas");
	var stage = new createjs.Stage("demoCanvas");

	var codeComponents = [];
	var codeTypes = [];

	// Initializing dimensions of spawn and drop space.
	var topSpawn = $('demoCanvas').height;
	var topDrop = $('demoCanvas').height/2;
	var bottomDrop = 0;
	var leftSide = $('demoCanvas').width/2;
	var rightSide = $('demoCanvas').width;

	var xPointList = [topDrop];
	var yPointList = [leftSide];
	var neighbourX;
	var neighbourY;

	var createRepeatBlock = function() {
		codeComponents.push(new createjs.Shape());
		var last = codeComponents.length-1
		codeComponents[last].graphics.beginFill("DeepSkyBlue").drawRect(0,0,200,40);
		codeComponents[last].x = leftSide-100;
		codeComponents[last].y = topSpawn;
		stage.addChild(codeComponents[last]);
		stage.update();
		codeTypes.push("repeatBlock");
		console.log(codeComponents);
		console.log(codeTypes);
	}

	createRepeatBlock();

	// Checks if the mouse (and therefore your component) is out of the working space.
	var outOfBounds = function() {
		if(MouseEvent.stageX < leftSide && MouseEvent.stageY > topDrop) {
			return true;
		}
		else {
			return false;
		}
	}
	
	var pleaseMove = function(which, evt) {
		console.log("moving");
	    evt.target.x = evt.stageX;
	    evt.target.y = evt.stageY;
	    snapTo(which);
	    stage.update();
	}


	var pleaseDrop = function(which, evt) {
		console.log("up"); 
		snapTo(which);
		// If out of bounds, snap object back to beginning position
		// HANDLE CASE IF DRAGGING OUT OF DROP THING
		if (outOfBounds() == true) {
			codeComponents[which].x = leftSide;
			codeComponents[which].y = topSpawn;
		}
		// If there is a close neighbour, snap to it. <<WE ARE BRITISH, NEIGHBOUR HAS A U
		else {
		    codeComponents[which].x = neighbourX;
		    codeComponents[which].y = neighbourY;
		    createRepeatBlock();
		}
		stage.update();
	};


	for(var i=0;i< codeComponents.length; i++) {
	       codeComponents[i].addEventListener("pressmove", pleaseMove(i));
	}

	// codeComponents[0].on("pressmove", function(evt) {
	// 	pleaseMove(0, evt);
	// });

	codeComponents[0].on("pressup", function(evt) { 
		pleaseDrop(0, evt);
	})

	// Snaps block to anything that exists in the working space
	var snapTo = function(index) {
		var block = codeComponents[index];

		// console.log(block);
		// var originalX = block.x;
		// var originalY = block.y;
		for(var num = 0; num < xPointList.length; num++) {
			// Determine the distance from the mouse position to the point
			var diffX = Math.abs(MouseEvent.stageX - xPointList[num]);
			var diffY = Math.abs(MouseEvent.stageY - yPointList[num]); 
			var d = Math.sqrt(diffX*diffX + diffY*diffY);        

			// If the current point is closeEnough and the closest (so far)
			// Then choose it to snap to.
			var snapDistance = 100;
			var closest = (d<snapDistance && (dist == null || d < dist));
			if (closest) {
				neighbourX = xPointList[num];
				neighbourY = yPointList[num];
			}          
		}
	};
}