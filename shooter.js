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
        this.arena = new Arena(canvas);
        this.player = new Player(this);
        this.bullets = new Array();
        this.stars = new Array();
        this.enemies = new Array();

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

        // update player
        this.player.update(dt, this);

        // update bullets
        for (var i = 0; i < this.bullets.length; i++) {
            this.bullets[i].update(dt, this);
        }
        // filter out dead bullets (offscreen)
        this.bullets = this.bullets.filter(bullet => bullet.alive);

        //update Stars
        this.spawnBackgroundStars(); 
        for (var i = 0; i < this.stars.length; i++) {
            this.stars[i].update(dt, this);
        }

        //update enemies
        this.spawnEnemy(); 
        for (var i = 0; i < this.enemies.length; i++) {
            this.enemies[i].update(dt, this);
        }

        // filter out dead enemies (offscreen)
        this.enemies = this.enemies.filter(enemy => enemy.alive);
    }

    render() {
        // render background
        this.context.fillStyle = '#000000';
        this.context.fillRect(0, 0, this.canvas.width, this.canvas.height);

        // render player
        this.player.render(this.canvas, this.context);

        // render bullets
        for (var i = 0; i < this.bullets.length; i++) {
            this.bullets[i].render(this.canvas, this.context);
        }

        // render stars
        for (var i = 0; i < this.stars.length; i++) {
            this.stars[i].render(this.canvas, this.context);
        }    

        // render enemies
        for (var i = 0; i < this.enemies.length; i++) {
            this.enemies[i].render(this.canvas, this.context);
        }  
    }

    spawnBackgroundStars() {
        while (this.stars.length < 100) {
            this.stars.push(new BackgroundStar(this));
        }
    }

    spawnEnemy() {
        while (this.enemies.length < 6) {
            this.enemies.push(new Enemy(this));
        }
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
    constructor(game) {
        this.x = game.arena.width / 2;
        this.y = game.arena.height * 0.9;
        this.width = 20;
        this.height = 20;
        this.gunCooldown = 0.1; // time between shots
        this.nextFire = Date.now() / 1000; // time after which we may fire gun

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
        // player movement
        var speed = 800;
        if (this.buttons.left) {
            this.x -= speed * dt;
        }
        if (this.buttons.right) {
            this.x += speed * dt;
        }
        if (this.buttons.up) {
            this.y -= speed * dt;
        }
        if (this.buttons.down) {
            this.y += speed * dt;
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

        // player bullets
        if (this.buttons.space && (Date.now() / 1000) >= this.nextFire) {
            game.bullets.push(new Bullet(this.x, (this.y - this.height), 0, -1000));
            this.nextFire = (Date.now() / 1000) + this.gunCooldown; 
            // console.log(Date.now());
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
class Enemy {
    constructor(game) {
        this.x = game.arena.x + game.arena.width * Math.random();
        this.y = game.arena.y;
        this.xSpeed = 0;
        this.ySpeed = 50;
        this.alive = true;
        this.width = 30;
        this.height = 30;
        this.gunCooldown = 0.5; // time between shots
        this.nextFire = Date.now() / 1000; // time after which we may fire gun
    }

    update(dt, game) {
        this.x += this.xSpeed * dt;
        this.y += this.ySpeed * dt;

        //todo detect star has moved off the screen
        if (this.y > (game.arena.y + game.arena.height)) {
            this.y = game.arena.y;
        }
    }

    render(canvas, context) {
        context.strokeStyle = "#ffffff";
        context.beginPath(); 
        context.moveTo(this.x, this.y);
        context.lineTo(this.x + this.width, this.y);
        context.lineTo(this.x + this.width, this.y + this.height);
        context.lineTo(this.x, this.y + this.height);
        context.lineTo(this.x, this.y);
        context.stroke();
}

}

// background stars
class BackgroundStar {
    constructor(game) {
        this.x = game.arena.x + game.arena.width * Math.random();
        this.y = game.arena.y + game.arena.height * Math.random();
        this.xSpeed = 0;
        this.ySpeed = 50 + 100*Math.random();
        this.alive = true;
    }

    update(dt, game) {
        this.x += this.xSpeed * dt;
        this.y += this.ySpeed * dt;

        //todo detect star has moved off the screen
        if (this.y > (game.arena.y + game.arena.height)) {
            this.y = game.arena.y;
        }
    }

    render(canvas, context) {
        context.strokeStyle = "#008080";
        context.beginPath(); 
        context.arc(this.x, this.y, 0.5, 0, 2*Math.PI);
        context.stroke();
    }

}

// Bullet
class Bullet {
    constructor(x, y, xSpeed, ySpeed) {
        this.x = x;
        this.y = y;
        this.xSpeed = xSpeed;
        this.ySpeed = ySpeed;
        this.alive = true;
    }

    update(dt, game) {
        this.x += this.xSpeed * dt;
        this.y += this.ySpeed * dt;

        //todo detect bullet has moved off the screen
        if (this.y < game.arena.y) {
            this.alive = false;
        }
    }

    render(canvas, context) {
        context.strokeStyle = "#ffffff";
        context.beginPath(); 
        context.arc(this.x, this.y, 2, 0, 2*Math.PI);
        context.stroke();
    }


}

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
