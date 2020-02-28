//reference:
//posenet with preload video:https://gist.github.com/golanlevin/701cec4696b61715879ccdb64855c155
let poseNet;
let poses = [];

let video;

function setup() {
  console.log('2');
  createCanvas(windowWidth,windowHeight);
  // video = select("video") || createCapture(VIDEO);
  video = createVideo('asset/Untitled.mov',vidLoad);
  video.size(width, height);

  const poseNet = ml5.poseNet(video, () => select("#status").hide());

  poseNet.on('pose', function(results) {
   poses = results;
 });
  // Hide the video element, and just show the canvas
  video.hide();
}


function mousePressed(){
  vidLoad();
}

function vidLoad() {
  video.stop();
  video.loop();
  videoIsPlaying = true;
}

function draw() {
  console.log('1');
  image(video, 0, 0, width, height);

  // We can call both functions to draw all keypoints and the skeletons
  drawPoses(poses);
}

function drawPoses(poses) {
  // Modify the graphics context to flip all remaining drawing horizontally.
  // This makes the image act like a mirror (reversing left and right); this is
  // easier to work with.
  translate(width, 0); // move the left side of the image to the right
  scale(-1.0, 1.0);
  image(video, 0, 0, video.width/2, video.height/2);
  filter(GRAY);
  image(video, 0, height/2, video.width/2, video.height/2);
  filter(DILATE);
  image(video, width/2, 0, video.width/2, video.height/2);
  filter(BLUR, 1);
  image(video, width/2, height/2, video.width/2, video.height/2);
  drawKeypoints(poses);
  drawSkeleton(poses);
}

// Draw ellipses over the detected keypoints
function drawKeypoints(poses) {
  poses.forEach(pose =>
    pose.pose.keypoints.forEach(keypoint => {
      if (keypoint.score > 0.2) {
        fill(0, 255, 0);
        noStroke();
        ellipse(keypoint.position.x, keypoint.position.y, 10, 10);
      }
    })
  );
}

// Draw connections between the skeleton joints.
function drawSkeleton(poses) {
  poses.forEach(pose => {
    pose.skeleton.forEach(skeleton => {
      // skeleton is an array of two keypoints. Extract the keypoints.
      const [p1, p2] = skeleton;
      stroke(255, 0, 0);
      line(p1.position.x, p1.position.y, p2.position.x, p2.position.y);
    });
  });
}
