let video;
let poseNet;
let pose;
let brain; // Storing the neural network
let poseLabel = "";

function setup() {
    createCanvas(640, 480);
    video = createCapture(VIDEO, videoReady);
    video.hide();
    
    let options = {
        inputs: 34, // 17 keypoints * 2 (x, y)
        task: 'classification',
        debug: true,
    };

    brain = ml5.neuralNetwork(options);
    const modelInfo = {
        model: 'model/model.json',
        metadata: 'model/model_meta.json',
        weights: 'model/model.weights.bin',
    };
    brain.load(modelInfo, brainLoaded);
}

function videoReady() {
    poseNet = ml5.poseNet(video, modelLoaded);
    poseNet.on('pose', gotPoses);
}

function gotPoses(poses) {
    if (poses.length > 0) {
        pose = poses[0].pose;
        skeleton = poses[0].skeleton;
    }
}

function modelLoaded() {
    console.log('posenet ready');
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

    if (results[0].confidence > 0.75) {
        poseLabel = results[0].label.toUpperCase();
    }
    // console.log(results[0].confidence);
    console.log(poseLabel);
    classifyPose();
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
        line(width*0.40,0,width*0.40,height);
        line(width*0.60,0,width*0.60,height);
        // line(width*0.46,0,width*0.46,height);
        // line(width*0.54,0,width*0.54,height);

        // fill(255);
        // noStroke();
        // textSize(32);
        // textAlign(CENTER, CENTER);
        // text(poseLabel, width / 2, height - 16);
    }
}
