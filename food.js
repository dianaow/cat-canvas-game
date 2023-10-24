class Food {
    constructor(game, x, y) {
        Object.assign(this, { game, x, y});
        this.spritesheet = ASSET_MANAGER.getAsset("./Cats/food.png");
        this.animator = new Animator(ASSET_MANAGER.getAsset("./Cats/food.png"), 0, 0, 63, 45, 1, 1, 0, false, true);
        
        selector.deselect(this);
    }

    updateBB() {
        this.BB = new BoundingBox(this.x, this.y, 63, 45);
    };

    update() {
        this.updateBB();

        // if (this.game.clicked) {
        //     let mousePoint = this.game.mouse ? this.game.mouse : this.game.click; 
        //     if((Math.abs(mousePoint.x - this.x) < 60) && (Math.abs(mousePoint.y - this.y) < 45)) {
        //         selector.select(this);
        //     } else {
        //         if (selector.isSelected(this)) {
        //             selector.deselect(this);
        //         }
        //     }
        //     if (selector.isSelected(this)) {
        //         let mousePoint = this.game.mouse ? this.game.mouse : this.game.click; 
        //         this.x = mousePoint.x;
        //         this.y = mousePoint.y;
        //     }
        // }
    };

    draw(ctx) {
        // ctx.strokeStyle = 'Red';
        // ctx.strokeRect(this.BB.x, this.BB.y, this.BB.width, this.BB.height);
        this.animator.drawFrame(this.game.clockTick, ctx, this.x, this.y, 0.7);
    };
}