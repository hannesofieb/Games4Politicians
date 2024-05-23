let video;
let poseNet;
let pose;
let brain; // Storing the neural network
let state = 'waiting'; // For training the network and letting me know when it is ready to train
let targetLabel;

function keyPressed() {
    // To initiate training of data
    if (key === 's') {
        brain.saveData();
    }
    if (key === 'ArrowDown' || key === 'ArrowUp' || key === 'ArrowLeft' || key === 'ArrowRight') {
        targetLabel = key; // Records what the following pose should mean/equal as
        console.log('Target Label:', targetLabel);
        setTimeout(function() {
            state = 'collecting';
            console.log('State: collecting');
            
            setTimeout(function() {
                console.log('State: waiting');
                state = 'waiting';
            }, 20000); // Data will be collected for only 20 seconds
        }, 2000); // After 2 seconds, state will start collecting (to give time to get ready)
    }
}

function setup() {
    createCanvas(640, 480);
    video = createCapture(VIDEO);
    video.hide(); // Corrected this line
    poseNet = ml5.poseNet(video, modelLoaded);
    poseNet.on('pose', gotPoses);

    let options = {
        inputs: 3, // Only 3 input (eyeL.x, eyeR.x, midx)
        task: 'classification',
        debug: true,
    };

    brain = ml5.neuralNetwork(options);
}

function gotPoses(poses) {
    if (poses.length > 0) {
        pose = poses[0].pose;

        if (state === 'collecting') {
            let inputs = [];
            let eyeL = pose.leftEye;
            let eyeR = pose.rightEye;

            let midx = (eyeR.x + eyeL.x) / 2;
            let avHeight = (eyeR.y + eyeL.y) /2;

            inputs.push(midx);
            // inputs.push(eyeL.x);
            // inputs.push(eyeL.y); won't need it because of new interaction pattern
            // inputs.push(eyeR.x);
            // inputs.push(eyeR.y); won't need it because of new interaction pattern
            
            let target = [targetLabel];
            brain.addData(inputs, target);
        }
    }
}

function modelLoaded() {
    console.log('posenet ready');
}

function draw() {
    translate(video.width, 0);   //move image by the width of image to the left
    scale(-1, 1);   //then flip it by scaling the video by -1 in the x-axis
    image(video, 0, 0); // Display the video on the canvas



    if (pose) {
        let eyeR = pose.rightEye;
        let eyeL = pose.leftEye;
        let d = dist(eyeR.x, eyeR.y, eyeL.x, eyeL.y);

        let midx = (eyeR.x + eyeL.x) / 2;
        let avHeight = (eyeR.y + eyeL.y) /2;

        fill(0, 0, 255);
        ellipse(eyeR.x, eyeR.y, 15);
        ellipse(eyeL.x, eyeL.y, 15);
        fill(255,0,0);
        ellipse(midx,avHeight,20);
        line(width*0.46,0,width*0.46,height);
        line(width*0.54,0,width*0.54,height);


        // console.log(d)
    }
}

// used The Coding Train's tutorial on Youtube "ml5.js Pose Estimation with PoseNet". Link: https://youtu.be/OIo-DIOkNVg?list=PLRqwX-V7Uu6YPSwT06y_AEYTqIwbeam3y
// also used their other video "ml5.js: Pose Classification with PoseNet and ml5.neuralNetwork()". Link: https://youtu.be/FYgYyq-xqAw?list=PLRqwX-V7Uu6YPSwT06y_AEYTqIwbeam3y