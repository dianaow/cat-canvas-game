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
        
        
        if (this.color == 'white') {
            this.spritesheet = ASSET_MANAGER.getAsset("./Cats/white-sprite.png");
        }
        else if (this.color == 'orange') {
            this.spritesheet = ASSET_MANAGER.getAsset("./Cats/orange-sprite.png")
        }
        
        // kitty states
        this.state = 0; // 0 = idle; 1 = walking; 2 = sitting; 3 = standing; 4 = idle sitting.
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
        console.log('param.x=' + x + ' param.y=' + y);
        console.log('this.x=' + this.x + ' this.y=' + this.y);
        console.log('x='+Math.abs(x - this.x) + ' y=' +Math.abs(y - this.y));
        if ((Math.abs(x - this.x) < 128) && (Math.abs(y - this.y) < 128)) {
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
        this.animations[2][0] = new Animator(this.spritesheet, 263, 128, 64, 64, 4, 0.2, 0, true, false);
        this.animations[2][1] = new Animator(this.spritesheet, 2, 128, 64, 64, 4, 0.2, 0, false, false);
        this.animations[3][0] = new Animator(this.spritesheet, 263, 128, 64, 64, 4, 0.2, 0, false, false);
        this.animations[3][1] = new Animator(this.spritesheet, 2, 128, 64, 64, 4, 0.2, 0, true, false);
        this.animations[4][0] = new Animator(this.spritesheet, 263, 128, 64, 64, 4, 0.2, 0, true, false);
        this.animations[4][1] = new Animator(this.spritesheet, 2, 128, 64, 64, 4, 0.2, 0, true, false);
    };

    

    update() {

        // console.log(this.selected);
        const TICK = this.game.clockTick;

        if (this.game.clicked) {
            let mousePoint = this.game.mouse ? this.game.mouse : this.game.click; 
            this.currentSelection(mousePoint.x, mousePoint.y);
            
        }

        if (this.selected) {
            if (this.color == 'white') {
                this.changeColor('white');
            }
            else if (this.color == 'orange') {
                this.changeColor('orange');
            }

            //Update position
            if (this.game.up) {
                this.state = 1;
                this.sitting = false;
                this.y -= 2;
            } 
            else if (this.game.down) {
                this.state = 1;
                this.sitting = false;
                this.y +=2;
            }
            if (this.game.left) {
                this.sitting = false;
                this.state = 1;
                this.facing = 1;
                this.x -= 2;
            }
            else if (this.game.right) {
                this.state = 1;
                this.sitting = false;
                this.facing = 0;
                this.x += 2;
            }
            if (!this.game.up && !this.game.down && !this.game.left && !this.game.right)
            {
                //this.sitting = true;
                this.state = 0;
            }

            // Update sit/stand
            if (this.sitting) this.state = 3;
            if (this.standing) this.state = 4;
        }
    };

    draw(ctx) {
        this.animations[this.state][this.facing].drawFrame(this.game.clockTick, ctx, this.x, this.y, 2);
    };
}