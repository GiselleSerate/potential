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

		//If the neighbour's y value is below 70 (which means it is in drop) add it to myScript. 70 is arbitrary and could probably be 40 or something. 
		if (neighbourY>70) {
			//Not in spawn, so add it.
			myScript.push(codeList[whatIndex]);
			pointList[pointList.length - 1].hasBlock = 1
		}

		//Snap object to neighbourX and neighbourY
		evt.currentTarget.x = neighbourX;
		evt.currentTarget.y = neighbourY+40;
		stage.update();
		if (pointList[pointList.length - 1].hasBlock === 1) {
			//If the last point in pointList is full, make a new slot.
			pointList.push(new Point(neighbourX, neighbourY + 40, 0));
		}
		//Otherwise, if the last point in pointList is not full, do not make a new slot.

		//Checking win case.
		if (myScript.length > 1) {
			if (myScript[0].kind === "repeat") {
				console.log("First is a repeat");
				if (myScript[1].kind === "attack") {
					console.log("Second is attack");
					console.log("WIN CASE REACHED");
					winCase();
				}
			}
		}
	};

	var whatKind;
	var instance;
	var blockY;
	var condition;

	for(var i=0;i< codeList.length; i++) {

		//If the point list is longer than default pop last.
		if (pointList.length > 2) {
			pointList.pop;
		}

		whatKind = codeList[i].kind;
		instance = codeList[i];
		blockY = codeList[i].piece.y;
		
		//What to do if the block type is repeat.
		if (whatKind === "repeat") {

			//The following (including pleaseMove and some conditions) is called when mouse is clicked.
			codeList[i].piece.on("pressmove", function(evt) {
				//I should only be checking this once, on the first step of the drag. 
				if (whichTime === 0) {
					//If it's the first time, check isUnlocked. 
					condition = (isUnlocked(0));
				}
				else {
					//Assume that it will keep dropping and resetting if it runs into errors.
					condition = true;
				}
				if (condition) {
					//This component is unlocked. Go ahead.
					//Save position of thing if it's the first time through
					if (whichTime === 0) {
						getOriginal(instance);

					}
					pleaseMove(instance, evt, "repeat");
				}
				//Otherwise, the component is locked. Go away.
			});

		    //Calls pleaseDrop function when mouse is no longer clicked.
			codeList[i].piece.on("pressup", function(evt) { 	
				pleaseDrop(instance, evt, "repeat");
				//Resets whichTime to reset the indicator that tells you if it's the first part of the drag sequence.
				whichTime = 0;
			});
		}

		//What to do if the block type is attack.
		else if (whatKind === "attack") {
			codeList[i].piece.on("pressmove", function(evt) {
				//I should only be checking this once, on the first step of the drag. 
				if (whichTime === 0) {
					//If it's the first time, check isUnlocked. 
					condition = (isUnlocked(1));
				}
				else {
					//Assume that it will keep dropping and resetting if it runs into errors.
					condition = true;
				}
				if (condition) {
					//Save position of thing if it's the first time through
					if (whichTime === 0) {
						getOriginal(instance);
					}
					pleaseMove(blockY, evt, "attack");
				}
				//Otherwise, the component is locked. Go away.");
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
		var objY = object.piece.y;
		//Go through point list.
		for (i = 0; i < pointList.length; i++) {
			var storedY = pointList[i].y + 40;
			var itsABool = (String(objY) === String(storedY));
			//Check if the object is at that point.
			if (itsABool) {
				origPos = i;
				//Says this point no longer has a block because you just dragged it out.
				pointList[i].hasBlock = 0;
				myScript.pop;
			}
		}
	};

	var isUnlocked = function(index) {
		var coord = codeList[index].piece.y;
		if (coord <= 40 || myScript.length === 0) {
			//This means it's in the spawn area. You can drag it.
			return true;
		}
		//Putting the spawn area ensures that you don't try to check elements of myScript before there are any elements in the list.
		else if (myScript[myScript.length - 1].piece.y = coord) {
			//This means it's the last block in the script. You can drag it. 
			return true;
		}
		else {
			//It must be behind another block. Do not drag it.
			return false;
		}
	}
}

//Handles what happens if you win. 
var winCase = function() {
	console.log("Entered winCase function");
	//Makes canvas hidden. 
	document.getElementById("demoCanvas").style.visibility = "hidden";
	//Makes simulated image visible. 
	// document.getElementById("simImage").style.visibility = "visible";
	//Makes credits button visible. 
	// document.getElementById("credButton").style.visibility = "visible";
	//Makes reload page button visible?
	//Animates girl and monster? 
	//Displays congratulatory helptext?
	document.getElementById("initHelpText").innerHTML = "Great work! Putting \"attack\" in a \"repeat\" <br> block successfully made Kristie attack <br> the monster over and over again. <br> <br> Thanks for playing! <br> <br> <a href = 'outro.html'>Credits</a>"
}