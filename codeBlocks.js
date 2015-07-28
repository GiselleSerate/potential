function init() {
	var canvas = document.getElementById("demoCanvas");
	var stage = new createjs.Stage(canvas);

	var codeComponents = [];

	var repeatBlock = new createjs.Shape();
	repeatBlock.graphics.beginFill("DeepSkyBlue").drawRect(100,100,20,20);
	repeatBlock.x = 10;
	repeatBlock.y = 100;
	stage.addChild(repeatBlock);
	// codeComponents.push(repeatBlock);
	// console.log(codeComponents);

	// INSERT CONTENTS OF NIXHOLDER HERE
}