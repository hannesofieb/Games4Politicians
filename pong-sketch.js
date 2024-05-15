//global
//ball
var ballX;
var ballY;
var ballWidth = 15;
var ballHeight = 15;
var ballSpeed = 3;
var ballDirectionX = 1;
var ballDirectionY = 1;

//player1
var p1X = 10;
var p1Y = 450;
//player2
var p2X = 1670;
var p2Y = 450;
//playersize
var pWidth = 20;
var pHeight = 100;
var pSpeed = 5;

//scoreboard
var p1Score = 0;
var p2Score = 0;

function setup(){
    createCanvas(windowWidth,windowHeight-15);

    //initial ball position
    rectMode(CENTER);
    ballX = width/2;
    ballY = height/2;

    textAlign(CENTER); //center text

} //close setup

function draw(){
    pong(); //run pong function
    
}

function pong(){
    //call functions
    keyTyped(); // loop keytyped function
    keyPressed(); // loop keypressed function

    
    //court appearance
    background(0);
    noFill();
    stroke(255,0,0);
    rect(width/2, height/2, width, height);
    line(windowWidth/2,0,windowWidth/2,height); //centre line

    //set colours
    fill(255);
    noStroke(); //no border

    //draw ball
    rect(ballX, ballY, ballWidth,ballHeight);

    //draw players
    rect(p1X,p1Y,pWidth,pHeight);
    rect(p2X,p2Y,pWidth,pHeight);

    //physics
    ballX = ballX +(ballDirectionX*ballSpeed); //move horisontally
    ballY = ballY +(ballDirectionY*ballSpeed); //move vertically

    //collisions
    //with walls
    if(ballY >= height) {
        //hit bottom wall
        ballDirectionY = ballDirectionY*-1; //change direction
    }
    if(ballY <= 0) {
        //hit top wall
        ballDirectionY = ballDirectionY*-1; //change direction
    }
    //with paddles
    if(ballX >= p1X-10 && ballX <= p1X+10 && ballY >= p1Y-50 && ballY <=p1Y+50){
        //hit player paddle
        ballDirectionX = ballDirectionX*-1; // change direction
    }
    if(ballX >= p2X-10 && ballX <=p2X+10 && ballY >= p2Y-50 && ballY <=p2Y+50){
        //hit player paddle
        ballDirectionX = ballDirectionX*-1; // change direction
    }

    //scoreboard
    textSize(25)
    text(p1Score,windowWidth/2-100, 50);
    text(p2Score,windowWidth/2+100, 50);

    if(ballX <= 0){
        // off left wall -- p1 missed
        p2Score = p2Score+1; //add score
        //recenter ball
        ballX = width/2;
        ballY = height/2;
    }//close p2 scores

    if(ballX >= width){
        // off left wall -- p2 missed
        p1Score = p1Score+1; //add score
        //recenter ball
        ballX = width/2;
        ballY = height/2;
    }//close p1 scores


}//close pong


function keyTyped(){
    if(key == 'w' && keyIsPressed){
        p1Y = p1Y-pSpeed;
    }//close w
    if(key == 's' && keyIsPressed){
        p1Y = p1Y+pSpeed;
    }//close s

}//close keyTyped


function keyPressed(){
    if(keyCode == UP_ARROW && keyIsPressed){
        p2Y = p2Y-pSpeed;
    }//close up
    if(keyCode == DOWN_ARROW && keyIsPressed){
        p2Y = p2Y+pSpeed;
    }//close down
}



// followed Mr.Erdreich's tutorial for creating pong in JS: https://www.youtube.com/playlist?list=PLBDInqUM5B270kU0D3TyJl_c7Z98Q2oc7