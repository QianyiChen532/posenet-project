class Mover {
  constructor(x, y, mass) {
    this.mass = mass;
    this.radius = mass*2 ;
    this.position = createVector(x, y);
    this.velocity = createVector(random(-1,1),random(-1,1));
    this.acceleration = createVector(0,0);
    // this.accAdj = createVector(random(0.001, 0.05));

    this.r = 12;
    this.maxspeed = 20;    // Maximum speed
    this.maxforce =2;

    this.lifespan = 100;
    this.lifeReduction = 2;
    this.isDone = false;

    this.isCollide = false;

    //color
    this.r = 0;
    this.g = 0;
    this.b = random(255);

    this.showlines = false;
  }
  update() {

    this.velocity.add(this.acceleration);
    this.position.add(this.velocity);
    this.velocity.limit(this.maxspeed);
    this.acceleration.mult(0);

    //edgecheck
    if(this.position.x<-100 || this.position.x>width+100){
      this.velocity.x = -this.velocity.x;

    }else if (this.position.y+this.radius < 0 || this.position.y+this.radius >height) {
      this.velocity.y = -this.velocity.y;
    }

    if (this.velocity.y == 0){
      this.velocity.y = 1;
    }
    if (this.velocity.x == 0){
      this.velocity.x = 1;
    }

  }

  applyBehaviors(movers,force){
    let separateForce = this.separate(movers);
  let seekForce = this.seek(force);

  separateForce.mult(2);
  seekForce.mult(1);

  this.applyForce(separateForce);
  this.applyForce(seekForce);

  }

  moveTo(target){
    let vec = p5.Vector.sub(target,this.position);
    if (vec.mag()<100){
      vec.mult(0.1);
      this.applyForce(vec);
if(this.showlines == true){
  stroke(255,70);
  strokeWeight(1);
  line(this.position.x, this.position.y,target.x, target.y);
}

    }
    // console.log(1);
  }

  applyForce(force) {
    let f = p5.Vector.div(force, this.mass);
    this.acceleration.add(f);
  }

  separate(mover){
    let desiredseparation = 20;
    let sum = createVector();
    let count = 0;
    // For every boid in the system, check if it's too close
    for (let i = 0; i < mover.length; i++) {
      let d = p5.Vector.dist(this.position, mover[i].position);

      if ((d > 0) && (d < desiredseparation)) {
        // Calculate vector pointing away from neighbor
        let diff = p5.Vector.sub(this.position, mover[i].position);
        diff.normalize();
        diff.div(d);        // Weight by distance
        sum.add(diff);
        count++;            // Keep track of how many
      }
    }
    if (count > 0) {
      sum.div(count);

      sum.normalize();
      sum.mult(this.maxspeed);
      // Implement Reynolds: Steering = Desired - Velocity
      sum.sub(this.velocity);
      sum.limit(this.maxforce);
    }
    return sum;
  }

  seek(target){
    let desired = p5.Vector.sub(target,this.position);

    desired.normalize();
    desired.mult(this.maxspeed);
    // Steering = Desired minus velocity
    let steer = p5.Vector.sub(desired,this.velocity);
    steer.limit(this.maxforce);
    if(this.showlines){

      stroke(0,150,255,90);
      strokeWeight(0.9);
      line(this.position.x, this.position.y,target.x, target.y);
    }

    return steer;
  }

  checkCollision(other){
    let distance = this.position.dist(other.position);
 if (distance < this.radius + other.radius) {


   let force1 = p5.Vector.sub(other.position, this.position);
   force1.mult(-1);
   force1.mult(0.1);
   this.applyForce(force1);

   let force2 = p5.Vector.sub(this.position, other.position);
   force2.mult(-1);
   force2.mult(0.1);
   other.applyForce(force2);

   this.isCollide = true;

 } else {

   this.isCollide=false;

 }
  }
  display() {
    noStroke();

    this.r = map(this.position.x,0,windowWidth,0,255);
    this.g = map(this.position.y,0,windowHeight,0,255);
    this.b = random(255);
    colorMode(RGB);
    fill(this.r,this.g,this.b,88);
    ellipse(this.position.x, this.position.y, this.radius);
    fill(255,255,255,0.5);
    ellipse(this.position.x, this.position.y, this.radius+5);

  }

variation(){
  //area 1
  if(0<this.position.x<windowWidth/2 && 0<this.position.y<windowHeight/2){
    this.velocity.normalize();

  }
//area2
  else if (0<this.position.x<windowWidth/2 && this.position.y>windowHeight/2) {

  }

  //area3
  else if (this.position.x>windowWidth/2 && 0<this.position.y<windowHeight/2) {

  }
  //area4
  else if (this.position.x>windowWidth/2 && this.position.y>windowHeight/2) {

  }

}

}
