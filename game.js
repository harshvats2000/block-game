var myGamePiece;
var myObstacles = [];
var myScore;

function startGame () {
    myGameArea.start();
    myGamePiece = new component(30, 30, "red", 10, 120, "car");
    myObstacle = new component(10, 200, "green", 300, 120);
    myScore = new component("30px", "Consolas", "black", 280, 40, "text");
}

var myGameArea = {
    canvas: document.createElement("canvas"),
    start: function() {
        this.canvas.width = 480;
        this.canvas.height = 270;
        this.context = this.canvas.getContext("2d");
        document.body.insertBefore(this.canvas, document.body.childNodes[0]);
        this.frameNo = 0;
        this.interval = setInterval(updateGameArea, 5);
        window.addEventListener('keydown', e => {
            myGameArea.key = e.keyCode;
        });
        window.addEventListener('keyup', e => {
            myGameArea.key = false;
        });
    },
    clear: function() {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    },
    stop: function() {
        clearInterval(this.interval);
    }
}

function component (width, height, color, x, y, type) {
    this.type = type;
    this.width = width;
    this.height = height;
    this.speedX = 0;
    this.speedY = 0;
    this.x = x;
    this.y = y;

    this.update = function() {
        ctx = myGameArea.context;
        if (this.type == "text") {
        ctx.font = this.width + " " + this.height;
        ctx.fillStyle = color;
        ctx.fillText(this.text, this.x, this.y);
        } else {
        ctx.fillStyle = color;
        if(type == 'car'){
            if(this.y < 0) {this.y = 0;}
            if((this.y + this.height) > myGameArea.canvas.height) {this.y = myGameArea.canvas.height - this.height;}
            if(this.x < 0) {this.x = 0;}
            if((this.x + this.width) > myGameArea.canvas.width) {this.x = myGameArea.canvas.width - this.width;}
        }
        ctx.fillRect(this.x, this.y, this.width, this.height);
        }
    }

    this.newPos = function() {
        this.x += this.speedX;
        this.y += this.speedY;
    }

    this.crashWith = function(otherobj) {
        var myleft = this.x;
        var myright = this.x + (this.width);
        var mytop = this.y;
        var mybottom = this.y + (this.height);
        var otherleft = otherobj.x;
        var otherright = otherobj.x + (otherobj.width);
        var othertop = otherobj.y;
        var otherbottom = otherobj.y + (otherobj.height);
        var crash = true;
        if ((mybottom < othertop) ||
        (mytop > otherbottom) ||
        (myright < otherleft) ||
        (myleft > otherright)) {
          crash = false;
        }
        return crash;
    }
}

function updateGameArea() {
    for(i=0; i<myObstacles.length; i++) {
        if(myGamePiece.crashWith(myObstacles[i])) {
            myGameArea.stop();
        }
    }

    myGameArea.clear();
    myGameArea.frameNo += 1;
    if(myGameArea.frameNo == 1 || everyInterval(200)) {
        var x = myGameArea.canvas.width;
        minHeight = 20;
        maxHeight = 200;
        height = Math.floor(Math.random()*(maxHeight-minHeight+1)+minHeight);
        minGap = 50;
        maxGap = 200;
        gap = Math.floor(Math.random()*(maxGap-minGap+1)+minGap);
        myObstacles.push(new component(10, height, 'green', x, 0));
        myObstacles.push(new component(10, x-height-gap, 'green', x, height+gap))
    }

    myGamePiece.speedY = 0;
    myGamePiece.speedX = 0;

    if(myGameArea.key == 37) {myGamePiece.speedX -= 1;}
    if(myGameArea.key == 38) {myGamePiece.speedY -= 1;}
    if(myGameArea.key == 39) {myGamePiece.speedX += 1;}
    if(myGameArea.key == 40) {myGamePiece.speedY += 1;}

    for(i=0; i<myObstacles.length; i++) {
        myObstacles[i].x += -1;
        myObstacles[i].update();
    }
    myScore.text = 'SCORE:' + Math.floor(myGameArea.frameNo/10);
    myScore.update();
    myGamePiece.newPos();
    myGamePiece.update();
}

function everyInterval(n) {
    if((myGameArea.frameNo/n)%1 == 0) {return true;}
    else {return false;}
}
