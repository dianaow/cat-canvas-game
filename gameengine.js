class GameEngine {
    constructor(options) {
        // What you will use to draw
        // Documentation: https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D
        this.ctx = null;

        // Everything that will be updated and drawn each frame
        this.entities = [];

        // Information on the input
        this.click = null;
        this.clicked = false;
        this.mouseDrag = false;
        this.mouse = null;
        this.mouseUp = true;
        this.wheel = null;
        this.left = false;
        this.right = false;
        this.up = false;
        this.down = false;
        this.keys = {};
        this.diedCount = 0

        // THE KILL SWITCH
        this.running = false;

        // Options and the Details
        this.options = options || {
            prevent: {
                contextMenu: true,
                scrolling: true,
            },
            debugging: true,
        };
    };

    init(ctx) {
        this.ctx = ctx;
        this.startInput();
        this.timer = new Timer();
    };

    start() {
        this.running = true;
        const gameLoop = () => {
            this.loop();
            if (this.running) {
                requestAnimFrame(gameLoop, this.ctx.canvas);
            } else {
                this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
                let cagedCats = this.entities.filter(d => d.caged)
                let totalHealth = cagedCats.map(d => d.health).reduce(function (a, b) {return a + b;}, 0);
                let totalHappiness = cagedCats.map(d => d.happy).reduce(function (a, b) {return a + b;}, 0);
                let totalDuration = Math.round(this.clockTick * 1000 * 100) / 100
                let totalScore = parseFloat(Math.round(totalHealth) + Math.round(totalHappiness))
                this.ctx.fillStyle = "black";
                this.ctx.font = "50px Arial";
                this.ctx.fillText("GAME OVER!", this.ctx.canvas.width/2 - 100, this.ctx.canvas.height/2 - 150);
                this.ctx.fillText("Total Health: " + Math.round(totalHealth), this.ctx.canvas.width/2 - 200, this.ctx.canvas.height/2 - 100);
                this.ctx.fillText("Total Happiness: " + Math.round(totalHappiness), this.ctx.canvas.width/2 - 200, this.ctx.canvas.height/2 - 50);
                this.ctx.fillText("Game Duration: " + totalDuration, this.ctx.canvas.width/2 - 200, this.ctx.canvas.height/2);
                this.ctx.fillText("FINAL SCORE: " + totalScore, this.ctx.canvas.width/2 - 200, this.ctx.canvas.height/2 + 50);
            }
        };
        gameLoop();
    };

    startInput() {
        var that = this;

        const getXandY = e => ({
            x: e.clientX - this.ctx.canvas.getBoundingClientRect().left,
            y: e.clientY - this.ctx.canvas.getBoundingClientRect().top
        });

        this.ctx.canvas.addEventListener("mousemove", e => {
            // if (this.options.debugging) {
            //     console.log("MOUSE_MOVE", getXandY(e));
            // }
            this.mouse = getXandY(e);
        });

        this.ctx.canvas.addEventListener("mousedown", function (e) {
            
            that.clicked = true;
            that.mouseUp = false;
            that.click = getXandY(e);
        }, false);

        this.ctx.canvas.addEventListener("mouseup", function (e) {
            that.clicked = false;
            that.mouseUp = true;
            that.click = getXandY(e);
        }, false);

        this.ctx.canvas.addEventListener("wheel", e => {
            if (this.options.debugging) {
            }
            if (this.options.prevent.scrolling) {
                e.preventDefault(); // Prevent Scrolling
            }
            this.wheel = e;
        });

        this.ctx.canvas.addEventListener("contextmenu", e => {
            if (this.options.debugging) {
                console.log("RIGHT_CLICK", getXandY(e));
            }
            if (this.options.prevent.contextMenu) {
                e.preventDefault(); // Prevent Context Menu
            }
            this.rightclick = getXandY(e);
        });

        window.addEventListener("keydown", event => this.keys[event.key] = true);
        window.addEventListener("keyup", event => this.keys[event.key] = false);
    };

    addEntity(entity) {
        this.entities.push(entity);
    };

    draw() {
        // Clear the whole canvas with transparent color (rgba(0, 0, 0, 0))
        this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);

        // Draw latest things first
        for (let i = this.entities.length - 1; i >= 0; i--) {
            this.entities[i].draw(this.ctx, this);
        }
    };

    update() {
        let entitiesCount = this.entities.length;
        let cagedCats = this.entities.filter(d => d.caged === true)
        let cats = this.entities.filter(d => d.type === 'cat')

        for (let i = 0; i < entitiesCount; i++) {
            let entity = this.entities[i];
            if (!entity.removeFromWorld) {
                entity.update();
            }
        }

        if(this.diedCount >= 3) {
            this.running = false;
            this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
        }

        if(cagedCats.length === cats.length) {
            this.running = false;
            this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
        }

        for (let i = this.entities.length - 1; i >= 0; --i) {
            if (this.entities[i].removeFromWorld) {
                this.diedCount += 1
                this.entities.splice(i, 1);
            }
        }
    };

    loop() {
        this.clockTick = this.timer.tick();
        this.update();
        this.draw();
    };

};