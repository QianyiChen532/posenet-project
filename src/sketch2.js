let movers = [];
let size = 5;
let attractor = [];
let slider = [];

let poseNet;
let poses;
let video;


function setup() {
  createCanvas(windowWidth,windowHeight);
  frameRate(60);
  //for video

  video = select("video") || createCapture(VIDEO);
  video.size(width, height);
  video.hide();

poseNet = ml5.poseNet(video, modelReady);
  poseNet.on('pose', function(results) {
   poses = results;
 });

//for movers
  // for (let i = 0; i<4;i++){
  //   slider[i] = createSlider(0,width,0,2);
  //   slider[i].position(width*0.8,height*0.3+i*10);
  //   slider[i].style('width','120px');
  // }

  for (let i = 0; i < size; i++) {
    movers[i] = new Mover(random(width),random(height),random(12,24));
  }
}

function modelReady() {
  console.log("Model Ready!");
}


function draw() {
    image(video, 0, 0, video.width, video.height);
  background(0,50);
  if (poses != undefined ) {
    for (let i = 0; i < poses.length; i++) {
      for (let j=0; j< poses[i].pose.keypoints.length; j++) {

        let partname = poses[i].pose.keypoints[j].part;

        let score = poses[i].pose.keypoints[j].score;
        let x = poses[i].pose.keypoints[j].position.x;
        let y = poses[i].pose.keypoints[j].position.y;

        if (score > 0.5) {
          if (partname == "leftWrist") {

            noStroke();
            fill(255, 0, 0);
            ellipse(x, y, 100, 100);
              // console.log(x,y);
              attractor.push(new Attractor(x, y, random(8, 10)));
          } else if (partname == "rightWrist") {
console.log('2');
            noStroke();
            fill(255, 0, 0);
            ellipse(x, y, 10, 10);
          attractor.push(new Attractor(x, y, random(8, 10)));
          }
        }

      }
    }
  }

  for (let i = 0; i < movers.length; i++) {

    movers[i].update();
    movers[i].display();


    for (let j = 0; j < attractor.length; j++) {

      // let val = slider[j].value();
      // attractor[j] = new Attractor(val+200, val, random(8, 10));
      attractor[j].display();
      attractor[j].life();
      // attractor[i].update(val,val);
      let force = attractor[j].attract(movers[i]);
      movers[i].applyForce(force);
      // console.log(val);
    }
  }

  if (attractor.length > 4){
    attractor.splice(0,1);
  }

}

// function drawPoses(poses) {
//   translate(width, 0);
//   scale(-1.0, 1.0);

//   drawKeypoints(poses);
//
// }

// Draw ellipses over the detected keypoints
function drawKeypoints(poses) {
  poses.forEach(pose =>
    pose.pose.keypoints.forEach(keypoint => {
        // console.log(pose.pose);
      if (keypoint.score > 0.2) {
        fill(0, 255, 0);
        noStroke();
        ellipse(keypoint.position.x, keypoint.position.y, 10, 10);
      }
    })
  );
}
