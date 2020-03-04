let movers = [];
let size = 10;
let attractor = [];
let slider = [];

let poseNet=[];
let poses = [];
let num = 1;//num of video
let video = [];

let left;


function setup() {
  createCanvas(windowWidth,windowHeight);
  frameRate(60);


  //for video
  // video = select("video") || createCapture(VIDEO);
  for (let i= 0;i< num;i++){
    // video[i] = createVideo('asset/'+i+'.mov',vidLoad);
      video[i] = select("video") || createCapture(VIDEO);
    video[i].size();
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
// scale(-1.0, 1.0);
  image(video[0], 0, 0,windowWidth/2,windowHeight/2);
  // image(video[1], windowWidth/2,windowHeight/2, windowWidth/2,windowHeight/2);
  //   image(video[2], 0,windowHeight/2, windowWidth/2,windowHeight/2);
  //   image(video[3], windowWidth/2,0, windowWidth/2,windowHeight/2);
drawKeypoints(poses);
  background(0,50);
  console.log(1);
//   if (poses != undefined ) {
//     console.log(poses);
//     for (let k = 0; k<poses.length;k++){
//     if (poses[k] != undefined ) {
//       for (let i = 0; i < poses[k].length; i++) {
//         for (let j=0; j< poses[k][i].pose.keypoints.length; j++) {
//
//           let partname = poses[k][i].pose.keypoints[j].part;
//
//           let score = poses[k][i].pose.keypoints[j].score;
//           let x = poses[k][i].pose.keypoints[j].position.x;
//           let y = poses[k][i].pose.keypoints[j].position.y;
//           // console.log('x ',x,'y ',y);
//
//           if (score > 0.3) {
//             if (partname == "leftWrist") {
//
//               noStroke();
//               fill(255, 0, 0);
//               ellipse(x, y, 100, 100);
//               // console.log(x,y);
//               // attractor.push(new Attractor(x, y, random(8, 10)));
//               left = createVector(x,y);
//             } else if (partname == "rightWrist") {
//               // console.log('2');
//               noStroke();
//               fill(255, 0, 0);
//               translate()
//               ellipse(x, y, 100, 100);
//               // attractor.push(new Attractor(x, y, random(8, 10)));
//             }
//           }
//
//         }
//       }
//
//     }
// }
// }

  for (let i = 0; i < movers.length; i++) {
    for(let a = 0; a<movers.length;a++){

      if(i!=a){
        movers[i].checkCollision(movers[a]);
      }
    }
    // let mouse = createVector(mouseX,mouseY);
    //   mover[i].acceleration = p5.Vector.sub(mouse, mover[i].position);

console.log(movers);
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

  if (attractor.length > 8){
    attractor.splice(0,3);
  }

}

// Draw ellipses over the detected keypoints
function drawKeypoints(poses) {

      // console.log(pose.pose);
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
              // console.log('x ',x,'y ',y);

              if (score > 0.3) {
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
                  translate()
                  ellipse(x, y, 100, 100);
                  attractor.push(new Attractor(x, y, random(8, 10)));
                }
              }

            }
          }

        }
    }
    }
      // if (keypoint.score > 0.2) {
      //   fill(0, 255, 0);
      //   noStroke();
      //   ellipse(keypoint.position.x, keypoint.position.y, 10, 10);
      // }
}
