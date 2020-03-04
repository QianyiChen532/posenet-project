//movers
class Mover {
  constructor(x, y, mass) {
    this.mass = mass;
    this.radius = mass * 3;
    this.position = createVector(x, y);
    this.velocity = createVector(0.1,0);
    this.acceleration = createVector(0, 0);

    this.lifespan = 100;
    this.lifeReduction = 1;
    this.isDone = false;
  }

  applyForce(force) {
    let f = p5.Vector.div(force, this.mass);
    this.acceleration.add(f);
  }

  update() {

    this.velocity.add(this.acceleration);
    this.position.add(this.velocity);
    this.acceleration.mult(0);

    this.velocity.setMag(5);
    // let s = this.velocity.mag();
    // s = constrain(s,5,10);

    //edgecheck
    if(this.position.x<0 || this.position.x>width){
      this.velocity.x = -this.velocity.x;

    }else if (this.position.y+this.radius < 0 || this.position.y+this.radius >height) {
      this.velocity.y = -this.velocity.y;
    }

    if (this.velocity.y == 0){
      this.velocity.y = 0.1;
    }
    if (this.velocity.x == 0){
      this.velocity.x = 0.1;
    }

  }


  display() {
    noStroke();
    this.alpha = noise(this.position.x,this.position.y);
    let c = color('hsba(255, 127,0,0.9)');
    fill(c);
    ellipse(this.position.x, this.position.y, this.radius * 2);
  }
}

//attractor
class Attractor {
  constructor(x,y) {
    this.position = createVector(x,y);
    this.mass = 20;
    this.G = 1;

    this.lifespan = 100;
    this.lifeReduction = 1;
    this.isDone = false;
  }

  update(x,y){
    this.position = (x,y);
  }


  life(){
    this.lifespan -= this.lifeReduction;
    if (this.lifespan == 0){
      this.isDone = true;
    }
  }

  attract(mover) {
    let force = p5.Vector.sub(this.position, mover.position);
    let distance = force.setMag(5,25);
    let strength = (this.G * this.mass * mover.mass) / (distance * distance);
    force.setMag(strength);

    return force;
  }

  // Method to display
  display() {
    ellipseMode(CENTER);
// console.log('1');
    noStroke();
    fill(255);
    ellipse(this.position.x, this.position.y, this.mass * 2, this.mass * 2);
  }

}
