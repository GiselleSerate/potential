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
	var topSpawn = 1200;
	var topDrop = 600;
	var bottomDrop = 0;
	var leftSide = 800;
	var rightSide = 1600;

	var xPointList = [topDrop];
	var yPointList = [leftSide];
	var neighbourX;
	var neighbourY;

	var createRepeatBlock = function() {
		codeComponents.push(new createjs.Shape());
		var last = codeComponents.length-1
		codeComponents[last].graphics.beginFill("DeepSkyBlue").drawRect(0,0,200,20);
		codeComponents[last].x = 10;
		codeComponents[last].y = 100;
		stage.addChild(codeComponents[last]);
		stage.update();
		//codeComponents.push(repeatBlock);
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

	codeComponents[0].on("pressmove", function(evt) {
		console.log("moving");
	    evt.target.x = evt.stageX;
	    evt.target.y = evt.stageY;
	    snapTo(0);
	    stage.update();
	});

	codeComponents[0].on("pressup", function(evt) { 
		console.log("up"); 
		snapTo(0);
		// If out of bounds, delete object
		if (outOfBounds() == true) {
			//stage.removeChild(codeComponents[index])
			//codeTypes.splice(0, 1);
			//createRepeatBlock();
		}
		// If there is a close neighbour, snap to it. <<WE ARE BRITISH, NEIGHBOUR HAS A U
		else {
		    codeComponents[0].x = neighbourX;
		    codeComponents[0].y = neighbourY;
		}
		stage.update();
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