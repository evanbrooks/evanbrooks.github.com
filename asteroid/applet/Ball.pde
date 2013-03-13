class Ball {
  //BALL PHYSICS VARIABLES
  float aim;
  float x, y;
  float diam;
  int cloud=int(diam);
  float vx = random(-2,2);
  float vy = random(-2,2);
  float shipdistance=300;
  float shipdx;
  float shipdy;
  float mousedistance=100;

  int level;
  int topic;
  String title = "Section";
  String url = "Broken";
  String imgurl = "Image";

  //BALL DETAILS
  int id;
  boolean exist=true;
  color c=colors[topic];
  String tag;
  // boolean selected=false;

  Ball[] others;

  //CHECK FOR COLLISIONS
  void collide() {
    shipdx = arrows.location.x - x; //Find the x-distance between this ball and the other one
    shipdy = arrows.location.y - y; //Find the y-distance too
    shipdistance = sqrt(shipdx*shipdx + shipdy*shipdy); //Find the total distance

    float mousedx = x - mouseX; //Find the x-distance between this ball and the other one
    float mousedy = y - mouseY; //Find the y-distance too
    mousedistance = sqrt(mousedx*mousedx + mousedy*mousedy); //Find the total distance

    if (exist) {
      //COLLIDE WITH FLYER
      if (arrows.location.x < x+diam/2 && arrows.location.x > x-diam/2) {
        if (arrows.location.y < y+diam/2 && arrows.location.y > y-diam/2) {
          float dx = arrows.location.x - x; //Find the x-distance between this ball and the other one
          float dy = arrows.location.y - y; //Find the y-distance too
          shipdistance = sqrt(dx*dx + dy*dy); //Find the total distance
          if (shipdistance<diam/2) {
            float angle = atan2(dy, dx); //Determine the angle between the two balls
            float targetX = x + cos(angle) * diam; //what is this doing?
            float targetY = y + sin(angle) * diam;
            float ax = (targetX - arrows.location.x) * spring;
            float ay = (targetY - arrows.location.y) * spring;
            vx -= ax; //change the x speed of this ball
            vy -= ay; //change the y speed of this ball
            arrows.velocity.x += ax; //change the x speed of the other ball
            arrows.velocity.y += ay; //change the y speed of the other ball
            arrows.health-=5;
            if (level==2) {
              counter[topic]--;
            }
          }
        }
      }
      if (counter[topic]<=0) {
        counter[topic]=10;
        for (int i=0; i < totalballs; i++) {
          if(balls[i].topic==topic) {
            if(level==1) {
              balls[i].exist=true;
            }
            //if(level==2) {
            // balls[i].exist=false;
            //}
          }
        }
      }

      //COLLIDE WITH BULLETS
      for (int i=0; i < arrows.shotsfired; i++) { //for each bullet that's been fired
        if (bullets[i].exist) { //if the bullet still exists
          if (bullets[i].x < x+diam/2 && bullets[i].x > x-diam/2) { //if the bullet is within
            if (bullets[i].y < y+diam/2 && bullets[i].y > y-diam/2) {
              hits++; //Number of times hit
              if (topic==6) {
                if (title=="Read Article") {
                  for (int j=0; j < arrows.shotsfired; j++) { //for each bullet that's been fired
                    if (bullets[j].exist) { //if the bullet still exists
                      bullets[j].exist=false;
                    }
                  }
                  open(url);
                  nopopup();
                  read++;
                }
                if (title=="Whatever") {
                  popup=0;
                  nopopup();
                  ignored++;
                }
              }

              if (level==2) {
                //                if(selected) {
                selected=id;
                println(selected);
                popup=1;
                //                 selected=false;
                //               }
                //               else {
                //                 selected=true;
                //               }
              }
              if (level==1) {
                exist=false; //Destroy ball
                createstories();
              }
              bullets[i].exist=false; //Destroy Bullet
            }
          }
        }
      }
      //COLLIDE WITH OTHER BALLS
      for (int i = id; i < numBalls; i++) { //All balls
        if (others[i].exist&&topic!=6) { //Only if the other balls also exist
          float dx = others[i].x - x; //Find the x-distance between this ball and the other one
          float dy = others[i].y - y; //Find the y-distance too
          float distance = sqrt(dx*dx + dy*dy); //Find the total distance
          float minDist = others[i].diam/2 + diam/2; //The minDist is  how far the edge of the ball is from its center
          if (distance < minDist) { //If the ball is closer to the other than the entire size of the ball
            float angle = atan2(dy, dx); //Determine the angle between the two balls
            float targetX = x + cos(angle) * minDist; //what is this doing?
            float targetY = y + sin(angle) * minDist;
            float ax = (targetX - others[i].x) * spring;
            float ay = (targetY - others[i].y) * spring;
            vx -= ax; //change the x speed of this ball
            vy -= ay; //change the y speed of this ball
            others[i].vx += ax; //change the x speed of the other ball
            others[i].vy += ay; //change the y speed of the other ball
          }
          else if (distance > 200 && others[i].topic==topic) { //If the ball is of the same type but far away
            float angle = atan2(dy, dx); //Determine the angle between the two balls
            float targetX = x + cos(angle) * 200; //what is this doing?
            float targetY = y + sin(angle) * 200;
            float ax = (targetX - others[i].x) * 0.001 *spring;
            float ay = (targetY - others[i].y) * 0.001 * spring;
            vx -= ax; //change the x speed of this ball
            vy -= ay; //change the y speed of this ball
            others[i].vx += ax; //change the x speed of the other ball
            others[i].vy += ay; //change the y speed of the other ball
          }
        }
        else {
        }
      }
    }
    else {
    }
  }

  void move() {
    if (exist) {
      //vy -= gravity; //move the ball up/down
      if (vx>2||vy>2) {//if it's going too fast, slow down
        vx*=.9;
        vy*=.9;
      }
      x += vx; 
      y += vy;
      //      if (x>width+diam/2) {
      //        x = 0-diam/2;
      //      }
      //      if (x<0-diam/2) {
      //        x = width+diam/2;
      //      }
      //      if (y>height+diam/2) {
      //        y = 0-diam/2;
      //      }
      //      if (y<0-diam/2) {
      //        y = height+diam/2;
      //      }

      if (x + diam/2 + offset> width) { //if the ball hits the edge, reverse direction and slow down
        x = width - diam/2 - offset;
        vx *= friction;
      }
      else if (x - diam/2 -offset< 0) {//if the ball hits the edge, reverse direction and slow down
        x = diam/2+offset;
        vx *= friction;
      }
      if (y + diam/2 +offset> height) {//if the ball hits the edge, reverse direction and slow down
        y = height - diam/2-offset;
        vy *= friction;
      } 
      if (y - diam/2 -offset< 0) {//if the ball hits the edge, reverse direction and slow down
        y = diam/2+offset;
        vy *= friction;
      }
      aim=atan2(y-arrows.location.y,x-arrows.location.x);//point the indicator toward the flyer
    }
    else {
    }
  }

  void display() {
    color c=colors[topic];
    if (exist) {

      for(int i=0; i<totalballs;i++) {
        if (others[i].topic==topic&&others[i].exist) {
          stroke(c,50);
          line(x,y,others[i].x,others[i].y);
          noStroke();
        }
      }

      pushMatrix();
      translate(x,y);//move the thing
      if(shipdistance <100||mousedistance<50) {
        if (level ==2) {
          textFont(serif);
          textSize(10);
          textAlign(LEFT,TOP);
          fill(#000000);
          rect(0,-1,200,2);
          text(title,30,5,150,100);//draw the label
        }
      }
      fill(c);
      noStroke();
      ellipse(0,0,diam,diam);//draw the ball
      fill(#000000);
      if (level ==1) {
        textFont(sans);
        textSize(12);
        textAlign(CENTER,CENTER);
        text(title,0,0);//draw the label
      }
      if (topic ==6) {
        fill(#000000);
        textFont(sans);
        textSize(12);
        textAlign(CENTER,CENTER);
        text(title,0,0);//draw the label
      }
      rotate(aim); //rotate the indicator
      fill(#000000);
      //rect(0,0,150,5);
      //ellipse(50*cos(aim),50*sin(aim),5,5);
      popMatrix();
    }
    else {
    }
  }

  void createstories() {
    int temptotal=totalballs;
    int tempcounter=0;
    for (int j = temptotal; j < temptotal+10; j ++) {
      balls[j].exist=true;
      balls[j].level=2;
      balls[j].topic=topic;
      balls[j].x=x; //right where the old ball was
      balls[j].y=y;
      balls[j].diam=diam/4;
      balls[j].title=titles[topic][tempcounter];
      balls[j].url=links[topic][tempcounter];
      balls[j].imgurl=imgurls[topic][tempcounter];
      totalballs++;
      tempcounter++;
    }
  }
}

class CatBall extends Ball {
  CatBall(float xin, float yin, int idin, Ball[] oin) {
    x = xin;
    y = yin;
    id = idin;
    others = oin;
    //diam = records[id].percent*5;
    //diam = 120;
    diam = 200;
  }
}

