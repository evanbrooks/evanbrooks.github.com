//DETECT KEY PRESSES
void keyPressed() {
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
void keyReleased() {
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

