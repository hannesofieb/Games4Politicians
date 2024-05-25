//global
//P5.play MUST BE ENABLED
var pg;

//ball
var ballX;
var ballY;
var ballWidth = 18;
var ballHeight = 18;
var ballSpeed = 10;
var initBallSpeed = 7; // for resetting ballSpeed later in code
var maxBallSpeed = 15; // Maximum speed the ball can reach
var lastSpeedIncreaseTime = 0; // Variable to store the time of the last speed increase
var speedIncreaseInterval = 15000; // Increase ball speed every 10 seconds (in milliseconds)
var speedIncreaseAmount = 0.5; // Amount to increase ball speed by
var ballDirectionX = 1;
var ballDirectionY = 1;

//player1
var p1X = 5;
var p1Y;
//CPU
var p2X;
var p2Y;
var cpuSpeed = 3; //allows to change difficulty levels

//playersize
var pWidth = 10;
var pHeight = 200;
var pSpeed = 7;

//scoreboard
var p1Score = 0;
var p2Score = 0;
var winningScore = 10;
var ts = 15; //text size

//interaction-toggle
var toggle = true;
var buffer = 10;
var delay = 5000;
var tts = 10; //text size for toggle
var toggleX, toggleY, toggleW, toggleH;

// timer
var startTime;
var elapsedTime;
var bestTime = 0;

//functions
var stage = 0;
//0 = introductional
//1 = pong

//images
var landingImg;
var endImg;
var cursorImg;

// model
let model;
let pose;
let poseLabel = '';

function preload(){
    landingImg = loadImage('img/landing-page.png');
    endImg = loadImage('img/365.png');
    cursorImg = loadImage('img/cursor_black.png');
}

function modelLoading() {
    video = createCapture(VIDEO, videoReady);
    video.hide();
    
    let options = {
        inputs: 4, // 17 keypoints * 2 (x, y)
        task: 'classification',
        debug: true,
    };

    brain = ml5.neuralNetwork(options);
    const modelInfo = {
        model: 'creating-training-model/model/model.json',
        metadata: 'creating-training-model/model/model_meta.json',
        weights: 'creating-training-model/model/model.weights.bin',
    };
    brain.load(modelInfo, brainLoaded);
}

function videoReady() {
    poseNet = ml5.poseNet(video, brainLoaded);
    poseNet.on('pose', gotPoses);
}

function gotPoses(poses) {
    if (poses.length > 0) {
        pose = poses[0].pose;
        skeleton = poses[0].skeleton;
    }
}

function brainLoaded() {
    console.log("model ready!");
    classifyPose();
}

function classifyPose() {
    if (pose) {
        let inputs = [];
        for (let i = 0; i < pose.keypoints.length; i++) {
            let x = pose.keypoints[i].position.x;
            let y = pose.keypoints[i].position.y;
            inputs.push(x);
            inputs.push(y);
        }
        brain.classify(inputs, gotResult);
    } else {
        setTimeout(classifyPose, 100);
    }
}

function gotResult(error, results) {
    if (error) {
        console.error(error);
        return;
    }

    if (results[0].confidence > 0.70) {
        poseLabel = results[0].label.toUpperCase();
    }

    console.log(poseLabel);
    classifyPose();
}

function setup(){
    // Create canvas with specified width and height
    var canvas = createCanvas(windowWidth, windowHeight);
    canvas.style('display', 'block');
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

    modelLoading();

    // Initialize sizes and speeds
    initSizes();
    initSpeeds();

    //timer
    startTime = millis();


} //close setup

function windowResized() {
    resizeCanvas(windowWidth, windowHeight);
    p2X = width - p1X;
    initSizes();
    initSpeeds();
}

function initSizes() {
    ballWidth = width * 0.02;
    ballHeight = ballWidth;
    pWidth = width * 0.01;
    pHeight = height * 0.2;
    ts = width * 0.01;
    tts = width * 0.0065;

    // Toggle button dimensions and position
    toggleX = width * 0.115;
    toggleY = height * 0.17;
    toggleW = width * 0.04;
    toggleH = height * 0.026;
}

function initSpeeds() {
    pSpeed = height * 0.008;
    cpuSpeed = height * 0.008;
    ballSpeed = initBallSpeed * (width / 1500);
}

function draw(){
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

    console.log(ballSpeed);
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
    // Set the background image to cover the entire viewport
    background(landingImg);
    image(landingImg, 0, 0, width, height);

    // Reset window scroll position
    window.scrollTo(0, 0);
}//close introductional


function endOfGame(){
    // Set the background image to cover the entire viewport
    background(endImg);
    image(endImg, 0, 0, width, height);

    // Reset window scroll position
    window.scrollTo(0, 0);
}

function pong(){
    clear(); //no trace of paddles or ball    
    noFill();

    //set colours
    fill(100);
    noStroke(); //no border

    //draw ball
    image(cursorImg,ballX, ballY, ballWidth*0.5, ballHeight*0.5);

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
    if(ballX >= p1X - 10 && ballX <= p1X + 10 && ballY >= p1Y - 100 && ballY <= p1Y + 100){
        //hit player paddle
        ballDirectionX = ballDirectionX * -1; // change direction
    }
    if(ballX >= p2X - 10 && ballX <= p2X + 10 && ballY >= p2Y - 100 && ballY <= p2Y + 100){
        //hit player paddle
        ballDirectionX = ballDirectionX * -1; // change direction
    }

    //interaction-toggle
    fill(255);
    rect(toggleX, toggleY, toggleW, toggleH);

    // Check for mouse hover within toggle area
    if (mouseX > toggleX - buffer && // Left boundary with buffer
        mouseX < toggleX + toggleW + buffer && // Right boundary with buffer
        mouseY > toggleY - buffer && // Top boundary with buffer
        mouseY < toggleY + toggleH + buffer) {
        cursor(HAND); // Change cursor to pointer (HAND) on hover
    } else {
        cursor(ARROW); // Set default cursor back to arrow
    }

    // Check for mouse click within toggle area
    if (mouseIsPressed && 
        mouseX > toggleX - buffer && // Left boundary with buffer
        mouseX < toggleX + toggleW + buffer && // Right boundary with buffer
        mouseY > toggleY - buffer && // Top boundary with buffer
        mouseY < toggleY + toggleH + buffer) {// Bottom boundary with buffer
        toggle = !toggle; // Toggle state change on click
        setTimeout(() => {
            mouseIsPressed = false; // Reset after delay
          }, delay);
      }

    fill(150); // Set fill color for the inner toggle element

    if (toggle) {
        rect(toggleX - toggleW * 0.25, toggleY, toggleW * 0.5, toggleH * 0.769); // Draw background for "MOVE"
        fill(255);
        textSize(tts);
        text("MOVE", toggleX - toggleW * 0.25, toggleY + toggleH * 0.154, toggleW * 0.5, toggleH * 0.769); // Display "MOVE"
    } else {
        rect(toggleX + toggleW * 0.25, toggleY, toggleW * 0.5, toggleH * 0.769); // Draw background for "KEYS"
        fill(255);
        textSize(tts);
        text("KEYS", toggleX + toggleW * 0.25, toggleY + toggleH * 0.154, toggleW * 0.5, toggleH * 0.769); // Display "KEYS"
    }
    
    //timer
    elapsedTime = millis() - startTime; // Calculate elapsed time
    let elapsedTimeSeconds = Math.floor(elapsedTime / 1000);     // Calculate the elapsed time in seconds

    // Calculate minutes and seconds
    let minutes = Math.floor(elapsedTimeSeconds / 60);
    let seconds = elapsedTimeSeconds % 60;

    // Format minutes and seconds to always have two digits
    let formattedMinutes = nf(minutes, 2);
    let formattedSeconds = nf(seconds, 2);

    // Display the timer at the top center of the screen
    textSize(tts*1.4);
    fill(0);
    text(`${formattedMinutes}:${formattedSeconds}`, width *0.905, height*0.085);

    // Display the best time next to the timer
    let bestMinutes = Math.floor(bestTime / 60);
    let bestSeconds = bestTime % 60;
    let formattedBestMinutes = nf(bestMinutes, 2);
    let formattedBestSeconds = nf(bestSeconds, 2);

    textSize(tts*1.4);
    fill(255);
    text(`${formattedBestMinutes}:${formattedBestSeconds}`, width * 0.969, height * 0.085);


    //scoreboard
    textSize(ts);
    fill(0);
    text(p1Score, width*0.15, height*0.175);
    text(":",width*0.16,height*0.175);
    text(p2Score, width*0.17, height*0.175);

    if(ballX <= 0){
        // off left wall -- p1 missed
        p2Score = p2Score + 1; //add score
        // Update best time if current elapsed time is greater
        if (elapsedTimeSeconds > bestTime) {
            bestTime = elapsedTimeSeconds;
        }
        //recenter ball
        ballX = width / 2;
        ballY = random(height * 0.25, height * 0.75); // Random Y position along the center
        //reset ballspeed and timer
        ballSpeed = initBallSpeed; 
        startTime = millis();
    }//close p2 scores

    if(ballX >= width){
        // off right wall -- p2 missed
        p1Score = p1Score + 1; //add score
        // Update best time if current elapsed time is greater
        if (elapsedTimeSeconds > bestTime) {
            bestTime = elapsedTimeSeconds;
        }
        //recenter ball
        ballX = width / 2;
        ballY = random(height * 0.25, height * 0.75); // Random Y position along the center
        //reset ballspeed and timer
        ballSpeed = initBallSpeed; 
        startTime = millis();
    }//close p1 scores

    if(p1Score >= winningScore || p2Score >= winningScore){
        stage = 2; //run endOfGame
    }//close winningscore reached

}//close pong

function handlePlayerMovement() {
    if (toggle) { // detection if toggle is true (MOVE)
        if (poseLabel === 'ARROWUP') {
            if (p1Y > (pHeight / 2)) { 
                // Check if the paddle is not at the top edge
                p1Y = p1Y - pSpeed;
            }
      } else if (poseLabel === 'ARROWDOWN') {
        if (p1Y < height - (pHeight / 2)) { 
            // Check if the paddle is not at the bottom edge
            p1Y = p1Y + pSpeed;
        }
      }
    } else { // Use keyboard controls if toggle is false (KEYS)
      if (keyIsDown(UP_ARROW)) { 
        if (p1Y > (pHeight / 2)) { 
            // Check if the paddle is not at the top edge
            p1Y = p1Y - pSpeed;
        }
      } else if (keyIsDown(DOWN_ARROW)) { 
        if (p1Y < height - (pHeight / 2)) { 
            // Check if the paddle is not at the bottom edge
            p1Y = p1Y + pSpeed;
        }
      }
    }
  }


function cpu() {
    // Determine the amount to scroll
    var scrollAmount = 1; // Increase the scroll amount for better visibility

    if (stage === 1) { // Ensure scrolling only happens in stage 1
        // Controls CPU player
        if (ballX >= width / 2) { 
            // If the ball crossed center court...
            if (p2Y <= ballY) {
                p2Y = p2Y + cpuSpeed;
                // Move down and scroll page down
                document.querySelector('.excel-sheet').scrollBy(0, scrollAmount);
            } 
            if (p2Y >= ballY) {
                p2Y = p2Y - cpuSpeed;
                // Move up and scroll page up
                document.querySelector('.excel-sheet').scrollBy(0, -scrollAmount);
            }
        }
    }
}




// followed Mr.Erdreich's tutorial for creating pong in JS: https://www.youtube.com/playlist?list=PLBDInqUM5B270kU0D3TyJl_c7Z98Q2oc7
// looked at xinxin's p5 toggle button sketch "Tutorial 3.3: Boolean Variable (completed)". Link: https://editor.p5js.org/xinxin/sketches/UHqr9rrCG 
// also used chatGPT and Google Gemini to alter code to my needs
