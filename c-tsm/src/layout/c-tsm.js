const ctsmLayout = require('../c-tsm/ctsmLayout');
const assign = require('../assign');

const defaults = Object.freeze( {

    quality: 'default',
    // use random node positions at beginning of layout
    // if this is set to false, then quality option must be "proof"
    randomize: false,
    // whether or not to animate the layout
    animate: 'end',
    // duration of animation in ms, if enabled
    animationDuration: 1000,
    // easing of animation, if enabled
    animationEasing: undefined,
    // fit the viewport to the repositioned nodes
    fit: true,
    // whether to include labels in node dimensions. Valid in "proof" quality
    nodeDimensionsIncludeLabels: false,
    /* spectral layout options */
    // false for random, true for greedy
    samplingType: true,
    // sample size to construct distance matrix
    sampleSize: 25,
    // separation amount between nodes
    nodeSeparation: 75,
    // power iteration tolerance
    piTol: 0.0000001,
    // number of ticks per frame; higher is faster but more jerky
    refresh: 30,
    // Padding on fit
    padding: 10,
    // Node repulsion (non overlapping) multiplier
    nodeRepulsion: 4500,
    // Ideal edge (non nested) length
    idealEdgeLength: 80,
    // Divisor to compute edge forces
    edgeElasticity: 0.45,
    // Nesting factor (multiplier) to compute ideal edge length for nested edges
    nestingFactor: 0.1,
    // Gravity force (constant)
    gravity: 0.25,
    // Maximum number of iterations to perform
    numIter: 2500,
    // For enabling tiling
    tile: false,
    // Represents the amount of the vertical space to put between the zero degree members during the tiling operation(can also be a function)
    tilingPaddingVertical: 10,
    // Represents the amount of the horizontal space to put between the zero degree members during the tiling operation(can also be a function)
    tilingPaddingHorizontal: 10,
    // Gravity range (constant) for compounds
    gravityRangeCompound: 1.5,
    // Gravity force (constant) for compounds
    gravityCompound: 1.0,
    // Gravity range (constant)
    gravityRange: 3.8,
    // Initial cooling factor for incremental layout
    initialEnergyOnIncremental: 0.5,
    //Represents if compaction will be applied to the graph
    compact: true,
    //Represent the maximum number of compaction passes that will be applied to the graph
    maxPasses: 10
});

class Layout 
{
  constructor( options )
  {
    this.options = assign( {}, defaults, options );
    this.ctsmNodeToCoseNode = {};
    this.cyNodesMap = {};
    this.cyEdgesMap = {};
    this.ctsmIdToLNode = {};
    this.ctsmNodesMap = {};
    this.ctsmEdgesMap = {};
  }

  run()
  {
    var ctsmIdToLNode = this.ctsmIdToLNode;
    var coseIdToLNode = {};
    var cyNodesMap = this.cyNodesMap;
    var cyEdgesMap = this.cyEdgesMap;
    var options = this.options;
    var ctsmNodesMap = this.ctsmNodesMap;
    var ctsmEdgesMap = this.ctsmEdgesMap;

    var layout = this.layout = new ctsmLayout(options);
    var self = this;

    cy = this.options.cy;
    cy.trigger({ type: 'layoutstart', layout: this });

    var gm = layout.newGraphManager();

    var nodes = cy.nodes();
    var edges = cy.edges();

    if (nodes.length < 2 || edges.length == 0)
      return;

    //we get the nodes which are parent nodes or do not have a parent node above them
    var topMostNodes = layout.getTopMostNodes(nodes, cyNodesMap);
    layout.processChildrenList(this.options, gm.addRoot(), topMostNodes, layout, "ctsm", ctsmIdToLNode);
    layout.processEdges(layout, gm, edges, ctsmIdToLNode, cyEdgesMap, ctsmEdgesMap);

    //set the parents of the nodes
    layout.setParents(gm);

    //finds and saves the compound nodes
    var compoundNodes = gm.findCompoundNodes();

    //visualizes the layout in cytoscape map
    let getPositions = function(ele, i)
    {
       if(typeof ele === "number") {
         ele = i;
       }
       var theId = ele.data('id');
       //take the ctsm node
       var lNode = self.ctsmIdToLNode[theId];
       
       return {
         x: lNode.getRect().getCenterX(),
         y: lNode.getRect().getCenterY()
       };
    };

    options.randomize = true;
    let coseLayout = layout.runCoseLayout(options, coseIdToLNode, this.ctsmNodeToCoseNode, topMostNodes);
    options.randomize = false;

    //Reflect changes back to ctsm nodes
    var ctsmNodes = gm.getAllNodes();
    for (let i = 0; i < ctsmNodes.length; i++)
    {
        let ctsmNode = ctsmNodes[i];
        let coseNode = this.ctsmNodeToCoseNode[ctsmNode.id];

        if (ctsmNode.isCompound())
        {
          //for compounds, widths and heights are also updated because they change after applying cose
          //weight, height are updated before updating center bcz doing the opposite changes location of the compound node
          ctsmNode.setWidth(coseNode.getWidth());
          ctsmNode.setHeight(coseNode.getHeight());
        }
        let loc = coseNode.getCenter();
        ctsmNode.setCenter(loc.x, loc.y);
    }

    cyCose.nodes().not(":parent").layoutPositions(this, this.options, getPositions);
    



    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    //PLANARIZATION:

    var oldGm;
    let nodeDict = {};
    let igEdges = [];

    if (compoundNodes.length > 0)
    {
      oldGm = gm;
      igEdges = gm.getInterGraphEdges();
      nodeDict = layout.convertToSimpleGraph(gm, compoundNodes);
      gm = layout.graphManager;
    }

    //find edge crossings in the graph and replace them with a dummy node
    allEdges = gm.getAllEdges();
    let edgeCrosses = layout.findEdgeCrosses(allEdges, allEdges);

    //create dummy nodes for edge crossings
    let edgeSplitDict = {};
    let dummyNodes = layout.createDummiesForCrossings(gm, edgeCrosses, edgeSplitDict, nodeDict);

    //package data to send to the python server
    //python code needs the nodes ids and their positions and the (src,tgt) data of edges to reconstruct the graph
    //so we will create an object to store all of this data
    
    let graphData = {nodes: {}, edges: []}
    let allNodes = gm.getAllNodes();
    for (let i = 0; i < allNodes.length; i++)
    {
      let node = allNodes[i];
      graphData.nodes[node.id]  = [node.getCenterX(), node.getCenterY()];
      if (compoundNodes.length == 0)
        nodeDict[node.id] = node;
    }

    let allEdges = gm.getAllEdges();
    for (let i = 0; i < allEdges.length; i++)
    {
      let edge = allEdges[i];
      graphData.edges.push([edge.source.id, edge.target.id]);
    }

    //now this jsonData has to be sent to the python server
    fetch('/tsm/', {
      method: "POST",
      body: JSON.stringify(graphData)
    })
    .then(response => response.json())
    .then(result => 
        {
          let output = JSON.parse(result);

          let nodes = output['nodes'];
          let bendData = output['bends'];

          //change the values of the positions obtained from python 
          for (var key in nodes) 
          {  
            var pos = nodes[key]; 
            pos[0] = pos[0] * options.idealEdgeLength;  
            pos[1] = pos[1] * -1 * options.idealEdgeLength; 
          }

          //Reflect changes back to ctsm nodes

          var ctsmNodes = gm.getAllNodes();
          for (let i = 0; i < ctsmNodes.length; i++)
          {
              let ctsmNode = ctsmNodes[i];
              if (ctsmNode.isCompound())
                continue;
              
              var newPos = nodes[ctsmNode.id]; 
              ctsmNode.setCenter(newPos[0], newPos[1]);
          }

          let edgesWithBends = layout.extractBends(bendData, nodeDict, nodes, edgeSplitDict);

          if (oldGm != undefined)
          {
            //Step 1: transfer positions
            ctsmNodes = oldGm.getAllNodes();
            for (let i = 0; i < ctsmNodes.length; i++)
            {
                let ctsmNode = ctsmNodes[i];

                if (ctsmNode.isCompound())
                  continue;

                let newPos = nodeDict[ctsmNode.id].getCenter();
                ctsmNode.setCenter(newPos.x, newPos.y);
            }
            gm.removeConnectivityEdges();
          }

          if (options.compact)
              layout.compactGraph(gm, options.maxPasses, options.idealEdgeLength);

          if (oldGm != undefined)
          {
            //Reflect changes back to actual ctsm nodes
            ctsmNodes = oldGm.getAllNodes();
            for (let i = 0; i < ctsmNodes.length; i++)
            {
                let ctsmNode = ctsmNodes[i];

                if (ctsmNode.isCompound())
                  continue;

                let newPos = nodeDict[ctsmNode.id].getCenter();
                ctsmNode.setCenter(newPos.x, newPos.y);
            }
          }
    
          layout.removeDummiesAndCreateBends(gm, edgeSplitDict, dummyNodes, edgesWithBends);

          //Last step: finally create edges with bends in cytoscape
          let ctsmEdges2 = gm.edgesWithBends;
          for (let i = 0; i < ctsmEdges2.length; i++)
          {
              let ctsmEdge = ctsmEdges2[i];
              let cyEdge = cyEdgesMap[ctsmEdge.id];

              function copyBps(edge1, edge2)
              {
                if (edge2.bendpoints.length == 0)
                  edge2.bendpoints = edge1.bendpoints;
                else
                {
                  for (let j = 0; j < edge1.bendpoints.length; j++)
                  {
                    edge2.bendpoints.push(edge1.bendpoints[j]);
                  }
                }
              }
              if (cyEdge != undefined)
              {
                cyEdge.css("curve-style", "segments");
                cyEdge.css("segment-weights", ctsmEdge.weight);
                cyEdge.css("segment-distances", ctsmEdge.distance);
                if (oldGm != undefined)
                {
                  let edge = ctsmEdgesMap[ctsmEdge.id];
                  copyBps (ctsmEdge, edge);
                }
              }
              else
              {
                let source = ctsmEdge.source;
                let target = ctsmEdge.target;

                let edge;
                if (source.isDummy && source.dummyOwner.isCompound() && !target.isDummy)
                {
                  edge = source.dummyOwner.findEdgeBetween(ctsmIdToLNode[target.id]);
                }
                else if (target.isDummy && target.dummyOwner.isCompound() && !source.isDummy)
                {
                  edge = target.dummyOwner.findEdgeBetween(ctsmIdToLNode[source.id]);
                }
                else if ((source.isDummy && source.dummyOwner.isCompound()) || (target.isDummy && target.dummyOwner.isCompound()))
                {
                  edge = source.dummyOwner.findEdgeBetween(target.dummyOwner);
                }
                else
                {
                  continue;
                }

                if (edge == null)
                  continue;

                copyBps(ctsmEdge, edge);

                edge.sourcePoint = ctsmEdge.source.getCenter();
                edge.targetPoint = ctsmEdge.target.getCenter();
              }
          } 
          
          cy.nodes().not(":parent").layoutPositions(this, this.options, getPositions);  
          
          if (oldGm != undefined)
          {
              layout.reshapeCompounds(compoundNodes, cyNodesMap, options.idealEdgeLength, gm);

              gm = oldGm;

              // now creating bendpoints for edges connected with compound nodes
              let compoundEdges = layout.findSrcAndTgtPorts(gm, nodeDict);
              for (let i = 0; i < compoundEdges.length; i++)
              {
                  let edge = compoundEdges[i];
                  let cyEdge = cyEdgesMap[edge.id];

                  if (edge.bendpoints.length > 0)
                  {
                    cyEdge.css("curve-style", "segments");
                    cyEdge.css("segment-weights", edge.weight);
                    cyEdge.css("segment-distances", edge.distance);
                  }  

                  if (edge.sourcePort != null && edge.targetPort!= null)
                  {
                    let relativePos1 = edge.source.getRelativeRatiotoNodeCenter(edge.sourcePort);
                    cyEdge.style({ 'source-endpoint': + relativePos1.x + "% "+ +relativePos1.y + '%' });
                    let relativePos2 = edge.target.getRelativeRatiotoNodeCenter(edge.targetPort);
                    cyEdge.style({ 'target-endpoint': + relativePos2.x + "% "+ +relativePos2.y + '%' });
                  }
              }
          }
        }
      )  
  }
}

module.exports = Layout;
