
// -----------------------------------------------------------------------------
// Section: Initializations
// -----------------------------------------------------------------------------

const CoSELayout = require('cose-base').CoSELayout;
const CoSEConstants = require('cose-base').CoSEConstants;
const CoSENode = require('cose-base').CoSENode;
const LayoutConstants = require('cose-base').layoutBase.LayoutConstants;
const FDLayoutConstants = require('cose-base').layoutBase.FDLayoutConstants;
const cc = require('../c-tsm/ctsmConstants');
const ctsmGraphManager = require('../c-tsm/ctsmGraphManager');
const ctsmNode = require('../c-tsm/ctsmNode');
const ctsmEdge = require('../c-tsm/ctsmEdge');
const ctsmGraph = require('../c-tsm/ctsmGraph');
const PointD = require('cose-base').layoutBase.PointD;
const DimensionD = require('cose-base').layoutBase.DimensionD;
const Layout = require('layout-base').Layout;
const HashMap = require('cose-base').layoutBase.HashMap;

// Constructor
function ctsmLayout(options)
{
    Layout.call(this);
    this.dummyNodes = [];
    this.options = options;
    this.maxNodeDimension;
}

ctsmLayout.prototype = Object.create(Layout.prototype);

for (let property in Layout)
{
    ctsmLayout[property] = Layout[property];
}

ctsmLayout.prototype.defineCoseConstants = function(options)
{
  if (options.nodeRepulsion != null)
    CoSEConstants.DEFAULT_REPULSION_STRENGTH = FDLayoutConstants.DEFAULT_REPULSION_STRENGTH = options.nodeRepulsion;
  if (options.idealEdgeLength != null)
    CoSEConstants.DEFAULT_EDGE_LENGTH = FDLayoutConstants.DEFAULT_EDGE_LENGTH = options.idealEdgeLength;;
  if (options.edgeElasticity != null)
    CoSEConstants.DEFAULT_SPRING_STRENGTH = FDLayoutConstants.DEFAULT_SPRING_STRENGTH = options.edgeElasticity;
  if (options.nestingFactor != null)
    CoSEConstants.PER_LEVEL_IDEAL_EDGE_LENGTH_FACTOR = FDLayoutConstants.PER_LEVEL_IDEAL_EDGE_LENGTH_FACTOR = options.nestingFactor;
  if (options.gravity != null)
    CoSEConstants.DEFAULT_GRAVITY_STRENGTH = FDLayoutConstants.DEFAULT_GRAVITY_STRENGTH = options.gravity;
  if (options.numIter != null)
    CoSEConstants.MAX_ITERATIONS = FDLayoutConstants.MAX_ITERATIONS = options.numIter;
  if (options.gravityRange != null)
    CoSEConstants.DEFAULT_GRAVITY_RANGE_FACTOR = FDLayoutConstants.DEFAULT_GRAVITY_RANGE_FACTOR = options.gravityRange;
  if(options.gravityCompound != null)
    CoSEConstants.DEFAULT_COMPOUND_GRAVITY_STRENGTH = FDLayoutConstants.DEFAULT_COMPOUND_GRAVITY_STRENGTH = options.gravityCompound;
  if(options.gravityRangeCompound != null)
    CoSEConstants.DEFAULT_COMPOUND_GRAVITY_RANGE_FACTOR = FDLayoutConstants.DEFAULT_COMPOUND_GRAVITY_RANGE_FACTOR = options.gravityRangeCompound;
  if (options.initialEnergyOnIncremental != null)
    CoSEConstants.DEFAULT_COOLING_FACTOR_INCREMENTAL = FDLayoutConstants.DEFAULT_COOLING_FACTOR_INCREMENTAL = options.initialEnergyOnIncremental;

  LayoutConstants.QUALITY = 1;

  CoSEConstants.NODE_DIMENSIONS_INCLUDE_LABELS = FDLayoutConstants.NODE_DIMENSIONS_INCLUDE_LABELS = LayoutConstants.NODE_DIMENSIONS_INCLUDE_LABELS = options.nodeDimensionsIncludeLabels;
  CoSEConstants.DEFAULT_INCREMENTAL = FDLayoutConstants.DEFAULT_INCREMENTAL = LayoutConstants.DEFAULT_INCREMENTAL = !(options.randomize);
  CoSEConstants.ANIMATE = FDLayoutConstants.ANIMATE = LayoutConstants.ANIMATE = options.animate;
  CoSEConstants.TILE = options.tile;
  CoSEConstants.TILING_PADDING_VERTICAL = typeof options.tilingPaddingVertical === 'function' ? options.tilingPaddingVertical.call() : options.tilingPaddingVertical;
  CoSEConstants.TILING_PADDING_HORIZONTAL = typeof options.tilingPaddingHorizontal === 'function' ? options.tilingPaddingHorizontal.call() : options.tilingPaddingHorizontal;
  CoSEConstants.TRANSFORM_ON_CONSTRAINT_HANDLING = false;
  CoSEConstants.ENFORCE_CONSTRAINTS = true;
};

ctsmLayout.prototype.newGraphManager = function(options){
   this.graphManager = new ctsmGraphManager(this);
   return this.graphManager;
};

/**
* This method creates a new node associated with the input view node.
*/
ctsmLayout.prototype.newNode = function(loc, size)
{
   return new ctsmNode(this.graphManager, loc, size, null);
};

ctsmLayout.prototype.newGraph = function(vGraph)
{
   return new ctsmGraph(null, this.graphManager, vGraph);
};

ctsmLayout.prototype.getGraphManager = function() 
{
  return this.graphManager;
};

/**
* This method creates a new edge associated with the input view edge.
*/
ctsmLayout.prototype.newEdge = function(source,target, vEdge)
{
   return new ctsmEdge(source, target, vEdge);
};

ctsmLayout.prototype.getTopMostNodes = function(nodes, cyNodesMap) 
{
    var nodesMap = {};

    for (var i = 0; i < nodes.length; i++) 
    {
        nodesMap[nodes[i].id()] = true;
        cyNodesMap[nodes[i].id()] = nodes[i];
    }

    var roots = nodes.filter(function (ele, i) 
    {
        if (typeof ele === "number")
            ele = i;

        var parent = ele.parent()[0];

        while (parent != null) 
        {
            if (nodesMap[parent.id()]) 
            {
                return false;
            }
            parent = parent.parent()[0];
        }
        return true;
    });

    return roots;
};

ctsmLayout.prototype.processChildrenList = function(options, parent, children, layout, layoutType, idToLNode, ctsmNodeToCoseNode) 
{
    var size = children.length;
    var includeLabelsOption = options.nodeDimensionsIncludeLabels;

    for (var i = 0; i < size; i++) 
    {
        var theNode;
        var theChild = children[i];
        var children_of_children = theChild.children();
        var dimensions = theChild.layoutDimensions({ nodeDimensionsIncludeLabels: includeLabelsOption });

        if (theChild.outerWidth() != null && theChild.outerHeight() != null) 
        {
            if (layoutType === "ctsm") 
            {
                theNode = parent.add(this.newNode(new PointD(theChild.position('x') - dimensions.w / 2, theChild.position('y') - dimensions.h / 2), new DimensionD(parseFloat(dimensions.w), parseFloat(dimensions.h))));
                theNode.id = theChild.data("id");
                layout.graphManager.nodes[theNode.id] = theNode;
            }
            else if (layoutType === "cose") 
            {
                theNode = parent.add(new CoSENode(layout.graphManager, new PointD(theChild.position('x') - dimensions.w / 2, theChild.position('y') - dimensions.h / 2), new DimensionD(parseFloat(dimensions.w), parseFloat(dimensions.h))));
                theNode.id = theChild._private.data.id;
            }
        } 

        // Attach the paddings of cy node to layout node
        theNode.paddingLeft = parseInt(theChild.css('padding'));
        theNode.paddingTop = parseInt(theChild.css('padding'));
        theNode.paddingRight = parseInt(theChild.css('padding'));
        theNode.paddingBottom = parseInt(theChild.css('padding'));
        theNode.borderWidth = parseInt(theChild.css('border-width'));

        //Attach the label properties to compound if labels will be included in node dimensions
        if (options.nodeDimensionsIncludeLabels) 
        {
            if (theChild.isParent()) 
            {
                var labelWidth = theChild.boundingBox({ includeLabels: true, includeNodes: false }).w;
                var labelHeight = theChild.boundingBox({ includeLabels: true, includeNodes: false }).h;
                var labelPos = theChild.css("text-halign");
                theNode.labelWidth = labelWidth;
                theNode.labelHeight = labelHeight;
                theNode.labelPos = labelPos;
            }
        }

        // Map the layout node
        if (layoutType === "ctsm") 
        {
          idToLNode[theChild.data("id")] = theNode;
        }
        else if (layoutType === "cose") 
        {
          idToLNode[theChild.data("id")] = theNode;
          ctsmNodeToCoseNode[theNode.id] = theNode;
        }

        if (isNaN(theNode.rect.x)) 
        {
          theNode.rect.x = 0;
        }

        if (isNaN(theNode.rect.y)) 
        {
          theNode.rect.y = 0;
        }

        if (children_of_children != null && children_of_children.length > 0) 
        {
          var theNewGraph = layout.getGraphManager().add(layout.newGraph(), theNode);
          this.processChildrenList(options, theNewGraph, children_of_children, layout, layoutType, idToLNode, ctsmNodeToCoseNode);
        }
    }
};

ctsmLayout.prototype.setParents = function(gm) 
{
    let allNodes = gm.getAllNodes();

    for (let i = 0; i < allNodes.length; i++)
    {
        let ctsmNode = allNodes[i];
        if (ctsmNode.owner.parent.id != undefined)
        {
          ctsmNode.parentNode = ctsmNode.owner.parent;
        }
    }
};

function isFn(fn) 
{
  return typeof fn === 'function';
};

function optFn(opt, ele) 
{
  if (isFn(opt)) 
  {
    return opt(ele);
  } 
  else 
  {
    return opt;
  }
};

// transfer cytoscape edges to ctsm edges
ctsmLayout.prototype.processEdges = function(layout, gm, edges, idToLNode, cyEdgesMap, ctsmEdgesMap)
{
  var idealLengthTotal = 0;
  var edgeCount = 0;
  let ctsmrun = false;

  if (cyEdgesMap)
    ctsmrun = true;

  for (let i = 0; i < edges.length; i++) 
  {
    let edge = edges[i];
    let sourceNode = idToLNode[edge.data("source")];
    let targetNode = idToLNode[edge.data("target")];

    if (ctsmrun)
      cyEdgesMap[edge.id()] = edge;


    if(sourceNode !== targetNode)
    {
      if (sourceNode.getEdgesBetween(targetNode).length == 0)
      {
        let e = gm.add(layout.newEdge(), sourceNode, targetNode);
        e.id = edge.id();
        e.idealLength = optFn(this.options.idealEdgeLength, edge);
        e.edgeElasticity = optFn(this.options.edgeElasticity, edge);
        e.width = parseInt(edge.css('width'));

        idealLengthTotal += e.idealLength;
        edgeCount++;

        if (ctsmEdgesMap != null)
          ctsmEdgesMap[e.id] = e;
      } 
    }

    if (this.options.idealEdgeLength != null)
    {
      CoSEConstants.DEFAULT_EDGE_LENGTH = FDLayoutConstants.DEFAULT_EDGE_LENGTH = 50;
      CoSEConstants.MIN_REPULSION_DIST = FDLayoutConstants.MIN_REPULSION_DIST = FDLayoutConstants.DEFAULT_EDGE_LENGTH / 10.0;
      CoSEConstants.DEFAULT_RADIAL_SEPARATION = FDLayoutConstants.DEFAULT_EDGE_LENGTH;
    }   
  }
};

ctsmLayout.prototype.runCoseLayout = function(options, idToLNode, ctsmNodeToCoseNode, topMostNodes) 
{
    // Create a CoSE layout object
    var coseLayout = new CoSELayout();

    this.defineCoseConstants(options);

    var gm = coseLayout.newGraphManager();
    this.coseGm = gm;

    var nodes = options.eles.nodes();
    var edges = options.eles.edges();

    this.processChildrenList(options, gm.addRoot(), topMostNodes, coseLayout, "cose", idToLNode, ctsmNodeToCoseNode);
    this.processEdges(coseLayout, gm, edges, idToLNode);

    coseLayout.runLayout();
    return coseLayout;
};

ctsmLayout.prototype.getMaxNodeDimension = function(gm) 
{
    var allNodes = gm.getAllNodes();
    var max = 0;

    for (let i = 0; i < allNodes.length; i++)
    {
        var node = allNodes[i];
        let tempMax = Math.max(node.getWidth(), node.getHeight());
        
        if (!node.isCompound() & max < tempMax)
          max = tempMax;
    }

    this.maxNodeDimension = max;
    return max;
};

ctsmLayout.prototype.extractBends = function(bendData, nodeDict, nodes, edgeSplitDict)
{
    let edgesWithBends = [];
    for (let i = 0; i < bendData.length; i++)
    {
        let row = bendData[i];

        let firstNode = nodeDict[row[0]];
        let lastNode = nodeDict[row[row.length - 1]];

        let edge = firstNode.findEdgeBetween(lastNode);

        let src = firstNode;
        if (edge.source.id != src.id)
            row.reverse();
 
        for (let j = 1; j < row.length - 1; j++)
        {
            let pos = nodes[row[j]];
            let bp = {
              x:pos[0], 
              y:pos[1], 
              id: row[j]
            };

            if (j == 1)
              bp.srcId = edge.source.id;
            else
              bp.srcId = row[j - 1];

            if (j == row.length - 2)
              bp.tgtId = edge.target.id;
            else
              bp.tgtId = row[j + 1];
           
            edge.bendpoints.push(bp);
        }

        if (!edge.source.id.includes("cdnode") && !edge.target.id.includes("cdnode"))
            edgesWithBends.push(edge);
    }

    return edgesWithBends;
};

ctsmLayout.prototype.deleteEdgeCrossings = function(edgeSplitDict, gm, edgesWithBends)
{
    let edgesWithDummies = Object.values(edgeSplitDict);
    let edgeSplitsKeys = Object.keys(edgeSplitDict);

    for (let i = 0; i < edgesWithDummies.length; i++)
    {
        let edgeWithDummies = edgesWithDummies[i];

        if (edgeSplitsKeys[i].includes("cdnode"))
            continue;

        let len = edgeWithDummies.length;

        //first create a new edge between the original source and target
        let origEdgeId = edgeSplitsKeys[i];
        let src = edgeWithDummies[0].source;
        let tgt = edgeWithDummies[len - 1].target;

        let newEdge = gm.add(this.newEdge(), src, tgt);
        newEdge.id = origEdgeId;

        for (let j = 0; j < len; j++)
        {
            //take each split portion, and extract its bendpoints 
            let dummyEdge = edgeWithDummies[j];
            let bps = dummyEdge.bendpoints;

            //add the bendpoints to the original edge
            for (let k = 0; k < bps.length; k++)
              newEdge.bendpoints.push(bps[k]);

            //now delete the edge from graph
            var graph = gm.calcLowestCommonAncestor(dummyEdge.source, dummyEdge.target);
            graph.remove(dummyEdge);
        }

        if (src.isCmpdBoundaryNode && (src.id.includes("-tr") || src.id.includes("-tl")
                                    || src.id.includes("-br") || src.id.includes("-bl")))
            continue;
        if (tgt.isCmpdBoundaryNode && (tgt.id.includes("-tr") || tgt.id.includes("-tl")
                                    || tgt.id.includes("-br") || tgt.id.includes("-bl")))
            continue;

        if (newEdge.bendpoints.length > 0)
            edgesWithBends.push(newEdge);
    }
};

ctsmLayout.prototype.deleteDummyNodes = function(dummyNodes)
{
    for (let i = 0; i < dummyNodes.length; i++)
    {
        dummyNodes[i].owner.remove(dummyNodes[i]);
    }
};

ctsmLayout.prototype.createBendpoints = function(edgesWithBends, gm)
{
    for (let i = 0; i < edgesWithBends.length; i++)
    {
        let edge = edgesWithBends[i];
        edge.convertToRelativeBendPosition();
        gm.edgesWithBends.push(edge);
    }
};

ctsmLayout.prototype.removeDummiesAndCreateBends = function(gm, edgeSplitDict, dummyNodes, edgesWithBends)
{
    this.deleteEdgeCrossings(edgeSplitDict, gm, edgesWithBends);
    this.deleteDummyNodes(dummyNodes);

    gm.resetAllEdges();
    gm.resetAllNodes();
    gm.getAllEdges();
    gm.getAllNodes();

    this.createBendpoints(edgesWithBends, gm);  
};

ctsmLayout.prototype.prepareGraphForCompaction = function(compoundNodes, cyNodesMap, gm, nodeDict, edgeSplitDict, igEdges)
{
  let newEdges = [];
  for (let i = 0; i < compoundNodes.length; i++)
  {
    //Step 1: Reshape Compounds

    let node = compoundNodes[i];

    //find corners from the boundary list
    let x1 = Number.MAX_VALUE;
    let x2 = Number.MIN_VALUE;
    let y1 = Number.MAX_VALUE;
    let y2 = Number.MIN_VALUE;

    for (let j = 0; j < node.boundaryList.length; j++)
    {
      let nodePosition = node.boundaryList[j].getCenter();
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

    node.setWidth(w);
    node.setHeight(h);
    node.setCenter(center.x, center.y);

    //Step 2: Delete all boundary nodes in gm
    let edgeCrossDummies = [];
    for (let j = 0; j < node.boundaryList.length; j++)
    {
      let bdNode = node.boundaryList[j];
      if (bdNode.id.includes("cdnode"))
          edgeCrossDummies.push(bdNode);
      else
        continue;    
    }

    node.boundaryList = [];

    //Step 3: Recreate boundary nodes
    node.createDummyCornerNodes(gm, nodeDict, 2);

    //Step 4: Determine new position of edge endpoints
    let edges = node.edges;
    for (let j = 0; j < edges.length; j++)
    {
      //compound edge ports
      let edge = edges[j];
      let nodeId = node.id.concat("-").concat(edge.id);

      let otherNode = edge.getOtherEnd(node);
      let edgeId;
      let srcId, tgtId;

      if (edge.source.isCompound())
      srcId = edge.source.id.concat("-").concat(edge.id);
      else
      srcId = edge.source.id;

      if (edge.target.isCompound())
      tgtId = edge.target.id.concat("-").concat(edge.id);
      else
      tgtId = edge.target.id;

      edgeId = srcId.concat("to").concat(tgtId);

      let dn = nodeDict[nodeId];

      //find the side on which dn is on
      let dnPos = dn.getCenter();

      let dnIsCorner = false;
      //lets check if the position of dn coincides with any corner node
      for (let k = 0; k < node.boundaryList.length; k++)
      {
        let bn = node.boundaryList[k];
        let bnPos = bn.getCenter();
        if (bnPos.x == dnPos.x && bnPos.y == dnPos.y)
        {
            node.boundaryList[node.boundaryList.indexOf(bn)] = dn;
            delete nodeDict[bn.id];
            bn.owner.remove(bn);
            dnIsCorner = true;
            break;
        }
      }

      if (!dnIsCorner)
      {
        let dir;

        //right now, this compound edge will not have bendpoints
        if (edgeSplitDict[edgeId] == undefined)
        {
            let e = nodeDict[srcId].findEdgeBetween(nodeDict[tgtId]);
            if (e.bendpoints.length == 0)
            {
              if (otherNode.isCompound())
              {
                otherNode = nodeDict[otherNode.id.concat("-").concat(edge.id)];
              }
              dir = this.direction(dn.getCenter(), otherNode.getCenter());
            }
            else
            {
              if (node == edge.source)
                dir = this.direction(dn.getCenter(), e.bendpoints[0]);
              else
                dir = this.direction(dn.getCenter(), e.bendpoints[e.bendpoints.length - 1]);
            }
        }
        else
        {
            if (node == edge.source)
            {
                let e = edgeSplitDict[edgeId][0];
                if (e.bendpoints.length == 0)
                {
                  otherNode = edgeSplitDict[edgeId][0].target;
                  dir = this.direction(dn.getCenter(), otherNode.getCenter());
                }
                else
                {
                  dir = this.direction(dn.getCenter(), e.bendpoints[0]);
                }
            }
            else
            {
              let e = edgeSplitDict[edgeId][0];
              let len = edgeSplitDict[edgeId].length;
              if (e.bendpoints.length == 0)
              {
                otherNode = edgeSplitDict[edgeId][len - 1].source;
                dir = this.direction(dn.getCenter(), otherNode.getCenter());
              }
              else
              {
                dir = this.direction(dn.getCenter(), e.bendpoints[e.bendpoints.length - 1]);
              }

            }
        }


        let bbox = node.getBbox();
        // determine dn node position based on direction from dn to other node
        if (dir == 0)
            dn.setCenter(bbox.x2, dnPos.y);
        else if (dir == 1)
            dn.setCenter(dnPos.x, bbox.y2);
        else if (dir == 2)
            dn.setCenter(bbox.x1, dnPos.y);
        else if (dir == 3)
            dn.setCenter(dnPos.x, bbox.y1);


        //check again if the value co-incides with corner points
        dnPos = dn.getCenter();


        for (let k = 0; k < node.boundaryList.length; k++)
        {
          let bn = node.boundaryList[k];
          let bnPos = bn.getCenter();

          if (bnPos.x == dnPos.x && bnPos.y == dnPos.y)
          {
            if (bn.id.includes("-tr") || bn.id.includes("-tl") || bn.id.includes("-br") || bn.id.includes("-bl"))
            {
              node.boundaryList[node.boundaryList.indexOf(bn)] = dn;
              delete nodeDict[bn.id];
              bn.owner.remove(bn);
              dnIsCorner = true;
            }
            break;
          }
        }

        if (!dnIsCorner)
        {
          //add dn to the boundary list 
          node.insertNodeToBoundary(dn);
        }      
      }          
    }

    //Step 4: Find new positions for edge crossing dummies
    for (let j = 0; j < edgeCrossDummies.length; j++)
    {
      let dn = edgeCrossDummies[j];

      //for each intergraph edge, find the intergraph edge that contains dn
      for (let k = 0; k < igEdges.length; k++)
      {
        let e = igEdges[k];
        let eDict;

        

        //if e is between two simple nodes, its edge should be in edge split dictionary
        if (!e.source.isCompound() && !e.target.isCompound())
        {
          if (edgeSplitDict[e.id] != undefined)
            eDict = Object.values(edgeSplitDict[e.id]);
        }
        else if (!e.source.isCompound() && e.target.isCompound())
        {
          let srcId = e.source.id;
          let tgtId = e.target.id.concat("-").concat(e.id);
          eDict = edgeSplitDict[srcId.concat("to").concat(tgtId)];
        }
        else if (e.source.isCompound() && !e.target.isCompound())
        {
          let srcId = e.source.id.concat("-").concat(e.id);
          let tgtId = e.target.id;
          eDict = edgeSplitDict[srcId.concat("to").concat(tgtId)];
        } 
        else
        {
          let srcId = e.source.id.concat("-").concat(e.id);
          let tgtId = e.target.id.concat("-").concat(e.id);
          eDict = edgeSplitDict[srcId.concat("to").concat(tgtId)];
        }
        
        if (eDict == null)
            continue;


        //find the two edge segments that are connected to dn
        //find the nodes connected to dn,
        let n1Pos, n2Pos;
        for (let l = 0; l < eDict.length - 1; l++)
        {
            let e1 = eDict[l];
            let e2 = eDict[l + 1];
            if (e1.target.id == dn.id && e2.source.id == dn.id)
            {
                if (e1.bendpoints.length == 0)
                  n1Pos = e1.source.getCenter();
                else
                  n1Pos = e1.bendpoints[e1.bendpoints.length - 1];

                if (e2.bendpoints.length == 0)
                  n2Pos = e2.target.getCenter();
                else
                  n2Pos = e2.bendpoints[0];
                break;
            }
        }

        if (n1Pos == null)
          continue;
        else
        {
          //find intersection of line formed by those nodes with each compound boundary
          for (let l = 0; l < node.boundaryList.length; l++)
          {
            let n3Pos = node.boundaryList[l].getCenter();
            let n4Pos;
            if (l == node.boundaryList.length - 1)
              n4Pos = node.boundaryList[0].getCenter();
            else
              n4Pos = node.boundaryList[l + 1].getCenter();

            if (this.doIntersect(n1Pos, n2Pos, n3Pos, n4Pos)) 
            {
              let intersectionPoint = this.findIntersection(n1Pos, n2Pos, n3Pos, n4Pos);
              dn.setCenter(intersectionPoint.x, intersectionPoint.y);
              node.insertNodeToBoundary(dn);

              break;
            }
          }
          break;
        }
      }
    }

    let boundaryList = node.boundaryList;

    // construct edges along the boundary of the compound nodes
    for (let j = 0; j < boundaryList.length; j++)
    {
      let source = nodeDict[boundaryList[j].id];
      let target;
      if (j != boundaryList.length - 1)
        target = nodeDict[boundaryList[j + 1].id];
      else
        target = nodeDict[boundaryList[0].id];

      if (source.findEdgeBetween(target) == null)
      {
        let newEdge = gm.add(this.newEdge(), source, target);
        newEdge.id = source.id.concat("to").concat(target.id);
        newEdge.parentNode = node;
      }
    }

  }

  gm.resetAllNodes();
  gm.resetAllEdges();
  gm.getAllNodes();
  gm.getAllEdges();

};

ctsmLayout.prototype.findIntersection = function(p1, p2, p3, p4)
{
    let intersectionPoint;
    let intersectX;
    let intersectY;

    let x1 = p1.x;
    let y1 = p1.y;

    let x2 = p2.x;
    let y2 = p2.y;

    let x3 = p3.x;
    let y3 = p3.y;

    let x4 = p4.x;
    let y4 = p4.y;

    let m1 = (y2 - y1) / (x2 - x1);
    let m2 = (y4 - y3) / (x4 - x3);

    if (m1 == Infinity || m1 == -Infinity)
    {
        //first line with x1, y1 and x2, y2 is vertical
        let c2 = y3 - m2*x3;
        intersectX = x1;
        intersectY = m2*intersectX + c2;

    }
    else if (m2 == Infinity|| m2 == -Infinity)
    {
        let c1 = y1 - m1*x1;
        intersectX = x3;
        intersectY = m1*intersectX + c1;
    }
    else if (m1 == 0)
    {
        let c2 = y3 - m2*x3;
        intersectY = y1;
        intersectX = (intersectY - c2) / m2;
    }
    else if (m2 == 0)
    {
      let c1 = y1 - m1*x1;
        intersectY = y3;
        intersectX = (intersectY - c1) / m1;
    }
    else
    {
        let c1 = y1 - m1*x1;
        let c2 = y3 - m2*x3;

        intersectX = (c2 - c1) / (m1 - m2);
        intersectY = m1*intersectX + c1;    
    }

    intersectionPoint = {
        x: intersectX,
        y: intersectY
    };

    return intersectionPoint;
};



ctsmLayout.prototype.reshapeCompounds = function(compoundNodes, cyNodesMap, iel, simpleGm)
{
    //if graph is a compound graph, we need to modify the height and width of the compound
    if (compoundNodes.length > 0)
    {
        for (let i = 0; i < compoundNodes.length; i++)
        {
            let node = compoundNodes[i];

            node.compactNode(iel, simpleGm);

            let w = node.getWidth();
            let h = node.getHeight();
            let center = node.getCenter();

            let bbox = node.getBbox();

            //now find the compound node in cy
            let cyNode = cyNodesMap[node.id];

            let autoWidth = cyNode[0]._private.autoWidth;
            let autoHeight = cyNode[0]._private.autoHeight;

            cyNode.css("min-width", w);
            cyNode.css("min-height", h);

            let extraWidth = w - autoWidth;
            let extraHeight = h - autoHeight;

            //get current center of the cyNode
            let cyCenter = cyNode.position();

            //get percentages for up, down, left, right biases
            let leftBias = ((cyCenter.x - autoWidth/2 - bbox.x1) / extraWidth) * 100;
            let rightBias = ((bbox.x2 - autoWidth/2 - cyCenter.x) / extraWidth) * 100;
            let topBias = ((cyCenter.y - autoHeight/2 - bbox.y1) / extraHeight) * 100;
            let bottomBias = ((bbox.y2 - autoHeight/2 - cyCenter.y) / extraHeight) * 100;

            cyNode.css("min-width-bias-left", leftBias);
            cyNode.css("min-width-bias-right", rightBias);
            cyNode.css("min-height-bias-top", topBias);
            cyNode.css("min-height-bias-bottom", bottomBias);

            if (node.getParentNode() != null)
            {
              //NEED TO KEEP THIS OTHERWISE COMPOUND EDGES BECOME NON-ORTHOGONAL
              let p = cyNodesMap[node.getParentNode().id].position();
            }

            node.setWidth(w);
            node.setHeight(h);
            node.setCenter(center.x, center.y);
        }

        for (let i = 0; i < compoundNodes.length; i++)
        {
            let node = compoundNodes[i];
            let cyNode = cyNodesMap[node.id];
            let center = node.getCenter();
            node.setWidth(cyNode.outerWidth());
            node.setHeight(cyNode.outerHeight());
            node.setCenter(center.x, center.y);

        }
    }
};

ctsmLayout.prototype.direction = function (node1Loc, node2Loc) 
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

ctsmLayout.prototype.findSrcAndTgtPorts = function (gm, nodeDict, cEdges) 
{
  var compoundEdges = [];
  var allEdges = gm.getAllEdges();
  var outputEdges = [];
  var createBp = false;

  for (var i = 0; i < allEdges.length; i++) 
  {
    var edge = allEdges[i];

    //if edge is not orthogonal, we make it orthogonal
    var source = edge.source;
    var target = edge.target;

    let srcIsCompound = source.isCompound();
    let tgtIsCompound = target.isCompound();

    if (!srcIsCompound && !tgtIsCompound) 
      continue;

    var srcCenterX = source.getCenterX();
    var srcCenterY = source.getCenterY();

    var tgtCenterX = target.getCenterX();
    var tgtCenterY = target.getCenterY();

    var srcBbox = source.getBbox();
    var tgtBbox = target.getBbox();

    let bpsLength = edge.bendpoints.length;

    if (bpsLength > 0)
    {
      function findPortFromDir(dir, bbox, bp)
      {
        let output;
        switch(dir)
        {
          case 0:
            output = { x: bbox.x1, y: bp.y};
            break;

          case 1:
            output = { x: bp.x, y: bbox.y1};
            break;

          case 2:
            output = { x: bbox.x2, y: bp.y};
            break;

          case 3:
            output = { x: bp.x, y: bbox.y2};
            break;
        }
        return output;
      };

      //get direction to source and target from first and last bendpoint
      let firstBp = {x: edge.bendpoints[0].x, y: edge.bendpoints[0].y};
      let lastBp = {x: edge.bendpoints[bpsLength - 1].x, y:edge.bendpoints[bpsLength - 1].y};

      let dir1 = this.direction(firstBp, edge.sourcePoint);
      let dir2 = this.direction(lastBp, edge.targetPoint);

      edge.sourcePort = findPortFromDir(dir1, srcBbox, firstBp);
      edge.targetPort = findPortFromDir(dir2, tgtBbox, lastBp);


      edge.convertToRelativeBendPosition();
      
    }
    else
    {
        if (srcIsCompound && !target.isCompound()) 
        {
            if (srcBbox.x1 <= tgtCenterX && tgtCenterX <= srcBbox.x2) 
            {
              //if target is on top
              if (tgtCenterY < srcBbox.y1)
              {
                edge.sourcePort = { x: tgtCenterX, y: srcBbox.y1 };
                edge.targetPort = { x: tgtCenterX, y: tgtBbox.y2 };
              }
              //target is on bottom
              else if (tgtCenterY > srcBbox.y2)
              {
                edge.sourcePort = { x: tgtCenterX, y: srcBbox.y2 };
                edge.targetPort = { x: tgtCenterX, y: tgtBbox.y1 };
              } 
            } 
            else if (srcBbox.y1 <= tgtCenterY && tgtCenterY <= srcBbox.y2) 
            {
              //if target is on the left
              if (tgtCenterX < srcBbox.x1)
              {
                edge.sourcePort = { x: srcBbox.x1, y: tgtCenterY };
                edge.targetPort = { x: tgtBbox.x2, y: tgtCenterY };
              }
              //if target is on the right
              else if (tgtCenterX > srcBbox.x2)
              {
                edge.sourcePort = { x: srcBbox.x2, y: tgtCenterY };
                edge.targetPort = { x: tgtBbox.x1, y: tgtCenterY };
              } 
            } 
            if (edge.sourcePort == null || edge.targetPort == null) //target has been moved to inside the compound
            {
                let arr = [
                    { x: srcBbox.x2, y: tgtCenterY }, //right
                    { x: tgtCenterX, y: srcBbox.y2 }, //bottom
                    { x: srcBbox.x1, y: tgtCenterY },  //left
                    { x: tgtCenterX, y: srcBbox.y1 } //top
                ];

                let min = Number.MAX_VALUE;

                let distArray = [];
                let freeDirs = target.getFreeDirs(source);
                for (let j = 0; j < arr.length; j++)
                {
                    if (freeDirs.includes(j))
                    {
                      let distance = this.distance(target.getCenter(), arr[j])
                      distArray.push(distance);
                      if (distance < min)
                          min = distance;
                    }
                    else
                        distArray.push(null);
                }

                let index = distArray.indexOf(min);
                edge.sourcePort = arr[index];
                if (index == 3)
                    edge.targetPort = { x: tgtCenterX, y: tgtBbox.y1 };
                else if (index == 0)
                    edge.targetPort = { x: tgtBbox.x2, y: tgtCenterY };
                else if (index == 1)
                    edge.targetPort = { x: tgtCenterX, y: tgtBbox.y2 };
                else
                    edge.targetPort = { x: tgtBbox.x1, y: tgtCenterY };
            }
        } 
        else if (!srcIsCompound && target.isCompound()) 
        {
            if (tgtBbox.x1 < srcCenterX && srcCenterX < tgtBbox.x2) 
            {
              //source can either be on top or on bottom i.e. north or south
              //if source is on top
              if (srcCenterY < tgtBbox.y1)
              {
                edge.targetPort = { x: srcCenterX, y: tgtBbox.y1 };
                edge.sourcePort = { x: srcCenterX, y: srcBbox.y2 };
              }
              //source is on bottom
              else if (srcCenterY > tgtBbox.y2)
              {
                edge.targetPort = { x: srcCenterX, y: tgtBbox.y2 };
                edge.sourcePort = { x: srcCenterX, y: srcBbox.y1 };
              } 
            } 
            else if (tgtBbox.y1 < srcCenterY && srcCenterY < tgtBbox.y2) 
            {
              //edge can be straight
              //if source is on the left
              if (srcCenterX < tgtBbox.x1)
              {
                edge.targetPort = { x: tgtBbox.x1, y: srcCenterY };
                edge.sourcePort = { x: srcBbox.x2, y: srcCenterY };
              }
              //if source is on the right
              else if (srcCenterX > tgtBbox.x2)
              {
                edge.targetPort = { x: tgtBbox.x2, y: srcCenterY };
                edge.sourcePort = { x: srcBbox.x1, y: srcCenterY };
              } 
            }
            if (edge.sourcePort == null || edge.targetPort == null) //target has been moved to inside the compound
            {
                let arr = [
                    { x: tgtBbox.x2, y: srcCenterY },
                    { x: srcCenterX, y: tgtBbox.y2 },
                    { x: tgtBbox.x1, y: srcCenterY },
                    { x: srcCenterX, y: tgtBbox.y1 },
                ];

                let min = Number.MAX_VALUE;
                
                let distArray = [];
                let freeDirs = source.getFreeDirs(target);
                for (let j = 0; j < arr.length; j++)
                {
                    if (freeDirs.includes(j))
                    {
                      let distance = this.distance(target.getCenter(), arr[j])
                      distArray.push(distance);
                      if (distance < min)
                          min = distance;
                    }
                    else
                        distArray.push(null);

                }

                let index = distArray.indexOf(min);
                edge.targetPort = arr[index];
                if (index == 3)
                    edge.sourcePort = { x: srcCenterX, y: srcBbox.y1 };
                else if (index == 0)
                    edge.sourcePort = { x: srcBbox.x2, y: srcCenterY };
                else if (index == 1)
                    edge.sourcePort = { x: srcCenterX, y: srcBbox.y2 };
                else
                    edge.sourcePort = { x: srcBbox.x1, y: srcCenterY };
            }
        } 

        else if (source.isCompound() && target.isCompound()) 
        {
            let sourcePos = nodeDict[edge.source.id.concat("-").concat(edge.id)].getCenter();
            let targetPos = nodeDict[edge.target.id.concat("-").concat(edge.id)].getCenter();

            //we check if the target node lies within the width of the source node
            if (srcBbox.x1 <= tgtBbox.x1 && tgtBbox.x1 <= srcBbox.x2 || srcBbox.x1 <= tgtBbox.x2 && tgtBbox.x2 <= srcBbox.x2
             || tgtBbox.x1 <= srcBbox.x1 && srcBbox.x1 <= tgtBbox.x2 || tgtBbox.x1 <= srcBbox.x2 && srcBbox.x2 <= tgtBbox.x2) 
            {
              //vertical edge
              //if target lies on top of the source node
              if (tgtCenterY < srcCenterY) 
              {
                if (tgtBbox.x1 <= sourcePos.x && sourcePos.x <= tgtBbox.x2)
                {
                  edge.sourcePort = { x: sourcePos.x, y: srcBbox.y1 };
                  edge.targetPort = { x: sourcePos.x, y: tgtBbox.y2 };
                }
                else
                {
                  edge.sourcePort = { x: targetPos.x, y: srcBbox.y1 };
                  edge.targetPort = { x: targetPos.x, y: tgtBbox.y2 };
                }
              }
              //if target lies at the bottom
              else 
              {
                if (tgtBbox.x1 <= sourcePos.x && sourcePos.x <= tgtBbox.x2)
                {
                  edge.sourcePort = { x: sourcePos.x, y: srcBbox.y2 };
                  edge.targetPort = { x: sourcePos.x, y: tgtBbox.y1 };
                }
                else
                {
                  edge.sourcePort = { x: targetPos.x, y: srcBbox.y2 };
                  edge.targetPort = { x: targetPos.x, y: tgtBbox.y1 };
                }
              }
            }
            //we check if the target node lies within the height of the source node
            else if (srcBbox.y1 <= tgtBbox.y1 && tgtBbox.y1 <= srcBbox.y2 || srcBbox.y1 <= tgtBbox.y2 && tgtBbox.y2 <= srcBbox.y2
                  || tgtBbox.y1 <= srcBbox.y1 && srcBbox.y1 <= tgtBbox.y2 || tgtBbox.y1 <= srcBbox.y2 && srcBbox.y2 <= tgtBbox.y2) 
            {
              //horizontal edge
              //if target lies on the left of the source node
              if (tgtCenterX < srcCenterX) 
              {
                if (tgtBbox.y1 <= sourcePos.y && sourcePos.y <= tgtBbox.y2)
                {
                  edge.sourcePort = { x: srcBbox.x1, y: sourcePos.y };
                  edge.targetPort = { x: tgtBbox.x2, y: sourcePos.y };
                }
                else
                {
                  edge.sourcePort = { x: srcBbox.x1, y: targetPos.y };
                  edge.targetPort = { x: tgtBbox.x2, y: targetPos.y };
                }
              }
              //if target lies on the right of the source node
              else 
              {
                if (tgtBbox.y1 <= sourcePos.y && sourcePos.y <= tgtBbox.y2)
                {
                  edge.sourcePort = { x: srcBbox.x2, y: sourcePos.y };
                  edge.targetPort = { x: tgtBbox.x1, y: sourcePos.y };
                }
                else
                {
                  edge.sourcePort = { x: srcBbox.x2, y: targetPos.y };
                  edge.targetPort = { x: tgtBbox.x1, y: targetPos.y };
                }
              }
            } 
        }
    }

    outputEdges.push(edge);
  }

  return outputEdges;
};

ctsmLayout.prototype.distance = function (a,b)
{
  return Math.sqrt(Math.pow((a.x - b.x), 2) + Math.pow((a.y - b.y), 2));
};

ctsmLayout.prototype.insertNodeIntoCompoundBoundary = function(node, boundaryList)
{
  let point = node.getCenter();

  if (boundaryList.length == 1)
  {
    boundaryList.push(node);
    return;
  }

  //now insert the endpoint at correct location in the boundarylist
  for (let k = 0; k < boundaryList.length; k++)
  {
    let value1 = boundaryList[k].getCenter();
    let value2;
    if (k != boundaryList.length - 1)
    {
      value2 = boundaryList[k + 1].getCenter();
    }
    else
    {
      value2 = boundaryList[0].getCenter();
    }
    if (value1.x == value2.x && point.x == value1.x)
    {
      if ((value1.y < point.y && point.y < value2.y) || (value2.y < point.y && point.y < value1.y))
      {
        boundaryList.splice(k + 1, 0, node);
      }
    }
    else if (value1.y == value2.y && point.y == value1.y)
    {
      if ((value1.x < point.x && point.x < value2.x) || (value2.x < point.x && point.x < value1.x))
      {
        boundaryList.splice(k + 1, 0, node);
      }
    }
  }
};

ctsmLayout.prototype.convertToSimpleGraph = function(gm, compoundNodes)
{
    var simpleGm = this.newGraphManager();
    let parent = simpleGm.addRoot();
    let newEdges = [];
    let nodeDict = {};

    //Copy the non-compound nodes to the new graph manager
    let allNodes = gm.getAllNodes();
    for (let i = 0; i < allNodes.length; i++)
    {
      let node = allNodes[i]; 
      if (!node.isCompound())
      {
        let newNode = parent.add(this.newNode(node.getLocation(), new DimensionD(node.getWidth(), node.getHeight())));
        newNode.id = node.id;
        nodeDict[newNode.id] = newNode;
      }
    }

    //copy the simple edges(whose source and target are both non compound nodes and which are not intergraph edges)
    let allEdges = gm.getAllEdges();
    for (let i = 0; i < allEdges.length; i++)
    {
      let edge = allEdges[i];
      if (!edge.source.isCompound() && !edge.target.isCompound())
      {
        let source = nodeDict[edge.source.id];
        let target = nodeDict[edge.target.id];
        let newEdge = simpleGm.add(this.newEdge(), source, target);
        newEdge.id = edge.id;
      }
    }

    for (let i = 0; i < compoundNodes.length; i++)
    {
      let node = compoundNodes[i];

      //1. Get boundary corner points
      node.createDummyCornerNodes(simpleGm, nodeDict, 1);
      
      let boundaryList = node.boundaryList;
      
      //2. Get endpoints of incident edges to the compound node
      let edges = node.edges;
      
      for (let j = 0; j < edges.length; j++)
      {
        let edge = edges[j];
        let endpoint1, endpoint2;
        if (edge.source == node)
        {  
          endpoint1 = edge.sourceEndpoint();
          if (edge.target.isCompound())
            endpoint2 = edge.target.id.concat("-").concat(edge.id);
          else
            endpoint2 = edge.target.id;
        }
        else
        {
          endpoint1 = edge.targetEndpoint();
          if (edge.source.isCompound())
            endpoint2 = edge.source.id.concat("-").concat(edge.id);
          else
            endpoint2 = edge.source.id;
        }

        let newNode = parent.add(this.newNode({x: endpoint1.x - 0.5, y: endpoint1.y - 0.5}, new DimensionD(1, 1)));
        newNode.id = node.id.concat("-").concat(edge.id);
        newNode.isCmpdBoundaryNode = true;  
        node.insertNodeToBoundary(newNode);
        nodeDict[newNode.id] = newNode;

        //store the new edges that have to be created in this case

        if (edge.source == node)
          newEdges.push([newNode.id, endpoint2]);
        else
          newEdges.push([endpoint2, newNode.id]);

      }

      //3. check if the child graph of the compound node is disconnected from outside
      //if this is the case, convert the graph to a connected graph
      
      let childGraphs = [node.child].concat(node.getChildGraphs());
      let connectivityCheck = node.findConnectivity(childGraphs);

      //if the child graph is disconnected it needs to be connected   
      if (!connectivityCheck) 
      {
        node.createConnectedGraph(nodeDict, simpleGm, this);
      }

      //4. construct edges along the boundary of the compound nodes
      for (let j = 0; j < boundaryList.length; j++)
      {
        let source = nodeDict[boundaryList[j].id];
        let target;
        if (j != boundaryList.length - 1)
          target = nodeDict[boundaryList[j + 1].id];
        else
          target = nodeDict[boundaryList[0].id];

        let newEdge = simpleGm.add(this.newEdge(), source, target);
        newEdge.id = source.id.concat("to").concat(target.id);
        newEdge.parentNode = node;
      }

      node.boundaryList = boundaryList;
    }

    //now create the compound connected edges in the graph
    for (let i = 0; i < newEdges.length; i++)
    {
      let edge = newEdges[i];
      let source = nodeDict[edge[0]];
      let target = nodeDict[edge[1]];

      //an edge might already have been created if both endpoints belong to compound nodes
      if (source.findEdgeBetween(target))
        continue;

      let newEdge = simpleGm.add(this.newEdge(), source, target);
      newEdge.id = source.id.concat("to").concat(target.id);
    }
    return nodeDict;
  
};

ctsmLayout.prototype.onSegment = function(p, q, r)
{
    if (q.x <= Math.max(p.x, r.x) && q.x >= Math.min(p.x, r.x) && q.y <= Math.max(p.y, r.y) && q.y >= Math.min(p.y, r.y))
        return true;
  
    return false;
};
  
ctsmLayout.prototype.orientation = function(p, q, r)
{
    let val = (q.y - p.y) * (r.x - q.x) - (q.x - p.x) * (r.y - q.y);
  
    if (val == 0) 
      return 0;
  
    return (val > 0)? 1: 2;
};
  
ctsmLayout.prototype.doIntersect = function(p1, q1, p2, q2)
{
    // Find the four orientations needed for general and
    // special cases
    let o1 = this.orientation(p1, q1, p2);
    let o2 = this.orientation(p1, q1, q2);
    let o3 = this.orientation(p2, q2, p1);
    let o4 = this.orientation(p2, q2, q1);
  
    // General case
    if (o1 != o2 && o3 != o4)
        return true;
  
    // Special Cases
    // p1, q1 and p2 are colinear and p2 lies on segment p1q1
    if (o1 == 0 && this.onSegment(p1, p2, q1)) 
      return true;
  
    // p1, q1 and q2 are colinear and q2 lies on segment p1q1
    if (o2 == 0 && this.onSegment(p1, q2, q1)) 
      return true;
  
    // p2, q2 and p1 are colinear and p1 lies on segment p2q2
    if (o3 == 0 && this.onSegment(p2, p1, q2)) 
      return true;
  
    // p2, q2 and q1 are colinear and q1 lies on segment p2q2
    if (o4 == 0 && this.onSegment(p2, q1, q2)) 
      return true;
  
    return false; // Doesn't fall in any of the above cases
};

//for simple edge crosses
ctsmLayout.prototype.findEdgeCrosses = function(edges1, edges2)
{
    let crossingEdges = [];
    for (let i = 0; i < edges1.length; i++) 
    {
        let edge = edges1[i];
        let srcLoc = null;
        let tgtLoc = null;

        if (edge.source.isCompound())
            srcLoc = edge.sourceEndpoint();
        else
            srcLoc = edge.source.getCenter();

        if (edge.target.isCompound())
            tgtLoc = edge.targetEndpoint();
        else
            tgtLoc = edge.target.getCenter();

        for (var j = i + 1; j < edges2.length; j++) 
        {
            let otherEdge = edges2[j]; 

            //if edges originate from the same node, dont find intersection
            if (edge.source == otherEdge.source || edge.source == otherEdge.target)
              continue;

            if (edge.target == otherEdge.source || edge.target == otherEdge.target)
              continue;

            let otherSrcLoc = null;
            let otherTgtLoc = null;

            if (otherEdge.source.isCompound())
                otherSrcLoc = otherEdge.sourceEndpoint();
            else
                otherSrcLoc = otherEdge.source.getCenter();

            if (otherEdge.target.isCompound())
                otherTgtLoc = otherEdge.targetEndpoint();
            else
                otherTgtLoc = otherEdge.target.getCenter();

            if (this.doIntersect(srcLoc, tgtLoc, otherSrcLoc, otherTgtLoc)) 
            {
                let intersectionPoint = this.findIntersection(srcLoc, tgtLoc, otherSrcLoc, otherTgtLoc);
                crossingEdges.push([edge, otherEdge, intersectionPoint]);
                
            }
        }
    }
    return crossingEdges;
};

ctsmLayout.prototype.createDummiesForCrossings = function(gm, edgeCrosses, edgeSplitDict, nodeDict)
{
    let dummyNodes = [];
    for (let i = 0; i < edgeCrosses.length; i++)
    {
        let edgeCrossing = edgeCrosses[i];
        let edge1 = edgeCrossing[0];
        let edge2 = edgeCrossing[1];
        let crossingPoint = edgeCrossing[2];

        //create a dummy node for the edge crossing
        let parent = gm.getRoot();
        let dummyNode = parent.add(this.newNode(crossingPoint, new DimensionD(1,1)));
        dummyNode.setCenter(crossingPoint.x, crossingPoint.y);
        dummyNode.id = "cdnode" + (i + 1).toString();  //cdn: edge crossing dummy node
        dummyNodes.push(dummyNode);
        nodeDict[dummyNode.id] = dummyNode;

        //if edge is a boundary edge of a compound node
        if (edge1.parentNode != null)
        {
          edge1.parentNode.insertNodeToBoundary(dummyNode);
        }
        if (edge2.parentNode != null)
        {
          edge2.parentNode.insertNodeToBoundary(dummyNode);
        }

        if (edgeSplitDict[edge1.id] != undefined)
        {
          //find the split edge section which contains the crossing point
          let splitEdges = edgeSplitDict[edge1.id];
          for (let k = 0; k < splitEdges.length; k++)
          {
            let e1 = splitEdges[k];
            let src = e1.source;
            let mid = e1.target;
            if (mid.octalCode(src) == mid.octalCode(dummyNode))
            {
              edge1 = e1;
              break;
            }
          }
        }
        if (edgeSplitDict[edge2.id] != undefined)
        {
          //find the split edge section which contains the crossing point
          let splitEdges = edgeSplitDict[edge2.id];
          for (let k = 0; k < splitEdges.length; k++)
          {
            let e1 = splitEdges[k];
            let src = e1.source;
            let mid = e1.target;
            if (mid.octalCode(src) == mid.octalCode(dummyNode))
            {
              edge2 = e1;
              break;
            }
          }
        }

        //connect the sources and targets to the dummy node
        let dummyEdge1 = gm.add(this.newEdge(), edge1.source, dummyNode);
        dummyEdge1.id = "cdedge:" + edge1.source.id + "to" + dummyNode.id;
        dummyEdge1.parentEdge = edge1;

        let dummyEdge2 = gm.add(this.newEdge(), dummyNode, edge1.target);
        dummyEdge2.id = "cdedge:" + dummyNode.id + "to" + edge1.target.id;
        dummyEdge2.parentEdge = edge1;

        let dummyEdge3 = gm.add(this.newEdge(), edge2.source, dummyNode);
        dummyEdge3.id = "cdedge:" + edge2.source.id + "to" + dummyNode.id;
        dummyEdge3.parentEdge = edge2;

        let dummyEdge4 = gm.add(this.newEdge(), dummyNode, edge2.target);
        dummyEdge4.id = "cdedge:" + dummyNode.id + "to" + edge2.target.id;
        dummyEdge4.parentEdge = edge2;

        edgeSplitDict[edge1.id] = [dummyEdge1, dummyEdge2];
        edgeSplitDict[edge2.id] = [dummyEdge3, dummyEdge4];

        let edge1temp = edge1;
        let edge2temp = edge2;

        let temp = edge1;
        let pEdge = temp.parentEdge;
        let arr = edgeSplitDict[temp.id];
        while (temp.id.includes("cdnode"))
        {
          let index = edgeSplitDict[pEdge.id].indexOf(temp);
          edgeSplitDict[pEdge.id].splice(index, 1);
          
          for (let k = 0; k < arr.length; k++)
            edgeSplitDict[pEdge.id].splice(index + k, 0, arr[k]); 

          pEdge = pEdge.parentEdge;
          if (pEdge == null)
            break;
        }

        temp = edge2;
        pEdge = temp.parentEdge;
        arr = edgeSplitDict[temp.id];
        while (temp.id.includes("cdnode"))
        {
          let index = edgeSplitDict[pEdge.id].indexOf(temp);
          edgeSplitDict[pEdge.id].splice(index, 1);
          
          for (let k = 0; k < arr.length; k++)
            edgeSplitDict[pEdge.id].splice(index + k, 0, arr[k]); 

          pEdge = pEdge.parentEdge;
          if (pEdge == null)
            break;
        }

        //delete both of the edges from the graph
        if (edge1temp.isInterGraph)
        {
          gm.remove(edge1temp);
        }
        else
        {
          var graph = gm.calcLowestCommonAncestor(edge1temp.source, edge1temp.target);
          graph.remove(edge1temp);
        }

        if (edge2temp.isInterGraph)
        {
          gm.remove(edge2temp);
        }
        else
        {
          var graph = gm.calcLowestCommonAncestor(edge2temp.source, edge2temp.target);
          graph.remove(edge2temp);
        }

        gm.resetAllEdges();
        gm.resetAllNodes();
        gm.getAllEdges();
        gm.getAllNodes();
    }

    return dummyNodes;
};

ctsmLayout.prototype.compactGraphHelper = function(gm, iel, axis, dir)
{
    let dict = this.createAxisDict(gm, axis);

    let indexDict, nextPosList;
    [dict, indexDict, nextPosList] = this.sortAndCombineDict(dict, indexDict);

    this.createVisibilityGraph(nextPosList, indexDict);

    this.assignNewLocsToBars(indexDict, dir, iel);

    this.reLocateBarMembers(gm, indexDict, dir, iel, axis);

    let ael = gm.getAverageEdgeLength();
    let area = gm.getArea();

    return [ael, area];
};


ctsmLayout.prototype.compactGraph = function(gm, maxPasses, iel)
{
    /*
     * if dir == 0, horizontal compaction is done towards right, vertical compaction is done towards bottom
     * if dir == 1, horizontal compaction is done towards left , vertical compaction is done towards top
     */

    let LEFT_TO_RIGHT = 0;
    let RIGHT_TO_LEFT = 1;
    let TOP_TO_BOTTOM = 0;
    let BOTTOM_TO_TOP  = 1;

    let aelArray = [];
    let areaArray = [];

    let ael = gm.getAverageEdgeLength();

    let area = gm.getArea();

    let prevArea = area/10000;

    for (let i = 1; i <= maxPasses; i++)
    {
        let ael1, ael2, ael3, ael4;
        let area1, area2, area3, area4;
        if (i % 4 == 1)
        {
          [ael1, area1] = this.compactGraphHelper(gm, iel, "y", TOP_TO_BOTTOM);
          [ael2, area2] = this.compactGraphHelper(gm, iel, "x", LEFT_TO_RIGHT);
          [ael3, area3] = this.compactGraphHelper(gm, iel, "y", BOTTOM_TO_TOP);
          [ael4, area4] = this.compactGraphHelper(gm, iel, "x", RIGHT_TO_LEFT);
        }
        else if (i % 4 == 2)
        {
          [ael1, area1] = this.compactGraphHelper(gm, iel, "y", BOTTOM_TO_TOP);
          [ael2, area2] = this.compactGraphHelper(gm, iel, "x", RIGHT_TO_LEFT);
          [ael3, area3] = this.compactGraphHelper(gm, iel, "y", TOP_TO_BOTTOM);
          [ael4, area4] = this.compactGraphHelper(gm, iel, "x", LEFT_TO_RIGHT);
        }
        else if (i % 4 == 3)
        {
          [ael1, area1] = this.compactGraphHelper(gm, iel, "x", LEFT_TO_RIGHT);
          [ael2, area2] = this.compactGraphHelper(gm, iel, "y", TOP_TO_BOTTOM);
          [ael3, area3] = this.compactGraphHelper(gm, iel, "x", RIGHT_TO_LEFT);
          [ael4, area4] = this.compactGraphHelper(gm, iel, "y", BOTTOM_TO_TOP);
        }
        else
        {
          [ael1, area1] = this.compactGraphHelper(gm, iel, "x", RIGHT_TO_LEFT);
          [ael2, area2] = this.compactGraphHelper(gm, iel, "y", BOTTOM_TO_TOP);
          [ael3, area3] = this.compactGraphHelper(gm, iel, "x", LEFT_TO_RIGHT);
          [ael4, area4] = this.compactGraphHelper(gm, iel, "y", TOP_TO_BOTTOM);
        }

        let avgAel =  (ael1  + ael2  + ael3  + ael4 ) / 4;
        let avgArea = (area1 + area2 + area3 + area4) / 4;
        aelArray.push(parseInt(avgAel));
        areaArray.push(avgArea/10000);

        if (prevArea == avgArea)
            break;
        else
            prevArea = avgArea
    }

};

ctsmLayout.prototype.createAxisDict = function(gm, axis)
{
    let dict = {};
    let allNodes = gm.getAllNodes();
    let allEdges = gm.getAllEdges();

    //add simple nodes to the dictionary
    for (let i = 0; i < allNodes.length; i++)
    {
        let node = allNodes[i];
        let pos1, pos2;

        if (axis == "x")
        {
            pos1 = node.getCenterX();
            pos2 = node.getCenterY();
        }
        else
        {
            pos1 = node.getCenterY();
            pos2 = node.getCenterX();
        }
        if (dict[pos1] == undefined)
            dict[pos1] = [];

        dict[pos1].push([null, [pos2], [node]]); 
    } 
   
    //add bendpoints to the dictionary
    for (let i = 0; i < allEdges.length; i++)
    {
        let edge = allEdges[i];
        
        if (edge.bendpoints.length > 0)
        {
            for (let j = 0; j < edge.bendpoints.length; j++)
            {
                let bendpoint = edge.bendpoints[j];
                let pos1, pos2;

                if (axis == "x")
                {
                    pos1 = bendpoint.x;
                    pos2 = bendpoint.y;
                }
                else
                {
                    pos1 = bendpoint.y;
                    pos2 = bendpoint.x;
                }

                if (dict[pos1] == undefined)
                    dict[pos1] = [];

                dict[pos1].push([null, [pos2], [bendpoint]]);
            }
        }
    }
    return dict;
};

ctsmLayout.prototype.sortAndCombineDict = function(dict, indexDict)
{
    let dictValues = Object.values(dict);
    let dictKeys = Object.keys(dict);

    let index = 0;

    let nextPosList = {};

    indexDict = {};

    let modify = false;
    
    for (let j = 0; j < dictValues.length; j++) 
    {
        let row = dictValues[j];

        row.sort(function(a, b) {
          return a[1][0] - b[1][0];
        });

        let combine = false;

        //then check if each consecutive item in the values is connected or not
        for (let i = 0; i < row.length - 1; i++)
        {
            modify = true;
            let currRow = row[i];
            let nextRow = row[i + 1];

            let currRowLN = currRow[2][currRow[2].length - 1];
            let nextRowFN = nextRow[2][0];

            //now check if these two items are connected
            if (!(currRowLN instanceof ctsmNode) && !(nextRowFN instanceof ctsmNode))
            {
                //both are bendpoints
                let bp1 = currRowLN;
                let bp2 = nextRowFN;
                if (bp1.id == bp2.srcId || bp1.id == bp2.tgtId)
                  combine = true;
            }
            else if (currRowLN instanceof ctsmNode && nextRowFN instanceof ctsmNode)
            {
                //both are nodes
                let node1 = currRowLN;
                let node2 = nextRowFN;
                let edge = node1.findEdgeBetween(node2);
                if (edge != null)
                  combine = true;
            }
            else if (currRowLN instanceof ctsmNode && !(nextRowFN instanceof ctsmNode))
            {
                let node = currRowLN;
                let bp = nextRowFN;
                if (node.id == bp.srcId || node.id == bp.tgtId)
                  combine = true;
            }
            else if (!(currRowLN instanceof ctsmNode) && nextRowFN instanceof ctsmNode)
            {
                let bp = currRowLN;
                let node = nextRowFN;
                if (node.id == bp.srcId || node.id == bp.tgtId)
                  combine = true;
            }

            if (currRow[0] == null)
            {
                currRow[0] = index;
            }

            if (combine == true)
            {
                //lets combine this removed row to the current row
                currRow[1] = currRow[1].concat(nextRow[1]);
                currRow[2] = currRow[2].concat(nextRow[2]);
                row.splice(i + 1, 1);

                if (row.indexOf(currRow) == row.length - 1)
                {
                  indexDict[index] = 
                  { 
                      dictKey: dictKeys[j], 
                      posData: currRow[1], 
                      nodes: currRow[2],
                      futureBars: [],
                      prevBars: [],
                      newLoc: null
                  };
                  index++;
                }
            }
            else
            {
                indexDict[index] = 
                { 
                    dictKey: dictKeys[j], 
                    posData: currRow[1], 
                    nodes: currRow[2],
                    futureBars: [],
                    prevBars: [],
                    newLoc: null
                };
                index++;
            }

            if (combine == false && row.indexOf(nextRow) == row.length - 1)
            {
              nextRow[0] = index;
              indexDict[index] = 
              { 
                  dictKey: dictKeys[j], 
                  posData: nextRow[1], 
                  nodes: nextRow[2],
                  futureBars: [],
                  prevBars: [],
                  newLoc: null
              };
              index++;
            }

            if (combine == true)
            {
                combine = false;
                i--;
            }
        }

        if (row.length == 1 && modify == false)
        {
            let currRow = row[0];
            currRow[0] = index;
            indexDict[index] = 
            { 
                dictKey: dictKeys[j], 
                posData: currRow[1], 
                nodes: currRow[2],
                futureBars: [],
                prevBars: [],
                newLoc: null
            };
            index++;
        }

        modify = false;

        dict[dictKeys[j]] = row;

        nextPosList[dictKeys[j]] = index;
    }
    return [dict, indexDict, nextPosList];
};

ctsmLayout.prototype.reLocateBarMembers = function(gm, indexDict, dir, iel, axis)
{
    let bars = Object.values(indexDict);
    let keys = Object.keys(indexDict);

    let refBar;
    if (dir == 0)
        refBar = bars[bars.length - 1];
    else
        refBar = bars[0];

    let refPos = parseInt(refBar.dictKey);

    for (let i = 0; i < bars.length; i++)
    {
        let bar = bars[i];
        if (bar.newLoc == 0 && bar == refBar)
            continue;
        else
        {
            let newPos = refPos + bar.newLoc * iel;
            let nodes = bar.nodes;

            //change the node positions only if they are different than the new ones
            if (nodes[0] instanceof ctsmNode && ((axis == "x" && newPos == nodes[0].getCenterX())
                                               || (axis == "y" && newPos == nodes[0].getCenterY())))
                continue;
            else if (!(nodes[0] instanceof ctsmNode) && ((axis == "x" && newPos == nodes[0].x)
                                               || (axis == "y" && newPos == nodes[0].y)))
                continue;


            //update positions of all nodes/bps in that bar
            for (let j = 0; j < nodes.length; j++)
            {
                let item = nodes[j];
                if (item instanceof ctsmNode)
                {
                    if (axis == "x")
                    {
                        item.setCenter(newPos, item.getCenterY());
                    }
                    else
                        item.setCenter(item.getCenterX(), newPos);
                }
                else
                {
                    if (axis == "x")
                        item.x = newPos; 
                    else
                        item.y = newPos;
                }
            }
        }
    }
};


ctsmLayout.prototype.assignNewLocsToBars = function(indexDict, dir, iel)
{
    /*
     * if dir == 0, horizontal compaction is done towards right, vertical compaction is done towards bottom
     * if dir == 1, horizontal compaction is done towards left , vertical compaction is done towards bottom
     */

    let bars = Object.values(indexDict);
    let keys = Object.keys(indexDict);

    let data = null;
    if (dir == 0)
    {
        data = "futureBars";
        for (let i = bars.length - 1; i >= 0; i--)
        {
            let bar = bars[i];
            let futureBars = bar[data];
            if (futureBars.length == 0)
            {
                if (i == bars.length - 1)
                    bar.newLoc = 0;
                else
                    bar.newLoc = (parseInt(bar.dictKey) - parseInt(bars[bars.length - 1].dictKey)) / iel;
            }
            else
            {
                //find the future bars with minimum value of new location
                let min = Number.MAX_VALUE;
                for (let j = 0; j < futureBars.length; j++)
                {
                  let index = futureBars[j];
                  if (indexDict[index].newLoc < min)
                    min = indexDict[index].newLoc;
                }
                bar.newLoc = min - 1;  
            }
        }
    }
    else if (dir == 1)
    {
        data = "prevBars";
        for (let i = 0; i < bars.length; i++)
        {
            let bar = bars[i];
            let prevBars = bar[data];
            if (prevBars.length == 0)
            {
                if (i == 0)
                    bar.newLoc = 0;
                else
                    bar.newLoc = (parseInt(bar.dictKey) - parseInt(bars[0].dictKey)) / iel;
            }
            else
            {
                //find the future bars with maximum value of new location
                let max = Number.MIN_VALUE;
                for (let j = 0; j < prevBars.length; j++)
                {
                  let index = prevBars[j];
                  if (indexDict[index].newLoc > max)
                    max = indexDict[index].newLoc;
                }
                bar.newLoc = max + 1; 
            }
        }
    } 
};

ctsmLayout.prototype.createVisibilityGraph = function(posList, indexDict)
{
    let bars = Object.values(indexDict);
    let keys = Object.keys(indexDict);

    //working on all bars at all x or y values
    for (let i = 0; i < bars.length - 1; i++)
    {
        let bar1 = bars[i];
        let dictKey = bar1.dictKey;

        let sp1 = bar1.posData[0];
        let ep1;
        if (bar1.posData.length == 1)
            ep1 = bar1.posData[0];   //in this case, it is not a bar but a single node
        else
            ep1 = bar1.posData[bar1.posData.length - 1];

        //get starting index of next x/y value
        let index = posList[dictKey];

        let compData = [];

        for (let j = index; j < bars.length; j++)
        {
            let bar2 = bars[j];

            let sp2 = bar2.posData[0]; //starting point of bar
            let ep2;              //end point of bar
            if (bar2.posData.length == 1)
                ep2 = bar2.posData[0];
            else
                ep2 = bar2.posData[bar2.posData.length - 1];

            if ((sp1 <= sp2 && sp2 <= ep1) || (sp1 <= ep2 && ep2 <= ep1) || (sp2 <= sp1 && sp1 <= ep2) || (sp2 <= ep1 && ep1< ep2))
            {          
                //find the part that coincides with bar1
                let sp4, ep4;
                let row = [sp1, ep1, sp2, ep2];
                row.sort(function(a, b){return a - b});
                sp4 = row[1];
                ep4 = row[2];

                let alteredData;
                let overlap = false;

                if (compData.length == 0)
                {
                    compData.push([sp4, ep4]);
                    alteredData = [sp4, ep4];
                }
                else
                {
                    //check if bar2 is covered completely by the previous bars
                    //if not, combine it into the compData
                    
                    for (let k = 0; k < compData.length; k++)
                    {
                        let sp3 = compData[k][0];
                        let ep3 = compData[k][1];

                        let row = [sp3, ep3, sp4, ep4];
                        if ((sp3 == sp4 && ep3 == ep4) || (sp3 <= sp4 && ep4 <= ep3)) //exact overlap
                        {  
                            //will not add to future bars because it is blocked
                            overlap = true;
                            break;
                        }
                        else if ((sp4 < sp3 && (sp3 <= ep4 && ep4 <= ep3)) || (ep4 > ep3 && (sp3 <= sp4 && sp4 <= ep3)) 
                                                                            || sp4 < sp3 && ep3 < ep4)
                        {
                            //will add to future bars bcz it is not completely blocked by prev bars
                            let row = [sp3, ep3, sp4, ep4];
                            row.sort(function(a, b){return a - b});
                            compData[k][0] = row[0];
                            compData[k][1] = row[3];
                            alteredData = [row[0], row[3]];
                            break;
                        }
                        else if (!(sp3 < sp4 && sp4 < ep3) || !(sp3 < ep4 && ep4 < ep3))  //no overlap
                        {
                          if (k == compData.length - 1)
                          {
                              compData.push([sp4, ep4]);
                              alteredData = [sp4, ep4];
                              break;
                          }

                        }
                    }

                    if (overlap == true)
                        continue;
                }

                //if compData is altered, check if its completely overlaps bar1
                //if it does, break

                if (overlap == false)
                {
                    bar1.futureBars.push(j);
                    bar2.prevBars.push(i);
                }

                if (alteredData != null)
                {
                    let sp3 = alteredData[0];
                    let ep3 = alteredData[1];
                    if (sp3 <= sp1 && ep1 <= ep3)
                    {
                        break;
                    }
                }
            }
        }
    }
};

module.exports = ctsmLayout;
