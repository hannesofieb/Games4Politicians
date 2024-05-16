//global
//P5.play MUST BE ENABLED
var pg;

//ball
var ballX;
var ballY;
var ballWidth = 15;
var ballHeight = 15;
var ballSpeed = 7;
var initBallSpeed = 7; // for resetting ballSpeed later in code
var maxBallSpeed = 25; // Maximum speed the ball can reach
var lastSpeedIncreaseTime = 0; // Variable to store the time of the last speed increase
var speedIncreaseInterval = 10000; // Increase ball speed every 10 seconds (in milliseconds)
var speedIncreaseAmount = 1; // Amount to increase ball speed by
var ballDirectionX = 1;
var ballDirectionY = 1;

//player1
var p1X = 5;
var p1Y;
//player2 IS NOW CPU
var p2X;
var p2Y;
var cpuSpeed = 1; //allows to change difficulty levels
//playersize
var pWidth = 10;
var pHeight = 200;
var pSpeed = 8;

//scoreboard
var p1Score = 0;
var p2Score = 0;
var winningScore = 5;

//functions
var stage = 0;
//0 = introductional
//1 = pong

//images
var landingImg;
var endImg;

function preload(){
    landingImg = loadImage('img/landing-page.png');
    endImg = loadImage('img/365.png');

}

function setup(){
    // Create canvas with specified width and height
    var canvas = createCanvas(windowWidth, windowHeight);
    pg = createGraphics(100, 100);
    //initial ball position
    rectMode(CENTER);
    ballX = width / 2;
    ballY = height / 2;

    textAlign(CENTER); //center text

    //sets placement of player paddles
    p2X = width-p1X;
    p2Y = height/2;
    p1Y = height/2;

} //close setup

function draw(){
    pg
    if (stage == 0){
        introductional(); //run introductional
    }
    if(stage == 1){
        pong(); //run pong function
    } 
    if(stage == 2){
        endOfGame();
    }

    if(mouseIsPressed){
        stage = 1; // start pong
    }//close stage change

    // Moved player and CPU movement function calls to draw loop
    handlePlayerMovement();
    cpu();

}//close draw

function mousePressed() {
    if (stage === 2 || stage === 3) {
        stage = 0; // Go back to the introductional screen
        p1Score = 0; // Reset scores
        p2Score = 0;
        ballSpeed = initBallSpeed; // Reset ball speed to its original value
    }
}

function introductional(){
    //welcome screen
    //change this to image of microsoft 365 intro img where if you click the image/screen then you get directed to the excel-pong
    //will also need some onboarding info
    //if time: add a page to see how everything works with more detail
    background(landingImg);
    fill(255);

    textSize(30);
    text('PONG', width / 2, height*0.4);

    textSize(10);
    text('PROGRAMMED BY HANNE SOFIE', width / 2, height*0.45);

    textSize(10);
    text('CLICK TO START', width / 2, height*0.6);
}//close introductional


function endOfGame(){
    //p1 win screen
    background(endImg);
    fill(255);

    textSize(30);
    text('END OF GAME', width / 2, height*0.4);

    textSize(10);
    text('CLICK ON SCREEN TO TRY AGAIN', width / 2, height*0.6);
}//close P1WINS

function pong(){
    clear(); //no trace of paddles or ball    
    noFill();

    //set colours
    fill(100);
    noStroke(); //no border

    //draw ball
    rect(ballX, ballY, ballWidth, ballHeight);

    //draw players
    rect(p1X, p1Y, pWidth, pHeight);
    rect(p2X, p2Y, pWidth, pHeight);

    //physics
    ballX = ballX + (ballDirectionX * ballSpeed); //move horizontally
    ballY = ballY + (ballDirectionY * ballSpeed); //move vertically

    //ball speed increase
    if (millis() - lastSpeedIncreaseTime >= speedIncreaseInterval && ballSpeed < maxBallSpeed) {
        ballSpeed += speedIncreaseAmount;
        lastSpeedIncreaseTime = millis(); // Update the last speed increase time
    }

    //collisions
    //with walls
    if(ballY >= height) {
        //hit bottom wall
        ballDirectionY = ballDirectionY * -1; //change direction
    }
    if(ballY <= 0) {
        //hit top wall
        ballDirectionY = ballDirectionY * -1; //change direction
    }
    //with paddles
    if(ballX >= p1X - 10 && ballX <= p1X + 10 && ballY >= p1Y - 50 && ballY <= p1Y + 50){
        //hit player paddle
        ballDirectionX = ballDirectionX * -1; // change direction
    }
    if(ballX >= p2X - 10 && ballX <= p2X + 10 && ballY >= p2Y - 50 && ballY <= p2Y + 50){
        //hit player paddle
        ballDirectionX = ballDirectionX * -1; // change direction
    }

    //scoreboard
    textSize(15);
    fill(0);
    text(p1Score, 250, height*0.175);
    text(":",260,height*0.175)
    text(p2Score, 270, height*0.175);

    if(ballX <= 0){
        // off left wall -- p1 missed
        p2Score = p2Score + 1; //add score
        //recenter ball
        ballX = width / 2;
        ballY = height / 2;
        //reset ballspeed
        ballSpeed = initBallSpeed; 
    }//close p2 scores

    if(ballX >= width){
        // off right wall -- p2 missed
        p1Score = p1Score + 1; //add score
        //recenter ball
        ballX = width / 2;
        ballY = height / 2;
        //reset ballspeed
        ballSpeed = initBallSpeed; 
    }//close p1 scores

    if(p1Score >= winningScore || p2Score >= winningScore){
        stage = 2; //run endOfGame
    }//close winningscore reached

}//close pong


function handlePlayerMovement(){
    if(keyIsDown(87)){
        // w is pressed
        if (p1Y > (pHeight/2)) { 
        // Check if the paddle is not at the top edge
            p1Y = p1Y - pSpeed;
        }
    }//close w
    if(keyIsDown(83)){
        // s is pressed
        if (p1Y < height - (pHeight/2)) { 
            // Check if the paddle is not at the bottom edge
            p1Y = p1Y + pSpeed;
        }
    }//close s
}//close handlePlayerMovement



function cpu(){
    //controls cpu player
    if(ballX >= width / 2){ 
        //if the ball crossed center court...
        if (p2Y <= ballY){
            p2Y = p2Y + cpuSpeed;
            //move down
        }//close above ball
        if(p2Y >= ballY){
            p2Y = p2Y - cpuSpeed;
            //move up
        }//close below ball
    }//close move cpu
    else{
        p2Y = p2Y;
        //only move when cpu ball is on cpu side
    }//close else
}//close cpu


// followed Mr.Erdreich's tutorial for creating pong in JS: https://www.youtube.com/playlist?list=PLBDInqUM5B270kU0D3TyJl_c7Z98Q2oc7
// also used chatgpt for bugs (Mr Erdreich's video might be a bit old? some lingo was not up to date)