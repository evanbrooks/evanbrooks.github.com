void bg() {
  int linelength=25;

  background(#FFFFFF);
  rect(offset,offset,-1,-linelength);
  rect(offset,offset,-linelength,-1);

  rect(width-offset,offset,1,-linelength);
  rect(width-offset,offset,linelength,-1);

  rect(offset,height-offset,-1,linelength);
  rect(offset,height-offset,-linelength,1);

  rect(width-offset,height-offset,1,linelength);
  rect(width-offset,height-offset,linelength,1);

  textFont(sans);
  fill(#000000);
  textSize(12);
  textAlign(CENTER);
  text("The News Arcade                     The New York Times", width/2, 35);

  textFont(italic);
  textSize(10);
  text("powered by", width/2 - 7,35);
  
  text("You have read " + read + " articles and ignored " + ignored + " articles, " + rating, width/2,height-35);
}

void bg2() {
  int linelength=25;

  fill(#000000,210);
  rect(0,0,width,height);
  fill(#FFFFFF);
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

