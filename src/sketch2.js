let movers = [];
let size = 5;
let attractor = [];
let slider = [];

let poseNet=[];
let poses = [];
let num = 2;//num of video
let video = [];


function setup() {
  createCanvas(windowWidth,windowHeight);
  frameRate(60);


  //for video
  // video = select("video") || createCapture(VIDEO);
  for (let i= 0;i< num;i++){
    video[i] = createVideo('asset/'+i+'.mov',vidLoad);
    video[i].size(640,480);
    video[i].hide();

    //for posenet
    poseNet[i] = ml5.poseNet(video[i], modelReady);
    // poseNet[i].on('pose', function(results) {
    //   poses = results;
    // });
    poseNet.forEach((pn, i) => {
    pn.on('pose', (results) => {
      poses[i] = results;
    });
  });

  }


  for (let i = 0; i < size; i++) {
    movers[i] = new Mover(random(width),random(height),random(12,24));
  }


}

function modelReady() {
  console.log("Model Ready!");
}

function vidLoad(){
  for (let i = 0; i< video.length;i++){
    video[i].stop();
    video[i].loop();
  }

}
function draw() {

  for (let i = 0; i<video.length;i++){

  }

  image(video[0], 0, 0);
  image(video[1], windowWidth/2,windowHeight/2, windowWidth/2,windowHeight/2);

  background(0,50);
  if (poses != undefined ) {
    console.log(poses);
    for (let k = 0; k<poses.length;k++){
    if (poses[k] != undefined ) {
      for (let i = 0; i < poses[k].length; i++) {
        for (let j=0; j< poses[k][i].pose.keypoints.length; j++) {

          let partname = poses[k][i].pose.keypoints[j].part;

          let score = poses[k][i].pose.keypoints[j].score;
          let x = poses[k][i].pose.keypoints[j].position.x;
          let y = poses[k][i].pose.keypoints[j].position.y;
          console.log('x ',x,'y ',y);

          if (score > 0.5) {
            if (partname == "leftWrist") {

              noStroke();
              fill(255, 0, 0);
              ellipse(x, y, 100, 100);
              // console.log(x,y);
              attractor.push(new Attractor(x, y, random(8, 10)));
            } else if (partname == "rightWrist") {
              // console.log('2');
              noStroke();
              fill(255, 0, 0);
              ellipse(x, y, 100, 100);
              attractor.push(new Attractor(x, y, random(8, 10)));
            }
          }

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
      // attractor[j].display();

      attractor[j].life();
      // attractor[i].update(val,val);
      let force = attractor[j].attract(movers[i]);
      movers[i].applyForce(force);
      // console.log(val);
    }
  }

  // if (attractor.length > 4){
  //   attractor.splice(0,1);
  // }

}

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
