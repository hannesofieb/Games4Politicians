//global
//ball
var ballX;
var ballY;
var ballWidth = 15;
var ballHeight = 15;


function setup(){
    createCanvas(900,500);

    //initial ball position
    rectMode(CENTER);
    ballX = width/2;
    ballY = height/2;

} //close setup

function draw(){
    background(0);

    //set colours
    fill(255);
    noStroke(); //no border

    //draw ball
    rect(ballX, ballY, ballWidth,ballHeight);

}//close draw



// followed Mr.Erdreich's tutorial for creating pong in JS: https://www.youtube.com/playlist?list=PLBDInqUM5B270kU0D3TyJl_c7Z98Q2oc7