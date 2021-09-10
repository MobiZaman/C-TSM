var LNode = require('cose-base').layoutBase.LNode;
var IMath = require('cose-base').layoutBase.IMath;
const PointD = require('cose-base').layoutBase.PointD;
const LayoutConstants = require('cose-base').layoutBase.LayoutConstants;
const DimensionD = require('cose-base').layoutBase.DimensionD;
const cc = require('../c-tsm/ctsmConstants');

function ctsmNode(gm, loc, size, vNode) 
{
  LNode.call(this, gm, loc, size, vNode);
  this.isDummy = false;
  this.parentNode = null;
  this.isCmpdBoundaryNode = false;
  this.boundaryList = [];
  this.connectedEdges = [];
  this.dummyOwner = null;
}

ctsmNode.prototype = Object.create(LNode.prototype);
for (var prop in LNode) {
  ctsmNode[prop] = LNode[prop];
}

ctsmNode.prototype.getParentNode = function()
{
    return this.parentNode;
};

ctsmNode.prototype.getArea = function()
{
  return (this.getWidth() * this.getHeight());
};

ctsmNode.prototype.getChildren = function()
{
  let children = null;

  if (this.isCompound())
  {
    return this.child.nodes;
  }
};

ctsmNode.prototype.compactNode = function(iel, simpleGm)
{
    if (!this.isCompound())
      return;

    let x1 = Number.MAX_VALUE;
    let x2 = Number.MIN_VALUE;
    let y1 = Number.MAX_VALUE;
    let y2 = Number.MIN_VALUE;

    let children = this.getChildren();
    for (let i = 0; i < children.length; i++)
    {
        let child = children[i];
        if (!child.isCompound())
        {
          let pos = child.getCenter();
          if (pos.x < x1)
            x1 = pos.x;
          if (pos.x > x2)
            x2 = pos.x;
          if (pos.y < y1)
            y1 = pos.y;
          if (pos.y > y2)
            y2 = pos.y;
        }
        else
        {
          let bbox = child.getBbox();
          if (bbox.x1 < x1)
            x1 = bbox.x1
          if (bbox.x2 > x2)
            x2 = bbox.x2;
          if (bbox.y1 < y1)
            y1 = bbox.y1;
          if (bbox.y2 > y2)
            y2 = bbox.y2;
        }
    }

    let cdRemoval = false;
    //remove dummy edge crossings from boundary list
    for (let j = 0; j < this.boundaryList.length; j++)
    {
      let bdnode = this.boundaryList[j];
      if (bdnode.id.includes("cdnode"))
      {
        this.boundaryList.splice(j, 1);
        cdRemoval = true;
        j--;
      }
    }

    let tempList = [];
    //add dummy nodes for bendpoints
    let bpsAddition = false;
    for (let j = 0; j < this.boundaryList.length; j++)
    {
      let bdNode1 = this.boundaryList[j];
      let bdNode2;
      if (j != this.boundaryList.length - 1)
        bdNode2 = this.boundaryList[j + 1];
      else
        bdNode2 = this.boundaryList[0];

      tempList.push(bdNode1);

      let edge = bdNode1.findEdgeBetween(bdNode2);
      if (edge != null && edge.bendpoints.length > 0)
      {
        let bps = edge.bendpoints;
        for (let k = 0; k < bps.length; k++)
        {
          let bp = bps[k];
          let parent = simpleGm.getRoot();
          let newNode = parent.add(new ctsmNode(simpleGm, {x: bp.x, y: bp.y}, new DimensionD(1, 1)));
          newNode.setCenter(bp.x, bp.y);
          newNode.isDummy = true;
          newNode.dummyOwner = this;
          newNode.isCmpdBoundaryNode = true;
          newNode.id = bp.id;
          tempList.push(newNode);
        }
      }
     
    }

    this.boundaryList = tempList;

    //recreate edges in compound boundary
    if (cdRemoval || bpsAddition)
    {
      for (let j = 0; j < this.boundaryList.length; j++)
      {
        let bdNode1 = this.boundaryList[j];
        let bdNode2;
        if (j != this.boundaryList.length - 1)
          bdNode2 = this.boundaryList[j + 1];
        else
          bdNode2 = this.boundaryList[0];

        if (bdNode1.findEdgeBetween(bdNode2) == null)
        {
          let layout = simpleGm.layout;
          let newEdge = simpleGm.add(layout.newEdge(), bdNode1, bdNode2);
          newEdge.id = bdNode1.id.concat("to").concat(bdNode2.id);
        }
      }
    }

    // crop top and bottom part of compound
    for (let i = 0; i < 4; i++)
    {
      let array = [];

      for (let j = 0; j < this.boundaryList.length; j++)
      {
        let bdnode = this.boundaryList[j];
        let nodePosition = bdnode.getCenter();
        if (i in [0, 1])  //x compaction
          array.push([nodePosition.y, bdnode]);
        else              //y compaction
          array.push([nodePosition.x, bdnode]);
      }  

      array.sort(function(a, b) {
          return a[0] - b[0];
        });

      if (i == 1 || i == 3)
        array.reverse();

      if (i == 0)
      {
        this.cropHelper(array, y1, iel, "top")
      }
      else if (i == 1)
      {
        this.cropHelper(array, y2, iel, "bottom")
      }
      else if (i == 2)
      {
        this.cropHelper(array, x1, iel, "left");
      }
      else
      {
        this.cropHelper(array, x2, iel, "right");
      }
    }

    x1 = Number.MAX_VALUE;
    x2 = Number.MIN_VALUE;
    y1 = Number.MAX_VALUE;
    y2 = Number.MIN_VALUE;

    for (let k = 0; k < this.boundaryList.length; k++)
    {
        let bdnode = this.boundaryList[k];
        let nodePosition = bdnode.getCenter();
        if (nodePosition.x < x1)
          x1 = nodePosition.x;
        if (nodePosition.x > x2)
          x2 = nodePosition.x;
        if (nodePosition.y < y1)
          y1 = nodePosition.y;
        if (nodePosition.y > y2)
          y2 = nodePosition.y;
    } 

    let center = {
      x: x1 + (x2 - x1) / 2,
      y: y1 + (y2 - y1) / 2
    };    

    //now get the new width and the height of the compound
    let w = x2 - x1;
    let h = y2 - y1;

    this.setWidth(w);
    this.setHeight(h);
    this.setCenter(center.x, center.y);
     
    
};

ctsmNode.prototype.cropHelper = function(array, childRef, iel, side)
{
  let bdLimit1 = array[0][0];
  let bdLimit2;

  let startPos = Number.MAX_VALUE;
  let endPos = Number.MIN_VALUE;

  let j = 0;
  for (j = 0; j < array.length; j++)
  {
    let pos = array[j][0];
    let condition;

    if (side == "top" || side == "left")
      condition = pos > bdLimit1;
    else
      condition = pos < bdLimit1;

    if (condition)
    {
      bdLimit2 = pos;
      break;
    }

    else
    {
      let node = array[j][1];
      let nodePos = node.getCenter();
      if (side == "top" || side == "bottom")
      {
        if (nodePos.x < startPos)
          startPos = nodePos.x;
        if (nodePos.x > endPos)
          endPos = nodePos.x;
      }
      else
      {
        if (nodePos.y < startPos)
          startPos = nodePos.y;
        if (nodePos.y > endPos)
          endPos = nodePos.y;
      }
    }
  }

  let cornerCheck = false;
  for (let i = 0; i < j; i++)
  {
    let node = array[i][1];
    let pos = node.getCenter();

    let condition;
    if (side == "top" || side == "bottom")
      condition = pos.x == startPos || pos.x == endPos;
    else
      condition = pos.y == startPos || pos.y == endPos

    if (condition)
    {
      //now check if the top corner nodes are three degree nodes
      if (node.getDegree() > 2)
      {
        let nbrs = node.getNeighbors();
        for (let k = 0; k < nbrs.length; k++)
        {
          let nbr = nbrs[k];
          if (nbr.isCmpdBoundaryNode && nbr.dummyOwner.id == this.id)
            continue;
          else
          {
            let edge = node.findEdgeBetween(nbr);
            let dir;
            if (edge.bendpoints.length == 0)
              dir = this.direction(node.getCenter(), nbr.getCenter());
            else
            {
              if (edge.source == node)
                dir = this.direction(node.getCenter(), edge.bendpoints[0]);
              else
                dir = this.direction(node.getCenter(), edge.bendpoints[edge.bendpoints.length - 1]);
            }
            if (side == "top" || side == "bottom")
            {
              if (dir == 0 || dir == 2) //then there are nodes connected to the other side
              {
                cornerCheck = true;                 //so node cannot be shrank
                break;
              }
            }
            else
            {
              if (dir == 1 || dir == 3) //then there are nodes connected to the other side
              {
                cornerCheck = true;                 //so node cannot be shrank
                break;
              }
            }
          }
        }
      }
      if (cornerCheck)
        break;
    }
  }
  if (cornerCheck)
    return;

  let chosenRef;
  if (side == "top" || side == "left") 
    chosenRef = Math.min(childRef, bdLimit2);
  else
    chosenRef = Math.max(childRef, bdLimit2);

  if (chosenRef == childRef)
  {
    let diff = Math.abs(chosenRef - bdLimit1);
    if (diff > iel)
    {
      //all boundary node with y value of bdLimit1 lie on the top boundary and can be moved downwards
      //determine the new position of the boundary
      for (let i = 0; i < array.length; i++)
      {
        let row = array[i];
        let pos = row[0];
        let node = row[1];
        let nodePos = node.getCenter();
        if (side == "top" || side == "left")
        {
          let cropLimit = chosenRef - iel;
          if (pos < cropLimit)
          {
            if (side == "top")
              node.setCenter(nodePos.x, cropLimit);
            else
              node.setCenter(cropLimit, nodePos.y);
          }
        }
        else
        {
          let cropLimit = chosenRef + iel;
          if (pos > cropLimit)
          {
            if (side == "bottom")
              node.setCenter(nodePos.x, cropLimit);
            else
              node.setCenter(cropLimit, nodePos.y);
          }
        }
      }
    }
  }
  else
  {
    cornerCheck = false;
    for (j; j < array.length; j++)
    {
      let pos = array[j][0];
      let node = array[j][1];
      let condition;

      if (side == "top" || side == "left")
        condition = pos < childRef;
      else
        condition = pos > childRef;

      if (condition)
      {
        if (node.getDegree() == 2)
          continue;

        let nbrs = node.getNeighbors();
        for (let k = 0; k < nbrs.length; k++)
        {
          let nbr = nbrs[k];
          if (nbr.isCmpdBoundaryNode && nbr.dummyOwner.id == this.id)
            continue;
          else
          {
            let edge = node.findEdgeBetween(nbr);
            let dir;
            if (edge.bendpoints.length == 0)
              dir = this.direction(node.getCenter(), nbr.getCenter());
            else
            {
              if (edge.source == node)
                dir = this.direction(node.getCenter(), edge.bendpoints[0]);
              else
                dir = this.direction(node.getCenter(), edge.bendpoints[edge.bendpoints.length - 1]);
            }
            if (side == "top" || side == "bottom")
            {
              if (dir == 0 || dir == 2) //then there are nodes connected to the other side
              {
                cornerCheck = true;                 //so node cannot be shrank
                bdLimit2 = pos;
                break;
              }
            }
            else
            {
              if (dir == 1 || dir == 3) //then there are nodes connected to the other side
              {
                cornerCheck = true;                 //so node cannot be shrank
                bdLimit2 = pos;
                break;
              }
            }
          }
        }
        if (cornerCheck)
          break;
      }
      else
      {
        if (side == "top" || side == "left")
          bdLimit2 = childRef - iel;
        else
          bdLimit2 = childRef + iel;
        break;
      }
    }

    for (let i = 0; i < array.length; i++)
    {
      let row = array[i];
      let pos = row[0];
      let node = row[1];
      let nodePos = node.getCenter();
      let condition;

      if (side == "top" || side == "left")
        condition = pos < bdLimit2;
      else
        condition = pos > bdLimit2;

      if (condition)
      {
        if (side == "top" || side == "bottom")
          node.setCenter(nodePos.x, bdLimit2);
        else
          node.setCenter(bdLimit2, nodePos.y);
      }
      else
        break;
    }
  }
};

ctsmNode.prototype.getChildGraphs = function () 
{  
  var childGraphsList = []; 
  var childNodes = this.getChildren();  
  for (var i = 0; i < childNodes.length; i++) 
  { 
    var child = childNodes[i];  
    if (child.isCompound()) 
    { 
      childGraphsList.push(child.child);  
      var a = child.getChildGraphs(); 
      childGraphsList = childGraphsList.concat(a);  
    } 
  } 
  return childGraphsList; 
};  

ctsmNode.prototype.getInterGraphEdges = function () 
{  
  var edges = this.edges; 
  var igEdges = []; 
  for (var k = 0; k < edgesedges.length; k++) 
  { 
    cEdge = edges[k]; 
    if (cEdge.isInterGraph) 
    { 
      igEdges.push(cEdge);  
    } 
  } 
};

ctsmNode.prototype.getBbox = function()
{
  var locX = this.getLocation().x;
  var locY = this.getLocation().y;
  var width = this.getWidth();
  var height = this.getHeight();

  var bbox = { 
    x1: locX, 
    x2: locX + width, 
    y1: locY, 
    y2: locY + height };

  return bbox;
};

ctsmNode.prototype.octalCode = function (node)
{
  //Semi axes get octal codes 0,2,4,6; East:0; North:2; West:4; South:6
  //Quadrants get octal codes 1,3,5,7; NorthEast:1; NorthWest:3; SouthWest:5; SouthEast:7
  var thisLoc = this.getCenter();
  var o = -1;
  let dx = (this.getCenterX() - node.getCenterX()).toFixed(7);
  let dy = (this.getCenterY() - node.getCenterY()).toFixed(7);


  if (dx > 0)
  {
    if (dy < 0)
    {
      o = 7;
    }
    else
    {
      if (dy === 0)
      {
        o = 0;
      }
      else
      {
        o = 1;
      }
    }
  }
  else if (dx === 0)
  {
    if (dy < 0)
    {
      o = 6;
    }
    else
    {
      o = 2;
    }
  }
  else
  {
    if (dy < 0)
    {
      o = 5;
    }
    else
    {
      if (dy === 0)
      {
        o = 4;
      }
      else
      {
        o = 3;
      }
    }
  }
  return o;
};

ctsmNode.prototype.insertNodeToBoundary = function (node) 
{  
  if (!this.isCompound()) 
    return; 
  var boundaryList = this.boundaryList; 
  var point = node.getCenter(); 

  if (boundaryList.length == 1) 
  { 
    boundaryList.push(node);  
    return; 
  } 

  //now insert the endpoint at correct location in the boundarylist 
  for (var k = 0; k < boundaryList.length; k++) 
  { 
    var value1 = boundaryList[k].getCenter(); 
    var value2 = void 0;  
    if (k != boundaryList.length - 1) 
    { 
      value2 = boundaryList[k + 1].getCenter(); 
    } 
    else {  
      value2 = boundaryList[0].getCenter(); 
    } 
    if (value1.x == value2.x && point.x == value1.x) 
    {  
      if (value1.y < point.y && point.y < value2.y || value2.y < point.y && point.y < value1.y) 
      { 
        boundaryList.splice(k + 1, 0, node);  
      } 
    } else if (value1.y == value2.y && point.y == value1.y) 
    { 
      if (value1.x < point.x && point.x < value2.x || value2.x < point.x && point.x < value1.x) 
      { 
        boundaryList.splice(k + 1, 0, node);  
      } 
    } 
  } 
  node.isDummy = true;  
  node.dummyOwner = this; 
};

ctsmNode.prototype.getNeighbors = function ()
{
  var neighbors = [];
  for (let i = 0; i < this.edges.length; i++)
  {
    let nbr = this.edges[i].getOtherEnd(this);
    neighbors.push(nbr);
  }
  return neighbors;
};

ctsmNode.prototype.isCompound = function() {
  if (this.withChildren().size > 1) {
      return true;
  }
    else {
      return false;
    }
};

ctsmNode.prototype.findEdgeBetween = function(node) {
  //finds if an edge exists between the current node and node and returns it
  let output = null;
  for (let i = 0; i < this.edges.length; i++)
  {
    let edge = this.edges[i]; 
    if (edge.source == this && edge.target == node)
    {
        output = edge;
        break;
    }
    else if (edge.source == node && edge.target == this)
    {
      output = edge;
      break;
    }
  }
  return output;
}

ctsmNode.prototype.getDegree = function()
{
  var edges = this.getEdges();
  var degree = 0;

  // For the edges connected
  for (var i = 0; i < edges.length; i++) {
    var edge = edges[i];
    if (edge.getSource().id !== edge.getTarget().id) {
      degree = degree + 1;
    }
  }
  return degree;
};

ctsmNode.prototype.getRelativeRatiotoNodeCenter = function(portLocation)
{
    let node = this;
    return new PointD((portLocation.x - node.getCenterX()) / (node.getWidth()) * 100,
        (portLocation.y -  node.getCenterY()) / (node.getHeight()) * 100);
};

ctsmNode.prototype.findConnectivity = function(childGraphs)
{
  if (!this.isCompound())
    return;

  //get child graphs list of node including this nodes own graph
  
  let connectivityCheck = false;
  let childNodes = this.getChild().nodes;
  let cEdge;
  for (let j = 0; j < childNodes.length; j++)
  {
    let childNode = childNodes[j];
    if (childNode.isCompound())
    {
      connectivityCheck = childNode.findConnectivity(childGraphs);
      if (connectivityCheck)
        break;
    }

    let childEdges = childNode.edges;
    for (let k = 0; k < childEdges.length; k++)
    {
      cEdge = childEdges[k];
      let otherNode = cEdge.getOtherEnd(childNode);
      if (cEdge.isInterGraph && !childGraphs.includes(otherNode.owner))
      {
        connectivityCheck = true;
        break;
      }
    }
    if (connectivityCheck)
      break;
  }
  return connectivityCheck;
};

ctsmNode.prototype.distance = function (a,b)
{
  return Math.sqrt(Math.pow((a.x - b.x), 2) + Math.pow((a.y - b.y), 2));
};

ctsmNode.prototype.createConnectedGraph = function(nodeDict, simpleGm, layout)
{
  var compareSecondColumn = function compareSecondColumn(a, b) 
  {
    if (a[1] === b[1]) {
      return 0;
    } else {
      return a[1] < b[1] ? -1 : 1;
    }
  };

  var nodePosList = [];

  //find the left most node
  var childNodes = this.getChild().nodes;
  for (let j = 0; j < childNodes.length; j++) 
  {
    var child = childNodes[j];
    nodePosList.push([child, child.getLocation().x]);
  }

  nodePosList.sort(compareSecondColumn);

  var leftMostNode = nodePosList[0][0];
  var src, tgt;

  if (!leftMostNode.isCompound()) 
  {
    //now find its distance from the top left and bottom left boundary nodes
    var d1 = this.distance(nodeDict[leftMostNode.id].getLocation(), nodeDict[this.id.concat("-tl")].getCenter());
    var d2 = this.distance(nodeDict[leftMostNode.id].getLocation(), nodeDict[this.id.concat("-bl")].getCenter());

    if (d1 <= d2) 
    {
      src = nodeDict[this.id.concat("-tl")];
    } 
    else 
    {
      src = nodeDict[this.id.concat("-bl")];
    }

    tgt = nodeDict[leftMostNode.id];
  } 
  else 
  {
    //find distance from the topleft corner of child node to topleft corner of compound
    //find distance from the bottomleft corner of child node to bottomleft corner of compound
    //connect the ones with smaller distance
    var d1 = this.distance(nodeDict[leftMostNode.id.concat("-tl")].getCenter(), nodeDict[this.id.concat("-tl")].getCenter());
    var d2 = this.distance(nodeDict[leftMostNode.id.concat("-bl")].getCenter(), nodeDict[this.id.concat("-bl")].getCenter());

    if (d1 <= d2)
    {
      src = nodeDict[this.id.concat("-tl")];
      tgt = nodeDict[leftMostNode.id.concat("-tl")];
    } 
    else 
    {
      src = nodeDict[this.id.concat("-bl")];
      tgt = nodeDict[leftMostNode.id.concat("-bl")];
    }
  }

  var newEdge = simpleGm.add(layout.newEdge(), src, tgt);
  newEdge.id = src.id.concat("to").concat(tgt.id);

  simpleGm.connectivityEdges.push(newEdge)
};

ctsmNode.prototype.createDummyCornerNodes = function(simpleGm, nodeDict, turn)
{
  //storing values in clockwise direction
  let boundaryList = [];
  let bbox = this.getBbox();
  let corners = [
    {x: bbox.x1, y: bbox.y1},
    {x: bbox.x2, y: bbox.y1},
    {x: bbox.x2, y: bbox.y2},
    {x: bbox.x1, y: bbox.y2},
  ];

  //create nodes for the corner points of the compound node in the new gm
  for (let j = 0; j < corners.length; j++)
  {
    let newNode, id;
    let point = corners[j];
    if (j == 0)
        id = this.id.concat("-tl");
    else if (j == 1)
        id = this.id.concat("-tr");
    else if (j == 2)
        id = this.id.concat("-br");
    else
        id = this.id.concat("-bl");

    if (turn == 1)
    {
      let parent = simpleGm.getRoot();
      newNode = parent.add(new ctsmNode(simpleGm, point, new DimensionD(1, 1)));
      newNode.setCenter(point.x, point.y);
      newNode.isDummy = true;
      newNode.dummyOwner = this;
      newNode.isCmpdBoundaryNode = true;
      newNode.id = id;
      nodeDict[newNode.id] = newNode;
    }
    else
    {
      newNode = nodeDict[id];
      newNode.setCenter(point.x, point.y);

      while(newNode.edges.length != 0)
      {
        let edge = newNode.edges[0];
        let graph = simpleGm.calcLowestCommonAncestor(edge.source, edge.target);
        graph.remove(edge);
      }

      simpleGm.resetAllEdges();
      simpleGm.getAllEdges();

    }

    boundaryList.push(newNode);
  }

  this.boundaryList = boundaryList;
};

ctsmNode.prototype.direction = function (node1Loc, node2Loc) 
{
  var x1 = node1Loc.x;
  var x2 = node2Loc.x;
  var y1 = node1Loc.y;
  var y2 = node2Loc.y;
  var dx = x2 - x1;
  var dy = y2 - y1;

  var dir;
  if (dx > 0 && dy < 0) 
    dir = cc.NE;
  else if (dx > 0 && dy == 0) 
    dir = cc.EAST;
  else if (dx > 0 && dy > 0) 
    dir = cc.SE;
  else if (dx == 0 && dy > 0) 
    dir = cc.SOUTH;
  else if (dx < 0 && dy > 0) 
    dir = cc.SW;
  else if (dx < 0 && dy == 0) 
    dir = cc.WEST;
  else if (dx < 0 && dy < 0) 
    dir = cc.NW;
  else if (dx == 0 && dy < 0) 
    dir = cc.NORTH;
  return dir;

};

ctsmNode.prototype.getFreeDirs = function(otherNode)
{
  let edges = this.edges;
  let pos = this.getCenter();
  let freeDirs = [0, 1, 2, 3];
  for (let i = 0; i < edges.length; i++)
  {
    let edge = edges[i];
    let node = edge.getOtherEnd(this);
    if (node.isCompound() && node.id == otherNode.id)
      continue;

    let dir;
    if (edge.bendpoints.length == 0)
      dir = this.direction(pos, node.getCenter());
    else
    {
      if (edge.source.id == this.id)
        dir = this.direction(pos, edge.bendpoints[0]);
      else
        dir = this.direction(pos, edge.bendpoints[edge.bendpoints.length - 1]);
    }

    if (dir == 0 || dir == 1 || dir == 2 || dir == 3)
      freeDirs.splice(freeDirs.indexOf(dir), 1);
  }

  console.log(this.id);
  console.log("Free directions");
  console.log(freeDirs);

  return freeDirs;
}

module.exports = ctsmNode;
