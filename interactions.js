//GLOBALS
let model;
let targetLabel = 'C';

// STEP 1: Load the model
function preload(){
    // if you did the teachable machine thngo here is the link to the already teached info
}

function setup(){
    createCanvas(640, 520); // do not need this when you use the posenet file for getting more 
    let options = {
        inputs: ['x','y'],
        outputs: ['label'],
        task:'classification'
    }
    model = ml5.neuralnetwork();

    //STEP 2: start classifying
    classifyVideo();
}

//Step 2: classify
function classifyVideo(){
    classifier.classify(video,gotResults);
}

function mousePressed(){

}

// STEP 4: Get Classification
function gotResults(error, results){
    // can recieve error, or can actually recieve results
    if(error){
        console.error(error);
        return;
    }
    console.log(results[0].label);
    // in the tutorial the possible results is an array, now it will only print most likely result by its name (instead of 'object')
    classifyVideo(); //continues to classify what it sees infinetly
}

//STEP 5: controlPaddle

function controlPaddle(){
    if(keyIsDown(87) || label == 'up'){
        // w is pressed
        if (p1Y > (pHeight/2)) { 
        // Check if the paddle is not at the top edge
            p1Y = p1Y - pSpeed;
        }
    }//close w
    if(keyIsDown(83) || label == 'down'){
        // s is pressed
        if (p1Y < height - (pHeight/2)) { 
            // Check if the paddle is not at the bottom edge
            p1Y = p1Y + pSpeed;
        }
    }//close s
}//close handlePlayerMovement



// I followed The Coding Train's tutorial "ml5.js: Train Your Own Neural Network" to set up the ml5 neural network. Link: https://youtu.be/8HEgeAbYphA
