class HealthBar {
    constructor(cat) {
        Object.assign(this, { cat });
    };

    update() {
       
    };

    draw(ctx) {
            var ratio = this.cat.health / this.cat.maxhealth;
            ctx.strokeStyle = "#a6b0ba";
            ctx.fillStyle = ratio < 0.2 ? "Red" : "#218cff";
            ctx.fillRect(this.cat.x , this.cat.y - this.cat.BB.height/4, this.cat.BB.width * ratio, 10);
            ctx.strokeRect(this.cat.x, this.cat.y - this.cat.BB.height/4, this.cat.BB.width, 10);
    };
};

class HappyBar {
    constructor(cat) {
        Object.assign(this, { cat });
    };

    draw(ctx) {
        var ratio = this.cat.happy / this.cat.maxhappy;
        ctx.strokeStyle = "#a6b0ba";
        ctx.fillStyle = ratio < 0.2 ? "Red" : "#fff891";
        ctx.fillRect(this.cat.x , this.cat.y - this.cat.BB.height/8, this.cat.BB.width * ratio, 10);
        ctx.strokeRect(this.cat.x, this.cat.y - this.cat.BB.height/8, this.cat.BB.width, 10);
    };
};
