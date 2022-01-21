console.log('loading in cat.js');

class Cat {
    constructor(game, x, y, color, current, selected) {
        Object.assign(this, { game, x, y, color, current });

        console.log('cat constructed');
        
        
        this.selected = false;

        this.current = false;
        this.game.cat = this;
        this.x = x;
        this.y = y;
        this.color = color;
        
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
    }

    currentSelection(x, y) {
       
        // console.log('param.x=' + x + ' param.y=' + y);
        // console.log('this.x=' + this.x + ' this.y=' + this.y);
        // console.log('x='+Math.abs(x - this.x) + ' y=' +Math.abs(y - this.y));
        if ((Math.abs(x - this.x - 20) < 64) && (Math.abs(y - this.y - 15) < 64)) {
            this.selected = true;
        } else this.selected = false;

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

    

    update() {

        // console.log(this.selected);
        const TICK = this.game.clockTick;

        if (this.game.clicked) {
            let mousePoint = this.game.mouse ? this.game.mouse : this.game.click; 
            this.currentSelection(mousePoint.x, mousePoint.y);
            
        }

        if (this.selected) {
            console.log('this.state: ' + this.state + ', this.facing: ' + this.facing);
           
            // if (this.color == 'white') {
            //     this.changeColor('white');
            // }
            // else if (this.color == 'orange') {
            //     this.changeColor('orange');
            // }

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
    };

    draw(ctx) {
        ctx.strokeStyle = 'Red';
        ctx.strokeRect(this.x + 20, this.y + 15, 64, 64);
        this.animations[this.state][this.facing].drawFrame(this.game.clockTick, ctx, this.x, this.y, 2);
    };
}