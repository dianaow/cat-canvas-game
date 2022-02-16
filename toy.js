class Toy {
    constructor(game, x, y) {
        Object.assign(this, { game, x, y});
        this.spritesheet = ASSET_MANAGER.getAsset("./yarn.png");
        this.animator = new Animator(ASSET_MANAGER.getAsset("./yarn.png"), 0, 0, 61, 40, 1, 1, 0, false, true);
        
    }

    updateBB() {
        this.BB = new BoundingBox(this.x, this.y, 61, 40);
    };

    update() {
        this.updateBB();
    }

    draw(ctx) {
        // ctx.strokeStyle = 'Red';
        ctx.strokeRect(this.BB.x, this.BB.y, this.BB.width, this.BB.height);
        this.animator.drawFrame(this.game.clockTick, ctx, this.x, this.y, 1);
    };
}