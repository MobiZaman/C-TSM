const LGraphManager = require('cose-base').layoutBase.LGraphManager;
const ctsmNode = require('../c-tsm/ctsmNode');
const DimensionD = require('cose-base').layoutBase.DimensionD;

function ctsmGraphManager(layout) 
{
  LGraphManager.call(this, layout);

  this.edgesWithBends = [];
  this.nodes = {};
  this.connectivityEdges = [];
}

ctsmGraphManager.prototype = Object.create(LGraphManager.prototype);
for (var prop in LGraphManager) {
  ctsmGraphManager[prop] = LGraphManager[prop];
}

//return the list of compound nodes
ctsmGraphManager.prototype.findCompoundNodes = function() 
{
    var allNodes = this.getAllNodes();
    var compoundNodes = [];

    for (var i = 0; i < allNodes.length; i++) 
    {
        var node = allNodes[i];
        if (node.isCompound())
        {
          compoundNodes.push(node);
        }
    }

    //sort compounds from inside to outside
    compoundNodes = this.sortCompounds(compoundNodes);
    return compoundNodes;
};

ctsmGraphManager.prototype.removeConnectivityEdges = function()
{
  let dummyEdges = this.connectivityEdges;
  for (let i = 0; i < dummyEdges.length; i++)
  {
    let edge = dummyEdges[i];
    let src = edge.source;
    let tgt = edge.target;

    if (src.findEdgeBetween(tgt))
    {
      let graph = this.calcLowestCommonAncestor(edge.source, edge.target);
      graph.remove(edge);
    }

  }
}

ctsmGraphManager.prototype.getAverageEdgeLength = function()
{
  this.resetAllEdges();
  let sum = 0;
  let allEdges = this.getAllEdges();
  for (let i = 0; i < allEdges.length; i++)
  {
    let edge = allEdges[i];
    let bps = edge.bendpoints;
    let len;

    if (bps.length == 0)
    {
      let n1Pos = edge.source.getCenter();
      let n2Pos = edge.target.getCenter();
      len = Math.sqrt(Math.pow((n1Pos.x - n2Pos.x), 2) + Math.pow((n1Pos.y - n2Pos.y), 2));
      sum = sum + len;
    }
    else
    {
      let n1Pos;
      let n2Pos;
      for (let j = 0; j <= bps.length; j++)
      {
        if (j == 0)
        {
          n1Pos = edge.source.getCenter();
          n2Pos = {x: bps[j].x, y: bps[j].y};
        }
        else if (j == bps.length)
        {
          n1Pos = {x: bps[j - 1].x, y: bps[j - 1].y};
          n2Pos = edge.target.getCenter();
        }
        else
        {
          n1Pos = {x: bps[j - 1].x, y: bps[j - 1].y};
          n2Pos = {x: bps[j].x, y: bps[j].y};
        }

        len = Math.sqrt(Math.pow((n1Pos.x - n2Pos.x), 2) + Math.pow((n1Pos.y - n2Pos.y), 2));
        sum = sum + len;
      }
    }

    
  }
  return (sum/allEdges.length);
}

ctsmGraphManager.prototype.getArea = function()
{
  // get minimum x and y values from nodes and bps
  
  let x1 = Number.MAX_VALUE;
  let x2 = Number.MIN_VALUE;
  let y1 = Number.MAX_VALUE;
  let y2 = Number.MIN_VALUE;

  let allNodes = this.getAllNodes();
  for (let i = 0; i < allNodes.length; i++)
  {
    let node = allNodes[i];
    let nodePosition = node.getCenter();

    if (nodePosition.x < x1)
      x1 = nodePosition.x;
    if (nodePosition.x > x2)
      x2 = nodePosition.x;
    if (nodePosition.y < y1)
      y1 = nodePosition.y;
    if (nodePosition.y > y2)
      y2 = nodePosition.y;

  }

  let allEdges = this.getAllEdges();
  for (let i = 0; i < allEdges.length; i++)
  {
    let edge = allEdges[i];
    let bps = edge.bendpoints;
    if (bps.length > 0)
    {
      for (let k = 0; k < bps.length; k++)
      {
        let bp = bps[k];
        if (bp.x < x1)
          x1 = bp.x;
        if (bp.x > x2)
          x2 = bp.x;
        if (bp.y < y1)
          y1 = bp.y;
        if (bp.y > y2)
          y2 = bp.y;
      }
    }
  }

  let width = x2 - x1;
  let height = y2 - y1;

  let area = width * height;
  return area;
}

ctsmGraphManager.prototype.getInterGraphEdges = function()
{
    let allEdges = this.getAllEdges();
    let igEdges = [];

    for (let i = 0; i < allEdges.length; i++)
    {
        let edge = allEdges[i];
        if (edge.isInterGraph)
            igEdges.push(edge);
    }
    return igEdges;
};

ctsmGraphManager.prototype.sortCompounds = function(compoundNodes)
{
  var hierarchyList = [];

  //sorting in ascending order
  compoundNodes.sort(function (a, b) {
    return a.getArea() - b.getArea();
  });

  let childDict = {};

  //create a hierarchy list for the compound nodes
  for (var i = 0; i < compoundNodes.length; i++) {
    var node = compoundNodes[i];
    var children = node.getChildren();

    let sum = 0;

    //check if any children of the compound node is a compound node
    for (var j = 0; j < children.length; j++) {
      var child = children[j];
      if (child.isCompound()) 
      {
        sum++;
        sum = sum + childDict[child.id];
      }
    }
    hierarchyList.push([node, sum]);
    childDict[node.id] = sum;
  }

  function compareSecondColumn(a, b) {
    if (a[1] === b[1]) {
      return 0;
    } else {
      return a[1] < b[1] ? -1 : 1;
    }
  };

  hierarchyList.sort(compareSecondColumn);

  compoundNodes = [];
  for (let i = 0; i < hierarchyList.length; i++)
    compoundNodes.push(hierarchyList[i][0]);

  return compoundNodes;
};

module.exports = ctsmGraphManager;
