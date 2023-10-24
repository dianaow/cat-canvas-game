class Cat {
    constructor(game, x, y, color, id) {
        Object.assign(this, { game, x, y, color, id });
        
        this.type = 'cat';
        this.maxhealth = 10;
        this.maxhappy = 10;
        this.health = Math.max(5, Math.round(Math.random()) * 10);
        this.happy = 10;
        this.spawn_flag = true;
        this.duration = 0;
        this.direction = 0;
        this.moving = false;
        this.caged = false
        this.healthBar = new HealthBar(this);
        this.HappyBar = new HappyBar(this);
        
        this.BB = new BoundingBox(this.x, this.y, 64, 64);

        this.id = id
        this.x = x;
        this.y = y;
        this.color = color;
        this.breedTimer = 0;
        this.timeSinceLastMoved = 0;

        this.midpoint_x = this.x + (this.BB.width)/2;
        this.midpoint_y = this.y + (this.BB.height)/2;
        
        this.velocity = 3;
        if (this.color == 'white') {
            this.spritesheet = ASSET_MANAGER.getAsset("./Cats/white-sprite.png");
        }
        else if (this.color == 'orange') {
            this.spritesheet = ASSET_MANAGER.getAsset("./Cats/orange-sprite.png")
        }
        
        // kitty states
        this.state = 0; // 0 = idle; 1 = walking; 2 = ???; 3 = standing; 4 = sitting;
        this.facing = Math.round(Math.random()); // 0 = right; 1 = left.

        this.animations = [
            [0,0],
            [0,1],
            [1,0],
            [1,1],
            [2,0],
            [2,1],
            [3,0],
            [3,1],
            [4,0],
            [4,1]
        ]; 
        this.loadAnimations();
          
        selector.deselect(this);

    };

    updateBB() {
        this.BB = new BoundingBox(this.x, this.y, 64, 64);
        this.midpoint_x = this.x + (this.BB.width)/2;
        this.midpoint_y = this.y + (this.BB.height)/2;  
    };

    changeColor(color) {
        if (this.color == 'white') {
            this.spritesheet = ASSET_MANAGER.getAsset("./Cats/white-sprite.png");
        }
        else if (this.color == 'orange') {
            this.spritesheet = ASSET_MANAGER.getAsset("./Cats/orange-sprite.png");
        }
    };

    loadAnimations() {
        this.animations[0][0] = new Animator(this.spritesheet, 263, 0, 64, 64, 4, 0.2, 0, false, true);
        this.animations[0][1] = new Animator(this.spritesheet, 2, 0, 64, 64, 4, 0.2, 0, true, true);
        this.animations[1][0] = new Animator(this.spritesheet, 263, 60, 64, 64, 4, 0.2, 0, false, true);
        this.animations[1][1] = new Animator(this.spritesheet, 2, 60, 64, 64, 4, 0.2, 0, true, true);
        this.animations[2][0] = new Animator(this.spritesheet, 263, 128, 64, 64, 4, 0.2, 0, true, true);
        this.animations[2][1] = new Animator(this.spritesheet, 2, 128, 64, 64, 4, 0.2, 0, false, true);
        this.animations[3][0] = new Animator(this.spritesheet, 263, 128, 64, 64, 4, 0.1, 0, false, true);
        this.animations[3][1] = new Animator(this.spritesheet, 2, 128, 64, 64, 4, 0.1, 0, true, true);
        this.animations[4][0] = new Animator(this.spritesheet, 263, 128, 64, 64, 4, 0.1, 0, true, true);
        this.animations[4][1] = new Animator(this.spritesheet, 2, 128, 64, 64, 4, 0.1, 0, false, true);
    };

    willBreed(elapsedTime, spawn_flag) {
        if(this.caged) return false
        if (spawn_flag) {
            spawn_flag = false;
            let chance =  elapsedTime > 60 ? this.probability(0.34) : elapsedTime > 30 ? this.probability(0.25) : 
                        elapsedTime > 20 ? this.probability(0.1) : this.probability(0.0);           
            if (chance == 1) {
                return true;
            }
        }
        return false;
    };

    willMove(elapsedTime) {
        let chance = elapsedTime > 80 ? this.probability(0.3) : this.probability(0.1);
        return (chance == 1);
    };


    /** Returns 0 or 1 based on probability of n */
    probability(n) {
        let rand = Math.random()
        return rand <= n;
    };

    selectCat(x, y) {
        if ((Math.abs(x - this.midpoint_x) < 64) && (Math.abs(y - this.midpoint_y) < 64)) {
            if (!selector.isSelected(this)) {
                selector.select(this);
            }
        } 
        else {
            if (selector.isSelected(this)) {
                selector.deselect(this);
            }
        }
    };

    update() {

        if (this.health <= 0) {
            this.removeFromWorld = true;
        }

        this.updateBB();

        const centerRect = {
            x: window.innerWidth * 0.4,
            y: window.innerHeight * 0.4,
            width: window.innerWidth * 0.2,
            height: window.innerHeight * 0.2
          };
          
        const TICK = this.game.clockTick;
        this.timeSinceLastMoved += TICK;

        this.breedTimer += TICK;
        this.spawn_flag = (this.breedTimer > 20);

        let mousePoint = this.game.mouse ? this.game.mouse : this.game.click; 

        if (this.game.clicked) {
            this.selectCat(mousePoint.x, mousePoint.y);
            if (selector.isSelected(this) && !this.caged) {
                this.x = mousePoint.x - (this.BB.width)/2;
                this.y = mousePoint.y - (this.BB.height)/2;
            }
        }

        // Health & Happiness adjustments
        if(this.duration < 5 && !this.caged) {
            this.health -= TICK/2.5;
            this.happy -= TICK/2.5;   
        } else if(!this.caged){
            this.health -= TICK/5;
            this.happy -= TICK/3;
        } else if(this.caged){
            this.health += TICK/3;
            this.happy += TICK/5;
        }

        var that = this;
        this.game.entities.forEach(function (entity) {
            //Don't collide with self, only check entity's with bounding boxes
            if (entity !== that && entity.BB && that.BB.collide(entity.BB)) {
                //If a cat collides with another cat, there is a probability of breeding
                if (entity instanceof Cat) {
                    if (that.willBreed(that.breedTimer, that.spawn_flag)) {
                        let color = Math.round(Math.random());
                        if (color == 0) {
                            let white_cat = new Cat(gameEngine, that.x - 50, that.y - 50, 'white', that.breedTimer);
                            that.game.addEntity(white_cat);
                        }
                        else {
                            let orange_cat = new Cat(gameEngine, that.x - 50, that.y - 50, 'orange', that.breedTimer);
                            that.game.addEntity(orange_cat);
                        }
                        that.spawn_flag = false;
                        that.breedTimer = 0;
                    }
                }
            }
        });

        /** RANDOM MOVEMENT **/
        if (this.willMove(this.timeSinceLastMoved) && !this.moving && !this.caged) {
            //console.log('start animation', this.id)
            //this.duration = Math.round(Math.random() * 15);
            this.duration = 15
            this.direction = Math.round(Math.random() * 4);
            this.moving = true;
            this.state = 1
        } 

        if (this.moving && !this.caged && !selector.isSelected(this)) {
            switch(this.direction) {
                case 0:
                    if (this.x > 0) this.x -= this.velocity;
                    this.duration -= this.game.clockTick*2;
                    break;
                case 1:
                    if ((this.x - this.BB.width) < window.innerWidth) this.x += this.velocity;
                    this.duration -= this.game.clockTick*2;
                    break;
                case 2: 
                    if (this.y > 0) this.y -= this.velocity;
                    this.duration -= this.game.clockTick*2;
                    break;
                case 3:
                    if ((this.y - this.BB.height) < window.innerHeight) this.y += this.velocity;
                    this.duration -= this.game.clockTick*2;
                    break;
            }

            // Check for collisions with walls
            if(this.direction === 0 || this.direction === 1){
                if (this.x < this.BB.width || (this.x > (window.innerWidth - this.BB.width))) {
                    // Collision with left or right wall
                    //console.log('colliding with left or right wall', this.id)
                    this.velocity *= -1; // Reverse horizontal direction
                    this.facing = this.facing === 0 ? 1 : 0
                    this.health -= 1
                }
            }
            
            if(this.direction === 2 || this.direction === 3){
                if (this.y < this.BB.height || (this.y > (window.innerHeight - this.BB.height))) {
                    // Collision with top or bottom wall
                    //console.log('colliding with top or bottom wall', this.id)
                    this.velocity *= -1; // Reverse vertical direction
                    this.facing = this.facing === 0 ? 1 : 0
                    this.health -= 1
                }
            }
            
            // Check for collision with the center rectangle
            if (
                this.x > (centerRect.x - this.BB.width) &&
                this.x < (centerRect.x + centerRect.width + this.BB.width*2) && 
                this.y > (centerRect.y - this.BB.width) &&
                this.y < (centerRect.y + centerRect.height + this.BB.height*2)
            ) {
                //console.log('colliding with cage', this.id)
                this.velocity *= -1; // Reverse horizontal direction
                this.facing = this.facing === 0 ? 1 : 0
                this.health -= 1
            }
       
            if (this.duration <= 0) {
                //console.log('finish animation', this.id)
                this.timeSinceLastMoved = 0;
                this.state = 4
                this.moving = false;
            }
        }




        /** PLAYR CONTROLLED MOVEMENT **/
        if (
            !this.caged &&
            selector.isSelected(this) && 
            this.x > (centerRect.x + 10) &&
            this.x < (centerRect.x + centerRect.width - this.BB.width) && 
            this.y > (centerRect.y + 10) &&
            this.y < (centerRect.y + centerRect.height - this.BB.height)
        ) {
            //Update position
            this.state = 0;
            this.caged = true
            this.velocity = 0
        }

        if(this.caged && this.health === 10){
            this.x = centerRect.x + centerRect.width / 2 
            this.y = centerRect.y - this.BB.height * 2
            this.velocity = 3
            this.caged = false
        }

    };

    draw(ctx) {
        // ctx.strokeStyle = 'yellow';
        // ctx.strokeRect(this.x, this.y, this.BB.width, this.BB.height);
        // ctx.strokeStyle = 'Red';
        // ctx.strokeRect(window.innerWidth * 0.4 - this.BB.width, window.innerHeight * 0.4 - this.BB.height, window.innerWidth * 0.2 + this.BB.width*2, window.innerHeight * 0.2 + this.BB.height*2);
        // ctx.strokeStyle = "blue";
        // ctx.strokeRect(this.midpoint_x-5, this.midpoint_y-5, 10, 10);
        // ctx.fillStyle = "black";
        // ctx.font = "10px Arial";
        // ctx.fillText(this.id, this.x + this.BB.width + 10, this.y + this.BB.height + 10);
        this.animations[this.state][this.facing].drawFrame(this.game.clockTick, ctx, this.x, this.y, 1.2);
        this.healthBar.draw(ctx);
        this.HappyBar.draw(ctx);
    };
}