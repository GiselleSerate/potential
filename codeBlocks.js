function init() {
	//Gets mouse position.
	var cursorX;
	var cursorY;
	document.onmousemove = function(e){
	    cursorX = e.pageX;
	    cursorY = e.pageY;
	}

	var whichTime = 0;

	//Saves the original position that you're dragging it from: using Point object type even though hasBlock is supremely irrelevant
	var origPos;

	var stage = new createjs.Stage("demoCanvas");

	//Constructor function for code pieces.
	function CodePiece(piece, kind, locked) {
		this.piece = piece;
		this.kind = kind;
		this.locked = locked;
	}

	//Creates array for storing components that are created.
	var codeList = [];

	// Initializing dimensions of spawn and drop space.
	var topSpawn = 0;
	var topDrop = $('#demoCanvas').height()/2;
	var bottomDrop = $('#demoCanvas').height();
	var rightSide = $('#demoCanvas').width();
	var leftSide = $('#demoCanvas').width()/2;

	//Creates point constructor function. 
	function Point(x, y, hasBlock) {
		this.x = x;
		this.y = y;
		this.hasBlock = hasBlock;
	}

	//Creates array for storing possible points to snap to. Points indicate the TOP LEFT OF THE BLOCK
	var pointList = [new Point(leftSide, topSpawn-40, 0), new Point(leftSide, topDrop, 0)];

	var neighbourX;
	var neighbourY;

	//Creates array for storing block types to run.
	var myScript = [];

	var dropSite = new createjs.Shape();
	dropSite.graphics.beginFill("gray").drawRect(0,0,200,40);
	dropSite.x = leftSide;
	dropSite.y = topDrop + 40;
	stage.addChild(dropSite);
	stage.update();

	var repeatSite = new createjs.Shape();
	repeatSite.graphics.beginFill("#B2F0FF").drawRect(0,0,200,40);
	repeatSite.x = leftSide;
	repeatSite.y = topSpawn;
	stage.addChild(repeatSite);
	stage.update();

	var attackSite = new createjs.Shape();
	attackSite.graphics.beginFill("#C2F0C2").drawRect(0,0,200,40);
	attackSite.x = leftSide + 240;
	attackSite.y = topSpawn;
	stage.addChild(attackSite);
	stage.update();

	var createRepeatBlock = function() {
		var repeatSet = new createjs.Graphics().beginFill("#00CCFF").drawRect(0, 0, 200, 40);
		var newRep = new createjs.Shape(repeatSet)
		newRep.x = 0;
		newRep.y = 0;
		repeatSet = new createjs.Graphics().beginFill("#00CCFF").drawRect(0, 0, 20, 40);
		var newExt = new createjs.Shape(repeatSet)
		newExt.x = 0;
		newExt.y = 40;
		//Creates label.
		var label = new createjs.Text("repeat", "#000000");
		label.textAlign = "center";
		label.x = 100;
		label.y = 10;
		//Creates dragger.
		var dragMe = new createjs.Container();
		dragMe.x = leftSide;
		dragMe.y = topSpawn;
		dragMe.addChild(newRep, newExt, label);
		var part = new CodePiece(dragMe, "repeat", 0);
		codeList.push(part);
		stage.addChild(dragMe);
		stage.update();
	};

	createRepeatBlock();

	var createAttackBlock = function() {
		var attackSet = new createjs.Graphics().beginFill("#00CC00").drawRect(0, 0, 200, 40);
		var newAtt = new createjs.Shape(attackSet);		
		newAtt.x = 0;
		newAtt.y = 0;
		//Creates label.
		var label = new createjs.Text("attack", "#000000");
		label.textAlign = "center";
		label.x = 100;
		label.y = 10;
		//Creates dragger.
		var dragMe = new createjs.Container();
		dragMe.x = leftSide+240;
		dragMe.y = topSpawn;
		dragMe.addChild(newAtt, label);
		var part = new CodePiece(dragMe, "attack", 0);
		codeList.push(part);
		stage.addChild(dragMe);
		stage.update();
	};

	createAttackBlock();

	// Checks if the mouse (and therefore your component) is out of the working space.
	var outOfBounds = function() {
		if(MouseEvent.stageX < leftSide && MouseEvent.stageY > topDrop) {
			return true;
		}
		else {
			return false;
		}
	}
	
	var pleaseMove = function(which, evt, kind) {
	    evt.currentTarget.x = evt.stageX;
	    evt.currentTarget.y = evt.stageY;
	    snapTo(which, kind);
	    stage.update();		
	    whichTime += 1;
	}


	var pleaseDrop = function(instance, evt, kind) {
		//Sets variable whatIndex depending on the type of block
		if (kind === "repeat") {
			whatIndex = 0;
		}
		else {
			whatIndex = 1;
		}

		snapTo(blockY, kind);

		//If the neighbour's y value is below 70 (probably in drop) add it to myScript. 
		if (neighbourY>70) {
			//not in spawn, so add
			console.log("Not in spawn, so add");
			myScript.push(codeList[whatIndex]);
			pointList[pointList.length - 1].hasBlock = 1
		}
		else {
			console.log("Snapping back to spawn");
		}

		//Snap object to neighbourX and neighbourY
		evt.currentTarget.x = neighbourX;
		evt.currentTarget.y = neighbourY+40;
		stage.update();
		if (pointList[pointList.length - 1].hasBlock === 1) {
			//If the last point in pointList is full, make a new slot.
			pointList.push(new Point(neighbourX, neighbourY + 40, 0));
			console.log("New Point Added to Point List");
		}
		else if (pointList[pointList.length - 1].hasBlock === 0) {
			//If the last point in pointList is not full, do not make a new slot.
			console.log("No new point added to point list, but we got here.");
		}
		console.log(pointList);

		//Checking win case.
		if (myScript.length > 1) {
			// console.log(myScript);
			// console.log(myScript[0]);
			// console.log(myScript[0].kind + " and " + myScript[1].kind);
			if (myScript[0].kind === "repeat") {
				console.log("First is a repeat");
				if (myScript[1].kind === "attack") {
					console.log("Second is attack");
					//alert("You won!");
					console.log("WIN CASE REACHED");
				}
			}
		}
	};


	console.log(codeList);

	var whatKind;
	var instance;
	var blockY;

	for(var i=0;i< codeList.length; i++) {

		//If the point list is longer than default pop last.
		if (pointList.length > 2) {
			pointList.pop;
		}
		//Calls pleaseMove function when mouse is clicked.
		whatKind = codeList[i].kind;
		instance = codeList[i];
		blockY = codeList[i].piece.y;
		console.log("HI IT'S BLOCKY MY VALUE IS " + blockY);
		if (whatKind === "repeat") {
			console.log("in for loop with repeat");
			codeList[i].piece.on("pressmove", function(evt) {
				if (isUnlocked(i)) {
					console.log("This component is unlocked. Go ahead.");
					//Save position of thing if it's the first time through
					if (whichTime === 0) {
						getOriginal(instance);

					}
					pleaseMove(instance, evt, "repeat");
				}
				else {
					console.log("Component locked. Go away.");
				}
			});
		    //Calls pleaseDrop function when mouse is no longer clicked.
			codeList[i].piece.on("pressup", function(evt) { 	
				pleaseDrop(instance, evt, "repeat");
				whichTime = 0;
			});
		}
		else if (whatKind === "attack") {
			console.log("in for loop with attack");
			codeList[i].piece.on("pressmove", function(evt) {
				if (isUnlocked(blockY)) {
					//Save position of thing if it's the first time through
					if (whichTime === 0) {
						getOriginal(instance);
					}
					pleaseMove(blockY, evt, "attack");
				}
				else {
					console.log("Component locked. Go away.");
				}
			});
		    //Calls pleaseDrop function when mouse is no longer clicked.
			codeList[i].piece.on("pressup", function(evt) { 
				pleaseDrop(blockY, evt, "attack");
				whichTime = 0;
			});
		}
	}

	// Snaps block to anything that exists in the working space
	var snapTo = function(index, kind) {
		for(var num = 0; num < pointList.length; num++) {
			// Determine the x and y distances from the mouse position to the point
			var diffX = Math.abs(cursorX - pointList[num].x);
			var diffY = Math.abs(cursorY - pointList[num].y); 

			// If the current point is closeEnough and the closest (so far)
			// Then choose it to snap to.
			var ySnapDistance = 80;
			var closest = (diffY<ySnapDistance);

			//If the point does not have a block (hasBlock is 0 not 1), then assign it as the new point to snap to. 
			if (pointList[num].hasBlock === 0) {
				if (closest) {
					if (num === 0) {
						if (kind === "attack") {
							neighbourX = pointList[num].x + 240;
						}
					}
					else {
						neighbourX = pointList[num].x;
					}
					neighbourY = pointList[num].y;
				}
			}

			//Else if it's the first time through in a new drag sequence, set neighbourX and neighbourY to the block's initial coordinates.
			else if (whichTime === 0) {
				neighbourY = pointList[0].y;
				if (kind === "repeat") {
					neighbourX = pointList[0].x;
				}
				else if (kind === "attack") {
					neighbourX = pointList[0].x + 240;
				}
			}          
			//Else, leave neighbourX and neighbourY as whatever they were the last time you ran snapTo.
		}
	};

	var getOriginal = function(object) {

		//Debug lines.
		var purplePie = object.piece.y;
		console.log("object.piece.y " + purplePie);
		//End of debug lines.

		//Go through point list.
		for (i = 0; i < pointList.length; i++) {

			//Debug lines.
			var pinkiePie = pointList[i].y + 40;
			console.log("checking pointList[i] " + pinkiePie);
			var itsABool = (String(purplePie) === String(pinkiePie));
			console.log("if condition " + itsABool);
			//End of debug lines.

			//Check if the object is at that point.
			// if (object.y-40 === pointList[i].y) {
			if (itsABool) {
				console.log("Made it into the if statement");
				origPos = i;
				console.log("Removing point from pointList");
				console.log(pointList[i]);
				//Says this point no longer has a block because you just dragged it out.
				pointList[i].hasBlock = 0;
				myScript.pop;
			}
			else {
				console.log("Not in. Don't know why. Fix me.");
			}
		}
	};

	var isUnlocked = function(index) {
		console.log(index);
		console.log(codeList);
		var coord = codeList[index].piece.y
		console.log("y is " + coord);
		if (coord < 40) {
			//This means it's in the spawn area. You can drag it.
			console.log("In spawn area");
			console.log(coord);
			return true;
		}
		//Putting the spawn area ensures that you don't try to check elements of myScript before there are any elements in the list.
		else if (myScript[myScript.length - 1].piece.y = coord) {
			//This means it's the last block in the script. You can drag it. 
			console.log("Last block in the script");
			return true;
		}
		else {
			//It must be behind another block. Do not drag it.
			console.log("GO AWAY DO NOT DRAGGY ME");
			return false;
		}
	}
}