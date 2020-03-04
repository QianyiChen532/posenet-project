let movers = [];
let size = 50;
let attractor = [];
let slider = [];

let poseNet=[];
let poses = [];
let num = 2;//num of video
let video = [];

let left;

// Available parts are:
// 0   nose
// 1	leftEye
// 2	rightEye
// 3	leftEar
// 4	rightEar
// 5	leftShoulder
// 6	rightShoulder
// 7	leftElbow
// 8	rightElbow
// 9	leftWrist
// 10	rightWrist
// 11	leftHip
// 12	rightHip
// 13	leftKnee
// 14	rightKnee
// 15	leftAnkle
// 16	rightAnkle


function setup() {
  createCanvas(windowWidth,windowHeight);
  frameRate(60);


  //for video
  // video = select("video") || createCapture(VIDEO);
  for (let i= 0;i< num;i++){
    video[i] = createVideo('asset/'+i+'.mov',vidLoad);
    // video[i] = select("video") || createCapture(VIDEO);
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
    movers[i] = new Mover(random(width),random(height),random(8,24));
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
  image(video[1], windowWidth/2,windowHeight/2, windowWidth/2,windowHeight/2);
  //   image(video[2], 0,windowHeight/2, windowWidth/2,windowHeight/2);
  //   image(video[3], windowWidth/2,0, windowWidth/2,windowHeight/2);
drawKeypoints(poses);
  background(0,50);

  for (let i = 0; i < movers.length; i++) {
    for(let a = 0; a<movers.length;a++){

      if(i!=a){
        movers[i].checkCollision(movers[a]);
      }
    }
    // let mouse = createVector(mouseX,mouseY);
    //   mover[i].acceleration = p5.Vector.sub(mouse, mover[i].position);


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

  if (attractor.length > num*2){
    attractor.splice(0,3);
  }
  if (movers.length > 100){
    movers.splice(0,3);
  }

}

// Draw ellipses over the detected keypoints
function drawKeypoints(poses) {

      // console.log(pose.pose);
      if (poses != undefined ) {
        poses.forEach((p,k) =>{console.log(p,k);}

          // pose.pose.keypoints.forEach(keypoint => {sth.forEach(keypoint =>
          //
          //   })
          // })
        );

        for (let k = 0; k<poses.length;k++){
        if (poses[k] != undefined ) {
          for (let i = 0; i < poses[k].length; i++) {
            for (let j=0; j< poses[k][i].pose.keypoints.length; j++) {

              let partname = poses[k][i].pose.keypoints[j].part;

              let score = poses[k][i].pose.keypoints[j].score;

              let x = [];
              let y = [];
              let x0 = poses[k][i].pose.keypoints[j].position.x;
              let y0 = poses[k][i].pose.keypoints[j].position.y;
              // console.log('x ',x,'y ',y);

              if(k==0){
                x[0]=x0;
                y[0]=y0;
              }else if(k==1){
                x[1]=x0+windowWidth/2;
                y[1]=y0+windowHeight/2;
              }
              else if(k==2){
                x[2]=x0;
                y[2]=y0+windowHeight/2;
              }
              else if(k==3){
                x[3]=x0+windowWidth/2;
                y[3]=y0;
              }


              if (score > 0.3) {
                if (partname == "leftWrist") {

                  noStroke();
                  fill(255, 0, 0);
                  ellipse(x[k], y[k], 20, 20);
                  // console.log(x,y);
                  attractor.push(new Attractor(x[k], y[k], random(8, 10)));

                } else if (partname == "rightWrist") {
                  // console.log('2');
                  noStroke();
                  fill(255, 0, 0);
                  translate()
                  ellipse(x[k], y[k], 20, 20);
                  attractor.push(new Attractor(x[k], y[k], random(8, 10)));
                }

                // else if (partname == "rightEar") {
                //   // console.log('2');
                //   noStroke();
                //   fill(255, 0, 0);
                //   translate()
                //   ellipse(x, y, 100, 100);
                //   movers.push(new Mover(x, y, random(8, 24)));
                // }
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
