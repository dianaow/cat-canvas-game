// This game shell was happily modified from Googler Seth Ladd's "Bad Aliens" game and his Google IO talk in 2011

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

        this.ctx.canvas.addEventListener('keydown', function (e) {
            switch (e.code) {
                case "KeyA":
                    that.left = true;
                    that.right = false;
                    break;
                case "KeyD":
                    that.right = true;
                    that.left = false;
                    break;
                case "KeyW":
                    that.up = true;
                    that.down = false;
                    break;
                case "KeyS":
                    that.down = true;
                    that.up = false;
                    break;    
            }
        }, false);

        this.ctx.canvas.addEventListener('keyup', function (e) {
            switch (e.code) {
                case "KeyA":
                    that.left = false;
                    break;
                case "KeyD":
                    that.right = false;
                    break;
                case "KeyW":
                    that.up = false;
                    break;
                case "KeyS":
                    that.down = false;
                    break;    
            }
        }
        )

        this.ctx.canvas.addEventListener('keypress', function (e) {
            switch (e.code) {
                case "KeyO":
                    that.color = 'orange';
                    break;
                case "KeyL":
                    that.color = 'white';
                    break; 
            }
        }
        )

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

        for (let i = 0; i < entitiesCount; i++) {
            let entity = this.entities[i];

            if (!entity.removeFromWorld) {
                entity.update();
            }
        }

        for (let i = this.entities.length - 1; i >= 0; --i) {
            if (this.entities[i].removeFromWorld) {
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