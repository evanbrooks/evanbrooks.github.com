class Bullet {
  float aim;
  float x, y;
  float vx;
  float vy;
  float v=10;
  float id;
  color c;
  boolean exist=true;
  float range=128;

  Bullet(float tempaim, float tempx, float tempy, int tempid) {
    aim=tempaim;
    x=tempx;
    y=tempy;
    id=tempid;
  }

  void move() {
    if (exist) {
      range--;//count down the time until the bullet fades out
      float cpart  =map(range,0,128,255,0);
      c=color(cpart,cpart,cpart);//visually fade out the bullet
      if (range<=0) {
        exist=false;//after the time is up, delete the bullet
      }

      x+=v*cos(aim);//polar coordinates to x
      y+=v*sin(aim);//polar coordinates to y
      //If offscreen, wrap around the world
      if (x < 0) {
        x=width;
      }
      if (x > width) {
        x=0;
      }
      if (y < 0) {
        y=height;
      }
      if (y > height) {
        y=0;
      }
    }
    else {
    }
  }
  void display() {
    if (exist) {
      //if(fire){
      noStroke();
      fill(c);
      ellipse(x,y,5,5); //draw the bullet
      //}
      //else{
      //ellipse(10,10,5,5);
      //}
    }
    else {
    }
  }
}

