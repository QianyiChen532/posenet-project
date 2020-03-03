let video;
let poseNet;
let poses;

let particles = [];

function setup() {
  createCanvas(windowWidth,windowHeight);
  //
  video = select("video") || createCapture(VIDEO);
  // video = select("video") ||createVideo('asset/1.mov',vidLoad);

  // video.size(width);
  video.hide();

  poseNet = ml5.poseNet(video, modelReady);
  poseNet.on('pose', function (results) {
    poses = results;
  });



}

function vidLoad() {
  video.stop();
  video.loop();
  videoIsPlaying = true;
}

function modelReady() {
  console.log("Model Ready!");
}


function draw() {
  // background(0);

  if (poses != undefined ) {
    for (let i = 0; i < poses.length; i++) {
      for (let j=0; j< poses[i].pose.keypoints.length; j++) {

        let partname = poses[i].pose.keypoints[j].part;

        let score = poses[i].pose.keypoints[j].score;
        let x = poses[i].pose.keypoints[j].position.x;
        let y = poses[i].pose.keypoints[j].position.y;

        if (score > 0.2) {
          if (partname == "leftWrist") {

            noStroke();
            fill(255, 0, 0);
            ellipse(x, y, 100, 100);
              console.log(x,y);
            // particles.push( new Particle(x, y, random(1, 3), random(-1, 1)));
          } else if (partname == "rightWrist") {
console.log('2');
            noStroke();
            fill(255, 0, 0);
            ellipse(x, y, 10, 10);
            // particles.push( new Particle(x, y, random(-3, -1), random(-1, 1)));
          }
        }

      }
    }
  }

  // image(video, 0, 0,width,height)
  translate(width, 0); // move the left side of the image to the right
  // scale(-1.0, 1.0);
  image(video, 0, 0, video.width/2, video.height/2);
  filter(GRAY);
  // console.log('2');
  image(video, 0, height/2, video.width/2, video.height/2);
  filter(DILATE);
  image(video, width/2, 0, video.width/2, video.height/2);
  filter(BLUR, 1);
  image(video, width/2, height/2, video.width/2, video.height/2);


  // update and display particles
  for (let i=0; i<particles.length; i++) {
    let p = particles[i];
    p.move();
    p.display();
  }

  // limit the number of particles
  if (particles.length > 400) {
    particles.splice(0, 1);
  }
}



class Particle {
  constructor(x, y, xspd, yspd) {
    this.x = x;
    this.y = y;
    this.xspd = xspd;
    this.yspd = yspd;
    this.size = random(5, 12);
    this.color = color(random(255),random(255),random(255));
  }
  display() {
    noStroke();
    fill(this.color);
    ellipse(this.x, this.y, this.size, this.size);
  }
  move() {
    this.x += this.xspd;
    this.y += this.yspd;
  }
}
