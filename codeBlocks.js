function init() {
	//Gets mouse position.
	var cursorX;
	var cursorY;
	document.onmousemove = function(e){
	    cursorX = e.pageX;
	    cursorY = e.pageY;
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

	//Creates array for storing possible points to snap to. Points indicate the TOP LEFT OF THE BLOCK
	var pointList = [new Point(leftSide, topSpawn-40), new Point(leftSide, topDrop)];

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

	var createRepeatBlock = function() {
		var repeatSet = new createjs.Graphics().beginFill("DeepSkyBlue").drawRect(0, 0, 200, 40);
		var newRep = new createjs.Shape(repeatSet)
		newRep.x = 0;
		newRep.y = 0;
		//Creates label.
		var label = new createjs.Text("repeat", "#000000");
		label.textAlign = "center";
		label.x = 100;
		label.y = 10;
		//Creates dragger.
		var dragMe = new createjs.Container();
		dragMe.x = leftSide;
		dragMe.y = topSpawn;
		dragMe.addChild(newRep, label);
		var part = new CodePiece(dragMe, "repeat");
		codeList.push(part);
		stage.addChild(dragMe);
		stage.update();
	};

	createRepeatBlock();

	var createAttackBlock = function() {
		var attackSet = new createjs.Graphics().beginFill("purple").drawRect(0, 0, 200, 40);
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
		var part = new CodePiece(dragMe, "attack");
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
		console.log("moving");
	    evt.currentTarget.x = evt.stageX;
	    evt.currentTarget.y = evt.stageY;
	    snapTo(which, kind);
	    stage.update();
	}


	var pleaseDrop = function(which, evt, kind) {
		console.log("up"); 
		snapTo(which, kind);
		//Snap object to neighbourX and neighbourY
		evt.currentTarget.x = neighbourX;
		evt.currentTarget.y = neighbourY+40;
		// If neighbour has been reset and is not its initial value, snap to that and create a new repeat block in the old place. 
		if(neighbourY !== pointList[0].y) {
			if(evt.target.type === "repeat") {
				console.log("repeat");
		    	createRepeatBlock();
			}
			else if(evt.target.type === "attack") {
				console.log("attack");
				createAttackBlock();
			}
		}
		stage.update();
		whichTime += 1;
	};


	for(var i=0;i< codeList.length; i++) {
		//Calls pleaseMove function when mouse is clicked.
		var whatKind = codeList[i].kind;
		codeList[i].piece.on("pressmove", function(evt) {
			pleaseMove(i, evt, whatKind);
		});
	    //Calls pleaseDrop function when mouse is no longer clicked.
		codeList[i].piece.on("pressup", function(evt) { 
			pleaseDrop(i, evt, whatKind);
			whichTime = 0;
		})
	}

	// Snaps block to anything that exists in the working space
	var snapTo = function(index, kind) {
		for(var num = 0; num < pointList.length; num++) {
			//console.log("x " + pointList[num].x);
			//console.log("mousex " + MouseEvent.stageX);
			// Determine the distance from the mouse position to the point
			var diffX = Math.abs(cursorX - pointList[num].x);
			var diffY = Math.abs(cursorY - pointList[num].y); 
			console.log(diffX + " " + diffY)
			//var d = Math.sqrt(diffX*diffX + diffY*diffY);        

			// If the current point is closeEnough and the closest (so far)
			// Then choose it to snap to.
			var xSnapDistance = 80;
			var ySnapDistance = 80;
			//var closest = (d<snapDistance && (dist == null || d < dist));
			var closest = (diffX<xSnapDistance && diffY<ySnapDistance);
			if (closest) {
				neighbourX = pointList[num].x;
				console.log(pointList[num].x);
				neighbourY = pointList[num].y;
				console.log("new closest");
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
}