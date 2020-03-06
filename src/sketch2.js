let gravity = 0;
let movers = [];
let size = 15;
let attractor = [];
let slider = [];

let poseNet=[];
let poses = [];
let num = 4;//num of video
let video = [];

let vnum = 1;
let audio=[];
let left;

let seekP;


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
function preload(){
  for(let i = 0; i<vnum;i++){
    audio[i] = loadSound('asset/'+i+'.mp3');
  }
  // for (let i= 0;i< num-1;i++){
  //   video[i] = createVideo('asset/'+i+'.mov',vidLoad);
  // }
  // if(num>1){
  //   video[num-1] = createCapture(VIDEO);
  // }
}

function setup() {
  background(0);
  createCanvas(windowWidth,windowHeight);
  frameRate(60);

  for (let i= 0;i< num-1;i++){
    video[i] = createVideo('asset/'+i+'.mov',vidLoad);
  }
  if(num>=1){
    video[num-1] = createCapture(VIDEO);
  }

  for (let i= 0;i< num;i++){


    video[i].size();
    video[i].hide();

    //for posenet
    poseNet[i] = ml5.poseNet(video[i], modelReady);
    poseNet.forEach((pn, i) => {
      pn.on('pose', (results) => {
        poses[i] = results;
      });
    });

  }

  for (let i = 0; i < size; i++) {
    movers[i] = new Mover(windowWidth/2,windowHeight/2,random(8,24));
    //       audLoad(0,movers[i].isCollide);
    // console.log(movers[i].isCollide);
  }
}


function modelReady() {
  console.log("Model Ready!");
}


function audLoad(i,b){

  if (audio[i].isPlaying() && b==false){
    audio[i].stop();
  }else if (b==true){
    audio[i].play();
    console.log('play');
  }

}

function vidLoad(){
  for (let i = 0; i< video.length;i++){
    // video[i].stop();
    // video[i].play();
    video[i].loop();

  }

}

function draw() {
  let a = map(mouseX,0,windowWidth,0,255);

  let l = video.length;
  if (l==1){
    tint(255, a);
    image(video[0], 0, 0,windowWidth/2,windowHeight/2);

  }
  else if(l==2){
    tint(255, a);
    image(video[0], 0, 0,windowWidth/2,windowHeight/2);
    image(video[1], windowWidth/2,windowHeight/2, windowWidth/2,windowHeight/2);

  }
  else if(l==3){
    tint(255, a);
    image(video[0], 0, 0,windowWidth/2,windowHeight/2);
    image(video[1], windowWidth/2,windowHeight/2, windowWidth/2,windowHeight/2);
    image(video[2], 0,windowHeight/2, windowWidth/2,windowHeight/2);
  }
  else {
    tint(255, a);
    image(video[0], 0, 0,windowWidth/2,windowHeight/2);
    image(video[1], windowWidth/2,windowHeight/2, windowWidth/2,windowHeight/2);
    image(video[2], 0,windowHeight/2, windowWidth/2,windowHeight/2);
    image(video[3], windowWidth/2,0, windowWidth/2,windowHeight/2);
  }

  background(0,0,0,90);


  drawKeypoints(poses);
  drawSkeleton(poses);


  // attractor.push(new Attractor(mouseX,mouseY));
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

    if(seekP!=undefined){
      movers[i].applyBehaviors(movers,seekP);
    }

    // movers[i].variation();

    //     for (let j = 0; j < attractor.length; j++) {
    //
    //       attractor[j].life();
    //       attractor[j].display();
    // // attractor[j].variation();
    //
    //
    //       let force = attractor[j].attract(movers[i]);
    //       movers[i].applyForce(force);
    //
    //       let g = createVector(0,gravity);
    //       movers[i].applyForce(g);
    //     }
  }

  if (attractor.length > num*2){
    attractor.splice(0,1);
  }
  if (movers.length > 50){
    movers.splice(0,3);
  }

}

// Draw ellipses over the detected keypoints
function drawKeypoints(poses) {

  for (let k = 0; k<poses.length;k++){
    if (poses[k] != undefined ) {
      for (let i = 0; i < poses[k].length; i++) {
        for (let j=0; j< poses[k][i].pose.keypoints.length; j++) {

          let partname = poses[k][i].pose.keypoints[j].part;

          let score = poses[k][i].pose.keypoints[j].score;

          let x = [];
          let y = [];
          let x0 = 30+poses[k][i].pose.keypoints[j].position.x;
          let y0 = poses[k][i].pose.keypoints[j].position.y;


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
            if (partname == "leftWrist" || partname == "rightWrist") {

              noStroke();
              fill(255, 0, 0);
              ellipse(x[k], y[k], 20, 20);
              seekP = createVector(x[k], y[k]);

              //update attractor position based on x[k]y[k]
              //how to match different points in this array?
            }
            // else if (partname == "leftKnee" ) {
            //   // console.log('2');
            //   noStroke();
            //   fill(255, 255, 0);
            //
            //   ellipse(x[k], y[k], 10, 10);
            //   movers.push(new Mover(x[k], y[k], random(8, 24)));
            // }
          }

        }
      }

    }
  }

}

function drawSkeleton(poses) {
  for (let k = 0; k<poses.length;k++){
    if (poses[k] != undefined ) {
      for (let i = 0; i < poses[k].length; i++) {
        for (let j=0; j< poses[k][i].skeleton.length; j++) {
          console.log(poses[k][i].skeleton[j]);
          if (poses[k][i].skeleton[j] != undefined & poses[k][i].skeleton[j].length >1){
            let p1 = 30+poses[k][i].skeleton[j][0].position;
            let p2 = poses[k][i].skeleton[j][1].position;

            let x1=[];
            let x2=[];
            let y1=[];
            let y2=[];

            let x0 = p1.x;
            let y0 = p1.y;
            let z0 = p2.x;
            let w0 = p2.y;

                      if(k==0){
                        x1[0]=x0;
                        y2[0]=y0;
                        x2[0]=z0;
                        y2[0]=w0;
                      }else if(k==1){

                        x1[1]=x0+windowWidth/2;
                        y2[1]=y0+windowHeight/2;
                        x2[1]=z0+windowWidth/2;
                        y2[1]=w0+windowHeight/2;
                      }
                      else if(k==2){
                        x1[2]=x0;
                        y2[2]=y0+windowHeight/2;
                        x2[2]=z0;
                        y2[2]=w0+windowHeight/2;

                      }
                      else if(k==3){

                        x1[3]=x0+windowWidth/2;
                        y2[3]=y0;
                        x2[3]=z0+windowWidth/2;
                        y2[3]=w0;
                      }

            stroke(255, 255, 255,50);
            strokeWeight(10);
            line(x1[k], y1[k], x2[k],y2[k]);
          }

        }

      }

    }
  }

}
