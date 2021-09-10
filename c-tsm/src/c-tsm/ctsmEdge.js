var LEdge = require('cose-base').layoutBase.LEdge;
var IGeometry = require('cose-base').layoutBase.IGeometry;
const PointD = require('cose-base').layoutBase.PointD;
const DimensionD = require('cose-base').layoutBase.DimensionD;

function ctsmEdge(source, target, vEdge) 
{
  LEdge.call(this, source, target, vEdge);
  this.weight = 0.5;
  this.distance = 0;

  //each entry in this.bendpoint contains [bendpoint, [dir1, dir2], [node1, node2]]
  this.bendpoints = [];

  //stores the location of the ports on the source or target (if any) 
  this.sourcePort = null;
  this.targetPort = null;

  this.parentEdge = null;
  this.parentNode = null;

  this.sourcePoint = null;
  this.targetPoint = null;
}

ctsmEdge.prototype = Object.create(LEdge.prototype);
for (var prop in LEdge) 
{
  ctsmEdge[prop] = LEdge[prop];
}

ctsmEdge.prototype.getEndpoint = function(node1Bbox, node2Loc) 
{
  let x = node2Loc.x;
  let y = node2Loc.y;

  //center of the node
  var midX = (node1Bbox.x1 + node1Bbox.x2) / 2;
  var midY = (node1Bbox.y1 + node1Bbox.y2) / 2;

  //slope of the line from source to target
  var m = (midY - y) / (midX - x);

  let endpoint;

  if (x <= midX) 
  { // check "left" side
    var minXy = m * (node1Bbox.x1 - x) + y;
    if (node1Bbox.y1 <= minXy && minXy <= node1Bbox.y2)
      endpoint = {x: node1Bbox.x1, y: minXy};
  }

  if (x >= midX) 
  { // check "right" side
    var maxXy = m * (node1Bbox.x2 - x) + y;
    if (node1Bbox.y1 <= maxXy && maxXy <= node1Bbox.y2)
      endpoint = {x: node1Bbox.x2, y: maxXy};
  }

  if (y <= midY) 
  { // check "top" side
    var minYx = (node1Bbox.y1 - y) / m + x;
    if (node1Bbox.x1 <= minYx && minYx <= node1Bbox.x2)
      endpoint = {x: minYx, y: node1Bbox.y1};
  }

  if (y >= midY) 
  { // check "bottom" side
    var maxYx = (node1Bbox.y2 - y) / m + x;
    if (node1Bbox.x1 <= maxYx && maxYx <= node1Bbox.x2)
      endpoint = {x: maxYx, y: node1Bbox.y2};
  }

  return endpoint;

}

ctsmEdge.prototype.sourceEndpoint = function() 
{
  //this assumes that the source or target of the edge is a rectangular node

  var sourceEndpoint = this.getEndpoint(this.source.getBbox(), this.target.getCenter());
  return sourceEndpoint;
};

ctsmEdge.prototype.targetEndpoint = function() 
{
  //this assumes that the source or target of the edge is a rectangular node

  let targetEndpoint = this.getEndpoint(this.target.getBbox(), this.source.getCenter());
  return targetEndpoint;
};

/*Get the other end to which an edge is connected with*/
ctsmEdge.prototype.getOtherEnd = function(node)
{
  if (node === this.source && node === this.target)
  {
    return null;
  }
  else if (node === this.source)
  {
    return this.target;
  }
  else if (node === this.target)
  {
    return this.source;
  }
};

ctsmEdge.prototype.convertToRelativeBendPosition = function() 
{
  var srcTgtPointsAndTangents = this.getSrcTgtPointsAndTangents(this);

  let edgeWeight = "";
  let edgeDistance = "";

  for (let i = 0; i < this.bendpoints.length; i++)
  {
    let bendpoint = this.bendpoints[i];

    var intersectionPoint = this.getIntersection(bendpoint, srcTgtPointsAndTangents);
    var intersectX = intersectionPoint.x;
    var intersectY = intersectionPoint.y;
    
    var srcPoint = srcTgtPointsAndTangents.srcPoint;
    var tgtPoint = srcTgtPointsAndTangents.tgtPoint;
    
    var weight;
    
    if( intersectX != srcPoint.x ) {
      weight = (intersectX - srcPoint.x) / (tgtPoint.x - srcPoint.x);
    }
    else if( intersectY != srcPoint.y ) {
      weight = (intersectY - srcPoint.y) / (tgtPoint.y - srcPoint.y);
    }
    else {
      weight = 0;
    }
    
    var distance = Math.sqrt(Math.pow((intersectY - bendpoint.y), 2) + Math.pow((intersectX - bendpoint.x), 2));
    
    //Get the direction of the line form source point to target point
    var dir1 = this.getLineDirection(srcPoint, tgtPoint);
    //Get the direction of the line from intesection point to bend point
    var dir2 = this.getLineDirection(intersectionPoint, bendpoint);
    
    //If the difference is not -2 and not 6 then the direction of the distance is negative
    if(dir1 - dir2 != -2 && dir1 - dir2 != 6)
    {
      if(distance != 0)
      {
        distance = -1 * distance;
      }
    }

    bendpoint.weight = weight;
    bendpoint.distance = distance;
    bendpoint.ownerEdge = this;

    edgeWeight = edgeWeight.concat(weight.toString()).concat(" ");
    edgeDistance = edgeDistance.concat(distance.toString()).concat(" ");
  }

  this.weight = edgeWeight;
  this.distance = edgeDistance;

};

ctsmEdge.prototype.getLineDirection = function(srcPoint, tgtPoint)
{
  if(srcPoint.y == tgtPoint.y && srcPoint.x < tgtPoint.x){
    return 1;
  }
  if(srcPoint.y < tgtPoint.y && srcPoint.x < tgtPoint.x){
    return 2;
  }
  if(srcPoint.y < tgtPoint.y && srcPoint.x == tgtPoint.x){
    return 3;
  }
  if(srcPoint.y < tgtPoint.y && srcPoint.x > tgtPoint.x){
    return 4;
  }
  if(srcPoint.y == tgtPoint.y && srcPoint.x > tgtPoint.x){
    return 5;
  }
  if(srcPoint.y > tgtPoint.y && srcPoint.x > tgtPoint.x){
    return 6;
  }
  if(srcPoint.y > tgtPoint.y && srcPoint.x == tgtPoint.x){
    return 7;
  }
  return 8;//if srcPoint.y > tgtPoint.y and srcPoint.x < tgtPoint.x
};

ctsmEdge.prototype.getSrcTgtPointsAndTangents = function()
{
  let srcPoint = this.source.getCenter();
  let tgtPoint = this.target.getCenter();

  //m1 is the slope of the line passing through source and target
  var m1 = (tgtPoint.y - srcPoint.y) / (tgtPoint.x - srcPoint.x);

  return {
    m1: m1,
    m2: -1 / m1,
    srcPoint: srcPoint,
    tgtPoint: tgtPoint
  };
};

ctsmEdge.prototype.getIntersection = function(point, srcTgtPointsAndTangents)
{
  var srcPoint = srcTgtPointsAndTangents.srcPoint;
  var tgtPoint = srcTgtPointsAndTangents.tgtPoint;
  var m1 = srcTgtPointsAndTangents.m1;
  var m2 = srcTgtPointsAndTangents.m2;

  var intersectX;
  var intersectY;

  if(m1 == Infinity || m1 == -Infinity){
    intersectX = srcPoint.x;
    intersectY = point.y;
  }
  else if(m1 == 0){
    intersectX = point.x;
    intersectY = srcPoint.y;
  }
  else {
    //y-intercept or c for the line passing between the source point and the target point
    //y-intersect is the intersecting point of the line and the y-axis
    var a1 = srcPoint.y - m1 * srcPoint.x;

    //y-intercept or c for the line perpendicular to the line passing between the source point and the target point
    //since line2 is perpendicular to line 1, its slope will be m2
    var a2 = point.y - m2 * point.x;

    //now we must find the point of intersection of line 1 and line 2
    //formula for findinf value of x
    intersectX = (a2 - a1) / (m1 - m2);

    //plugging back the value of x in equation of line 1 to get the value of y
    intersectY = m1 * intersectX + a1;
  }

  //Intersection point is the intersection of the lines passing through the nodes and
  //passing through the bend point and perpendicular to the other line
  var intersectionPoint = {
    x: intersectX,
    y: intersectY
  };
  
  return intersectionPoint;
};

module.exports = ctsmEdge;
