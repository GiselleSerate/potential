

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
				var snapDistance = 10;
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







