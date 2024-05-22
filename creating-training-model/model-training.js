let brain; // Storing the neural network

function setup() {
    createCanvas(640, 480);
    let options = {
        inputs: 34, // 17 keypoints * 2 (x, y)
        task: 'classification',
        debug: true,
    };

    brain = ml5.neuralNetwork(options);
    brain.loadData('model/data03.json', dataReady); //put in json file from model-training

}


function dataReady(){
    brain.normalizeData();
    brain.train({epochs:50}, finished);
}

function finished(){
    console.log('model trained');
    brain.save();
}

// used The Coding Train's tutorial on Youtube "ml5.js Pose Estimation with PoseNet". Link: https://youtu.be/OIo-DIOkNVg?list=PLRqwX-V7Uu6YPSwT06y_AEYTqIwbeam3y
// also used their other video "ml5.js: Pose Classification with PoseNet and ml5.neuralNetwork()". Link: https://youtu.be/FYgYyq-xqAw?list=PLRqwX-V7Uu6YPSwT06y_AEYTqIwbeam3y
