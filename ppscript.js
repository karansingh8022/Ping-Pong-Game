//selext the canvas
const cvs = document.getElementById("pong");
const c = cvs.getContext("2d");

cvs.width = window.innerWidth;
cvs.height = window.innerHeight;
 
function drawRect(x, y, l, w, color) {
    c.fillStyle = color;
    c.fillRect(x, y, l, w);
}

function drawCircle(x, y, radius, color) {
    c.beginPath();
    c.arc(x, y, radius, 0, Math.PI * 2, false);
    c.fillStyle = color;
    c.fill();
}

function score(x, y, text, color) {
    c.fillStyle = color;
    c.font = "50px fantasy";
    c.fillText(text, x, y);
}

const user = {
    x: 0,
    y: cvs.height / 2 - 50,
    width: 10,
    height: 100,
    color: "blue",
    score: 0
}

const com = {
    x: cvs.width - 10,
    y: cvs.height / 2 - 50,
    width: 10,
    height: 100,
    color: "red",
    score: 0
}


const ball = {
    x: cvs.width / 2,
    y: cvs.height / 2,
    radius: 10,
    speed: 5,
    velocityX: 5,
    velocityY: 5,
    color: "#33ff00"
}

const net = {
    x: cvs.width / 2 - 2 / 2,
    y: 0,
    width: 2,
    height: 15,
    color: "white",
}
function drawNet() {
    for (let i = 0; i < cvs.height; i += 30) {
        drawRect(net.x, net.y + i, net.width, net.height, net.color);
    }
}


function render() {
    drawNet();
    drawCircle(ball.x, ball.y, ball.radius, ball.color);
    drawRect(user.x, user.y, user.width, user.height, user.color);
    drawRect(com.x, com.y, com.width, com.height, com.color);
    score(cvs.width / 4, cvs.height / 5, user.score, user.color);
    score(3 * cvs.width / 4, cvs.height / 5, com.score, com.color);
}

function collision(b, player){
    b.top = b.y - b.radius;
    b.bottom = b.y + b.radius;
    b.left = b.x - b.radius;
    b.right = b.x + b.radius;

    player.top = player.y;
    player.bottom = player.y + player.height;
    player.left = player.x;
    player.right = player.x + player.width;

    return (b.right > player.left) && (b.left < player.right) && (b.bottom > player.top) && (b.top < player.bottom)

}

cvs.addEventListener("mousemove", movepaddle);

function movepaddle(event){
    console.log(event);
    let rect = cvs.getBoundingClientRect();

    user.y = event.clientY - rect.top - user.height/2;
}


function resetball(){
    ball.x = cvs.width/2;
    ball.y = cvs.height/2;

    ball.speed = 5;
    ball.velocityX = -ball.velocityX;
}

function update(){
    ball.x += ball.velocityX;
    ball.y += ball.velocityY;

    const computerlevel = 0.1;
    com.y += (ball.y - (com.y + com.height/2))*computerlevel;

    if(ball.y + ball.radius > cvs.height || ball.y - ball.radius < 0){
        ball.velocityY = -ball.velocityY;
    }

    let player = (ball.x < cvs.width/2)? user: com;

    if(collision(ball, player)){
        let collidePoint = ball.y - (player.y + player.height/2);
        collidePoint = collidePoint/(player.height/2);

        let angleRad = collidePoint * (Math.PI/4);

        let direction = (ball.x < cvs.width/2)? 1: -1;

        ball.velocityX = direction * ball.speed * Math.cos(angleRad);
        ball.velocityY = ball.speed * Math.sin(angleRad);

        ball.speed += 0.5;
    }
    if(ball.x - ball.radius < 0){
        com.score++;
        resetball();
    }
    else if(ball.x + ball.radius > cvs.width){
        user.score++;
        resetball();
    }
}

function game(){
    c.fillStyle = "rgba(0,0,0,0.2)";
    c.fillRect(0, 0, cvs.width, cvs.height);

    window.requestAnimationFrame(game);
    update();
    render();
}
game();

