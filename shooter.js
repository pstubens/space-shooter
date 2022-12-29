// window.onload gets called when the window is fully loaded
window.onload = function() {
    var canvas = document.getElementById("viewport"); 
    var game = new Game(canvas, 3);
    function main(tframe) {
        game.update(tframe);
        game.render();
        window.requestAnimationFrame(main); // Request the _next_ frame to run
    }
    main(0) // Run the first frame
}

class Game {
    constructor(canvas, n) {
        this.canvas = canvas;
        this.context = canvas.getContext("2d");

        // Timing and FPS
        this.lastframe = 0;
        this.fpstime = 0;
        this.framecount = 0;
        this.fps = 0;

        // Create game world
        this.player = new Player(canvas);
        this.arena = new Arena(canvas);

        // Set up mouse event listeners
        canvas.addEventListener("mousemove", (e) => this.onMouseMove(e));
        canvas.addEventListener("mousedown", (e) => this.onMouseDown(e));
        canvas.addEventListener("mouseup",   (e) => this.onMouseUp(e));
        canvas.addEventListener("mouseout",  (e) => this.onMouseOut(e));
    }

    update(tframe) {
        // Update FPS
        var dt = (tframe - this.lastframe) / 1000;
        this.lastframe = tframe;
        this.updateFps(dt);
        dt *= 0.3;

        this.player.update(dt, this);
    }

    render() {
        this.context.fillStyle = '#000000';
        this.context.fillRect(0, 0, this.canvas.width, this.canvas.height);

        this.player.render(this.canvas, this.context);
    }

    updateFps(dt) {
        if (this.fpstime > 0.25) {
            // Calculate fps
            this.fps = Math.round(this.framecount / this.fpstime);
            
            // Reset time and framecount
            this.fpstime = 0;
            this.framecount = 0;
        }
        
        // Increase time and framecount
        this.fpstime += dt;
        this.framecount++;
    }

    onMouseMove(e) {

    }

    onMouseDown(e) {
        var pos = getMousePos(this.canvas, e); // Get the mouse position
    }

    onMouseUp(e) {
        // square.color = "#ff0000"
    }

    onMouseOut(e) {
        // square.color = "#cecece";
    }

}

// Player
class Player {
    constructor(canvas) {
        this.x = canvas.width / 2;
        this.y = canvas.height * 0.9;
        this.width = 20;
        this.height = 20;

        this.buttons = {
            up: false,
            down: false,
            left: false,
            right: false,
            space: false,
        }
        window.addEventListener('keydown', (e) => this.keyDown(e));
        window.addEventListener('keyup', (e) => this.keyUp(e));
    }

    update(dt, game) {
        var speed = 3;
        if (this.buttons.left) {
            this.x -= speed;
        }
        if (this.buttons.right) {
            this.x += speed;
        }
        if (this.buttons.up) {
            this.y -= speed;
        }
        if (this.buttons.down) {
            this.y += speed;
        }

        // keep the player trapped inside the arena or they die mehehehehhehehehehehwhehwela kdnhaw lt

        if ((this.x - (this.width/2)) <= game.arena.x) {
            this.x = game.arena.x + (this.width/2);
        }
        if ((this.x + (this.width/2)) >= (game.arena.x + game.arena.width)) {
            this.x = (game.arena.x + game.arena.width) - (this.width/2);
        }
        if ((this.y - (this.height)) <= game.arena.y) {
            this.y = game.arena.y + (this.height);
        }
        if (this.y >= (game.arena.y + game.arena.height)) {
            this.y = (game.arena.y + game.arena.height);
        }
    }

    render(canvas, context) {
        context.strokeStyle = "#ffffff";
        context.beginPath(); 
        context.moveTo(this.x, this.y);
        context.lineTo(this.x - (this.width/2), this.y);
        context.lineTo(this.x, this.y - this.height);
        context.lineTo(this.x + (this.width/2), this.y);
        context.lineTo(this.x, this.y);
        context.stroke();
    }

    keyDown(e) {
        switch (e.code) {
            case 'Space':
                this.buttons.space = true;
                break;
            case 'ArrowLeft':
                this.buttons.left = true;
                break;
            case 'ArrowRight':
                this.buttons.right = true;
                break;
            case 'ArrowUp':
                this.buttons.up = true;
                break;
            case 'ArrowDown':
                this.buttons.down = true;
                break;
        }
    }

    keyUp(e) {
        switch (e.code) {
            case 'Space':
                this.buttons.space = false;
                break;
            case 'ArrowLeft':
                this.buttons.left = false;
                break;
            case 'ArrowRight':
                this.buttons.right = false;
                break;
            case 'ArrowUp':
                this.buttons.up = false;
                break;
            case 'ArrowDown':
                this.buttons.down = false;
                break;
        }
    }
}

// Enemy

// Bullet

// Explosion

// Arena
class Arena {
    constructor(canvas) {
        this.x = 5;
        this.y = 5;
        this.width = canvas.width - 10;
        this.height = canvas.height - 10;
    }
}


//
// Helper functions
//

// Check if a position `pos` is inside a square
function isInSquare(pos, square) {
    if (pos.x >= square.x && pos.x < square.x + square.width &&
        pos.y >= square.y && pos.y < square.y + square.height) {
            return true;
    }
}

// Get the mouse position
function getMousePos(canvas, e) {
    var rect = canvas.getBoundingClientRect();
    return {
        x: Math.round((e.clientX - rect.left)/(rect.right - rect.left)*canvas.width),
        y: Math.round((e.clientY - rect.top)/(rect.bottom - rect.top)*canvas.height)
    };
}

//random colours yay
function getRandomColor() {
    var letters = '0123456789ABCDEF';
    var color = '#';
    for (var i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}

//check if two squares overlap
function isOverlap(a, b) {
    if (
            ((a.x < b.x && (a.x + a.width) > b.x) || (a.x > b.x && (b.x + b.width) > a.x))
        && ((a.y < b.y && (a.y + a.height) > b.y) || (a.y > b.y && (b.y + b.height) > a.y))
    ) {
        return true;
    } 
    return false;
}
