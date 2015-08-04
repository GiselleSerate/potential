
        //create variables you need
        var stage, instance2;

        function init() {

            //initialize stage variable to your html canvas element
            stage = new createjs.Stage("demoCanvas");

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
            instance2 = new createjs.Sprite(ss2);

            //give your animation starting coordinates: (0,0) is top left
            instance.x = 550;
            instance.y = 175;
            //instance2.x = 0;
            instance2.y = 325;

            //need to add instance to stage (everything needs to be added to the stage)
            stage.addChild(instance);
            stage.addChild(instance2);
            //this starts the animation and repeats forever
            //gotoAndStop would cause it to run once
            //can also specify a animation to follow, look at docs
            instance.gotoAndPlay("stand");
            instance2.gotoAndPlay("run");


            //these two lines continully update the stage
            createjs.Ticker.setFPS(10);
            createjs.Ticker.addEventListener("tick", tick);


        }
        function tick(event) {
            instance2.x = instance2.x + 10;
            if (instance2.x > 250) { 
                instance2.gotoAndPlay("stand"); 
                return false;
            }
            stage.update(event); // important!!
        }