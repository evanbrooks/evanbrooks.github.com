import processing.core.*; 
import processing.xml.*; 

import processing.xml.*; 
import processing.opengl.*; 

import java.applet.*; 
import java.awt.Dimension; 
import java.awt.Frame; 
import java.awt.event.MouseEvent; 
import java.awt.event.KeyEvent; 
import java.awt.event.FocusEvent; 
import java.awt.Image; 
import java.io.*; 
import java.net.*; 
import java.text.*; 
import java.util.*; 
import java.util.zip.*; 
import java.util.regex.*; 

public class Asteroids_nyt5 extends PApplet {




int popup = 0;
int selected = 0;
int[]counter = new int[10];

int read;
int ignored;
String rating;

int moving = 1;
int loading = 1;

//GLOBAL PHYSICS STUFF VARIABLES
float spring = .05f;
float gravity = -0.06f;
float friction = -0.9f;
int offset = 90;

//TYPE VARIABLES
PFont sans;
PFont serif;
PFont bigserif;
PFont italic;

//FLYER VARIABLE
Flyer arrows;

//SHOOTING VARIABLES
int ammo = 400;
int shots=0;
int wait;
int waitlength=10;
Bullet[] bullets = new Bullet[ammo];
int hits;

//BALL VARIABLES
int sectioncount = 6;
int numBalls = 1000;
int totalballs = 6;
CatBall[] balls = new CatBall[numBalls];

String[]sections=new String[sectioncount];

String[][]titles = new String[sectioncount][10];
String[][]links = new String[sectioncount][10];
String[][]imgurls = new String[sectioncount][10];
PImage[][]imgs = new PImage[sectioncount][10];

int[]colors = new int[7];

//CONTROLS
boolean left;
boolean right;
boolean up;
boolean notup;
boolean fire;

//READING FILES
String[] lines;
int recordCount;

public void setup() 
{
  //BASIC FILES
  size(1400, 900, OPENGL);
  //size(800, 600, OPENGL);
  noStroke();
  // smooth();

  //DECLARING FLYER
  arrows = new Flyer();

  sections[0]="Top Stories";
  sections[1]="World";
  sections[2]="US";
  sections[3]="Business";
  sections[4]="Sports";
  sections[5]="Opinion";

  colors[0]=0xffBDBDB0;
  colors[1]=0xff959A8F;
  colors[2]=0xffABADB0;
  colors[3]=0xff809EAD;
  colors[4]=0xffDAD7C5;
  colors[5]=0xffB0A690;
  colors[6]=0xffFFFFFF;
  
  counter[0]=10;
    counter[1]=10;
      counter[2]=10;
        counter[3]=10;
          counter[4]=10;
            counter[5]=10;

  // LOADING INTIAL BALL
  for (int i = 0; i < numBalls; i++) {//for each ball
    if (i < totalballs) {
      balls[i] = new CatBall(random(width), random(height), i,balls);//create it
      balls[i].topic=i;
      balls[i].level=1;
      balls[i].title=sections[i];
    }
    else {
      balls[i] = new CatBall(random(width), random(height), i, balls);//create it
      balls[i].exist=false;
    }
  }

  //DECLARING TYPE
  serif = loadFont("Georgia-Bold-10.vlw");
  bigserif = loadFont("Georgia-48.vlw");
  italic = loadFont("Georgia-Italic-10.vlw");
  sans = loadFont("Arial-BoldMT-12.vlw");
}
int ind;
public void draw() 
{
  if (read+ignored<1) {
    rating="try harder";
  }
  else if (read>ignored+2) {
    rating="nice start";
  }
  else if (read+5<ignored) {
    rating="you'd be better off just play real asteroids";
  }
  else {
    rating="keep it up";
  }
  bg();
  if (loading==1) {
    loadrss();
  }
  else {
    //GO THROUGH EVERY BALL
    for (int i = 0; i < numBalls; i++) {
      if (moving == 1) {
        balls[i].collide();
        balls[i].move();
      }
      else {
      }
      balls[i].display();
    }
    if(popup==1) {
      popup();
    }
    else {
    }
  }
  //DISPLAY FLYER
  arrows.fly();
  arrows.display();
  ind++;
  save("aster_"+ind+".jpg");
}

class Ball {
  //BALL PHYSICS VARIABLES
  float aim;
  float x, y;
  float diam;
  int cloud=PApplet.parseInt(diam);
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
  int c=colors[topic];
  String tag;
  // boolean selected=false;

  Ball[] others;

  //CHECK FOR COLLISIONS
  public void collide() {
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
            float ax = (targetX - others[i].x) * 0.001f *spring;
            float ay = (targetY - others[i].y) * 0.001f * spring;
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

  public void move() {
    if (exist) {
      //vy -= gravity; //move the ball up/down
      if (vx>2||vy>2) {//if it's going too fast, slow down
        vx*=.9f;
        vy*=.9f;
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

  public void display() {
    int c=colors[topic];
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
          fill(0xff000000);
          rect(0,-1,200,2);
          text(title,30,5,150,100);//draw the label
        }
      }
      fill(c);
      noStroke();
      ellipse(0,0,diam,diam);//draw the ball
      fill(0xff000000);
      if (level ==1) {
        textFont(sans);
        textSize(12);
        textAlign(CENTER,CENTER);
        text(title,0,0);//draw the label
      }
      if (topic ==6) {
        fill(0xff000000);
        textFont(sans);
        textSize(12);
        textAlign(CENTER,CENTER);
        text(title,0,0);//draw the label
      }
      rotate(aim); //rotate the indicator
      fill(0xff000000);
      //rect(0,0,150,5);
      //ellipse(50*cos(aim),50*sin(aim),5,5);
      popMatrix();
    }
    else {
    }
  }

  public void createstories() {
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

class Bullet {
  float aim;
  float x, y;
  float vx;
  float vy;
  float v=10;
  float id;
  int c;
  boolean exist=true;
  float range=128;

  Bullet(float tempaim, float tempx, float tempy, int tempid) {
    aim=tempaim;
    x=tempx;
    y=tempy;
    id=tempid;
  }

  public void move() {
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
  public void display() {
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

//DETECT KEY PRESSES
public void keyPressed() {
  //        moving=1;
  if(key == CODED) { 
    if (keyCode == LEFT) {
      arrows.left=true;
    }
    if (keyCode == RIGHT) {
      arrows.right=true;
    }
    if (keyCode == UP) {
      arrows.forward=true;
      arrows.notforward=false;
    }
  }
  if (key == 'z') {
    arrows.forward=true;
    arrows.notforward=false;
  }
  if (key== 'x'|| key==' ') {
    arrows.fire=true;
  }
}

//DETECT RELEASE OF KEY PRESSES
public void keyReleased() {
  if(key == CODED) { 
    // pts
    if (keyCode == LEFT) {
      arrows.left=false;
    }
    if (keyCode == RIGHT) {
      arrows.right=false;
    }
    if (keyCode == UP) {
      arrows.forward=false;
      arrows.notforward=true;
    }
  }
  if (key == 'z') {
    arrows.forward=false;
    arrows.notforward=true;
  }
  if (key== 'x'|| key==' ') {
    arrows.fire=false;
  }
}

class Flyer {

  //Visuals
  int c = 0xff000000;

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
  public void reset() {
    forward=false;
    left=false;
    thrust=0;
    fire=false;
  }
  public void fly() {
    //    if(moving==0){
    //      reset();
    //    }
    //Thrust
    if (forward) {
      thrust=0.4f;
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
    turningVelocity=turningVelocity*.9f;


    //Apply acceleration to velocity
    velocity.add(acceleration);

    //Easing
    velocity.mult(0.95f);

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

  public void fire() {

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

  public void display() {
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

public void loadrss() {

  //LOADING MESSAGE

  fill(0xff000000);
  textFont(serif);
  textSize(10);
  textAlign(CENTER,CENTER);
  background(0xffFFFFFF);
  text("Loading Top News",width/2,height/2); //Show the loading message

  //LIST OF ALL THE FEED URLS

  String url_all ="http://www.nytimes.com/services/xml/rss/nyt/HomePage.xml";  
  String url_world = "http://www.nytimes.com/services/xml/rss/nyt/World.xml";  
  String url_us = "http://www.nytimes.com/services/xml/rss/nyt/US.xml";  
  String url_business = "http://www.nytimes.com/services/xml/rss/nyt/Business.xml";  
  String url_sports = "http://www.nytimes.com/services/xml/rss/nyt/Sports.xml";  
  String url_opinion = "http://www.nytimes.com/services/xml/rss/nyt/Opinion.xml"; 

  //READ THE RSS

  XMLElement rss_all = new XMLElement(this, url_all);
  XMLElement rss_world = new XMLElement(this, url_world);
  XMLElement rss_us = new XMLElement(this, url_us);
  XMLElement rss_business = new XMLElement(this, url_business);
  XMLElement rss_sports = new XMLElement(this, url_sports);
  XMLElement rss_opinion = new XMLElement(this, url_opinion);

  //LIST THE TITLES OUT TO A 2-Dimensional Array
  String titlechild = "channel/item/title";

  XMLElement[] titleXMLElements = rss_all.getChildren("channel/item/title");
  XMLElement[] linkXMLElements = rss_all.getChildren("channel/item/link");
  //XMLElement[] imgXMLElements = rss_all.getChildren("channel/item/media:content");
  for (int i = 0; i < 10; i++) {  
    titles[0][i] = titleXMLElements[i].getContent();
    links[0][i] = linkXMLElements[i].getContent();
    imgurls[0][i] = linkXMLElements[i].getContent();
    //imgs[0][i] = loadImage(imgurls[0][i]);
  }
  titleXMLElements = rss_world.getChildren("channel/item/title");
  linkXMLElements = rss_world.getChildren("channel/item/link");
  for (int i = 0; i < 10; i++) {  
    titles[1][i] = titleXMLElements[i].getContent();
    links[1][i] = linkXMLElements[i].getContent();
  }
  titleXMLElements = rss_us.getChildren("channel/item/title");
  linkXMLElements = rss_us.getChildren("channel/item/link");
  for (int i = 0; i < 10; i++) {  
    titles[2][i] = titleXMLElements[i].getContent();
    links[2][i] = linkXMLElements[i].getContent();
  }
  titleXMLElements = rss_business.getChildren("channel/item/title");
  linkXMLElements = rss_business.getChildren("channel/item/link");
  for (int i = 0; i < 10; i++) {  
    titles[3][i] = titleXMLElements[i].getContent();
    links[3][i] = linkXMLElements[i].getContent();
  }
  titleXMLElements = rss_sports.getChildren("channel/item/title");
  linkXMLElements = rss_sports.getChildren("channel/item/link");
  for (int i = 0; i < 10; i++) {  
    titles[4][i] = titleXMLElements[i].getContent();
    links[4][i] = linkXMLElements[i].getContent();
  }
  titleXMLElements = rss_opinion.getChildren("channel/item/title");
  linkXMLElements = rss_opinion.getChildren("channel/item/link");
  for (int i = 0; i < 10; i++) {  
    titles[5][i] = titleXMLElements[i].getContent();
    links[5][i] = linkXMLElements[i].getContent();
  }
  ///////////////////////

  loading=0;
}

public void bg() {
  int linelength=25;

  background(0xffFFFFFF);
  rect(offset,offset,-1,-linelength);
  rect(offset,offset,-linelength,-1);

  rect(width-offset,offset,1,-linelength);
  rect(width-offset,offset,linelength,-1);

  rect(offset,height-offset,-1,linelength);
  rect(offset,height-offset,-linelength,1);

  rect(width-offset,height-offset,1,linelength);
  rect(width-offset,height-offset,linelength,1);

  textFont(sans);
  fill(0xff000000);
  textSize(12);
  textAlign(CENTER);
  text("The News Arcade                     The New York Times", width/2, 35);

  textFont(italic);
  textSize(10);
  text("powered by", width/2 - 7,35);
  
  text("You have read " + read + " articles and ignored " + ignored + " articles, " + rating, width/2,height-35);
}

public void bg2() {
  int linelength=25;

  fill(0xff000000,210);
  rect(0,0,width,height);
  fill(0xffFFFFFF);
  rect(offset,offset,-1,-linelength);
  rect(offset,offset,-linelength,-1);

  rect(width-offset,offset,1,-linelength);
  rect(width-offset,offset,linelength,-1);

  rect(offset,height-offset,-1,linelength);
  rect(offset,height-offset,-linelength,1);

  rect(width-offset,height-offset,1,linelength);
  rect(width-offset,height-offset,linelength,1);

  textFont(sans);
  textSize(12);
  textAlign(CENTER);
  text("The News Arcade                     The New York Times", width/2, 35);

  textFont(italic);
  textSize(10);
  text("powered by", width/2 - 7,35);
}

public void popup() {
   int temptopic=balls[selected].topic;
   String sectionline=sections[temptopic];
   String headline=balls[selected].title;
    if (popup==1){
    arrows.c=0xffFFFFFF;
    moving=0;
    bg2();
    textAlign(LEFT,TOP);
    textFont(sans);
    textSize(12);
    text(sectionline,130,130);//draw the label
    fill(0xffFFFFFF);
    textFont(bigserif);
    textSize(36);
    text(headline,130,160,500,500);//draw the label

    int temptotal=totalballs;
    for (int i = totalballs+1; i<totalballs+3; i++) {
      balls[i].exist=true;
      balls[i].topic=6;
      balls[i].diam=100;
      balls[i].url=balls[selected].url;
      balls[i].collide();
      balls[i].move();
      balls[i].display();
    }
    balls[totalballs+1].title="Read Article";
    balls[totalballs+2].title="Whatever";
    }
    else {}
  }

  public void nopopup() {
    bg();
      balls[totalballs+1].exist=false;
            balls[totalballs+2].exist=false;
    arrows.c=0xff000000;
    moving=1;
    popup=0;
  }
  static public void main(String args[]) {
    PApplet.main(new String[] { "--present", "--bgcolor=#666666", "--stop-color=#cccccc", "Asteroids_nyt5" });
  }
}
