class Flyer {

  //Visuals
  color c = #000000;

  //Motion
  PVector location ;
  PVector velocity;
  PVector acceleration;
  float thrust;

  //Aim
  float aim;
  float turningVelocity;

  //Controls
  boolean forward;
  boolean notforward;
  boolean left;
  boolean right;
  boolean fire;

  //Identity
  int health=100;

  //Bullets
  int ammo=400;
  int shotsfired=0;
  int waitcurrent;
  int waitlength=10;


  Flyer() {
    location = new PVector(width/2, height/2);
    velocity = new PVector(0,0);
    acceleration = new PVector(0,0);
    aim=0;
    turningVelocity = radians(5);
  }
  void reset() {
    forward=false;
    left=false;
    thrust=0;
    fire=false;
  }
  void fly() {
    //    if(moving==0){
    //      reset();
    //    }
    //Thrust
    if (forward) {
      thrust=0.4;
    }
    if (notforward) {
      thrust = 0;
    }

    acceleration.x = thrust*cos(aim);
    acceleration.y = thrust*sin(aim);

    //Aim
    if (left) {
      turningVelocity=radians(-5);
    }
    if (right) {
      turningVelocity=radians(5);
    }

    aim+=turningVelocity;
    turningVelocity=turningVelocity*.9;


    //Apply acceleration to velocity
    velocity.add(acceleration);

    //Easing
    velocity.mult(0.95);

    //Apply velocity to location
    location.add(velocity);

    //If offscreen, wrap around the world
    if (location.x < 0) {
      location.x=width;
    }
    if (location.x > width) {
      location.x=0;
    }
    if (location.y < 0) {
      location.y=height;
    }
    if (location.y > height) {
      location.y=0;
    }
    fire();
  }

  void fire() {

    //CREATE BULLETS
    if (fire) {
      if (shotsfired>=ammo)//once you've gone through all the bullets
      {
        shotsfired=0;//reset the bullet counter to avoid array out of bounds
      }
      if (waitcurrent<=0) {//if the flyer has reloaded
        bullets[shotsfired] = new Bullet(arrows.aim,arrows.location.x,arrows.location.y,shotsfired); //make another bullet
        shotsfired++;//count how many shots have been taken
        waitcurrent=waitlength;//start reloading time
      }
    } 
    waitcurrent--;//countdown reloading time

    //MOVE BULLETS
    for (int i = 0; i < shotsfired; i++) { //for all the bullets that have been fired
      if (bullets[i].exist) {
        bullets[i].move();
        bullets[i].display();
      }
      else {
      }
    }
  }

  void display() {
    fill(c);

    pushMatrix();
    //Move it
    translate(location.x, location.y);
    rotate(aim);

    //Shape of the ship
    triangle(-6,-5,10,0,-6,5);

    //Shape of the thrust
    if (forward) {
      quad(-10,-4,-20,0,-10,4,-12,0);
    }
    else {
    }
    popMatrix();
  }
}

