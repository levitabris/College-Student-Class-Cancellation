
var data = {};
var img;
var boundaries;



function preload(){ // asynchronized file load
  var url = "d/stripped_combinedFile.json";
  data = loadJSON(url);
  img = loadImage("img/map.png");

}

function setup(){

  createCanvas(windowWidth, windowHeight, WEBGL);
  ambientLight(195);
  boundaries = getBoundaries(data);
  //console.log(getBoundaries(data));

}

function draw(){

  var areaCenter = [(boundaries.lng.max + boundaries.lng.min)/2,(boundaries.lat.max + boundaries.lat.min)/2].join(",");
  var projCenter = project(areaCenter);
  //console.log(projCenter);
  translate(-projCenter.xPos,-projCenter.yPos+windowHeight*0.4,-1200);
  orbitControl();

  //adjust the 3d scene
  rotateZ(PI*0.03);
  rotateY(PI*0.3 - abs(sin(frameCount*0.0007*PI)) );
  rotateX(-PI*0.17 - abs(sin(frameCount*0.0007*PI)) );

  push();
  translate(350,350,0);
  texture(img);
  plane(700, 700);
  pop();
  push();
  ambientMaterial(56,56,125);
  translate(350,350,-1);
  plane(710, 710);
  pop();

  drawGeometry();

}

function getBoundaries(JSONData) {
  var lng = [];
  var lat = [];
  for (var i = JSONData.length - 1; i >= 0; i--) {
    if (JSONData[i].location && JSONData[i].location != "Unknown") {
    var lnglat = split(JSONData[i].location, ",");
    append(lng,lnglat[0]);
    append(lat,lnglat[1]);
    }
  }

  var returnValue = {
    lat:{},
    lng:{}
  }

  returnValue.lat.max = Math.max.apply(Math,lat);
  returnValue.lat.min = Math.min.apply(Math,lat);
  returnValue.lng.max = Math.max.apply(Math,lng);
  returnValue.lng.min = Math.min.apply(Math,lng);

  return returnValue;
}

function project(location, area) {
  area = area || data;
  var Plnglat = split(location,",");
  var maxMin = getBoundaries(area);
  var pos = {}
  pos.xPos = Plnglat[1];
  pos.yPos = Plnglat[0];
  xyRatio = (maxMin.lat.max - maxMin.lat.min)/(maxMin.lng.max - maxMin.lng.min);
  pos.xPos = map(Plnglat[1], maxMin.lat.max, maxMin.lat.min, 40, windowHeight - 40);
  pos.yPos = map(Plnglat[0], maxMin.lng.max, maxMin.lng.min, 40, (windowHeight - 40)*xyRatio);
  return pos; 
}

function drawGeometry() {
    for (var i = data.length - 1; i >= 0; i--) {
      if (data[i].location && data[i].location != "Unknown") {
        var projection = project(data[i].location);
        push();
        translate(projection.xPos, projection.yPos, abs(sin(frameCount*0.0007*PI))*160 - (data[i].resp_time-1366600000)/9000 );
        colorMode(HSB);
        ambientMaterial(data[i].uid*7,60,220);
        box(10,10,2);
        pop();
      }
    }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  redraw();
}