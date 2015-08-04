
        //create variables you need
        var stage1, instance21;

        function init1() {

            //initialize stage variable to your html canvas element
            stage1 = new createjs.Stage("demoCanvas1");

            //data object that holds animation info-spritesheet and how to break it up
            var data = {
                images: ["dadsheetintroscene1.png"],
                //this says each individual sprite is 180 wide and 247.5 tall (view image size in photoshop and do the math to get these numbers)
                frames: {width:200, height:422, count:3},
                //define animations here by giving frame indexes (remember to start at zero)
                animations: {
                    stand:0,
                    run:[0,2]
                }
            };
            var data2 = {
                images: ["girlsheetintroscene1.png"],
                //this says each individual sprite is 180 wide and 247.5 tall (view image size in photoshop and do the math to get these numbers)
                frames: {width:160, height:286, count:3},
                //define animations here by giving frame indexes (remember to start at zero)
                animations: {
                    stand:0,
                    run:[0,2]
                }
            };

            //these two lines pair together and are both necessary:
            //create sprite sheet from the data
            var ss = new createjs.SpriteSheet(data);
            var ss2 = new createjs.SpriteSheet(data2);
            //create animation from the sprite sheet
            var instance = new createjs.Sprite(ss);
            instance21 = new createjs.Sprite(ss2);

            //give your animation starting coordinates: (0,0) is top left
            instance.x = 550;
            instance.y = 175;
            //instance2.x = 0;
            instance21.y = 325;

            //need to add instance to stage (everything needs to be added to the stage)
            stage1.addChild(instance);
            stage1.addChild(instance21);
            //this starts the animation and repeats forever
            //gotoAndStop would cause it to run once
            //can also specify a animation to follow, look at docs
            instance.gotoAndPlay("stand");
            instance21.gotoAndPlay("run");


            //these two lines continully update the stage
            createjs.Ticker.setFPS(10);
            createjs.Ticker.addEventListener("tick", tick1);


        }
        function tick1(event) {
            instance21.x = instance21.x + 10;
            if (instance21.x > 250) { 
                instance21.gotoAndPlay("stand"); 
                return false;
            }
            stage1.update(event); // important!!
        }






//===========================================================INTROSCENE3================================================================





        //create variables you need
        var stage2;

        function init2() {

            //initialize stage variable to your html canvas element
            stage2 = new createjs.Stage("demoCanvas2");

            //data object that holds animation info-spritesheet and how to break it up
            var data = {
                images: ["fairyintroscene3.png"],
                //this says each individual sprite is 180 wide and 247.5 tall (view image size in photoshop and do the math to get these numbers)
                frames: {width:50, height:55, count:2},
                //define animations here by giving frame indexes (remember to start at zero)
                animations: {
                    stop:0,
                    fly:[0,2]
                }
            };
            var data2 = {
                images: ["girlsheetlvl1.png"],
                //this says each individual sprite is 180 wide and 247.5 tall (view image size in photoshop and do the math to get these numbers)
                frames: {width:72, height:128, count:3},
                //define animations here by giving frame indexes (remember to start at zero)
                animations: {
                    stand:0,
                    run:[0,2]
                }
            };

            //these two lines pair together and are both necessary:
            //create sprite sheet from the data
            var ss = new createjs.SpriteSheet(data);
            //create animation from the sprite sheet
            var instance = new createjs.Sprite(ss);

            //give your animation starting coordinates: (0,0) is top left
            instance.x = 300;
            instance.y = 280;

            //need to add instance to stage (everything needs to be added to the stage)
            stage2.addChild(instance);
            //stage.addChild(instance2);
            //this starts the animation and repeats forever
            //gotoAndStop would cause it to run once
            //can also specify a animation to follow, look at docs
            instance.gotoAndPlay("run");


            //these two lines continully update the stage
            createjs.Ticker.setFPS(6);
            createjs.Ticker.addEventListener("tick", stage2);


        }







//===========================================================LVL1===================================================================







        //create variables you need
        var stage3, instance23;

        function init3() {

            //initialize stage variable to your html canvas element
            stage3 = new createjs.Stage("demoCanvas3");

            //data object that holds animation info-spritesheet and how to break it up
            var data = {
                images: ["monstersheetlvl1.png"],
                //this says each individual sprite is 180 wide and 247.5 tall (view image size in photoshop and do the math to get these numbers)
                frames: {width:80, height:177, count:3},
                //define animations here by giving frame indexes (remember to start at zero)
                animations: {
                    stand:0,
                    run:[0,2]
                }
            };
            var data2 = {
                images: ["girlsheetlvl1.png"],
                //this says each individual sprite is 180 wide and 247.5 tall (view image size in photoshop and do the math to get these numbers)
                frames: {width:72, height:128, count:3},
                //define animations here by giving frame indexes (remember to start at zero)
                animations: {
                    stand:0,
                    run:[0,2]
                }
            };

            //these two lines pair together and are both necessary:
            //create sprite sheet from the data
            var ss = new createjs.SpriteSheet(data);
            var ss2 = new createjs.SpriteSheet(data2);
            //create animation from the sprite sheet
            var instance = new createjs.Sprite(ss);
            instance23 = new createjs.Sprite(ss2);

            //give your animation starting coordinates: (0,0) is top left
            instance.x = 550;
            instance.y = 400;
            //instance2.x = 0;
            instance23.y = 450;

            //need to add instance to stage (everything needs to be added to the stage)
            stage3.addChild(instance);
            stage3.addChild(instance23);
            //this starts the animation and repeats forever
            //gotoAndStop would cause it to run once
            //can also specify a animation to follow, look at docs
            instance.gotoAndPlay("run");
            instance23.gotoAndPlay("run");


            //these two lines continully update the stage
            createjs.Ticker.setFPS(6);
            createjs.Ticker.addEventListener("tick", tick3);


        }
        function tick3(event) {
            instance23.x = instance23.x + 10;
            if (instance23.x > 250) { 
                instance23.gotoAndPlay("stand"); 
                return false;
            }
            stage3.update(event); // important!!
        }























var counter = 1;
$(document).ready(function () {
	$("#startButton").append('<img src = "StartButton.png" onclick="nextPage()">');
    $("#Logo").append('<p id= "title"> Potential</p><p id= "subtitle"> An interactive story adventure!</p>');
});


var nextPage = function(){
	counter = counter + 1
	console.log(counter)
	document.querySelector(".pages").style.visibility = "hidden";
	if (counter === 2){
		document.getElementById("secondPage").style.visibility = "visible";
		init1();

	}
	if (counter === 3) {
		document.getElementById("secondPage").style.visibility = "hidden";
		document.getElementById("thirdPage").style.visibility = "visible";
		init2();
	}
	if (counter === 4) {
		document.getElementById("thirdPage").style.visibility = "hidden";
		document.getElementById("fourthPage").style.visibility = "visible";
		init3()
	}
	if (counter == 5) {
		document.getElementById("fourthPage").style.visibility = "hidden";
		document.getElementById("fifthPage").style.visibility = "visible";
	}
}

$(document).keydown(function(e) {
    switch(e.which) {
        case 39: // right
        nextPage();
        break;

        default: return; // exit this handler for other keys
    }
    e.preventDefault(); // prevent the default action (scroll / move caret)
});