void loadrss() {

  //LOADING MESSAGE

  fill(#000000);
  textFont(serif);
  textSize(10);
  textAlign(CENTER,CENTER);
  background(#FFFFFF);
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

