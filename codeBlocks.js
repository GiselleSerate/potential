function init() {

	// Mouse down checker unnecessary
	var mouseDown = 0;
	document.body.onmousedown = function() { 
	    mouseDown = 1;
	}
	document.body.onmouseup = function() {
	    mouseDown = 0;
	}

	var whichTime = 0;

	var stage = new createjs.Stage("demoCanvas");

	//Constructor function for code pieces.
	function CodePiece(piece, kind) {
		this.piece = piece;
		this.kind = kind;
	}

	//Creates array for storing components that are created.
	var codeList = [];

	// Initializing dimensions of spawn and drop space.
	var topSpawn = 0;
	var topDrop = $('#demoCanvas').height()/2;
	var bottomDrop = $('#demoCanvas').height();
	var rightSide = $('#demoCanvas').width();
	var leftSide = $('#demoCanvas').width()/2;
	console.log(topSpawn + " " + topDrop + " " + bottomDrop + " " + leftSide + " " + rightSide); 

	//Creates point constructor function. 
	function Point(x, y) {
		this.x = x;
		this.y = y;
	}

	//Creates array for storing possible points to snap to. 
	var pointList = [new Point(leftSide, topDrop)];

	var neighbourX;
	var neighbourY;

	var dropSite = new createjs.Shape();
	dropSite.graphics.beginFill("red").drawRect(0,0,200,40);
	dropSite.x = leftSide;
	dropSite.y = topDrop + 40;
	stage.addChild(dropSite);
	stage.update();

	var createRepeatBlock = function() {
		codeList.push(new createjs.Shape(), "repeat");
		var last = 0;
		codeList[last].piece.graphics.beginFill("DeepSkyBlue").drawRect(0,40,200,40);
		codeList[last].piece.x = leftSide;
		codeList[last].piece.y = topSpawn;
		stage.addChild(codeList[last].piece);
		stage.update();
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
		//Snap object to neighbourX and neighbourY
		evt.target.x = neighbourX;
		evt.target.y = neighbourY;
		// If neighbour has been reset and is not its initial value, snap to that and create a new repeat block in the old place. 
		if(neighbourX !== xPointList[0] && neighbourY !== yPointList[0]) {
		    createRepeatBlock();
		}
		stage.update();
		whichTime += 1;
	};


	for(var i=0;i< codeList.length; i++) {
		//Calls pleaseMove function when mouse is clicked.
	    codeList[i].piece.on("pressmove", function(evt) {
			pleaseMove(i, evt);
		});

	    //Calls pleaseDrop function when mouse is no longer clicked.
		codeList[i].piece.on("pressup", function(evt) { 
			pleaseDrop(i, evt);
			whichTime = 0;
		})
	}

	// Snaps block to anything that exists in the working space
	var snapTo = function(index) {
		var block = codeList[index].piece;

		// console.log(block);
		// var originalX = block.x;
		// var originalY = block.y;
		for(var num = 0; num < xPointList.length; num++) {
			// Determine the distance from the mouse position to the point
			var diffX = Math.abs(MouseEvent.stageX - pointList[num].x);
			var diffY = Math.abs(MouseEvent.stageY - pointList[num].y); 
			var d = Math.sqrt(diffX*diffX + diffY*diffY);        

			// If the current point is closeEnough and the closest (so far)
			// Then choose it to snap to.
			var snapDistance = 100;
			var closest = (d<snapDistance && (dist == null || d < dist));
			if (closest) {
				neighbourX = pointList[num].x;
				console.log(pointList[num].x);
				neighbourY = pointList[num].y;
			}
			//Else if it's the first time through in a new drag sequence, set neighbourX and neighbourY to the block's initial coordinates.
			else if (whichTime === 0) {
				neighbourX = pointList[0].x;
				neighbourY = pointList[0].y;
			}          
			//Else, leave neighbourX and neighbourY as whatever they were the last time you ran snapTo.
		}
	};
}