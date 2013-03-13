void popup() {
   int temptopic=balls[selected].topic;
   String sectionline=sections[temptopic];
   String headline=balls[selected].title;
    if (popup==1){
    arrows.c=#FFFFFF;
    moving=0;
    bg2();
    textAlign(LEFT,TOP);
    textFont(sans);
    textSize(12);
    text(sectionline,130,130);//draw the label
    fill(#FFFFFF);
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

  void nopopup() {
    bg();
      balls[totalballs+1].exist=false;
            balls[totalballs+2].exist=false;
    arrows.c=#000000;
    moving=1;
    popup=0;
  }
