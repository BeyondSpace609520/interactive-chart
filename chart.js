var setViewportX = 150;
var setViewportY = 150;
var isDraw;
var setMarkedSection;
var savedPoints;
var totalRadius;
var headingRadius;
var eachRadius;
var selectionAreas = ['your_fake_', 'family_fake_', 'work_fake_', 'goals_fake_', 'env_fake_'];
var markLines = ['your_', 'family_', 'work_', 'goals_', 'env_'];

function polarToCartesian(centerX, centerY, radius, angleInDegrees) { // Point of Polar
  var angleInRadians = (angleInDegrees - 90) * Math.PI / 180.0;

  return {
    x: centerX + (radius * Math.cos(angleInRadians)) + setViewportX,
    y: centerY + (radius * Math.sin(angleInRadians)) + setViewportY
  };
}

function describeArc(x, y, radius, startAngle, endAngle) { //Not Closed Path
  var start = polarToCartesian(x, y, radius, endAngle);                                                                              
  var end = polarToCartesian(x, y, radius, startAngle);

  var largeArcFlag = endAngle - startAngle <= 180 ? "0" : "1";

  var d = [
    "M", start.x, start.y, 
    "A", radius, radius, 0, largeArcFlag, 0, end.x, end.y
  ].join(" ");

  return d;
}

function describeSelectableArea(x, y, radius, startAngle, endAngle) { //Closed Path with 4 Points
  var start1 = polarToCartesian(x, y, radius, endAngle);                                                                              
  var end1 = polarToCartesian(x, y, radius, startAngle);

  var start2 = polarToCartesian(x, y, radius + eachRadius, endAngle);                                                                              
  var end2 = polarToCartesian(x, y, radius + eachRadius, startAngle);

  var largeArcFlag = endAngle - startAngle <= 180 ? "0" : "1";

  var d = [
    "M", start1.x, start1.y, 
    "A", radius, radius, 0, largeArcFlag, 0, end1.x, end1.y,
    "L", end2.x, end2.y,
    "A", radius + eachRadius, radius + eachRadius, 0, largeArcFlag, 1, start2.x, start2.y,
  ].join(" ");

  return d;
}

function describeSelectableAreaForOrigin(x, y, startAngle, endAngle) { //Closed Path with 4 Points
  var start = polarToCartesian(x, y, eachRadius, endAngle);                                                                              
  var end = polarToCartesian(x, y, eachRadius, startAngle);

  var largeArcFlag = endAngle - startAngle <= 180 ? "0" : "1";

  var d = [
    "M", x, y,
    "L", start.x, start.y,
    "A", eachRadius, eachRadius, 0, largeArcFlag, 0, end.x, end.y,
    "L", x, y,
    "Z"
  ].join(" ");

  return d;
}

function describeInversedArc(x, y, radius, startAngle, endAngle) { //Inversed Path
  var start = polarToCartesian(x, y, radius, endAngle);
  var end = polarToCartesian(x, y, radius, startAngle);

  var largeArcFlag = endAngle - startAngle <= 180 ? "0" : "1";

  var d = [
    "M", start.x, start.y, 
    "A", radius, radius, 0, largeArcFlag, 1, end.x, end.y
  ].join(" ");

  return d;
}

function describeArea(x, y, radius, startAngle, endAngle) { //Closed Path wtih 2 Polar points with origin point
  var start = polarToCartesian(x, y, radius, endAngle);
  var end = polarToCartesian(x, y, radius, startAngle);

  var largeArcFlag = endAngle - startAngle <= 180 ? "0" : "1";

  var d = [
    "M", setViewportX * 2, setViewportY * 2,
    "L", start.x, start.y, 
    "A", radius, radius, 0, largeArcFlag, 0, end.x, end.y,
    "Z"
  ].join(" ");

  return d;
}

window.onload = function() {
  isDraw = 1;
  savedPoints = [];
  if (window.matchMedia('screen and (min-device-width : 220px) and (max-device-width : 550px)').matches) {
    totalRadius = 144;
    document.getElementById('watermark').setAttribute('x', '200');
    document.getElementById('watermark').setAttribute('y', '305');
  } else {
    totalRadius = 225;
    document.getElementById('watermark').setAttribute('x', '140');
    document.getElementById('watermark').setAttribute('y', '305');
  }

  headingRadius = totalRadius / 9;
  eachRadius = (totalRadius - headingRadius) / 11;
  
  setMarkedSection = 1;

  document.getElementById('start').setAttribute('x', setViewportX * 2 + eachRadius * 2);
  document.getElementById('start').setAttribute('y', setViewportY * 2 - eachRadius * 4.5);

  document.getElementById("arc6").setAttribute("d", describeArea(setViewportX, setViewportY, totalRadius - headingRadius, 0, 72));
  document.getElementById("arc7").setAttribute("d", describeArea(setViewportX, setViewportY, totalRadius - headingRadius, 72, 144));
  document.getElementById("arc8").setAttribute("d", describeArea(setViewportX, setViewportY, totalRadius - headingRadius, 144, 216));
  document.getElementById("arc9").setAttribute("d", describeArea(setViewportX, setViewportY, totalRadius - headingRadius, 216, 288));
  document.getElementById("arc10").setAttribute("d", describeArea(setViewportX, setViewportY, totalRadius - headingRadius, 288, 360));

  //YOURSELF
  document.getElementById("arc1").setAttribute("d", describeInversedArc(setViewportX, setViewportY, totalRadius, 71.5, 0));
  //FAMILY
  document.getElementById("arc2").setAttribute("d", describeArc(setViewportX, setViewportY, totalRadius, 72, 143.5));
  //WORK
  document.getElementById("arc3").setAttribute("d", describeArc(setViewportX, setViewportY, totalRadius, 144, 215.5));
  //GOALS
  document.getElementById("arc4").setAttribute("d", describeArc(setViewportX, setViewportY, totalRadius, 216, 287.5));
  //ENVIRONMENT
  document.getElementById("arc5").setAttribute("d", describeInversedArc(setViewportX, setViewportY, totalRadius, 359.5, 288));

  document.getElementById("arc1").setAttribute("stroke-width", headingRadius * 2);
  document.getElementById("arc2").setAttribute("stroke-width", headingRadius * 2);
  document.getElementById("arc3").setAttribute("stroke-width", headingRadius * 2);
  document.getElementById("arc4").setAttribute("stroke-width", headingRadius * 2);
  document.getElementById("arc5").setAttribute("stroke-width", headingRadius * 2);

  var i, j, seg_id, seg_rad;

  // Set markLines and selectable Areas
  for(i = 1; i <= 10; i ++) {
    for(j = 0; j < 5; j ++) {
      seg_id = markLines[j] + i;
      seg_rad = eachRadius * (i);

      document.getElementById(seg_id).setAttribute("d", describeArea(setViewportX, setViewportY, seg_rad, 72 * j, 72 * (j + 1)));
      document.getElementById(seg_id).setAttribute('onclick', 'getMarkedPoint(' + (j + 1) + ',' + i + ')');

      seg_id = selectionAreas[j] + i;

      if(i == 0)
        document.getElementById(seg_id).setAttribute("d", describeSelectableAreaForOrigin(setViewportX, setViewportY, 72 * j, 72 * (j + 1)));
      else
        document.getElementById(seg_id).setAttribute("d", describeSelectableArea(setViewportX, setViewportY, seg_rad - eachRadius, 72 * j, 72 * (j + 1)));
      
      document.getElementById(seg_id).setAttribute('onclick', 'getMarkedPoint(' + (j + 1) + ',' + i + ')');
    }
  }

  // Set 1, 5, 10 Dots.
  var pre_dots = [1, 5, 10];
  for(i = 1; i <= 5; i ++) {
    for(j = 0; j < 3; j ++) {
      seg_id = "dot_" + i + "_" + pre_dots[j];
      seg_rad = eachRadius * (pre_dots[j]);

      var prept = polarToCartesian(setViewportX, setViewportY, seg_rad, (i - 1) * 72);
      document.getElementById(seg_id).setAttribute("cx", prept.x);
      document.getElementById(seg_id).setAttribute("cy", prept.y);
    }
  }

  // Set 1, 5, 10 Labels.
  for(i = 1; i <= 5; i ++) {
    for(j = 0; j < 3; j ++) {
      seg_id = "label_" + i + "_" + pre_dots[j];
      seg_rad = eachRadius * pre_dots[j];

      var prept = polarToCartesian(setViewportX, setViewportY, seg_rad, (i - 1) * 72);
      document.getElementById(seg_id).setAttribute("x", prept.x + 8);
      document.getElementById(seg_id).setAttribute("y", prept.y + 5);
      document.getElementById(seg_id).textContent = pre_dots[j]; 

      var rotation;
      rotation = "rotate(" + 72 * (i - 1) + "," + prept.x + "," + prept.y + ")";
      document.getElementById(seg_id).setAttribute("transform", rotation);
    }
  }

  for(i = 1; i <= 10; i ++) {
    for(j = 0; j < 5; j ++) {
      seg_id = selectionAreas[j] + i;

      document.getElementById(seg_id).setAttribute("onmouseenter", "hoverHeadings(" + (j + 1) + ", " + (i) + ")");
      document.getElementById(seg_id).setAttribute("onmouseleave", "releaseHeadings(" + (j + 1) + ", " + (i) + ")");
    }
  }
};

function getMarkedPoint(sectionId, levelId) {
  var mark;

  if(sectionId == 1) //Disappear "Start" on First Section
    document.getElementById('start').textContent = '';

  if(isDraw == 0) {
    markPoint(sectionId, levelId);
    drawRadarChart();
    return;
  }

  if(setMarkedSection > sectionId) {
    markPoint(sectionId, levelId);
    savedPoints[sectionId - 1] = levelId;

    var deltaRadius;
    deltaRadius = levelId * eachRadius / 15;

    var intervalId;
    var animate = 0;

    intervalId = setInterval(function(){
      var region_id;
      region_id = "last_region_" + sectionId;

      document.getElementById(region_id).setAttribute("d", 
        describeArea(setViewportX, setViewportY, deltaRadius * animate, (sectionId - 1) * 72, sectionId * 72));

      animate += 1;
      if(animate > 15)
        clearInterval(intervalId);
    }, 10);
    return;
  }

  if(setMarkedSection != sectionId)
    return;

  var oldSection = "arc" + parseInt(setMarkedSection + 5);
  setMarkedSection = parseInt(sectionId + 1);

  var newSection = "arc" + parseInt(setMarkedSection + 5);
  if(setMarkedSection >= 6)
    document.getElementById(oldSection).setAttribute('class', '');
  else {
    document.getElementById(oldSection).setAttribute('class', '');
    document.getElementById(newSection).setAttribute('class', 'fading-segment');
  }

  var pathId = markLines[sectionId - 1] + levelId;
  document.getElementById(pathId).setAttribute('class', '');

  markPoint(sectionId, levelId);

  var deltaRadius;
  deltaRadius = levelId * eachRadius / 15;

  var intervalId;
  var animate = 0;

  intervalId = setInterval(function(){
    var region_id;
    region_id = "last_region_" + sectionId;

    document.getElementById(region_id).setAttribute("d", 
      describeArea(setViewportX, setViewportY, deltaRadius * animate, (sectionId - 1) * 72, sectionId * 72));

    animate += 1;
    if(animate > 15)
      clearInterval(intervalId);
  }, 10);

  savedPoints.push(levelId)

  if(setMarkedSection >= 6)
    drawRadarChart();
}

function markPoint(sectionId, levelId) {
  var circleId = "circle" + sectionId;
  var mark_radius = 36 + (sectionId - 1) * 72;

  mark = polarToCartesian(setViewportX, setViewportY, levelId * eachRadius, mark_radius);
  
  document.getElementById(circleId).setAttribute("cx", mark.x);
  document.getElementById(circleId).setAttribute("cy", mark.y);
  document.getElementById(circleId).setAttribute("stroke", "white");
  document.getElementById(circleId).setAttribute("fill", "blue");
}

function drawRadarChart() {
  var pts = [
    {x: document.getElementById("circle1").getAttribute("cx"), y: document.getElementById("circle1").getAttribute("cy")},
    {x: document.getElementById("circle2").getAttribute("cx"), y: document.getElementById("circle2").getAttribute("cy")},
    {x: document.getElementById("circle3").getAttribute("cx"), y: document.getElementById("circle3").getAttribute("cy")},
    {x: document.getElementById("circle4").getAttribute("cx"), y: document.getElementById("circle4").getAttribute("cy")},
    {x: document.getElementById("circle5").getAttribute("cx"), y: document.getElementById("circle5").getAttribute("cy")}
  ];

  var deltaPos = [];
  for(var i = 0; i < 5; i ++) {
    deltaPos[i] = {x: (pts[i].x - setViewportX * 2) / 30, y: (pts[i].y - setViewportY * 2) / 30};
  }

  var intervalId;
  var animate = 0;

  intervalId = setInterval(function(){
    var d = [
      "M", setViewportX * 2 + deltaPos[0].x * animate, setViewportY * 2 + deltaPos[0].y * animate,
      "L", setViewportX * 2 + deltaPos[1].x * animate, setViewportY * 2 + deltaPos[1].y * animate,
      "L", setViewportX * 2 + deltaPos[2].x * animate, setViewportY * 2 + deltaPos[2].y * animate,
      "L", setViewportX * 2 + deltaPos[3].x * animate, setViewportY * 2 + deltaPos[3].y * animate,
      "L", setViewportX * 2 + deltaPos[4].x * animate, setViewportY * 2 + deltaPos[4].y * animate,
      "L", setViewportX * 2 + deltaPos[0].x * animate, setViewportY * 2 + deltaPos[0].y * animate,
      "Z"
    ].join(" ");
    animate += 1;

    document.getElementById("chart").setAttribute("d", d);
    document.getElementById("chart").setAttribute("stroke", "blue");
    document.getElementById("chart").setAttribute("fill", "#67e063");

    var region_id;

    if(isDraw == 1) {
      for(i = 1; i <= 5; i ++) {      
        region_id = "last_region_" + i;
        deltaRadius = savedPoints[i - 1] * eachRadius / 30;
        document.getElementById(region_id).setAttribute("d", 
        describeArea(setViewportX, setViewportY, savedPoints[i - 1] * eachRadius - animate * deltaRadius, (i - 1) * 72, i * 72));
      }
    } else {
      for(i = 1; i <= 5; i ++) {      
        region_id = "last_region_" + i;
        deltaRadius = savedPoints[i - 1] * eachRadius / 30;
        document.getElementById(region_id).setAttribute("fill", 'none');
      }
    }

    if(animate > 30)
      clearInterval(intervalId);
  }, 10);
  isDraw = 0;
//  releaseHeadings(5, 1);
}

function startNewDraw() {
  document.getElementById("arc6").setAttribute("class", "fading-segment");
  document.getElementById("arc7").setAttribute("class", "");
  document.getElementById("arc8").setAttribute("class", "");
  document.getElementById("arc9").setAttribute("class", "");
  document.getElementById("arc10").setAttribute("class", "");

  document.getElementById("chart").setAttribute("stroke", "transparent");
  document.getElementById("chart").setAttribute("fill", "transparent");

  for(var i = 1; i <=5; i ++) {
    var circleId = "circle" + i;

    document.getElementById(circleId).setAttribute("stroke", "transparent");
    document.getElementById(circleId).setAttribute("fill", "transparent");
  }

  isDraw = 1; 
  setMarkedSection = 1;
  savedPoints = [];

  document.getElementById('start').setAttribute('x', setViewportX * 2 + eachRadius * 1.8);
  document.getElementById('start').setAttribute('y', setViewportY * 2 - eachRadius * 4.5);

  document.getElementById('start').textContent = 'START';

  document.getElementById('last_region_1').setAttribute('fill', '#20AFE3');
  document.getElementById('last_region_2').setAttribute('fill', '#EB2A23');
  document.getElementById('last_region_3').setAttribute('fill', '#9998A6');
  document.getElementById('last_region_4').setAttribute('fill', '#20AFE3');
  document.getElementById('last_region_5').setAttribute('fill', '#EB2A23');

  var initialPath = "M 0 0 L 0 0 Z";

  document.getElementById('last_region_1').setAttribute('d', initialPath);
  document.getElementById('last_region_2').setAttribute('d', initialPath);
  document.getElementById('last_region_3').setAttribute('d', initialPath);
  document.getElementById('last_region_4').setAttribute('d', initialPath);
  document.getElementById('last_region_5').setAttribute('d', initialPath);
}

function hoverHeadings(sectionId, levelId) {
  if(isDraw == 0) {
    return;
  }

  var headingId = "arc" + sectionId;
  document.getElementById(headingId).setAttribute('stroke-opacity', 0.5);
  
  if(setMarkedSection != sectionId)
    return;

  var pathId;
  for(var i = 1; i <= 10; i ++) {
    pathId = markLines[sectionId - 1] + i;
    document.getElementById(pathId).setAttribute('class', '');

    if(i == levelId)
      document.getElementById(pathId).setAttribute('class', 'fading-segment');
  }

  var setMarkedSectionId = "arc" + parseInt(setMarkedSection + 5);
  document.getElementById(setMarkedSectionId).setAttribute('class', '');
}

function releaseHeadings(sectionId, levelId) {
  var headingId = "arc" + sectionId;
  
  document.getElementById(headingId).setAttribute('stroke-opacity', 1);

  var pathId = markLines[sectionId - 1] + levelId;
  document.getElementById(pathId).setAttribute('class', '');
}