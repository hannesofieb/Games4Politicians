//global
//P5.play MUST BE ENABLED



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
var winningScore =2;

//functions
var stage = 0;
//0 = splash
//1 = pong

function setup(){
    createCanvas(windowWidth,windowHeight-15);

    //initial ball position
    rectMode(CENTER);
    ballX = width/2;
    ballY = height/2;

    textAlign(CENTER); //center text

} //close setup

function draw(){
    if (stage == 0){
        splash(); //run splash
    }
    if(stage ==1){
        pong(); //run pong function
    } 
    if(stage ==2){
        p1Wins();
    }
    if(stage ==3){
        p2Wins();
    }


    if(mouseIsPressed == true){
        stage = 1; // start pong
    }//close stage change

}//close draw


function splash(){
    //welcome screen
    background(0);
    fill(255);

    textSize(150);
    text('PONG',width/2,200);

    textSize(30);
    text('PROGRAMMED BY HANNE SOFIE',width/2,250);

    textSize(30);
    text('CLICK TO START',width/2,450);
}//close splash


function p1Wins(){
    //p1 win screen
    background(0);
    fill(255);

    textSize(150);
    text('PLAYER 1 WINS',width/2,200);

    textSize(30);
    text('REFRESH TO TRY AGAIN',width/2,250);
}//close P1WINS

function p2Wins(){
    //p1 win screen
    background(0);
    fill(255);

    textSize(150);
    text('PLAYER 2 WINS',width/2,200);

    textSize(30);
    text('REFRESH TO TRY AGAIN',width/2,250);
}//close P1WINS

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

    if(p1Score >=winningScore){
        stage = 2; //run p1Wins
    }//close p1wins

    if(p2Score >=winningScore){
        stage = 3; //run p2Wins
    }//close p2wins


}//close pong


function keyTyped(){
    if(keyIsDown(87)){
        //w is pressed
        p1Y = p1Y-pSpeed;
    }//close w
    if(keyIsDown(83)){
        //s is pressed
        p1Y = p1Y+pSpeed;
    }//close s

}//close keyTyped


function keyPressed(){
    if(keyIsDown(UP_ARROW)){
        p2Y = p2Y-pSpeed;
    }//close up
    if(keyIsDown(DOWN_ARROW)){
        p2Y = p2Y+pSpeed;
    }//close down
}



// followed Mr.Erdreich's tutorial for creating pong in JS: https://www.youtube.com/playlist?list=PLBDInqUM5B270kU0D3TyJl_c7Z98Q2oc7
// also used chatgpt for bugs (Mr Erdreich's video might be a bit old? some lingo was not up to date)