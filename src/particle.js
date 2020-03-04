//movers
class Mover {
  constructor(x, y, mass) {
    this.mass = mass;
    this.radius = mass*2 ;
    this.position = createVector(x, y);
    this.velocity = createVector(0.01,0);
    this.acceleration = createVector(0, 0);
    this.accAdj = 0;//random(0.001, 0.05);

    this.lifespan = 100;
    this.lifeReduction = 1;
    this.isDone = false;

    //color
    this.r = map(this.r,0,int(this.position.x),0,255);
    this.g = 0;
    this.b = random(255);
  }

  applyForce(force) {
    let f = p5.Vector.div(force, this.mass);
    this.acceleration.add(f);
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

 } else {

 }
  }

  // explode(i){
  //   if(i==2){
  //     this.vel=random()
  //   }
  // }

  update() {

    this.velocity.add(this.acceleration);
    this.position.add(this.velocity);
    this.velocity.mult(0.5);
    this.acceleration.mult(0);


    this.velocity.setMag(6);
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

    this.r = map(this.position.x,0,windowWidth,0,255);
    this.g = map(this.position.y,0,windowHeight,0,255);
    this.b = random(255);

    fill(this.r,this.g,this.b);
    ellipse(this.position.x, this.position.y, this.radius);
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
    force.setMag(strength*5);

    return force;
  }

  display() {
    ellipseMode(CENTER);
    noStroke();
    fill(255);
    ellipse(this.position.x, this.position.y, this.mass * 2, this.mass * 2);
  }

}
