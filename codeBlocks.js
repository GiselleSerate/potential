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
		console.log("move" + kind);
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

		//console.logs various things
		console.log("blockY " + codeList[whatIndex].piece.y);
		console.log("pointList " + pointList[1].y);

		snapTo(blockY, kind);

		//If the neighbour's y value is below 70 (probably in drop) add it to the thingy. 
		if (neighbourY>70) {
			//not in spawn, so add
			console.log("Not in spawn, so add");
			myScript.push(codeList[whatIndex].piece);
		}
		else {
			console.log("Snapping back to spawn");
		}

		//Snap object to neighbourX and neighbourY
		evt.currentTarget.x = neighbourX;
		evt.currentTarget.y = neighbourY+40;
		stage.update();
		pointList.push(new Point(neighbourX, neighbourY, 0));
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
				if (instance.locked === 0) {
					//Save position of thing if it's the first time through
					if (whichTime === 0) {
						getOriginal(instance);

					}
					pleaseMove(instance, evt, "repeat");
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
				if (instance.locked === 0) {
					//Save position of thing if it's the first time through
					if (whichTime === 0) {
						getOriginal(instance);
					}
					pleaseMove(blockY, evt, "attack");
				}
			});
		    //Calls pleaseDrop function when mouse is no longer clicked.
			codeList[i].piece.on("pressup", function(evt) { 
				console.log(whatKind + " drop");
				pleaseDrop(blockY, evt, "attack");
				whichTime = 0;
			});
		}
	}

	// Snaps block to anything that exists in the working space
	var snapTo = function(index, kind) {
		console.log(whichTime);
		console.log("snap" + kind);
		for(var num = 0; num < pointList.length; num++) {
			// Determine the x and y distances from the mouse position to the point
			var diffX = Math.abs(cursorX - pointList[num].x);
			var diffY = Math.abs(cursorY - pointList[num].y); 

			// If the current point is closeEnough and the closest (so far)
			// Then choose it to snap to.
			var ySnapDistance = 80;
			var closest = (diffY<ySnapDistance);
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
					console.log("new closest");
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
		//Go through point list.
		for (i = 0; i < pointList.length; i++) {
			//Check if the object is at that point.
			if (object.y-40 === pointList[i]) {
				origPos = i;
				console.log(pointList[i]);
				//Says this point no longer has a block because you just dragged it out.
				pointList[i].hasBlock = 0;
				myScript.pop;
				return;
			}
		}
		console.log("ERROR ERROR HELP ME COULDN'T FIND ORIGINAL POINT")
	};
}