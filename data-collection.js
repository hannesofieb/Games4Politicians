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
            }, 10000); // Data will be collected for only 10 seconds
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
        inputs: 4, // Only 4 inputs (eyeL.x, eyeL.y, eyeR.x, eyeR.y)
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
            inputs.push(eyeL.x);
            inputs.push(eyeL.y);
            inputs.push(eyeR.x);
            inputs.push(eyeR.y);
            
            let target = [targetLabel];
            brain.addData(inputs, target);
        }
    }
}

function modelLoaded() {
    console.log('posenet ready');
}

function draw() {
    image(video, 0, 0); // Display the video on the canvas

    if (pose) {
        let eyeR = pose.rightEye;
        let eyeL = pose.leftEye;
        let d = dist(eyeR.x, eyeR.y, eyeL.x, eyeL.y);

        d = d - 10;

        fill(0, 0, 255);
        ellipse(eyeR.x, eyeR.y, d);
        ellipse(eyeL.x, eyeL.y, d);

        // console.log(d)
    }
}

// used The Coding Train's tutorial on Youtube "ml5.js Pose Estimation with PoseNet". Link: https://youtu.be/OIo-DIOkNVg?list=PLRqwX-V7Uu6YPSwT06y_AEYTqIwbeam3y
// also used their other video "ml5.js: Pose Classification with PoseNet and ml5.neuralNetwork()". Link: https://youtu.be/FYgYyq-xqAw?list=PLRqwX-V7Uu6YPSwT06y_AEYTqIwbeam3y