class Cat {
    constructor(game, x, y, color, current, selected) {
        Object.assign(this, { game, x, y, color, current });
        
        this.maxhealth = 10;
        this.maxhappy = 10;
        this.health = 10;
        this.happy = 10;
        this.spawn_flag = true;
        this.age = 0;
        
        this.healthBar = new HealthBar(this);
        this.HappyBar = new HappyBar(this);
        
        this.BB = new BoundingBox(this.x + 25, this.y + 25, 100, 80);


        this.current = false;
        // this.game.cat = this;
        this.x = x;
        this.y = y;
        this.color = color;
        this.breedTimer = 0;
        this.midpoint_x = this.x + (this.BB.width - 25)/2;
        this.midpoint_y = this.y + (this.BB.height - 25)/2;
        
        this.velocity = 3;
        if (this.color == 'white') {
            this.spritesheet = ASSET_MANAGER.getAsset("./Cats/white-sprite.png");
        }
        else if (this.color == 'orange') {
            this.spritesheet = ASSET_MANAGER.getAsset("./Cats/orange-sprite.png")
        }
        
        // kitty states
        this.state = 0; // 0 = idle; 1 = walking; 2 = ???; 3 = standing; 4 = sitting;
        this.facing = 0; // 0 = right; 1 = left.
        this.sitting = false;
        this.standing = false;

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
        this.BB = new BoundingBox(this.x + 25, this.y + 25, 100, 80);
        this.midpoint_x = this.x + (this.BB.width + 25)/2;
        this.midpoint_y = this.y + (this.BB.height + 25)/2;  
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

    selectCat(x, y) {
        if ((Math.abs(x - this.midpoint_x) < 40) && (Math.abs(y - this.midpoint_y) < 64)) {
            if (!selector.isSelected(this)) {
                selector.select(this);
            }
        } 
        else {
            if (selector.isSelected(this)) {
                selector.deselect(this);
                console.log("deselecting cat");
            }
        }

    };

    update() {

        if (this.health <= 0 || this.age >= 14) {
            this.removeFromWorld = true;
        }

        this.updateBB();

        const TICK = this.game.clockTick;
        this.breedTimer += TICK;
        this.spawn_flag = (this.breedTimer > 20);

        let mousePoint = this.game.mouse ? this.game.mouse : this.game.click; 

        if (this.game.clicked) {
            
            this.selectCat(mousePoint.x, mousePoint.y);

            if (selector.isSelected(this)) {
                this.x = mousePoint.x - (this.BB.width + 25)/2;
                this.y = mousePoint.y - (this.BB.height + 25)/2;
            }
        }

        // Health & Happiness Constantly Decrementing
        this.health -= TICK/30;
        this.happy -= TICK/30;

        // Age growing
        this.age += TICK/40;

        var that = this;
        this.game.entities.forEach(function (entity) {

            //Don't collide with self, only check entity's with bounding boxes
            if (entity !== that && entity.BB && that.BB.collide(entity.BB)) {

                // Currently only handling map block collisions, no entity collisions yet
                if (entity instanceof Food) {
                    // Case 1: Jumping up while hitting the side
                    // Case 2: Walking into the side while on the ground
                    that.health = 10;
                }

                if (entity instanceof Toy) {
                    that.happy = 10;
                }

                if (entity instanceof Cat) {
                    if (that.happy > 8 && that.spawn_flag && that.age > 2) {
                        if (that.spawn_flag) {
                            let color = Math.round(Math.random());
                            if (color == 0) {
                                that.spawn_flag = false;
                                that.breedTimer = 0;
                                let white_cat = new Cat(gameEngine, that.x + 50, that.y + 50, 'white', true);
                                that.game.addEntity(white_cat);
                                
                            }
                            else {
                                that.spawn_flag = false;
                                that.breedTimer = 0;
                                let orange_cat = new Cat(gameEngine, that.x + 50, that.y + 50, 'orange', false);
                                that.game.addEntity(orange_cat);
                                
                            }
                        }
                    }
                }
            }
        });

        if (selector.isSelected(this)) {

            //Update position
            if (this.game.up) {
                
                if (this.state == 0) {
                    this.state = 3; // state 3 is the transition from sit-to-stand
                }
                else if (this.state == 3) {
                    if (this.facing == 0) {
                        if (this.animations[3][0].isAlmostDone(TICK)) {
                            this.state = 1; // walking animation
                            this.animations[3][0].resetElapsedTime();
                        }
                    }
                    else if (this.facing == 1) {
                        if (this.animations[3][1].isAlmostDone(TICK)) {
                            this.state = 1; // walking animation
                            this.animations[3][1].resetElapsedTime();
                        }
                    }
                }
                else this.state = 1;
                this.y -= this.velocity;
            } 
            else if (this.game.down) {
                if (this.state == 0) {
                    this.state = 3;
                }
                else if (this.state == 3) {
                    if (this.facing == 0) {
                        if (this.animations[3][0].isAlmostDone(TICK)) {
                            this.state = 1;
                            this.animations[3][0].resetElapsedTime();
                        }
                    }
                    else if (this.facing == 1) {
                        if (this.animations[3][1].isAlmostDone(TICK)) {
                            this.state = 1;
                            this.animations[3][1].resetElapsedTime();
                        }
                    }
                }
                else this.state = 1;
                this.y += this.velocity;
            }
            if (this.game.left) {
                this.facing = 1;
                if (this.state == 0) {
                    this.state = 3;
                }
                else if (this.state == 3) {
                    if (this.animations[3][1].isAlmostDone(TICK)) {
                        this.state = 1;
                        this.animations[3][1].resetElapsedTime();
                    }
                }
                else this.state = 1;
                this.x -= this.velocity;
            }
            else if (this.game.right) {
                this.facing = 0;
                if (this.state == 0) {
                    this.state = 3;
                }
                else if (this.state == 3) {
                    if (this.animations[3][0].isAlmostDone(TICK)) {
                        this.state = 1;
                        this.animations[3][0].resetElapsedTime();
                    }
                }
                else this.state = 1;
                this.x += this.velocity;
            } 
            if (!this.game.up && !this.game.down && !this.game.left && !this.game.right)
            {  
                
                if (this.state == 1) {
                    this.state = 4; // 4 is the sitting state
                }
                else if (this.state == 4) {
                    if (this.facing == 0) {
                        if (this.animations[4][0].isAlmostDone(TICK)) {
                           
                            this.state = 0; // idle state
                            this.animations[4][0].resetElapsedTime();
                        }
                    }
                    else if (this.facing == 1) {
                        if (this.animations[4][1].isAlmostDone(TICK)) {
                            this.state = 0; // idle state
                            this.animations[4][1].resetElapsedTime();
                        }
                    }
                }

                else this.state = 0;
            }

        }
        else this.state = 0;

        
    };

    draw(ctx) {
        // ctx.strokeStyle = 'Red';
        // ctx.strokeRect(this.BB.x, this.BB.y, this.BB.width, this.BB.height);
        // ctx.strokeStyle = "blue";
        // ctx.strokeRect(this.midpoint_x-5, this.midpoint_y-5, 10, 10);
        this.animations[this.state][this.facing].drawFrame(this.game.clockTick, ctx, this.x, this.y, 2.5);
        this.healthBar.draw(ctx);
        this.HappyBar.draw(ctx);
    };
}