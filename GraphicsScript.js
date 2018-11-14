/// <reference path="p5.global-mode.d.ts"/>

var projectiles = new Array(0);
var mousePositions = new Array(0);
var particles = new Array(0);
var mDownPrevious = false;
var mouseVelX = 0;
var mouseVely = 0;
//var cloudImage;

const mouseSmoothing = 5;
const gravityUp = -8;
const gravityDown = -15;
const framerate = 60;
const width = 800;
const height = 600;
const nullNormal = new Position(0, 0);

function preload() {
    var cloudImage = loadImage("https://raw.githubusercontent.com/Julian-Wyatt/ComputingContributions/master/src/images/IoT2.jpg");
}

function setup() {
    var canvas = createCanvas(width, height);
    frameRate(framerate);
    canvas.parent("holder");
    background(200, 200, 200);
    cursor(CROSS);
    
}

function draw() {
    background(200, 200, 200);

    noStroke();
    fill(0, 0, 0);
    var projectileCount = projectiles.length;
    var i = 0;
    while (i < projectileCount){
        projectiles[i].MakeMove();
        projectiles[i].Render();
        if (projectiles[i].deadNormal == nullNormal) {
            i += 1;
        }
        else {
            DeleteProjectile(i);
            projectileCount -= 1;
        }
    }
    var particleCount = particles.length;
    i = 0;
    while (i < particleCount) {
        particles[i].MakeMove();
        particles[i].Render();
        if (particles[i].dead) {
            particleCount -= 1;
            DeleteParticle(i);
        }
        else {
            i += 1;
        }
    }


    if (mouseIsPressed) {
        if (mDownPrevious === false) {
            //Mouse just clicked:
            mDownPrevious = true;
        }
        //Every frame the mouse is down:
        var lastPoint = AddPosition(mouseX, mouseY);
        var movementX = mouseX - lastPoint.x;
        var movementY = mouseY - lastPoint.y;        
        movementX /= mousePositions.length;
        movementY /= mousePositions.length;
        mouseVelX = movementX * 0.3;/// framerate;
        mouseVely = movementY * 0.3; /// framerate;

        //ellipse(lastPoint.x, lastPoint.y, 2, 2);

    }
    else if (mDownPrevious) {
        //Mouse just let go:

        if (mouseX > 0 && mouseX < width && mouseY > 0 && mouseY < height) {
            projectiles.push(new Projectile(mouseX, height - mouseY,mouseVelX,-mouseVely));
        }
        mousePositions = new Array(0);
        mDownPrevious = false;
    }



}

function DeleteProjectile(index) {
    var deleted = projectiles.splice(index, 1);    
    particles.push(new BangParticle(deleted[0].x, deleted[0].y, deleted[0].deadNormal));

}
function DeleteParticle(index) {
    particles.splice(index, 1);
}

function AddPosition(xIn, yIn) {
    var last = new Position(xIn, yIn);
    if (mousePositions.length > 0) {
        last = mousePositions[0];
    }
    if (mousePositions.length < mouseSmoothing) {

        mousePositions.push(new Position(xIn, yIn));
    }
    else {
        last = mousePositions.shift();
        mousePositions.push(new Position(xIn, yIn));
    }
    return last;
}


function Position(xIn, yIn) {
    this.x = xIn;
    this.y = yIn;
}

function Projectile(xIn, yIn, xVelIn, yVelIn) {
    this.radius = 10;
    this.x = xIn;
    this.y = yIn;
    this.xVel = xVelIn;
    this.yVel = yVelIn;
    this.direction = 0;
    this.deadNormal = nullNormal;
}
Projectile.prototype.MakeMove = function () {
    if (this.deadNormal == nullNormal) {
        this.x += this.xVel;
        this.y += this.yVel;

        var currentGravity = gravityUp;
        if (this.yVel < 0) {
            currentGravity = gravityDown;
        }
        this.yVel += currentGravity * 1 / framerate;
        //                READABILITY ^ you nonce

        if (this.x < 0) { 
            this.deadNormal = new Position(1, 0);
            this.x = 0;
        }
        else if (this.x > width) { 
            this.deadNormal = new Position(-1, 0);
            this.x = width;
        }
        else if (this.y < 0) {
            this.deadNormal = new Position(0, 1);
            this.y = 0
        }
        else if (this.y > height) {
        this.deadNormal = new Position(0, -1);
        this.y = height;
        }
    }
};
Projectile.prototype.Render = function () {

    ellipse(this.x, height - this.y, 5, 5);
};

function BangParticle(xIn, yIn, normalIn) {
    this.x = xIn;
    this.y = yIn;
    this.lifetime = (Math.random() * (0.65 - 0.3) + 0.3);
    this.age = 0;
    this.normal = normalIn;
    this.maxRadius = (Math.random() * (200 - 80)+80);
    this.radius = 0;
    this.alpha = 1;
    this.thickness = 4;
    this.dead = false;
}
BangParticle.prototype.MakeMove = function () {
    if (!this.dead) {
        
        this.age += 1 / framerate;

        this.radius = Math.pow((this.age / this.lifetime),0.35) * this.maxRadius;
        
        this.alpha = 1-(this.age / this.lifetime);
        this.thickness = Math.floor((1 - (this.age / this.lifetime)) * 15);

        if (this.age > this.lifetime) {
            this.dead = true;
        }
    }
}
BangParticle.prototype.Render = function () {
    if (!this.dead) {
        stroke(color(0,0,0,this.alpha*255));        
        strokeWeight(this.thickness);
        noFill();
        ellipse(Math.floor(this.x), height - Math.floor(this.y), this.radius, this.radius);        
    }
}

function SmokeParticle(xIn, yIn, normalIn) {
    this.x = xIn;
    this.y = yIn;
    this.lifetime = (Math.random() * (4 - 0.5) + 0.5);
    this.normal = normalIn;
    this.size = 1;
    this.rotation = 0;
    this.dead = false;
}
SmokeParticle.prototype.MakeMove = function () {
    if (!this.dead) {


    }
}

SmokeParticle.prototype.Render = function () {
    if (!this.dead) {


    }
}