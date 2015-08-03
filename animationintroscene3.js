
        //create variables you need
        var stage, instance2;

        function init() {

            //initialize stage variable to your html canvas element
            stage = new createjs.Stage("demoCanvas");

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
            var ss2 = new createjs.SpriteSheet(data2);
            //create animation from the sprite sheet
            var instance = new createjs.Sprite(ss);
            instance2 = new createjs.Sprite(ss2);

            //give your animation starting coordinates: (0,0) is top left
            instance.x = 300;
            instance.y = 280;
            //instance2.x = 0;
            instance2.y = 450;

            //need to add instance to stage (everything needs to be added to the stage)
            stage.addChild(instance);
            //stage.addChild(instance2);
            //this starts the animation and repeats forever
            //gotoAndStop would cause it to run once
            //can also specify a animation to follow, look at docs
            instance.gotoAndPlay("run");
            instance2.gotoAndPlay("run");


            //these two lines continully update the stage
            createjs.Ticker.setFPS(6);
            createjs.Ticker.addEventListener("tick", stage);


        }
