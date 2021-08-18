(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory(require("cose-base"), require("layout-base"));
	else if(typeof define === 'function' && define.amd)
		define(["cose-base", "layout-base"], factory);
	else if(typeof exports === 'object')
		exports["cytoscapeChola"] = factory(require("cose-base"), require("layout-base"));
	else
		root["cytoscapeChola"] = factory(root["coseBase"], root["layoutBase"]);
})(window, function(__WEBPACK_EXTERNAL_MODULE__4__, __WEBPACK_EXTERNAL_MODULE__10__) {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var impl = __webpack_require__(1);

// registers the extension on a cytoscape lib ref
var register = function register(cytoscape) {
  if (!cytoscape) {
    return;
  } // can't register if cytoscape unspecified

  cytoscape('layout', 'chola', impl); // register with cytoscape.js
};

if (typeof cytoscape !== 'undefined') {
  // expose to global cytoscape (i.e. window.cytoscape)
  register(cytoscape);
}

module.exports = register;

/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


module.exports = __webpack_require__(2);

/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var cholaLayout = __webpack_require__(3);
var assign = __webpack_require__(11);

var defaults = Object.freeze({

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
  idealEdgeLength: 100,
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

var Layout = function () {
  function Layout(options) {
    _classCallCheck(this, Layout);

    this.options = assign({}, defaults, options);
    this.cholaNodeToCoseNode = {};
    this.cyNodesMap = {};
    this.cyEdgesMap = {};
    this.cholaIdToLNode = {};
    this.cholaNodesMap = {};
    this.cholaEdgesMap = {};
  }

  _createClass(Layout, [{
    key: 'run',
    value: function run() {
      var _this = this;

      var cholaIdToLNode = this.cholaIdToLNode;
      var coseIdToLNode = {};
      var cyNodesMap = this.cyNodesMap;
      var cyEdgesMap = this.cyEdgesMap;
      var options = this.options;
      var cholaNodesMap = this.cholaNodesMap;
      var cholaEdgesMap = this.cholaEdgesMap;

      var layout = this.layout = new cholaLayout(options);
      var self = this;

      cy = this.options.cy;
      cy.trigger({ type: 'layoutstart', layout: this });

      var gm = layout.newGraphManager();

      var nodes = cy.nodes();
      var edges = cy.edges();

      if (nodes.length < 2 || edges.length == 0) return;

      //we get the nodes which are parent nodes or do not have a parent node above them
      var topMostNodes = layout.getTopMostNodes(nodes, cyNodesMap);
      layout.processChildrenList(this.options, gm.addRoot(), topMostNodes, layout, "chola", cholaIdToLNode);
      layout.processEdges(layout, gm, edges, cholaIdToLNode, cyEdgesMap, cholaEdgesMap);

      //set the parents of the nodes
      layout.setParents(gm);

      //finds and saves the compound nodes
      var compoundNodes = gm.findCompoundNodes();

      //visualizes the layout in cytoscape map
      var getPositions = function getPositions(ele, i) {
        if (typeof ele === "number") {
          ele = i;
        }
        var theId = ele.data('id');
        //take the chola node
        var lNode = self.cholaIdToLNode[theId];

        return {
          x: lNode.getRect().getCenterX(),
          y: lNode.getRect().getCenterY()
        };
      };

      options.randomize = true;
      var coseLayout = layout.coseOnCore(options, coseIdToLNode, this.cholaNodeToCoseNode, topMostNodes);
      options.randomize = false;

      //Reflect changes back to chola nodes
      var cholaNodes = gm.getAllNodes();
      for (var i = 0; i < cholaNodes.length; i++) {
        var cholaNode = cholaNodes[i];
        var coseNode = this.cholaNodeToCoseNode[cholaNode.id];

        if (cholaNode.isCompound()) {
          //for compounds, widths and heights are also updated because they change after applying cose
          //weight, height are updated before updating center bcz doing the opposite changes location of the compound node
          cholaNode.setWidth(coseNode.getWidth());
          cholaNode.setHeight(coseNode.getHeight());
        }
        var loc = coseNode.getCenter();
        cholaNode.setCenter(loc.x, loc.y);
      }

      cyCose.nodes().not(":parent").layoutPositions(this, this.options, getPositions);

      ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

      //PLANARIZATION:

      var oldGm;
      var nodeDict = {};
      var igEdges = [];

      if (compoundNodes.length > 0) {
        oldGm = gm;
        igEdges = gm.getInterGraphEdges();
        nodeDict = layout.convertToSimpleGraph(gm, compoundNodes);
        gm = layout.graphManager;
      }

      //find edge crossings in the graph and replace them with a dummy node
      allEdges = gm.getAllEdges();
      var edgeCrosses = layout.findEdgeCrosses(allEdges, allEdges);

      //create dummy nodes for edge crossings
      var edgeSplitDict = {};
      var dummyNodes = layout.createDummiesForCrossings(gm, edgeCrosses, edgeSplitDict, nodeDict);

      //package data to send to the python server
      //python code needs the nodes ids and their positions and the (src,tgt) data of edges to reconstruct the graph
      //so we will create an object to store all of this data

      var graphData = { nodes: {}, edges: [] };
      var allNodes = gm.getAllNodes();
      for (var _i = 0; _i < allNodes.length; _i++) {
        var node = allNodes[_i];
        graphData.nodes[node.id] = [node.getCenterX(), node.getCenterY()];
        if (compoundNodes.length == 0) nodeDict[node.id] = node;
      }

      var allEdges = gm.getAllEdges();
      for (var _i2 = 0; _i2 < allEdges.length; _i2++) {
        var edge = allEdges[_i2];
        graphData.edges.push([edge.source.id, edge.target.id]);
      }

      //now this jsonData has to be sent to the python server
      fetch('/tsm/', {
        method: "POST",
        body: JSON.stringify(graphData)
      }).then(function (response) {
        return response.json();
      }).then(function (result) {
        var output = JSON.parse(result);
        console.log(result);

        var nodes = output['nodes'];
        var bendData = output['bends'];

        //change the values of the positions obtained from python 
        for (var key in nodes) {
          var pos = nodes[key];
          pos[0] = pos[0] * options.idealEdgeLength;
          pos[1] = pos[1] * -1 * options.idealEdgeLength;
        }

        //Reflect changes back to chola nodes

        var cholaNodes = gm.getAllNodes();
        for (var _i3 = 0; _i3 < cholaNodes.length; _i3++) {
          var _cholaNode = cholaNodes[_i3];
          if (_cholaNode.isCompound()) continue;

          var newPos = nodes[_cholaNode.id];
          _cholaNode.setCenter(newPos[0], newPos[1]);
        }

        var edgesWithBends = layout.extractBends(bendData, nodeDict, nodes, edgeSplitDict);

        if (oldGm != undefined) {
          //Step 1: transfer positions
          cholaNodes = oldGm.getAllNodes();
          for (var _i4 = 0; _i4 < cholaNodes.length; _i4++) {
            var _cholaNode2 = cholaNodes[_i4];

            if (_cholaNode2.isCompound()) continue;

            var _newPos = nodeDict[_cholaNode2.id].getCenter();
            _cholaNode2.setCenter(_newPos.x, _newPos.y);
          }
          gm.removeConnectivityEdges();

          // if (options.compact) 
          //     layout.prepareGraphForCompaction(compoundNodes, cyNodesMap, gm, nodeDict, edgeSplitDict, igEdges);
        }

        if (options.compact) layout.compactGraph(gm, options.maxPasses);

        if (oldGm != undefined) {
          //Reflect changes back to actual chola nodes
          cholaNodes = oldGm.getAllNodes();
          for (var _i5 = 0; _i5 < cholaNodes.length; _i5++) {
            var _cholaNode3 = cholaNodes[_i5];

            if (_cholaNode3.isCompound()) continue;

            var _newPos2 = nodeDict[_cholaNode3.id].getCenter();
            _cholaNode3.setCenter(_newPos2.x, _newPos2.y);
          }
          // for (let i = 0; i < compoundNodes.length; i++)
          // {
          //   let node = compoundNodes[i];
          //   node.compactNode(options.idealEdgeLength);
          // }
        }

        layout.removeDummiesAndCreateBends(gm, edgeSplitDict, dummyNodes, edgesWithBends);

        //Last step: finally create edges with bends in cytoscape
        var cholaEdges2 = gm.edgesWithBends;
        for (var _i6 = 0; _i6 < cholaEdges2.length; _i6++) {
          var copyBps = function copyBps(edge1, edge2) {
            if (edge2.bendpoints.length == 0) edge2.bendpoints = edge1.bendpoints;else {
              for (var j = 0; j < edge1.bendpoints.length; j++) {
                edge2.bendpoints.push(edge1.bendpoints[j]);
              }
            }
          };

          var cholaEdge = cholaEdges2[_i6];
          var cyEdge = cyEdgesMap[cholaEdge.id];

          if (cyEdge != undefined) {
            cyEdge.css("curve-style", "segments");
            cyEdge.css("segment-weights", cholaEdge.weight);
            cyEdge.css("segment-distances", cholaEdge.distance);
            if (oldGm != undefined) {
              var _edge = cholaEdgesMap[cholaEdge.id];
              copyBps(cholaEdge, _edge);
            }
          } else {
            var source = cholaEdge.source;
            var target = cholaEdge.target;

            var _edge2 = void 0;
            if (source.isDummy && source.dummyOwner.isCompound() && !target.isDummy) {
              _edge2 = source.dummyOwner.findEdgeBetween(cholaIdToLNode[target.id]);
            } else if (target.isDummy && target.dummyOwner.isCompound() && !source.isDummy) {
              _edge2 = target.dummyOwner.findEdgeBetween(cholaIdToLNode[source.id]);
            } else if (source.isDummy && source.dummyOwner.isCompound() || target.isDummy && target.dummyOwner.isCompound()) {
              _edge2 = source.dummyOwner.findEdgeBetween(target.dummyOwner);
            } else {
              continue;
            }

            if (_edge2 == null) continue;

            copyBps(cholaEdge, _edge2);

            _edge2.sourcePoint = cholaEdge.source.getCenter();
            _edge2.targetPoint = cholaEdge.target.getCenter();
          }
        }

        cy.nodes().not(":parent").layoutPositions(_this, _this.options, getPositions);

        if (oldGm != undefined) {
          layout.reshapeCompounds(compoundNodes, cyNodesMap, options.idealEdgeLength, gm);

          gm = oldGm;

          // now creating bendpoints for edges connected with compound nodes
          var compoundEdges = layout.findSrcAndTgtPorts(gm, nodeDict);
          for (var _i7 = 0; _i7 < compoundEdges.length; _i7++) {
            var _edge3 = compoundEdges[_i7];
            var _cyEdge = cyEdgesMap[_edge3.id];

            if (_edge3.bendpoints.length > 0) {
              _cyEdge.css("curve-style", "segments");
              _cyEdge.css("segment-weights", _edge3.weight);
              _cyEdge.css("segment-distances", _edge3.distance);
            }

            if (_edge3.sourcePort != null && _edge3.targetPort != null) {
              var relativePos1 = _edge3.source.getRelativeRatiotoNodeCenter(_edge3.sourcePort);
              _cyEdge.style({ 'source-endpoint': +relativePos1.x + "% " + +relativePos1.y + '%' });
              var relativePos2 = _edge3.target.getRelativeRatiotoNodeCenter(_edge3.targetPort);
              _cyEdge.style({ 'target-endpoint': +relativePos2.x + "% " + +relativePos2.y + '%' });
            }
          }
        }
        var edgeDict = {};
        var allEdges = gm.getAllEdges();
        for (var _i8 = 0; _i8 < allEdges.length; _i8++) {
          var _edge4 = allEdges[_i8];
          edgeDict[_edge4.id] = _edge4;
        }
        console.log(edgeDict);
      });
    }
  }]);

  return Layout;
}();

module.exports = Layout;

/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

// -----------------------------------------------------------------------------
// Section: Initializations
// -----------------------------------------------------------------------------

var CoSELayout = __webpack_require__(4).CoSELayout;
var CoSEConstants = __webpack_require__(4).CoSEConstants;
var CoSENode = __webpack_require__(4).CoSENode;
var LayoutConstants = __webpack_require__(4).layoutBase.LayoutConstants;
var FDLayoutConstants = __webpack_require__(4).layoutBase.FDLayoutConstants;
var cc = __webpack_require__(5);
var cholaGraphManager = __webpack_require__(6);
var cholaNode = __webpack_require__(7);
var cholaEdge = __webpack_require__(8);
var cholaGraph = __webpack_require__(9);
var PointD = __webpack_require__(4).layoutBase.PointD;
var DimensionD = __webpack_require__(4).layoutBase.DimensionD;
var Layout = __webpack_require__(10).Layout;
var HashMap = __webpack_require__(4).layoutBase.HashMap;

// Constructor
function cholaLayout(options) {
  Layout.call(this);
  this.dummyNodes = [];
  this.options = options;
  this.maxNodeDimension;
}

cholaLayout.prototype = Object.create(Layout.prototype);

for (var property in Layout) {
  cholaLayout[property] = Layout[property];
}

cholaLayout.prototype.defineCoseConstants = function (options) {
  if (options.nodeRepulsion != null) CoSEConstants.DEFAULT_REPULSION_STRENGTH = FDLayoutConstants.DEFAULT_REPULSION_STRENGTH = options.nodeRepulsion;
  if (options.idealEdgeLength != null) CoSEConstants.DEFAULT_EDGE_LENGTH = FDLayoutConstants.DEFAULT_EDGE_LENGTH = options.idealEdgeLength;;
  if (options.edgeElasticity != null) CoSEConstants.DEFAULT_SPRING_STRENGTH = FDLayoutConstants.DEFAULT_SPRING_STRENGTH = options.edgeElasticity;
  if (options.nestingFactor != null) CoSEConstants.PER_LEVEL_IDEAL_EDGE_LENGTH_FACTOR = FDLayoutConstants.PER_LEVEL_IDEAL_EDGE_LENGTH_FACTOR = options.nestingFactor;
  if (options.gravity != null) CoSEConstants.DEFAULT_GRAVITY_STRENGTH = FDLayoutConstants.DEFAULT_GRAVITY_STRENGTH = options.gravity;
  if (options.numIter != null) CoSEConstants.MAX_ITERATIONS = FDLayoutConstants.MAX_ITERATIONS = options.numIter;
  if (options.gravityRange != null) CoSEConstants.DEFAULT_GRAVITY_RANGE_FACTOR = FDLayoutConstants.DEFAULT_GRAVITY_RANGE_FACTOR = options.gravityRange;
  if (options.gravityCompound != null) CoSEConstants.DEFAULT_COMPOUND_GRAVITY_STRENGTH = FDLayoutConstants.DEFAULT_COMPOUND_GRAVITY_STRENGTH = options.gravityCompound;
  if (options.gravityRangeCompound != null) CoSEConstants.DEFAULT_COMPOUND_GRAVITY_RANGE_FACTOR = FDLayoutConstants.DEFAULT_COMPOUND_GRAVITY_RANGE_FACTOR = options.gravityRangeCompound;
  if (options.initialEnergyOnIncremental != null) CoSEConstants.DEFAULT_COOLING_FACTOR_INCREMENTAL = FDLayoutConstants.DEFAULT_COOLING_FACTOR_INCREMENTAL = options.initialEnergyOnIncremental;

  LayoutConstants.QUALITY = 1;

  CoSEConstants.NODE_DIMENSIONS_INCLUDE_LABELS = FDLayoutConstants.NODE_DIMENSIONS_INCLUDE_LABELS = LayoutConstants.NODE_DIMENSIONS_INCLUDE_LABELS = options.nodeDimensionsIncludeLabels;
  CoSEConstants.DEFAULT_INCREMENTAL = FDLayoutConstants.DEFAULT_INCREMENTAL = LayoutConstants.DEFAULT_INCREMENTAL = !options.randomize;
  CoSEConstants.ANIMATE = FDLayoutConstants.ANIMATE = LayoutConstants.ANIMATE = options.animate;
  CoSEConstants.TILE = options.tile;
  CoSEConstants.TILING_PADDING_VERTICAL = typeof options.tilingPaddingVertical === 'function' ? options.tilingPaddingVertical.call() : options.tilingPaddingVertical;
  CoSEConstants.TILING_PADDING_HORIZONTAL = typeof options.tilingPaddingHorizontal === 'function' ? options.tilingPaddingHorizontal.call() : options.tilingPaddingHorizontal;
  CoSEConstants.TRANSFORM_ON_CONSTRAINT_HANDLING = false;
  CoSEConstants.ENFORCE_CONSTRAINTS = true;
};

cholaLayout.prototype.newGraphManager = function (options) {
  this.graphManager = new cholaGraphManager(this);
  return this.graphManager;
};

/**
* This method creates a new node associated with the input view node.
*/
cholaLayout.prototype.newNode = function (loc, size) {
  return new cholaNode(this.graphManager, loc, size, null);
};

cholaLayout.prototype.newGraph = function (vGraph) {
  return new cholaGraph(null, this.graphManager, vGraph);
};

cholaLayout.prototype.getGraphManager = function () {
  return this.graphManager;
};

/**
* This method creates a new edge associated with the input view edge.
*/
cholaLayout.prototype.newEdge = function (source, target, vEdge) {
  return new cholaEdge(source, target, vEdge);
};

cholaLayout.prototype.getTopMostNodes = function (nodes, cyNodesMap) {
  var nodesMap = {};

  for (var i = 0; i < nodes.length; i++) {
    nodesMap[nodes[i].id()] = true;
    cyNodesMap[nodes[i].id()] = nodes[i];
  }

  var roots = nodes.filter(function (ele, i) {
    if (typeof ele === "number") ele = i;

    var parent = ele.parent()[0];

    while (parent != null) {
      if (nodesMap[parent.id()]) {
        return false;
      }
      parent = parent.parent()[0];
    }
    return true;
  });

  return roots;
};

cholaLayout.prototype.processChildrenList = function (options, parent, children, layout, layoutType, idToLNode, cholaNodeToCoseNode) {
  var size = children.length;
  var includeLabelsOption = options.nodeDimensionsIncludeLabels;

  for (var i = 0; i < size; i++) {
    var theNode;
    var theChild = children[i];
    var children_of_children = theChild.children();
    var dimensions = theChild.layoutDimensions({ nodeDimensionsIncludeLabels: includeLabelsOption });

    if (theChild.outerWidth() != null && theChild.outerHeight() != null) {
      if (layoutType === "chola") {
        theNode = parent.add(new cholaNode(layout.graphManager, new PointD(theChild.position('x') - dimensions.w / 2, theChild.position('y') - dimensions.h / 2), new DimensionD(parseFloat(dimensions.w), parseFloat(dimensions.h))));
        theNode.id = theChild.data("id");
        layout.graphManager.nodes[theNode.id] = theNode;
      } else if (layoutType === "cose") {
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
    if (options.nodeDimensionsIncludeLabels) {
      if (theChild.isParent()) {
        var labelWidth = theChild.boundingBox({ includeLabels: true, includeNodes: false }).w;
        var labelHeight = theChild.boundingBox({ includeLabels: true, includeNodes: false }).h;
        var labelPos = theChild.css("text-halign");
        theNode.labelWidth = labelWidth;
        theNode.labelHeight = labelHeight;
        theNode.labelPos = labelPos;
      }
    }

    // Map the layout node
    if (layoutType === "chola") {
      idToLNode[theChild.data("id")] = theNode;
    } else if (layoutType === "cose") {
      idToLNode[theChild.data("id")] = theNode;
      cholaNodeToCoseNode[theNode.id] = theNode;
    }

    if (isNaN(theNode.rect.x)) {
      theNode.rect.x = 0;
    }

    if (isNaN(theNode.rect.y)) {
      theNode.rect.y = 0;
    }

    if (children_of_children != null && children_of_children.length > 0) {
      var theNewGraph = layout.getGraphManager().add(layout.newGraph(), theNode);
      this.processChildrenList(options, theNewGraph, children_of_children, layout, layoutType, idToLNode, cholaNodeToCoseNode);
    }
  }
};

cholaLayout.prototype.setParents = function (gm) {
  var allNodes = gm.getAllNodes();

  for (var i = 0; i < allNodes.length; i++) {
    var _cholaNode = allNodes[i];
    if (_cholaNode.owner.parent.id != undefined) {
      _cholaNode.parentNode = _cholaNode.owner.parent;
    }
  }
};

function isFn(fn) {
  return typeof fn === 'function';
};

function optFn(opt, ele) {
  if (isFn(opt)) {
    return opt(ele);
  } else {
    return opt;
  }
};

// transfer cytoscape edges to chola edges
cholaLayout.prototype.processEdges = function (layout, gm, edges, idToLNode, cyEdgesMap, cholaEdgesMap) {
  var idealLengthTotal = 0;
  var edgeCount = 0;
  var cholarun = false;

  if (cyEdgesMap) cholarun = true;

  for (var i = 0; i < edges.length; i++) {
    var edge = edges[i];
    var sourceNode = idToLNode[edge.data("source")];
    var targetNode = idToLNode[edge.data("target")];

    if (cholarun) cyEdgesMap[edge.id()] = edge;

    if (sourceNode !== targetNode) {
      if (sourceNode.getEdgesBetween(targetNode).length == 0) {
        var e = gm.add(layout.newEdge(), sourceNode, targetNode);
        e.id = edge.id();
        e.idealLength = optFn(this.options.idealEdgeLength, edge);
        e.edgeElasticity = optFn(this.options.edgeElasticity, edge);
        e.width = parseInt(edge.css('width'));

        idealLengthTotal += e.idealLength;
        edgeCount++;

        if (cholaEdgesMap != null) cholaEdgesMap[e.id] = e;
      }
    }

    if (this.options.idealEdgeLength != null) {
      CoSEConstants.DEFAULT_EDGE_LENGTH = FDLayoutConstants.DEFAULT_EDGE_LENGTH = 50;

      // we need to update these constant values based on the ideal edge length constant
      CoSEConstants.MIN_REPULSION_DIST = FDLayoutConstants.MIN_REPULSION_DIST = FDLayoutConstants.DEFAULT_EDGE_LENGTH / 10.0;
      CoSEConstants.DEFAULT_RADIAL_SEPARATION = FDLayoutConstants.DEFAULT_EDGE_LENGTH;
    }
  }
};

cholaLayout.prototype.coseOnCore = function (options, idToLNode, cholaNodeToCoseNode, topMostNodes) {
  // Create a CoSE layout object
  var coseLayout = new CoSELayout();

  this.defineCoseConstants(options);

  var gm = coseLayout.newGraphManager();
  this.coseGm = gm;

  var nodes = options.eles.nodes();
  var edges = options.eles.edges();

  this.processChildrenList(options, gm.addRoot(), topMostNodes, coseLayout, "cose", idToLNode, cholaNodeToCoseNode);
  this.processEdges(coseLayout, gm, edges, idToLNode);

  coseLayout.runLayout();
  return coseLayout;
};

cholaLayout.prototype.getMaxNodeDimension = function (gm) {
  var allNodes = gm.getAllNodes();
  var max = 0;

  for (var i = 0; i < allNodes.length; i++) {
    var node = allNodes[i];
    var tempMax = Math.max(node.getWidth(), node.getHeight());

    if (!node.isCompound() & max < tempMax) max = tempMax;
  }

  this.maxNodeDimension = max;
  return max;
};

cholaLayout.prototype.extractBends = function (bendData, nodeDict, nodes, edgeSplitDict) {
  var edgesWithBends = [];
  for (var i = 0; i < bendData.length; i++) {
    var row = bendData[i];

    var firstNode = nodeDict[row[0]];
    var lastNode = nodeDict[row[row.length - 1]];

    var edge = firstNode.findEdgeBetween(lastNode);

    var src = firstNode;
    if (edge.source.id != src.id) row.reverse();

    for (var j = 1; j < row.length - 1; j++) {
      var pos = nodes[row[j]];
      var bp = {
        x: pos[0],
        y: pos[1],
        id: row[j]
      };

      if (j == 1) bp.srcId = edge.source.id;else bp.srcId = row[j - 1];

      if (j == row.length - 2) bp.tgtId = edge.target.id;else bp.tgtId = row[j + 1];

      edge.bendpoints.push(bp);
    }

    if (!edge.source.id.includes("cdnode") && !edge.target.id.includes("cdnode")) edgesWithBends.push(edge);
  }

  return edgesWithBends;
};

cholaLayout.prototype.deleteEdgeCrossings = function (edgeSplitDict, gm, edgesWithBends) {
  var edgesWithDummies = Object.values(edgeSplitDict);
  var edgeSplitsKeys = Object.keys(edgeSplitDict);

  for (var i = 0; i < edgesWithDummies.length; i++) {
    var edgeWithDummies = edgesWithDummies[i];

    if (edgeSplitsKeys[i].includes("cdnode")) continue;

    var len = edgeWithDummies.length;

    //first create a new edge between the original source and target
    var origEdgeId = edgeSplitsKeys[i];
    var src = edgeWithDummies[0].source;
    var tgt = edgeWithDummies[len - 1].target;

    var newEdge = gm.add(this.newEdge(), src, tgt);
    newEdge.id = origEdgeId;

    for (var j = 0; j < len; j++) {
      //take each split portion, and extract its bendpoints 
      var dummyEdge = edgeWithDummies[j];
      var bps = dummyEdge.bendpoints;

      //add the bendpoints to the original edge
      for (var k = 0; k < bps.length; k++) {
        newEdge.bendpoints.push(bps[k]);
      } //now delete the edge from graph
      var graph = gm.calcLowestCommonAncestor(dummyEdge.source, dummyEdge.target);
      graph.remove(dummyEdge);
    }

    if (src.isCmpdBoundaryNode && (src.id.includes("-tr") || src.id.includes("-tl") || src.id.includes("-br") || src.id.includes("-bl"))) continue;
    if (tgt.isCmpdBoundaryNode && (tgt.id.includes("-tr") || tgt.id.includes("-tl") || tgt.id.includes("-br") || tgt.id.includes("-bl"))) continue;

    if (newEdge.bendpoints.length > 0) edgesWithBends.push(newEdge);
  }
};

cholaLayout.prototype.deleteDummyNodes = function (dummyNodes) {
  for (var i = 0; i < dummyNodes.length; i++) {
    dummyNodes[i].owner.remove(dummyNodes[i]);
  }
};

cholaLayout.prototype.createBendpoints = function (edgesWithBends, gm) {
  for (var i = 0; i < edgesWithBends.length; i++) {
    var edge = edgesWithBends[i];
    edge.convertToRelativeBendPosition();
    gm.edgesWithBends.push(edge);
  }
};

cholaLayout.prototype.removeDummiesAndCreateBends = function (gm, edgeSplitDict, dummyNodes, edgesWithBends) {
  this.deleteEdgeCrossings(edgeSplitDict, gm, edgesWithBends);
  this.deleteDummyNodes(dummyNodes);

  gm.resetAllEdges();
  gm.resetAllNodes();
  gm.getAllEdges();
  gm.getAllNodes();

  this.createBendpoints(edgesWithBends, gm);
};

cholaLayout.prototype.prepareGraphForCompaction = function (compoundNodes, cyNodesMap, gm, nodeDict, edgeSplitDict, igEdges) {
  var newEdges = [];
  for (var i = 0; i < compoundNodes.length; i++) {
    //Step 1: Reshape Compounds

    var node = compoundNodes[i];

    //find corners from the boundary list
    var x1 = Number.MAX_VALUE;
    var x2 = Number.MIN_VALUE;
    var y1 = Number.MAX_VALUE;
    var y2 = Number.MIN_VALUE;

    for (var j = 0; j < node.boundaryList.length; j++) {
      var nodePosition = node.boundaryList[j].getCenter();
      if (nodePosition.x < x1) x1 = nodePosition.x;
      if (nodePosition.x > x2) x2 = nodePosition.x;
      if (nodePosition.y < y1) y1 = nodePosition.y;
      if (nodePosition.y > y2) y2 = nodePosition.y;
    }

    var center = {
      x: x1 + (x2 - x1) / 2,
      y: y1 + (y2 - y1) / 2
    };

    //now get the new width and the height of the compound
    var w = x2 - x1;
    var h = y2 - y1;

    node.setWidth(w);
    node.setHeight(h);
    node.setCenter(center.x, center.y);

    //Step 2: Delete all boundary nodes in gm
    var edgeCrossDummies = [];
    for (var _j = 0; _j < node.boundaryList.length; _j++) {
      var bdNode = node.boundaryList[_j];
      if (bdNode.id.includes("cdnode")) edgeCrossDummies.push(bdNode);else continue;
    }

    node.boundaryList = [];

    //Step 3: Recreate boundary nodes
    node.createDummyCornerNodes(gm, nodeDict, 2);

    //Step 4: Determine new position of edge endpoints
    var edges = node.edges;
    for (var _j2 = 0; _j2 < edges.length; _j2++) {
      //compound edge ports
      var edge = edges[_j2];
      var nodeId = node.id.concat("-").concat(edge.id);

      var otherNode = edge.getOtherEnd(node);
      var edgeId = void 0;
      var srcId = void 0,
          tgtId = void 0;

      if (edge.source.isCompound()) srcId = edge.source.id.concat("-").concat(edge.id);else srcId = edge.source.id;

      if (edge.target.isCompound()) tgtId = edge.target.id.concat("-").concat(edge.id);else tgtId = edge.target.id;

      edgeId = srcId.concat("to").concat(tgtId);

      var dn = nodeDict[nodeId];

      //find the side on which dn is on
      var dnPos = dn.getCenter();

      var dnIsCorner = false;
      //lets check if the position of dn coincides with any corner node
      for (var k = 0; k < node.boundaryList.length; k++) {
        var bn = node.boundaryList[k];
        var bnPos = bn.getCenter();
        if (bnPos.x == dnPos.x && bnPos.y == dnPos.y) {
          node.boundaryList[node.boundaryList.indexOf(bn)] = dn;
          delete nodeDict[bn.id];
          bn.owner.remove(bn);
          dnIsCorner = true;
          break;
        }
      }

      if (!dnIsCorner) {
        var dir = void 0;

        //right now, this compound edge will not have bendpoints
        if (edgeSplitDict[edgeId] == undefined) {
          var e = nodeDict[srcId].findEdgeBetween(nodeDict[tgtId]);
          if (e.bendpoints.length == 0) {
            if (otherNode.isCompound()) {
              otherNode = nodeDict[otherNode.id.concat("-").concat(edge.id)];
            }
            dir = this.direction(dn.getCenter(), otherNode.getCenter());
          } else {
            if (node == edge.source) dir = this.direction(dn.getCenter(), e.bendpoints[0]);else dir = this.direction(dn.getCenter(), e.bendpoints[e.bendpoints.length - 1]);
          }
        } else {
          if (node == edge.source) {
            var _e = edgeSplitDict[edgeId][0];
            if (_e.bendpoints.length == 0) {
              otherNode = edgeSplitDict[edgeId][0].target;
              dir = this.direction(dn.getCenter(), otherNode.getCenter());
            } else {
              dir = this.direction(dn.getCenter(), _e.bendpoints[0]);
            }
          } else {
            var _e2 = edgeSplitDict[edgeId][0];
            var len = edgeSplitDict[edgeId].length;
            if (_e2.bendpoints.length == 0) {
              otherNode = edgeSplitDict[edgeId][len - 1].source;
              dir = this.direction(dn.getCenter(), otherNode.getCenter());
            } else {
              dir = this.direction(dn.getCenter(), _e2.bendpoints[_e2.bendpoints.length - 1]);
            }
          }
        }

        var bbox = node.getBbox();
        // determine dn node position based on direction from dn to other node
        if (dir == 0) dn.setCenter(bbox.x2, dnPos.y);else if (dir == 1) dn.setCenter(dnPos.x, bbox.y2);else if (dir == 2) dn.setCenter(bbox.x1, dnPos.y);else if (dir == 3) dn.setCenter(dnPos.x, bbox.y1);

        //check again if the value co-incides with corner points
        dnPos = dn.getCenter();

        for (var _k = 0; _k < node.boundaryList.length; _k++) {
          var _bn = node.boundaryList[_k];
          var _bnPos = _bn.getCenter();

          if (_bnPos.x == dnPos.x && _bnPos.y == dnPos.y) {
            if (_bn.id.includes("-tr") || _bn.id.includes("-tl") || _bn.id.includes("-br") || _bn.id.includes("-bl")) {
              node.boundaryList[node.boundaryList.indexOf(_bn)] = dn;
              delete nodeDict[_bn.id];
              _bn.owner.remove(_bn);
              dnIsCorner = true;
            }
            break;
          }
        }

        if (!dnIsCorner) {
          //add dn to the boundary list 
          node.insertNodeToBoundary(dn);
        }
      }
    }

    //Step 4: Find new positions for edge crossing dummies
    for (var _j3 = 0; _j3 < edgeCrossDummies.length; _j3++) {
      var _dn = edgeCrossDummies[_j3];

      //for each intergraph edge, find the intergraph edge that contains dn
      for (var _k2 = 0; _k2 < igEdges.length; _k2++) {
        var _e3 = igEdges[_k2];
        var eDict = void 0;

        //if e is between two simple nodes, its edge should be in edge split dictionary
        if (!_e3.source.isCompound() && !_e3.target.isCompound()) {
          if (edgeSplitDict[_e3.id] != undefined) eDict = Object.values(edgeSplitDict[_e3.id]);
        } else if (!_e3.source.isCompound() && _e3.target.isCompound()) {
          var _srcId = _e3.source.id;
          var _tgtId = _e3.target.id.concat("-").concat(_e3.id);
          eDict = edgeSplitDict[_srcId.concat("to").concat(_tgtId)];
        } else if (_e3.source.isCompound() && !_e3.target.isCompound()) {
          var _srcId2 = _e3.source.id.concat("-").concat(_e3.id);
          var _tgtId2 = _e3.target.id;
          eDict = edgeSplitDict[_srcId2.concat("to").concat(_tgtId2)];
        } else {
          var _srcId3 = _e3.source.id.concat("-").concat(_e3.id);
          var _tgtId3 = _e3.target.id.concat("-").concat(_e3.id);
          eDict = edgeSplitDict[_srcId3.concat("to").concat(_tgtId3)];
        }

        if (eDict == null) continue;

        //find the two edge segments that are connected to dn
        //find the nodes connected to dn,
        var n1Pos = void 0,
            n2Pos = void 0;
        for (var l = 0; l < eDict.length - 1; l++) {
          var e1 = eDict[l];
          var e2 = eDict[l + 1];
          if (e1.target.id == _dn.id && e2.source.id == _dn.id) {
            if (e1.bendpoints.length == 0) n1Pos = e1.source.getCenter();else n1Pos = e1.bendpoints[e1.bendpoints.length - 1];

            if (e2.bendpoints.length == 0) n2Pos = e2.target.getCenter();else n2Pos = e2.bendpoints[0];
            break;
          }
        }

        if (n1Pos == null) continue;else {
          //find intersection of line formed by those nodes with each compound boundary
          for (var _l = 0; _l < node.boundaryList.length; _l++) {
            var n3Pos = node.boundaryList[_l].getCenter();
            var n4Pos = void 0;
            if (_l == node.boundaryList.length - 1) n4Pos = node.boundaryList[0].getCenter();else n4Pos = node.boundaryList[_l + 1].getCenter();

            if (this.doIntersect(n1Pos, n2Pos, n3Pos, n4Pos)) {
              var intersectionPoint = this.findIntersection(n1Pos, n2Pos, n3Pos, n4Pos);
              _dn.setCenter(intersectionPoint.x, intersectionPoint.y);
              node.insertNodeToBoundary(_dn);

              break;
            }
          }
          break;
        }
      }
    }

    var boundaryList = node.boundaryList;

    // construct edges along the boundary of the compound nodes
    for (var _j4 = 0; _j4 < boundaryList.length; _j4++) {
      var source = nodeDict[boundaryList[_j4].id];
      var target = void 0;
      if (_j4 != boundaryList.length - 1) target = nodeDict[boundaryList[_j4 + 1].id];else target = nodeDict[boundaryList[0].id];

      if (source.findEdgeBetween(target) == null) {
        var newEdge = gm.add(this.newEdge(), source, target);
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

cholaLayout.prototype.findIntersection = function (p1, p2, p3, p4) {
  var intersectionPoint = void 0;
  var intersectX = void 0;
  var intersectY = void 0;

  var x1 = p1.x;
  var y1 = p1.y;

  var x2 = p2.x;
  var y2 = p2.y;

  var x3 = p3.x;
  var y3 = p3.y;

  var x4 = p4.x;
  var y4 = p4.y;

  var m1 = (y2 - y1) / (x2 - x1);
  var m2 = (y4 - y3) / (x4 - x3);

  if (m1 == Infinity || m1 == -Infinity) {
    //first line with x1, y1 and x2, y2 is vertical
    var c2 = y3 - m2 * x3;
    intersectX = x1;
    intersectY = m2 * intersectX + c2;
  } else if (m2 == Infinity || m2 == -Infinity) {
    var c1 = y1 - m1 * x1;
    intersectX = x3;
    intersectY = m1 * intersectX + c1;
  } else if (m1 == 0) {
    var _c = y3 - m2 * x3;
    intersectY = y1;
    intersectX = (intersectY - _c) / m2;
  } else if (m2 == 0) {
    var _c2 = y1 - m1 * x1;
    intersectY = y3;
    intersectX = (intersectY - _c2) / m1;
  } else {
    var _c3 = y1 - m1 * x1;
    var _c4 = y3 - m2 * x3;

    intersectX = (_c4 - _c3) / (m1 - m2);
    intersectY = m1 * intersectX + _c3;
  }

  intersectionPoint = {
    x: intersectX,
    y: intersectY
  };

  return intersectionPoint;
};

cholaLayout.prototype.reshapeCompounds = function (compoundNodes, cyNodesMap, iel, simpleGm) {
  //if graph is a compound graph, we need to modify the height and width of the compound
  if (compoundNodes.length > 0) {
    for (var i = 0; i < compoundNodes.length; i++) {
      var node = compoundNodes[i];

      ////////////////////////////////////////////////

      node.compactNode(iel, simpleGm);

      // let x1, x2, y1, y2;
      // x1 = Number.MAX_VALUE;
      // x2 = Number.MIN_VALUE;
      // y1 = Number.MAX_VALUE;
      // y2 = Number.MIN_VALUE;

      // for (let k = 0; k < node.boundaryList.length; k++)
      // {
      //     let bdnode = node.boundaryList[k];
      //     let nodePosition = bdnode.getCenter();
      //     if (nodePosition.x < x1)
      //       x1 = nodePosition.x;
      //     if (nodePosition.x > x2)
      //       x2 = nodePosition.x;
      //     if (nodePosition.y < y1)
      //       y1 = nodePosition.y;
      //     if (nodePosition.y > y2)
      //       y2 = nodePosition.y;
      // } 

      // let center = {
      //   x: x1 + (x2 - x1) / 2,
      //   y: y1 + (y2 - y1) / 2
      // };    

      // //now get the new width and the height of the compound
      // let w = x2 - x1;
      // let h = y2 - y1;

      // let bbox = {x1:x1, x2:x2, y1:y1, y2:y2};

      ////////////////////////////////////////////////

      var w = node.getWidth();
      var h = node.getHeight();
      var center = node.getCenter();

      var bbox = node.getBbox();

      //now find the compound node in cy
      var cyNode = cyNodesMap[node.id];

      var autoWidth = cyNode[0]._private.autoWidth;
      var autoHeight = cyNode[0]._private.autoHeight;

      cyNode.css("min-width", w);
      cyNode.css("min-height", h);

      var extraWidth = w - autoWidth;
      var extraHeight = h - autoHeight;

      //get current center of the cyNode
      var cyCenter = cyNode.position();

      //get percentages for up, down, left, right biases
      var leftBias = (cyCenter.x - autoWidth / 2 - bbox.x1) / extraWidth * 100;
      var rightBias = (bbox.x2 - autoWidth / 2 - cyCenter.x) / extraWidth * 100;
      var topBias = (cyCenter.y - autoHeight / 2 - bbox.y1) / extraHeight * 100;
      var bottomBias = (bbox.y2 - autoHeight / 2 - cyCenter.y) / extraHeight * 100;

      cyNode.css("min-width-bias-left", leftBias);
      cyNode.css("min-width-bias-right", rightBias);
      cyNode.css("min-height-bias-top", topBias);
      cyNode.css("min-height-bias-bottom", bottomBias);

      if (node.getParentNode() != null) {
        //NEED TO KEEP THIS OTHERWISE COMPOUND EDGES BECOME NON-ORTHOGONAL
        var p = cyNodesMap[node.getParentNode().id].position();
      }

      //first set temporary widths and heights according to this level
      //cytoscape data can be updated later on

      //////////////////////////////////
      node.setWidth(w);
      node.setHeight(h);
      //////////////////////////////////

      // node.setWidth(cyNode.outerWidth());
      // node.setHeight(cyNode.outerHeight());
      node.setCenter(center.x, center.y);
    }

    for (var _i = 0; _i < compoundNodes.length; _i++) {
      var _node = compoundNodes[_i];
      var _cyNode = cyNodesMap[_node.id];
      var _center = _node.getCenter();
      _node.setWidth(_cyNode.outerWidth());
      _node.setHeight(_cyNode.outerHeight());
      _node.setCenter(_center.x, _center.y);
    }
  }
};

cholaLayout.prototype.direction = function (node1Loc, node2Loc) {
  var x1 = node1Loc.x;
  var x2 = node2Loc.x;
  var y1 = node1Loc.y;
  var y2 = node2Loc.y;
  var dx = x2 - x1;
  var dy = y2 - y1;

  var dir;
  if (dx > 0 && dy < 0) dir = cc.NE;else if (dx > 0 && dy == 0) dir = cc.EAST;else if (dx > 0 && dy > 0) dir = cc.SE;else if (dx == 0 && dy > 0) dir = cc.SOUTH;else if (dx < 0 && dy > 0) dir = cc.SW;else if (dx < 0 && dy == 0) dir = cc.WEST;else if (dx < 0 && dy < 0) dir = cc.NW;else if (dx == 0 && dy < 0) dir = cc.NORTH;
  return dir;
};

cholaLayout.prototype.findSrcAndTgtPorts = function (gm, nodeDict, cEdges) {
  var compoundEdges = [];
  var allEdges = gm.getAllEdges();
  var outputEdges = [];
  var createBp = false;

  for (var i = 0; i < allEdges.length; i++) {
    var edge = allEdges[i];

    //if edge is not orthogonal, we make it orthogonal
    var source = edge.source;
    var target = edge.target;

    var srcIsCompound = source.isCompound();
    var tgtIsCompound = target.isCompound();

    if (!srcIsCompound && !tgtIsCompound) continue;

    var srcCenterX = source.getCenterX();
    var srcCenterY = source.getCenterY();

    var tgtCenterX = target.getCenterX();
    var tgtCenterY = target.getCenterY();

    var srcBbox = source.getBbox();
    var tgtBbox = target.getBbox();

    var bpsLength = edge.bendpoints.length;

    if (bpsLength > 0) {
      var findPortFromDir = function findPortFromDir(dir, bbox, bp) {
        var output = void 0;
        switch (dir) {
          case 0:
            output = { x: bbox.x1, y: bp.y };
            break;

          case 1:
            output = { x: bp.x, y: bbox.y1 };
            break;

          case 2:
            output = { x: bbox.x2, y: bp.y };
            break;

          case 3:
            output = { x: bp.x, y: bbox.y2 };
            break;
        }
        return output;
      };

      ;

      //get direction to source and target from first and last bendpoint
      var firstBp = { x: edge.bendpoints[0].x, y: edge.bendpoints[0].y };
      var lastBp = { x: edge.bendpoints[bpsLength - 1].x, y: edge.bendpoints[bpsLength - 1].y };

      var dir1 = this.direction(firstBp, edge.sourcePoint);
      var dir2 = this.direction(lastBp, edge.targetPoint);

      edge.sourcePort = findPortFromDir(dir1, srcBbox, firstBp);
      edge.targetPort = findPortFromDir(dir2, tgtBbox, lastBp);

      edge.convertToRelativeBendPosition();
    } else {
      if (srcIsCompound && !target.isCompound()) {
        // console.log("Source is compound and target is not");
        if (srcBbox.x1 <= tgtCenterX && tgtCenterX <= srcBbox.x2) {
          //if target is on top
          if (tgtCenterY < srcBbox.y1) {
            edge.sourcePort = { x: tgtCenterX, y: srcBbox.y1 };
            edge.targetPort = { x: tgtCenterX, y: tgtBbox.y2 };
          }
          //target is on bottom
          else if (tgtCenterY > srcBbox.y2) {
              edge.sourcePort = { x: tgtCenterX, y: srcBbox.y2 };
              edge.targetPort = { x: tgtCenterX, y: tgtBbox.y1 };
            }
        } else if (srcBbox.y1 <= tgtCenterY && tgtCenterY <= srcBbox.y2) {
          //if target is on the left
          if (tgtCenterX < srcBbox.x1) {
            edge.sourcePort = { x: srcBbox.x1, y: tgtCenterY };
            edge.targetPort = { x: tgtBbox.x2, y: tgtCenterY };
          }
          //if target is on the right
          else if (tgtCenterX > srcBbox.x2) {
              edge.sourcePort = { x: srcBbox.x2, y: tgtCenterY };
              edge.targetPort = { x: tgtBbox.x1, y: tgtCenterY };
            }
        }
        if (edge.sourcePort == null || edge.targetPort == null) //target has been moved to inside the compound
          {
            var arr = [{ x: srcBbox.x2, y: tgtCenterY }, //right
            { x: tgtCenterX, y: srcBbox.y2 }, //bottom
            { x: srcBbox.x1, y: tgtCenterY }, //left
            { x: tgtCenterX, y: srcBbox.y1 //top
            }];

            var min = Number.MAX_VALUE;

            var distArray = [];
            var freeDirs = target.getFreeDirs(source);
            for (var j = 0; j < arr.length; j++) {
              if (freeDirs.includes(j)) {
                var distance = this.distance(target.getCenter(), arr[j]);
                distArray.push(distance);
                if (distance < min) min = distance;
              } else distArray.push(null);
            }

            var index = distArray.indexOf(min);
            edge.sourcePort = arr[index];
            if (index == 3) edge.targetPort = { x: tgtCenterX, y: tgtBbox.y1 };else if (index == 0) edge.targetPort = { x: tgtBbox.x2, y: tgtCenterY };else if (index == 1) edge.targetPort = { x: tgtCenterX, y: tgtBbox.y2 };else edge.targetPort = { x: tgtBbox.x1, y: tgtCenterY };
          }
      } else if (!srcIsCompound && target.isCompound()) {
        if (tgtBbox.x1 < srcCenterX && srcCenterX < tgtBbox.x2) {
          //source can either be on top or on bottom i.e. north or south
          //if source is on top
          if (srcCenterY < tgtBbox.y1) {
            edge.targetPort = { x: srcCenterX, y: tgtBbox.y1 };
            edge.sourcePort = { x: srcCenterX, y: srcBbox.y2 };
          }
          //source is on bottom
          else if (srcCenterY > tgtBbox.y2) {
              edge.targetPort = { x: srcCenterX, y: tgtBbox.y2 };
              edge.sourcePort = { x: srcCenterX, y: srcBbox.y1 };
            }
        } else if (tgtBbox.y1 < srcCenterY && srcCenterY < tgtBbox.y2) {
          // console.log("SOurce lies along the height of target");
          //edge can be straight
          //if source is on the left
          if (srcCenterX < tgtBbox.x1) {
            edge.targetPort = { x: tgtBbox.x1, y: srcCenterY };
            edge.sourcePort = { x: srcBbox.x2, y: srcCenterY };
          }
          //if source is on the right
          else if (srcCenterX > tgtBbox.x2) {
              edge.targetPort = { x: tgtBbox.x2, y: srcCenterY };
              edge.sourcePort = { x: srcBbox.x1, y: srcCenterY };
            }
        }
        if (edge.sourcePort == null || edge.targetPort == null) //target has been moved to inside the compound
          {
            var _arr = [{ x: tgtBbox.x2, y: srcCenterY }, { x: srcCenterX, y: tgtBbox.y2 }, { x: tgtBbox.x1, y: srcCenterY }, { x: srcCenterX, y: tgtBbox.y1 }];

            var _min = Number.MAX_VALUE;

            var _distArray = [];
            var _freeDirs = source.getFreeDirs(target);
            for (var _j5 = 0; _j5 < _arr.length; _j5++) {
              if (_freeDirs.includes(_j5)) {
                var _distance = this.distance(target.getCenter(), _arr[_j5]);
                _distArray.push(_distance);
                if (_distance < _min) _min = _distance;
              } else _distArray.push(null);
            }

            var _index = _distArray.indexOf(_min);
            edge.targetPort = _arr[_index];
            if (_index == 3) edge.sourcePort = { x: srcCenterX, y: srcBbox.y1 };else if (_index == 0) edge.sourcePort = { x: srcBbox.x2, y: srcCenterY };else if (_index == 1) edge.sourcePort = { x: srcCenterX, y: srcBbox.y2 };else edge.sourcePort = { x: srcBbox.x1, y: srcCenterY };
          }
      } else if (source.isCompound() && target.isCompound()) {
        var sourcePos = nodeDict[edge.source.id.concat("-").concat(edge.id)].getCenter();
        var targetPos = nodeDict[edge.target.id.concat("-").concat(edge.id)].getCenter();

        //we check if the target node lies within the width of the source node
        if (srcBbox.x1 <= tgtBbox.x1 && tgtBbox.x1 <= srcBbox.x2 || srcBbox.x1 <= tgtBbox.x2 && tgtBbox.x2 <= srcBbox.x2 || tgtBbox.x1 <= srcBbox.x1 && srcBbox.x1 <= tgtBbox.x2 || tgtBbox.x1 <= srcBbox.x2 && srcBbox.x2 <= tgtBbox.x2) {
          //vertical edge
          //if target lies on top of the source node
          if (tgtCenterY < srcCenterY) {
            if (tgtBbox.x1 <= sourcePos.x && sourcePos.x <= tgtBbox.x2) {
              edge.sourcePort = { x: sourcePos.x, y: srcBbox.y1 };
              edge.targetPort = { x: sourcePos.x, y: tgtBbox.y2 };
            } else {
              edge.sourcePort = { x: targetPos.x, y: srcBbox.y1 };
              edge.targetPort = { x: targetPos.x, y: tgtBbox.y2 };
            }
          }
          //if target lies at the bottom
          else {
              if (tgtBbox.x1 <= sourcePos.x && sourcePos.x <= tgtBbox.x2) {
                edge.sourcePort = { x: sourcePos.x, y: srcBbox.y2 };
                edge.targetPort = { x: sourcePos.x, y: tgtBbox.y1 };
              } else {
                edge.sourcePort = { x: targetPos.x, y: srcBbox.y2 };
                edge.targetPort = { x: targetPos.x, y: tgtBbox.y1 };
              }
            }
        }
        //we check if the target node lies within the height of the source node
        else if (srcBbox.y1 <= tgtBbox.y1 && tgtBbox.y1 <= srcBbox.y2 || srcBbox.y1 <= tgtBbox.y2 && tgtBbox.y2 <= srcBbox.y2 || tgtBbox.y1 <= srcBbox.y1 && srcBbox.y1 <= tgtBbox.y2 || tgtBbox.y1 <= srcBbox.y2 && srcBbox.y2 <= tgtBbox.y2) {
            //horizontal edge
            //if target lies on the left of the source node
            if (tgtCenterX < srcCenterX) {
              if (tgtBbox.y1 <= sourcePos.y && sourcePos.y <= tgtBbox.y2) {
                edge.sourcePort = { x: srcBbox.x1, y: sourcePos.y };
                edge.targetPort = { x: tgtBbox.x2, y: sourcePos.y };
              } else {
                edge.sourcePort = { x: srcBbox.x1, y: targetPos.y };
                edge.targetPort = { x: tgtBbox.x2, y: targetPos.y };
              }
            }
            //if target lies on the right of the source node
            else {
                if (tgtBbox.y1 <= sourcePos.y && sourcePos.y <= tgtBbox.y2) {
                  edge.sourcePort = { x: srcBbox.x2, y: sourcePos.y };
                  edge.targetPort = { x: tgtBbox.x1, y: sourcePos.y };
                } else {
                  edge.sourcePort = { x: srcBbox.x2, y: targetPos.y };
                  edge.targetPort = { x: tgtBbox.x1, y: targetPos.y };
                }
              }
          }
      }
    }

    if (edge.sourcePort == null || edge.targetPort == null) {
      var a = 4;
      var u = 7;
    }

    outputEdges.push(edge);
  }

  return outputEdges;
};

cholaLayout.prototype.distance = function (a, b) {
  return Math.sqrt(Math.pow(a.x - b.x, 2) + Math.pow(a.y - b.y, 2));
};

cholaLayout.prototype.insertNodeIntoCompoundBoundary = function (node, boundaryList) {
  var point = node.getCenter();

  if (boundaryList.length == 1) {
    boundaryList.push(node);
    return;
  }

  //now insert the endpoint at correct location in the boundarylist
  for (var k = 0; k < boundaryList.length; k++) {
    var value1 = boundaryList[k].getCenter();
    var value2 = void 0;
    if (k != boundaryList.length - 1) {
      value2 = boundaryList[k + 1].getCenter();
    } else {
      value2 = boundaryList[0].getCenter();
    }
    if (value1.x == value2.x && point.x == value1.x) {
      if (value1.y < point.y && point.y < value2.y || value2.y < point.y && point.y < value1.y) {
        boundaryList.splice(k + 1, 0, node);
      }
    } else if (value1.y == value2.y && point.y == value1.y) {
      if (value1.x < point.x && point.x < value2.x || value2.x < point.x && point.x < value1.x) {
        boundaryList.splice(k + 1, 0, node);
      }
    }
  }
};

cholaLayout.prototype.convertToSimpleGraph = function (gm, compoundNodes) {
  var simpleGm = this.newGraphManager();
  var parent = simpleGm.addRoot();
  var newEdges = [];
  var nodeDict = {};

  //Copy the non-compound nodes to the new graph manager
  var allNodes = gm.getAllNodes();
  for (var i = 0; i < allNodes.length; i++) {
    var node = allNodes[i];
    if (!node.isCompound()) {
      var newNode = parent.add(new cholaNode(simpleGm, node.getLocation(), new DimensionD(node.getWidth(), node.getHeight())));
      newNode.id = node.id;
      nodeDict[newNode.id] = newNode;
    }
  }

  //copy the simple edges(whose source and target are both non compound nodes and which are not intergraph edges)
  var allEdges = gm.getAllEdges();
  for (var _i2 = 0; _i2 < allEdges.length; _i2++) {
    var edge = allEdges[_i2];
    if (!edge.source.isCompound() && !edge.target.isCompound()) {
      var source = nodeDict[edge.source.id];
      var target = nodeDict[edge.target.id];
      var newEdge = simpleGm.add(this.newEdge(), source, target);
      newEdge.id = edge.id;
    }
  }

  for (var _i3 = 0; _i3 < compoundNodes.length; _i3++) {
    var _node2 = compoundNodes[_i3];

    //1. Get boundary corner points
    _node2.createDummyCornerNodes(simpleGm, nodeDict, 1);

    var boundaryList = _node2.boundaryList;

    //2. Get endpoints of incident edges to the compound node
    var edges = _node2.edges;

    for (var j = 0; j < edges.length; j++) {
      var _edge = edges[j];
      var endpoint1 = void 0,
          endpoint2 = void 0;
      if (_edge.source == _node2) {
        endpoint1 = _edge.sourceEndpoint();
        if (_edge.target.isCompound()) endpoint2 = _edge.target.id.concat("-").concat(_edge.id);else endpoint2 = _edge.target.id;
      } else {
        endpoint1 = _edge.targetEndpoint();
        if (_edge.source.isCompound()) endpoint2 = _edge.source.id.concat("-").concat(_edge.id);else endpoint2 = _edge.source.id;
      }

      var _newNode = parent.add(new cholaNode(simpleGm, { x: endpoint1.x - 0.5, y: endpoint1.y - 0.5 }, new DimensionD(1, 1)));
      _newNode.id = _node2.id.concat("-").concat(_edge.id);
      _newNode.isCmpdBoundaryNode = true;
      _node2.insertNodeToBoundary(_newNode);
      nodeDict[_newNode.id] = _newNode;

      //store the new edges that have to be created in this case

      if (_edge.source == _node2) newEdges.push([_newNode.id, endpoint2]);else newEdges.push([endpoint2, _newNode.id]);
    }

    //3. check if the child graph of the compound node is disconnected from outside
    //if this is the case, convert the graph to a connected graph

    var childGraphs = [_node2.child].concat(_node2.getChildGraphs());
    var connectivityCheck = _node2.findConnectivity(childGraphs);

    //if the child graph is disconnected it needs to be connected   
    if (!connectivityCheck) {
      _node2.createConnectedGraph(nodeDict, simpleGm, this);
    }

    //4. construct edges along the boundary of the compound nodes
    for (var _j6 = 0; _j6 < boundaryList.length; _j6++) {
      var _source = nodeDict[boundaryList[_j6].id];
      var _target = void 0;
      if (_j6 != boundaryList.length - 1) _target = nodeDict[boundaryList[_j6 + 1].id];else _target = nodeDict[boundaryList[0].id];

      var _newEdge = simpleGm.add(this.newEdge(), _source, _target);
      _newEdge.id = _source.id.concat("to").concat(_target.id);
      _newEdge.parentNode = _node2;
    }

    _node2.boundaryList = boundaryList;
  }

  //now create the compound connected edges in the graph
  for (var _i4 = 0; _i4 < newEdges.length; _i4++) {
    var _edge2 = newEdges[_i4];
    var _source2 = nodeDict[_edge2[0]];
    var _target2 = nodeDict[_edge2[1]];

    //an edge might already have been created if both endpoints belong to compound nodes
    if (_source2.findEdgeBetween(_target2)) continue;

    var _newEdge2 = simpleGm.add(this.newEdge(), _source2, _target2);
    _newEdge2.id = _source2.id.concat("to").concat(_target2.id);
  }
  return nodeDict;
};

cholaLayout.prototype.onSegment = function (p, q, r) {
  if (q.x <= Math.max(p.x, r.x) && q.x >= Math.min(p.x, r.x) && q.y <= Math.max(p.y, r.y) && q.y >= Math.min(p.y, r.y)) return true;

  return false;
};

cholaLayout.prototype.orientation = function (p, q, r) {
  var val = (q.y - p.y) * (r.x - q.x) - (q.x - p.x) * (r.y - q.y);

  if (val == 0) return 0;

  return val > 0 ? 1 : 2;
};

cholaLayout.prototype.doIntersect = function (p1, q1, p2, q2) {
  // Find the four orientations needed for general and
  // special cases
  var o1 = this.orientation(p1, q1, p2);
  var o2 = this.orientation(p1, q1, q2);
  var o3 = this.orientation(p2, q2, p1);
  var o4 = this.orientation(p2, q2, q1);

  // General case
  if (o1 != o2 && o3 != o4) return true;

  // Special Cases
  // p1, q1 and p2 are colinear and p2 lies on segment p1q1
  if (o1 == 0 && this.onSegment(p1, p2, q1)) return true;

  // p1, q1 and q2 are colinear and q2 lies on segment p1q1
  if (o2 == 0 && this.onSegment(p1, q2, q1)) return true;

  // p2, q2 and p1 are colinear and p1 lies on segment p2q2
  if (o3 == 0 && this.onSegment(p2, p1, q2)) return true;

  // p2, q2 and q1 are colinear and q1 lies on segment p2q2
  if (o4 == 0 && this.onSegment(p2, q1, q2)) return true;

  return false; // Doesn't fall in any of the above cases
};

//for simple edge crosses
cholaLayout.prototype.findEdgeCrosses = function (edges1, edges2) {
  var crossingEdges = [];
  for (var i = 0; i < edges1.length; i++) {
    var edge = edges1[i];
    var srcLoc = null;
    var tgtLoc = null;

    if (edge.source.isCompound()) srcLoc = edge.sourceEndpoint();else srcLoc = edge.source.getCenter();

    if (edge.target.isCompound()) tgtLoc = edge.targetEndpoint();else tgtLoc = edge.target.getCenter();

    for (var j = i + 1; j < edges2.length; j++) {
      var otherEdge = edges2[j];

      //if edges originate from the same node, dont find intersection
      if (edge.source == otherEdge.source || edge.source == otherEdge.target) continue;

      if (edge.target == otherEdge.source || edge.target == otherEdge.target) continue;

      var otherSrcLoc = null;
      var otherTgtLoc = null;

      if (otherEdge.source.isCompound()) otherSrcLoc = otherEdge.sourceEndpoint();else otherSrcLoc = otherEdge.source.getCenter();

      if (otherEdge.target.isCompound()) otherTgtLoc = otherEdge.targetEndpoint();else otherTgtLoc = otherEdge.target.getCenter();

      if (this.doIntersect(srcLoc, tgtLoc, otherSrcLoc, otherTgtLoc)) {
        var intersectionPoint = this.findIntersection(srcLoc, tgtLoc, otherSrcLoc, otherTgtLoc);
        crossingEdges.push([edge, otherEdge, intersectionPoint]);

        if (edge.id == "1_17" || otherEdge.id == "1_17") {
          console.log("Edge crossing of 1_17");
          console.log(edge.id);
          console.log(otherEdge.id);
          console.log("");
        }
      }
    }
  }
  return crossingEdges;
};

cholaLayout.prototype.createDummiesForCrossings = function (gm, edgeCrosses, edgeSplitDict, nodeDict) {
  var dummyNodes = [];
  for (var i = 0; i < edgeCrosses.length; i++) {
    var edgeCrossing = edgeCrosses[i];
    var edge1 = edgeCrossing[0];
    var edge2 = edgeCrossing[1];
    var crossingPoint = edgeCrossing[2];

    //create a dummy node for the edge crossing
    var parent = gm.getRoot();
    var dummyNode = parent.add(new cholaNode(gm, crossingPoint, new DimensionD(1, 1)));
    dummyNode.setCenter(crossingPoint.x, crossingPoint.y);
    dummyNode.id = "cdnode" + (i + 1).toString(); //cdn: edge crossing dummy node
    dummyNodes.push(dummyNode);
    nodeDict[dummyNode.id] = dummyNode;

    //if edge is a boundary edge of a compound node
    if (edge1.parentNode != null) {
      edge1.parentNode.insertNodeToBoundary(dummyNode);
    }
    if (edge2.parentNode != null) {
      edge2.parentNode.insertNodeToBoundary(dummyNode);
    }

    if (edgeSplitDict[edge1.id] != undefined) {
      //find the split edge section which contains the crossing point
      var splitEdges = edgeSplitDict[edge1.id];
      for (var k = 0; k < splitEdges.length; k++) {
        var e1 = splitEdges[k];
        var src = e1.source;
        var mid = e1.target;
        if (mid.octalCode(src) == mid.octalCode(dummyNode)) {
          edge1 = e1;
          break;
        }
      }
    }
    if (edgeSplitDict[edge2.id] != undefined) {
      //find the split edge section which contains the crossing point
      var _splitEdges = edgeSplitDict[edge2.id];
      for (var _k3 = 0; _k3 < _splitEdges.length; _k3++) {
        var _e4 = _splitEdges[_k3];
        var _src = _e4.source;
        var _mid = _e4.target;
        if (_mid.octalCode(_src) == _mid.octalCode(dummyNode)) {
          edge2 = _e4;
          break;
        }
      }
    }

    //connect the sources and targets to the dummy node
    var dummyEdge1 = gm.add(this.newEdge(), edge1.source, dummyNode);
    dummyEdge1.id = "cdedge:" + edge1.source.id + "to" + dummyNode.id;
    dummyEdge1.isDummy = true;
    dummyEdge1.parentEdge = edge1;

    var dummyEdge2 = gm.add(this.newEdge(), dummyNode, edge1.target);
    dummyEdge2.id = "cdedge:" + dummyNode.id + "to" + edge1.target.id;
    dummyEdge2.isDummy = true;
    dummyEdge2.parentEdge = edge1;

    dummyEdge1.coupleEdge = dummyEdge2;
    dummyEdge2.coupleEdge = dummyEdge1;

    var dummyEdge3 = gm.add(this.newEdge(), edge2.source, dummyNode);
    dummyEdge3.id = "cdedge:" + edge2.source.id + "to" + dummyNode.id;
    dummyEdge3.isDummy = true;
    dummyEdge3.parentEdge = edge2;

    var dummyEdge4 = gm.add(this.newEdge(), dummyNode, edge2.target);
    dummyEdge4.id = "cdedge:" + dummyNode.id + "to" + edge2.target.id;
    dummyEdge4.isDummy = true;
    dummyEdge4.parentEdge = edge2;

    dummyEdge3.coupleEdge = dummyEdge4;
    dummyEdge4.coupleEdge = dummyEdge3;

    edgeSplitDict[edge1.id] = [dummyEdge1, dummyEdge2];
    edgeSplitDict[edge2.id] = [dummyEdge3, dummyEdge4];

    var edge1temp = edge1;
    var edge2temp = edge2;

    var temp = edge1;
    var pEdge = temp.parentEdge;
    var arr = edgeSplitDict[temp.id];
    while (temp.id.includes("cdnode")) {
      var index = edgeSplitDict[pEdge.id].indexOf(temp);
      edgeSplitDict[pEdge.id].splice(index, 1);

      for (var _k4 = 0; _k4 < arr.length; _k4++) {
        edgeSplitDict[pEdge.id].splice(index + _k4, 0, arr[_k4]);
      }pEdge = pEdge.parentEdge;
      if (pEdge == null) break;
    }

    temp = edge2;
    pEdge = temp.parentEdge;
    arr = edgeSplitDict[temp.id];
    while (temp.id.includes("cdnode")) {
      var _index2 = edgeSplitDict[pEdge.id].indexOf(temp);
      edgeSplitDict[pEdge.id].splice(_index2, 1);

      for (var _k5 = 0; _k5 < arr.length; _k5++) {
        edgeSplitDict[pEdge.id].splice(_index2 + _k5, 0, arr[_k5]);
      }pEdge = pEdge.parentEdge;
      if (pEdge == null) break;
    }

    //delete both of the edges from the graph
    if (edge1temp.isInterGraph) {
      gm.remove(edge1temp);
    } else {
      var graph = gm.calcLowestCommonAncestor(edge1temp.source, edge1temp.target);
      graph.remove(edge1temp);
    }

    if (edge2temp.isInterGraph) {
      gm.remove(edge2temp);
    } else {
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

cholaLayout.prototype.compactGraphHelper = function (gm, axis, dir) {
  if (axis == "x") {
    console.log("Performing horizontal compaction towards:");
    if (dir == 0) console.log("RIGHT");else console.log("LEFT");
  } else {
    console.log("Performing vertical compaction towards:");
    if (dir == 0) console.log("BOTTOM");else console.log("TOP");
  }
  var dict = this.createAxisDict(gm, axis);

  var indexDict = void 0,
      nextPosList = void 0;

  var _sortAndCombineDict = this.sortAndCombineDict(dict, indexDict);

  var _sortAndCombineDict2 = _slicedToArray(_sortAndCombineDict, 3);

  dict = _sortAndCombineDict2[0];
  indexDict = _sortAndCombineDict2[1];
  nextPosList = _sortAndCombineDict2[2];


  this.createVisibilityGraph(nextPosList, indexDict);

  console.log("Created visibility graph");
  console.log(indexDict);
  console.log("");

  this.assignNewLocsToBars(indexDict, dir);

  this.reLocateBarMembers(gm, indexDict, dir, axis);

  var ael = gm.getAverageEdgeLength();
  var area = gm.getArea();

  return [ael, area];
};

cholaLayout.prototype.compactGraph = function (gm, maxPasses) {
  /*
   * if dir == 0, horizontal compaction is done towards right, vertical compaction is done towards bottom
   * if dir == 1, horizontal compaction is done towards left , vertical compaction is done towards top
   */

  var LEFT_TO_RIGHT = 0;
  var RIGHT_TO_LEFT = 1;
  var TOP_TO_BOTTOM = 0;
  var BOTTOM_TO_TOP = 1;

  var aelArray = [];
  var areaArray = [];

  var ael = gm.getAverageEdgeLength();
  console.log("Original average edge length is:");
  console.log(ael);

  var area = gm.getArea();
  console.log("Original area is:");
  console.log(area);

  var prevArea = area / 10000;

  for (var i = 1; i <= maxPasses; i++) {
    var ael1 = void 0,
        ael2 = void 0,
        ael3 = void 0,
        ael4 = void 0;
    var area1 = void 0,
        area2 = void 0,
        area3 = void 0,
        area4 = void 0;
    if (i % 4 == 1) {
      var _compactGraphHelper = this.compactGraphHelper(gm, "y", TOP_TO_BOTTOM);

      var _compactGraphHelper2 = _slicedToArray(_compactGraphHelper, 2);

      ael1 = _compactGraphHelper2[0];
      area1 = _compactGraphHelper2[1];

      var _compactGraphHelper3 = this.compactGraphHelper(gm, "x", LEFT_TO_RIGHT);

      var _compactGraphHelper4 = _slicedToArray(_compactGraphHelper3, 2);

      ael2 = _compactGraphHelper4[0];
      area2 = _compactGraphHelper4[1];

      var _compactGraphHelper5 = this.compactGraphHelper(gm, "y", BOTTOM_TO_TOP);

      var _compactGraphHelper6 = _slicedToArray(_compactGraphHelper5, 2);

      ael3 = _compactGraphHelper6[0];
      area3 = _compactGraphHelper6[1];

      var _compactGraphHelper7 = this.compactGraphHelper(gm, "x", RIGHT_TO_LEFT);

      var _compactGraphHelper8 = _slicedToArray(_compactGraphHelper7, 2);

      ael4 = _compactGraphHelper8[0];
      area4 = _compactGraphHelper8[1];
    } else if (i % 4 == 2) {
      var _compactGraphHelper9 = this.compactGraphHelper(gm, "y", BOTTOM_TO_TOP);

      var _compactGraphHelper10 = _slicedToArray(_compactGraphHelper9, 2);

      ael1 = _compactGraphHelper10[0];
      area1 = _compactGraphHelper10[1];

      var _compactGraphHelper11 = this.compactGraphHelper(gm, "x", RIGHT_TO_LEFT);

      var _compactGraphHelper12 = _slicedToArray(_compactGraphHelper11, 2);

      ael2 = _compactGraphHelper12[0];
      area2 = _compactGraphHelper12[1];

      var _compactGraphHelper13 = this.compactGraphHelper(gm, "y", TOP_TO_BOTTOM);

      var _compactGraphHelper14 = _slicedToArray(_compactGraphHelper13, 2);

      ael3 = _compactGraphHelper14[0];
      area3 = _compactGraphHelper14[1];

      var _compactGraphHelper15 = this.compactGraphHelper(gm, "x", LEFT_TO_RIGHT);

      var _compactGraphHelper16 = _slicedToArray(_compactGraphHelper15, 2);

      ael4 = _compactGraphHelper16[0];
      area4 = _compactGraphHelper16[1];
    } else if (i % 4 == 3) {
      var _compactGraphHelper17 = this.compactGraphHelper(gm, "x", LEFT_TO_RIGHT);

      var _compactGraphHelper18 = _slicedToArray(_compactGraphHelper17, 2);

      ael1 = _compactGraphHelper18[0];
      area1 = _compactGraphHelper18[1];

      var _compactGraphHelper19 = this.compactGraphHelper(gm, "y", TOP_TO_BOTTOM);

      var _compactGraphHelper20 = _slicedToArray(_compactGraphHelper19, 2);

      ael2 = _compactGraphHelper20[0];
      area2 = _compactGraphHelper20[1];

      var _compactGraphHelper21 = this.compactGraphHelper(gm, "x", RIGHT_TO_LEFT);

      var _compactGraphHelper22 = _slicedToArray(_compactGraphHelper21, 2);

      ael3 = _compactGraphHelper22[0];
      area3 = _compactGraphHelper22[1];

      var _compactGraphHelper23 = this.compactGraphHelper(gm, "y", BOTTOM_TO_TOP);

      var _compactGraphHelper24 = _slicedToArray(_compactGraphHelper23, 2);

      ael4 = _compactGraphHelper24[0];
      area4 = _compactGraphHelper24[1];
    } else {
      var _compactGraphHelper25 = this.compactGraphHelper(gm, "x", RIGHT_TO_LEFT);

      var _compactGraphHelper26 = _slicedToArray(_compactGraphHelper25, 2);

      ael1 = _compactGraphHelper26[0];
      area1 = _compactGraphHelper26[1];

      var _compactGraphHelper27 = this.compactGraphHelper(gm, "y", BOTTOM_TO_TOP);

      var _compactGraphHelper28 = _slicedToArray(_compactGraphHelper27, 2);

      ael2 = _compactGraphHelper28[0];
      area2 = _compactGraphHelper28[1];

      var _compactGraphHelper29 = this.compactGraphHelper(gm, "x", LEFT_TO_RIGHT);

      var _compactGraphHelper30 = _slicedToArray(_compactGraphHelper29, 2);

      ael3 = _compactGraphHelper30[0];
      area3 = _compactGraphHelper30[1];

      var _compactGraphHelper31 = this.compactGraphHelper(gm, "y", TOP_TO_BOTTOM);

      var _compactGraphHelper32 = _slicedToArray(_compactGraphHelper31, 2);

      ael4 = _compactGraphHelper32[0];
      area4 = _compactGraphHelper32[1];
    }

    console.log("Area values");
    console.log(area1);
    console.log(area2);
    console.log(area3);
    console.log(area4);
    var avgAel = (ael1 + ael2 + ael3 + ael4) / 4;
    var avgArea = (area1 + area2 + area3 + area4) / 4;
    aelArray.push(parseInt(avgAel));
    areaArray.push(avgArea / 10000);

    if (prevArea == avgArea) break;else prevArea = avgArea;
  }

  console.log("Average edge length data:");
  console.log(aelArray);
  console.log("Average area data:");
  console.log(areaArray);
};

cholaLayout.prototype.createAxisDict = function (gm, axis) {
  var dict = {};
  var allNodes = gm.getAllNodes();
  var allEdges = gm.getAllEdges();

  //add simple nodes to the dictionary
  for (var i = 0; i < allNodes.length; i++) {
    var node = allNodes[i];
    var pos1 = void 0,
        pos2 = void 0;

    if (axis == "x") {
      pos1 = node.getCenterX();
      pos2 = node.getCenterY();
    } else {
      pos1 = node.getCenterY();
      pos2 = node.getCenterX();
    }
    if (dict[pos1] == undefined) dict[pos1] = [];

    dict[pos1].push([null, [pos2], [node]]);
  }

  //add bendpoints to the dictionary
  for (var _i5 = 0; _i5 < allEdges.length; _i5++) {
    var edge = allEdges[_i5];

    if (edge.bendpoints.length > 0) {
      for (var j = 0; j < edge.bendpoints.length; j++) {
        var bendpoint = edge.bendpoints[j];
        var _pos = void 0,
            _pos2 = void 0;

        if (axis == "x") {
          _pos = bendpoint.x;
          _pos2 = bendpoint.y;
        } else {
          _pos = bendpoint.y;
          _pos2 = bendpoint.x;
        }

        if (dict[_pos] == undefined) dict[_pos] = [];

        dict[_pos].push([null, [_pos2], [bendpoint]]);
      }
    }
  }
  return dict;
};

cholaLayout.prototype.sortAndCombineDict = function (dict, indexDict) {
  var dictValues = Object.values(dict);
  var dictKeys = Object.keys(dict);

  var index = 0;

  var nextPosList = {};

  indexDict = {};

  var modify = false;

  for (var j = 0; j < dictValues.length; j++) {
    var row = dictValues[j];

    row.sort(function (a, b) {
      return a[1][0] - b[1][0];
    });

    var combine = false;

    //then check if each consecutive item in the values is connected or not
    for (var i = 0; i < row.length - 1; i++) {
      modify = true;
      var currRow = row[i];
      var nextRow = row[i + 1];

      var currRowLN = currRow[2][currRow[2].length - 1];
      var nextRowFN = nextRow[2][0];

      //now check if these two items are connected
      if (!(currRowLN instanceof cholaNode) && !(nextRowFN instanceof cholaNode)) {
        //both are bendpoints
        var bp1 = currRowLN;
        var bp2 = nextRowFN;
        if (bp1.id == bp2.srcId || bp1.id == bp2.tgtId) combine = true;
      } else if (currRowLN instanceof cholaNode && nextRowFN instanceof cholaNode) {
        //both are nodes
        var node1 = currRowLN;
        var node2 = nextRowFN;
        var edge = node1.findEdgeBetween(node2);
        if (edge != null) combine = true;
      } else if (currRowLN instanceof cholaNode && !(nextRowFN instanceof cholaNode)) {
        var node = currRowLN;
        var bp = nextRowFN;
        if (node.id == bp.srcId || node.id == bp.tgtId) combine = true;
      } else if (!(currRowLN instanceof cholaNode) && nextRowFN instanceof cholaNode) {
        var _bp = currRowLN;
        var _node3 = nextRowFN;
        if (_node3.id == _bp.srcId || _node3.id == _bp.tgtId) combine = true;
      }

      if (currRow[0] == null) {
        currRow[0] = index;
      }

      if (combine == true) {
        //lets combine this removed row to the current row
        currRow[1] = currRow[1].concat(nextRow[1]);
        currRow[2] = currRow[2].concat(nextRow[2]);
        row.splice(i + 1, 1);

        if (row.indexOf(currRow) == row.length - 1) {
          indexDict[index] = {
            dictKey: dictKeys[j],
            posData: currRow[1],
            nodes: currRow[2],
            futureBars: [],
            prevBars: [],
            newLoc: null
          };
          index++;
        }
      } else {
        indexDict[index] = {
          dictKey: dictKeys[j],
          posData: currRow[1],
          nodes: currRow[2],
          futureBars: [],
          prevBars: [],
          newLoc: null
        };
        index++;
      }

      if (combine == false && row.indexOf(nextRow) == row.length - 1) {
        nextRow[0] = index;
        indexDict[index] = {
          dictKey: dictKeys[j],
          posData: nextRow[1],
          nodes: nextRow[2],
          futureBars: [],
          prevBars: [],
          newLoc: null
        };
        index++;
      }

      if (combine == true) {
        combine = false;
        i--;
      }
    }

    if (row.length == 1 && modify == false) {
      var _currRow = row[0];
      _currRow[0] = index;
      indexDict[index] = {
        dictKey: dictKeys[j],
        posData: _currRow[1],
        nodes: _currRow[2],
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

cholaLayout.prototype.reLocateBarMembers = function (gm, indexDict, dir, axis) {
  var bars = Object.values(indexDict);
  var keys = Object.keys(indexDict);

  var refBar = void 0;
  if (dir == 0) refBar = bars[bars.length - 1];else refBar = bars[0];

  var refPos = parseInt(refBar.dictKey);

  for (var i = 0; i < bars.length; i++) {
    var bar = bars[i];
    if (bar.newLoc == 0 && bar == refBar) continue;else {
      var newPos = refPos + bar.newLoc * 100;
      var nodes = bar.nodes;

      //change the node positions only if they are different than the new ones
      if (nodes[0] instanceof cholaNode && (axis == "x" && newPos == nodes[0].getCenterX() || axis == "y" && newPos == nodes[0].getCenterY())) continue;else if (!(nodes[0] instanceof cholaNode) && (axis == "x" && newPos == nodes[0].x || axis == "y" && newPos == nodes[0].y)) continue;

      //update positions of all nodes/bps in that bar
      for (var j = 0; j < nodes.length; j++) {
        var item = nodes[j];
        if (item instanceof cholaNode) {
          if (axis == "x") {
            item.setCenter(newPos, item.getCenterY());
          } else item.setCenter(item.getCenterX(), newPos);
        } else {
          if (axis == "x") item.x = newPos;else item.y = newPos;
        }
      }
    }
  }
};

cholaLayout.prototype.assignNewLocsToBars = function (indexDict, dir) {
  /*
   * if dir == 0, horizontal compaction is done towards right, vertical compaction is done towards bottom
   * if dir == 1, horizontal compaction is done towards left , vertical compaction is done towards bottom
   */

  var bars = Object.values(indexDict);
  var keys = Object.keys(indexDict);

  var data = null;
  if (dir == 0) {
    data = "futureBars";
    for (var i = bars.length - 1; i >= 0; i--) {
      var bar = bars[i];
      var futureBars = bar[data];
      if (futureBars.length == 0) bar.newLoc = 0;else {
        //find the future bars with minimum value of new location
        var min = Number.MAX_VALUE;
        for (var j = 0; j < futureBars.length; j++) {
          var index = futureBars[j];
          if (indexDict[index].newLoc < min) min = indexDict[index].newLoc;
        }
        bar.newLoc = min - 1;
      }
    }
  } else if (dir == 1) {
    data = "prevBars";
    for (var _i6 = 0; _i6 < bars.length; _i6++) {
      var _bar = bars[_i6];
      var prevBars = _bar[data];
      if (prevBars.length == 0) _bar.newLoc = 0;else {
        //find the future bars with maximum value of new location
        var max = Number.MIN_VALUE;
        for (var _j7 = 0; _j7 < prevBars.length; _j7++) {
          var _index3 = prevBars[_j7];
          if (indexDict[_index3].newLoc > max) max = indexDict[_index3].newLoc;
        }
        _bar.newLoc = max + 1;
      }
    }
  }
};

cholaLayout.prototype.createVisibilityGraph = function (posList, indexDict) {
  var bars = Object.values(indexDict);
  var keys = Object.keys(indexDict);

  //working on all bars at all x or y values
  for (var i = 0; i < bars.length - 1; i++) {
    var bar1 = bars[i];
    var dictKey = bar1.dictKey;

    var sp1 = bar1.posData[0];
    var ep1 = void 0;
    if (bar1.posData.length == 1) ep1 = bar1.posData[0]; //in this case, it is not a bar but a single node
    else ep1 = bar1.posData[bar1.posData.length - 1];

    //get starting index of next x/y value
    var index = posList[dictKey];

    var compData = [];

    for (var j = index; j < bars.length; j++) {
      var bar2 = bars[j];

      var sp2 = bar2.posData[0]; //starting point of bar
      var ep2 = void 0; //end point of bar
      if (bar2.posData.length == 1) ep2 = bar2.posData[0];else ep2 = bar2.posData[bar2.posData.length - 1];

      if (sp1 <= sp2 && sp2 <= ep1 || sp1 <= ep2 && ep2 <= ep1 || sp2 <= sp1 && sp1 <= ep2 || sp2 <= ep1 && ep1 < ep2) {
        //find the part that coincides with bar1
        var sp4 = void 0,
            ep4 = void 0;
        var row = [sp1, ep1, sp2, ep2];
        row.sort(function (a, b) {
          return a - b;
        });
        sp4 = row[1];
        ep4 = row[2];

        var alteredData = void 0;
        var overlap = false;

        if (compData.length == 0) {
          compData.push([sp4, ep4]);
          alteredData = [sp4, ep4];
        } else {
          //check if bar2 is covered completely by the previous bars
          //if not, combine it into the compData

          for (var k = 0; k < compData.length; k++) {
            var sp3 = compData[k][0];
            var ep3 = compData[k][1];

            var _row = [sp3, ep3, sp4, ep4];
            if (sp3 == sp4 && ep3 == ep4 || sp3 <= sp4 && ep4 <= ep3) //exact overlap
              {
                //will not add to future bars because it is blocked
                overlap = true;
                break;
              } else if (sp4 < sp3 && sp3 <= ep4 && ep4 <= ep3 || ep4 > ep3 && sp3 <= sp4 && sp4 <= ep3 || sp4 < sp3 && ep3 < ep4) {
              //will add to future bars bcz it is not completely blocked by prev bars
              var _row2 = [sp3, ep3, sp4, ep4];
              _row2.sort(function (a, b) {
                return a - b;
              });
              compData[k][0] = _row2[0];
              compData[k][1] = _row2[3];
              alteredData = [_row2[0], _row2[3]];
              break;
            } else if (!(sp3 < sp4 && sp4 < ep3) || !(sp3 < ep4 && ep4 < ep3)) //no overlap
              {
                if (k == compData.length - 1) {
                  compData.push([sp4, ep4]);
                  alteredData = [sp4, ep4];
                  break;
                }
              }
          }

          if (overlap == true) continue;
        }

        //if compData is altered, check if its completely overlaps bar1
        //if it does, break

        if (overlap == false) {
          bar1.futureBars.push(j);
          bar2.prevBars.push(i);
        }

        if (alteredData != null) {
          var _sp = alteredData[0];
          var _ep = alteredData[1];
          if (_sp <= sp1 && ep1 <= _ep) {
            break;
          }
        }
      }
    }
  }
};

module.exports = cholaLayout;

/***/ }),
/* 4 */
/***/ (function(module, exports) {

module.exports = __WEBPACK_EXTERNAL_MODULE__4__;

/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var LayoutConstants = __webpack_require__(4).layoutBase.LayoutConstants;

function cholaConstants() {}

//cholaConstants inherits static props in FDLayoutConstants
for (var prop in LayoutConstants) {
    cholaConstants[prop] = LayoutConstants[prop];
}

cholaConstants.DEFAULT_USE_MULTI_LEVEL_SCALING = false;
cholaConstants.DEFAULT_RADIAL_SEPARATION = LayoutConstants.DEFAULT_MIN_LENGTH;
cholaConstants.DEFAULT_COMPONENT_SEPERATION = 60;
cholaConstants.TILE = true;
cholaConstants.TILING_PADDING_VERTICAL = 10;
cholaConstants.TILING_PADDING_HORIZONTAL = 10;

/*
Ideal edge length will be a multiple of the average node dimension.
Set the multiplier here.

Should be at least two, or else the shape buffer multiplier should not be used.
*/
cholaConstants.IEL_MULTIPLIER = 2;
cholaConstants.ROTATE_FOR_WIDE_ASPECT_RATIO = true;
cholaConstants.CLASSIC_ACA_FOR_CHAINS = true;

//Set the kinds of placements that are favoured for trees.

cholaConstants.TREE_PLACEMENT_FAVOUR_CARDINAL = true;
cholaConstants.TREE_PLACEMENT_FAVOUR_EXTERNAL = true;
cholaConstants.TREE_PLACEMENT_FAVOUR_ISOLATION = true;

//We pad the nodes to keep gaps between them.

cholaConstants.NODE_PADDING_IEL_SCALAR = 0.25;

//For neighbour stress we scale the ideal edge length.

cholaConstants.NBR_STRESS_IEL_SCALAR = 1 / 20;

//Options and parameters for the "near alignments" pass:

cholaConstants.DO_NEAR_ALIGNMENTS = true;
cholaConstants.ALIGN_AND_SHAKE_REPS = 2;
cholaConstants.KINK_WIDTH_SCALAR = 0.5;
cholaConstants.ALIGNMENT_SCOPE_SCALAR = 2;

//Options for symmetric tree layout:

cholaConstants.RIGID_RANK_SEP = true;
cholaConstants.TRY_MIRROR_TRIPLES = false;

//Logging levels for various stages of the process:

// cholaConstants.LOG_LEVEL_GENERAL = LogLevel.TIMING;
// cholaConstants.LOG_LEVEL_TREE_PLACEMENT = LogLevel.TIMING;


//Do you want node IDs to be labels on the nodes in the final layout?

cholaConstants.NODE_IDS_AS_LABELS = false;

//Do a final stress reduction with neighbour stress?

cholaConstants.DO_FINAL_NEIGHBOUR_STRESS_SHAKE = true;

/*
If three nodes u, v, w in a graph form a triangle -- i.e. a subgraph isomorphic
to K3 -- then during node configuration we may wish to prevent the "flattening"
of this triangle, i.e. the configuration of any one of the three nodes in such
a way that the other two are assigned to opposite compass directions, e.g. assigning
u and w to be north and south, resp., of v. To prevent this, set this option to
true.

One reason to leave this option set to false; is e.g. that K4 gets a better (planar)
layout.
*/
cholaConstants.NODE_CONFIG_NO_FLAT_TRIANGLES = false;

/*
To get a dictionary of routing options to be passed to a RoutingRig object,
call the getRoutingOpts function.

In many cases it makes sense to think of router parameters as scalar multiples
of the ideal edge length of the graph. In such cases, you may set the scalars
in the following dictionary, and you must pass the ideal edge length as iel
to the getRoutingOpts function.

If you want to switch some of these off, while
continuing to use others, simply set their value to None. Where scalars are
not used we fall back on the defaults dictionary below.
*/
cholaConstants.ROUTING_OPT_IEL_SCALARS = [['crossingPenalty', 2],
// DEPRECATED: Nodes are padded throughout, so no need for this:
['shapeBufferDistance', 0], ['segmentPenalty', 0.5]];
cholaConstants.ROUTING_OPT_DEFAULTS = [['crossingPenalty', 0],
// DEPRECATED: Nodes are padded throughout, so no need for this:
['shapeBufferDistance', 0],
//
['segmentPenalty', 50]];
/*
In, for example, a NORTH-growing tree, an edge between ranks i and i + 1
will always be allowed to connect only to the south (S) port of a node in
rank i + 1.

This setting controls the directions allowed for connection to nodes in
rank i, as follows:

0:  only N is allowed
1:  N, E, W are allowed for the root node if it has exactly one child and
    it is an ordinal placement, otherwise only N
2:  N, E, W are allowed for all nodes on rank i

The "CORE" version controls trees attached to a core graph.
The "PURE" version controls graphs which are themselves trees.
*/
cholaConstants.PERMISSIVE_CORE_TREE_ROUTING = 1;
cholaConstants.PERMISSIVE_PURE_TREE_ROUTING = 2;

/*
How to react if we get a positive water level route with no bends?
This is indicative of some systematic error, but we may nevertheless
want to skip over it, and simply mark the path as unusable.
OR we can even throw all caution to the wind and try to use the path
anyway.

The settings are as follows:

0:  Do not tolerate. Raise an exception and quit immediately.
1:  Raise an UnusableWaterPath exception, and print a warning.
    This type of exception is caught by a higher level control loop.
2:  Do not raise any exception, but do print a warning.
3:  Do not raise any exception, do not print any warning.
*/
cholaConstants.ON_POSITIVE_WATER_LEVEL_ROUTE_WITHOUT_BENDS = 1;

/*
Default operation is to evaluate all tree placement options exactly
by actually carrying out each potential projection sequence, evaluating
the stress change, and backtracking.
If speed is favoured over quality, we can instead merely estimate the
cost of each tree placement. Set this to true if that is desired.
*/
cholaConstants.ESTIMATE_TREE_PLACEMENT_COSTS = false;
/*
Legacy option. Heuristic for estimating face expansion costs was discovered
to be faulty, and was updated 25 Jul 2018. Set this option to true if you
want the old behaviour.
*/
cholaConstants.USE_OLD_COST_ESTIMATE_HEURISTIC = false;
/*
We can also speed up tree placement by using an estimate of the stress
costs, in order to choose the primary expansion dimension.
*/
cholaConstants.HEURISTIC_CHOICE_FOR_PRIMARY_EXPANSION_DIMENSION = false;
/*
When making heuristic choice of primary expansion dimension, do you want
to work in the costlier dimension first? (The hope is that the bigger change
that this represents will already be enough to make room for the tree, and
you will not have to work in the other dimension at all.)
*/
cholaConstants.HCPED_COSTLIER_DIMENSION_FIRST = true;

/*
Ignore all but level zero? Doing so may miss some alternative ways to
expand a face, but will be faster.
*/
cholaConstants.WATER_LEVEL_ZERO_ONLY = false;

/*
Should we use scaling when using stress majorization for neighbour stress layout?
Recent tests have shown it is faster if we do _not_ use it.
*/
cholaConstants.USE_SCALING_IN_MAJORIZATION = false;
cholaConstants.DEFAULT_TREE_DIREC = 1; // 1 means south

/*
Set the kinds of placements that are favoured for trees.
*/
cholaConstants.TREE_PLACEMENT_FAVOUR_CARDINAL = true;
cholaConstants.TREE_PLACEMENT_FAVOUR_EXTERNAL = true;
cholaConstants.TREE_PLACEMENT_FAVOUR_ISOLATION = true;

cholaConstants.EAST = 0;
cholaConstants.SOUTH = 1;
cholaConstants.WEST = 2;
cholaConstants.NORTH = 3;

cholaConstants.SE = 4;
cholaConstants.SW = 5;
cholaConstants.NW = 6;
cholaConstants.NE = 7;

cholaConstants.XDIM = 0;
cholaConstants.YDIM = 1;

module.exports = cholaConstants;

/***/ }),
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var LGraphManager = __webpack_require__(4).layoutBase.LGraphManager;
var cholaNode = __webpack_require__(7);
var DimensionD = __webpack_require__(4).layoutBase.DimensionD;

function cholaGraphManager(layout) {
  LGraphManager.call(this, layout);

  this.edgesWithBends = [];
  this.nodes = {};
  this.connectivityEdges = [];
}

cholaGraphManager.prototype = Object.create(LGraphManager.prototype);
for (var prop in LGraphManager) {
  cholaGraphManager[prop] = LGraphManager[prop];
}

//return the list of compound nodes
cholaGraphManager.prototype.findCompoundNodes = function () {
  var allNodes = this.getAllNodes();
  var compoundNodes = [];

  for (var i = 0; i < allNodes.length; i++) {
    var node = allNodes[i];
    if (node.isCompound()) {
      compoundNodes.push(node);
    }
  }

  //sort compounds from inside to outside
  compoundNodes = this.sortCompounds(compoundNodes);
  return compoundNodes;
};

cholaGraphManager.prototype.removeConnectivityEdges = function () {
  var dummyEdges = this.connectivityEdges;
  for (var i = 0; i < dummyEdges.length; i++) {
    var edge = dummyEdges[i];
    console.log("Removing edge between");
    console.log(edge.source, edge.target);
    var graph = this.calcLowestCommonAncestor(edge.source, edge.target);

    graph.remove(edge);
  }
};

cholaGraphManager.prototype.getAverageEdgeLength = function () {
  this.resetAllEdges();
  var sum = 0;
  var allEdges = this.getAllEdges();
  for (var i = 0; i < allEdges.length; i++) {
    var edge = allEdges[i];
    var len = edge.getLength();
    sum = sum + len;
  }
  return sum / allEdges.length;
};

cholaGraphManager.prototype.getArea = function () {
  // get minimum x and y values from nodes and bps

  var x1 = Number.MAX_VALUE;
  var x2 = Number.MIN_VALUE;
  var y1 = Number.MAX_VALUE;
  var y2 = Number.MIN_VALUE;

  var allNodes = this.getAllNodes();
  for (var i = 0; i < allNodes.length; i++) {
    var node = allNodes[i];
    var nodePosition = node.getCenter();

    if (nodePosition.x < x1) x1 = nodePosition.x;
    if (nodePosition.x > x2) x2 = nodePosition.x;
    if (nodePosition.y < y1) y1 = nodePosition.y;
    if (nodePosition.y > y2) y2 = nodePosition.y;
  }

  var allEdges = this.getAllEdges();
  for (var _i = 0; _i < allEdges.length; _i++) {
    var edge = allEdges[_i];
    var bps = edge.bendpoints;
    if (bps.length > 0) {
      for (var k = 0; k < bps.length; k++) {
        var bp = bps[k];
        if (bp.x < x1) x1 = bp.x;
        if (bp.x > x2) x2 = bp.x;
        if (bp.y < y1) y1 = bp.y;
        if (bp.y > y2) y2 = bp.y;
      }
    }
  }

  var width = x2 - x1;
  var height = y2 - y1;

  var area = width * height;
  return area;
};

cholaGraphManager.prototype.getInterGraphEdges = function () {
  var allEdges = this.getAllEdges();
  var igEdges = [];

  for (var i = 0; i < allEdges.length; i++) {
    var edge = allEdges[i];
    if (edge.isInterGraph) igEdges.push(edge);
  }
  return igEdges;
};

cholaGraphManager.prototype.sortCompounds = function (compoundNodes) {
  var hierarchyList = [];

  //sorting in ascending order
  compoundNodes.sort(function (a, b) {
    return a.getArea() - b.getArea();
  });

  var childDict = {};

  //create a hierarchy list for the compound nodes
  for (var i = 0; i < compoundNodes.length; i++) {
    var node = compoundNodes[i];
    var children = node.getChildren();

    var childList = [];

    var sum = 0;

    //check if any children of the compound node is a compound node
    for (var j = 0; j < children.length; j++) {
      var child = children[j];
      if (child.isCompound()) {
        childList.push(child);
        sum++;
        sum = sum + childDict[child.id];
      }
    }
    hierarchyList.push([node, sum]);
    childDict[node.id] = sum;
    node.childList = childList;
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
  for (var _i2 = 0; _i2 < hierarchyList.length; _i2++) {
    compoundNodes.push(hierarchyList[_i2][0]);
  }return compoundNodes;
};

module.exports = cholaGraphManager;

/***/ }),
/* 7 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var LNode = __webpack_require__(4).layoutBase.LNode;
var IMath = __webpack_require__(4).layoutBase.IMath;
var PointD = __webpack_require__(4).layoutBase.PointD;
var LayoutConstants = __webpack_require__(4).layoutBase.LayoutConstants;
var DimensionD = __webpack_require__(4).layoutBase.DimensionD;
var cc = __webpack_require__(5);

function cholaNode(gm, loc, size, vNode) {
  LNode.call(this, gm, loc, size, vNode);
  this.processed = false;
  this.treeSerialNum = 0;
  this.dx = null;
  this.dy = null;
  this.isRootNode = false;
  this.isDummy = false;
  this.parentNode = null;
  this.data = {};
  this.layout = "chola";
  this.isCmpdBoundaryNode = false;
  this.boundaryList = [];
  this.childList = [];
  this.connectedEdges = [];
  this.dummyOwner = null;
  this.freeSemiLocations = [];
  this.ports = {
    top: [],
    bottom: [],
    left: [],
    right: []
  };
}

cholaNode.prototype = Object.create(LNode.prototype);
for (var prop in LNode) {
  cholaNode[prop] = LNode[prop];
}

cholaNode.prototype.setAsRootNode = function (option) {
  this.isRootNode = option;
};

cholaNode.prototype.getParentNode = function () {
  return this.parentNode;
};

cholaNode.prototype.getArea = function () {
  return this.getWidth() * this.getHeight();
};

cholaNode.prototype.getChildren = function () {
  var children = null;

  if (this.isCompound()) {
    return this.child.nodes;
  }
};

cholaNode.prototype.compactNode = function (iel, simpleGm) {
  if (!this.isCompound()) return;

  var x1 = Number.MAX_VALUE;
  var x2 = Number.MIN_VALUE;
  var y1 = Number.MAX_VALUE;
  var y2 = Number.MIN_VALUE;

  var children = this.getChildren();
  for (var i = 0; i < children.length; i++) {
    var child = children[i];
    if (!child.isCompound()) {
      var pos = child.getCenter();
      if (pos.x < x1) x1 = pos.x;
      if (pos.x > x2) x2 = pos.x;
      if (pos.y < y1) y1 = pos.y;
      if (pos.y > y2) y2 = pos.y;
    } else {
      var bbox = child.getBbox();
      if (bbox.x1 < x1) x1 = bbox.x1;
      if (bbox.x2 > x2) x2 = bbox.x2;
      if (bbox.y1 < y1) y1 = bbox.y1;
      if (bbox.y2 > y2) y2 = bbox.y2;
    }
  }

  var cdRemoval = false;
  //remove dummy edge crossings from boundary list
  for (var j = 0; j < this.boundaryList.length; j++) {
    var bdnode = this.boundaryList[j];
    if (bdnode.id.includes("cdnode")) {
      this.boundaryList.splice(j, 1);
      cdRemoval = true;
      j--;
    }
  }

  var tempList = [];
  //add dummy nodes for bendpoints
  var bpsAddition = false;
  for (var _j = 0; _j < this.boundaryList.length; _j++) {
    var bdNode1 = this.boundaryList[_j];
    var bdNode2 = void 0;
    if (_j != this.boundaryList.length - 1) bdNode2 = this.boundaryList[_j + 1];else bdNode2 = this.boundaryList[0];

    tempList.push(bdNode1);

    var edge = bdNode1.findEdgeBetween(bdNode2);
    if (edge != null && edge.bendpoints.length > 0) {
      var bps = edge.bendpoints;
      for (var k = 0; k < bps.length; k++) {
        var bp = bps[k];
        var parent = simpleGm.getRoot();
        var newNode = parent.add(new cholaNode(simpleGm, { x: bp.x, y: bp.y }, new DimensionD(1, 1)));
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
  if (cdRemoval || bpsAddition) {
    for (var _j2 = 0; _j2 < this.boundaryList.length; _j2++) {
      var _bdNode = this.boundaryList[_j2];
      var _bdNode2 = void 0;
      if (_j2 != this.boundaryList.length - 1) _bdNode2 = this.boundaryList[_j2 + 1];else _bdNode2 = this.boundaryList[0];

      if (_bdNode.findEdgeBetween(_bdNode2) == null) {
        var layout = simpleGm.layout;
        var newEdge = simpleGm.add(layout.newEdge(), _bdNode, _bdNode2);
        newEdge.id = _bdNode.id.concat("to").concat(_bdNode2.id);
      }
    }
  }

  console.log(this.id);
  console.log(this.boundaryList);

  // crop top and bottom part of compound
  for (var _i = 0; _i < 4; _i++) {
    var array = [];

    for (var _j3 = 0; _j3 < this.boundaryList.length; _j3++) {
      var _bdnode = this.boundaryList[_j3];
      var nodePosition = _bdnode.getCenter();
      if (_i in [0, 1]) //x compaction
        array.push([nodePosition.y, _bdnode]);else //y compaction
        array.push([nodePosition.x, _bdnode]);
    }

    array.sort(function (a, b) {
      return a[0] - b[0];
    });

    if (_i == 1 || _i == 3) array.reverse();

    if (_i == 0) {
      this.cropHelper(array, y1, iel, "top");
    } else if (_i == 1) {
      this.cropHelper(array, y2, iel, "bottom");
    } else if (_i == 2) {
      this.cropHelper(array, x1, iel, "left");
    } else {
      this.cropHelper(array, x2, iel, "right");
    }
  }

  x1 = Number.MAX_VALUE;
  x2 = Number.MIN_VALUE;
  y1 = Number.MAX_VALUE;
  y2 = Number.MIN_VALUE;

  for (var _k = 0; _k < this.boundaryList.length; _k++) {
    var _bdnode2 = this.boundaryList[_k];
    var _nodePosition = _bdnode2.getCenter();
    if (_nodePosition.x < x1) x1 = _nodePosition.x;
    if (_nodePosition.x > x2) x2 = _nodePosition.x;
    if (_nodePosition.y < y1) y1 = _nodePosition.y;
    if (_nodePosition.y > y2) y2 = _nodePosition.y;
  }

  var center = {
    x: x1 + (x2 - x1) / 2,
    y: y1 + (y2 - y1) / 2
  };

  //now get the new width and the height of the compound
  var w = x2 - x1;
  var h = y2 - y1;

  this.setWidth(w);
  this.setHeight(h);
  this.setCenter(center.x, center.y);
};

cholaNode.prototype.cropHelper = function (array, childRef, iel, side) {
  var bdLimit1 = array[0][0];
  var bdLimit2 = void 0;

  var startPos = Number.MAX_VALUE;
  var endPos = Number.MIN_VALUE;

  var j = 0;
  for (j = 0; j < array.length; j++) {
    var pos = array[j][0];
    var condition = void 0;

    if (side == "top" || side == "left") condition = pos > bdLimit1;else condition = pos < bdLimit1;

    if (condition) {
      bdLimit2 = pos;
      break;
    } else {
      var node = array[j][1];
      var nodePos = node.getCenter();
      if (side == "top" || side == "bottom") {
        if (nodePos.x < startPos) startPos = nodePos.x;
        if (nodePos.x > endPos) endPos = nodePos.x;
      } else {
        if (nodePos.y < startPos) startPos = nodePos.y;
        if (nodePos.y > endPos) endPos = nodePos.y;
      }
    }
  }

  var cornerCheck = false;
  for (var i = 0; i < j; i++) {
    var _node = array[i][1];
    var _pos = _node.getCenter();

    var _condition = void 0;
    if (side == "top" || side == "bottom") _condition = _pos.x == startPos || _pos.x == endPos;else _condition = _pos.y == startPos || _pos.y == endPos;

    if (_condition) {
      //now check if the top corner nodes are three degree nodes
      if (_node.getDegree() > 2) {
        var nbrs = _node.getNeighbors();
        for (var k = 0; k < nbrs.length; k++) {
          var nbr = nbrs[k];
          if (nbr.isCmpdBoundaryNode && nbr.dummyOwner.id == this.id) continue;else {
            var edge = _node.findEdgeBetween(nbr);
            var dir = void 0;
            if (edge.bendpoints.length == 0) dir = this.direction(_node.getCenter(), nbr.getCenter());else {
              if (edge.source == _node) dir = this.direction(_node.getCenter(), edge.bendpoints[0]);else dir = this.direction(_node.getCenter(), edge.bendpoints[edge.bendpoints.length - 1]);
            }
            if (side == "top" || side == "bottom") {
              if (dir == 0 || dir == 2) //then there are nodes connected to the other side
                {
                  cornerCheck = true; //so node cannot be shrank
                  break;
                }
            } else {
              if (dir == 1 || dir == 3) //then there are nodes connected to the other side
                {
                  cornerCheck = true; //so node cannot be shrank
                  break;
                }
            }
          }
        }
      }
      if (cornerCheck) break;
    }
  }
  if (cornerCheck) return;

  var chosenRef = void 0;
  if (side == "top" || side == "left") chosenRef = Math.min(childRef, bdLimit2);else chosenRef = Math.max(childRef, bdLimit2);

  if (chosenRef == childRef) {
    var diff = Math.abs(chosenRef - bdLimit1);
    if (diff > iel) {
      //all boundary node with y value of bdLimit1 lie on the top boundary and can be moved downwards
      //determine the new position of the boundary
      for (var _i2 = 0; _i2 < array.length; _i2++) {
        var row = array[_i2];
        var _pos2 = row[0];
        var _node2 = row[1];
        var _nodePos = _node2.getCenter();
        if (side == "top" || side == "left") {
          var cropLimit = chosenRef - iel;
          if (_pos2 < cropLimit) {
            if (side == "top") _node2.setCenter(_nodePos.x, cropLimit);else _node2.setCenter(cropLimit, _nodePos.y);
          }
        } else {
          var _cropLimit = chosenRef + iel;
          if (_pos2 > _cropLimit) {
            if (side == "bottom") _node2.setCenter(_nodePos.x, _cropLimit);else _node2.setCenter(_cropLimit, _nodePos.y);
          }
        }
      }
    }
  } else {
    cornerCheck = false;
    for (j; j < array.length; j++) {
      var _pos3 = array[j][0];
      var _node3 = array[j][1];
      var _condition2 = void 0;

      if (side == "top" || side == "left") _condition2 = _pos3 < childRef;else _condition2 = _pos3 > childRef;

      if (_condition2) {
        if (_node3.getDegree() == 2) continue;

        var _nbrs = _node3.getNeighbors();
        for (var _k2 = 0; _k2 < _nbrs.length; _k2++) {
          var _nbr = _nbrs[_k2];
          if (_nbr.isCmpdBoundaryNode && _nbr.dummyOwner.id == this.id) continue;else {
            var _edge = _node3.findEdgeBetween(_nbr);
            var _dir = void 0;
            if (_edge.bendpoints.length == 0) _dir = this.direction(_node3.getCenter(), _nbr.getCenter());else {
              if (_edge.source == _node3) _dir = this.direction(_node3.getCenter(), _edge.bendpoints[0]);else _dir = this.direction(_node3.getCenter(), _edge.bendpoints[_edge.bendpoints.length - 1]);
            }
            if (side == "top" || side == "bottom") {
              if (_dir == 0 || _dir == 2) //then there are nodes connected to the other side
                {
                  cornerCheck = true; //so node cannot be shrank
                  bdLimit2 = _pos3;
                  break;
                }
            } else {
              if (_dir == 1 || _dir == 3) //then there are nodes connected to the other side
                {
                  cornerCheck = true; //so node cannot be shrank
                  bdLimit2 = _pos3;
                  break;
                }
            }
          }
        }
        if (cornerCheck) break;
      } else {
        if (side == "top" || side == "left") bdLimit2 = childRef - iel;else bdLimit2 = childRef + iel;
        break;
      }
    }

    for (var _i3 = 0; _i3 < array.length; _i3++) {
      var _row = array[_i3];
      var _pos4 = _row[0];
      var _node4 = _row[1];
      var _nodePos2 = _node4.getCenter();
      var _condition3 = void 0;

      if (side == "top" || side == "left") _condition3 = _pos4 < bdLimit2;else _condition3 = _pos4 > bdLimit2;

      if (_condition3) {
        if (side == "top" || side == "bottom") _node4.setCenter(_nodePos2.x, bdLimit2);else _node4.setCenter(bdLimit2, _nodePos2.y);
      } else break;
    }
  }
};

cholaNode.prototype.getChildGraphs = function () {
  var childGraphsList = [];
  var childNodes = this.getChildren();
  for (var i = 0; i < childNodes.length; i++) {
    var child = childNodes[i];
    if (child.isCompound()) {
      childGraphsList.push(child.child);
      var a = child.getChildGraphs();
      childGraphsList = childGraphsList.concat(a);
    }
  }
  return childGraphsList;
};

cholaNode.prototype.getInterGraphEdges = function () {
  var edges = this.edges;
  var igEdges = [];
  for (var k = 0; k < edgesedges.length; k++) {
    cEdge = edges[k];
    if (cEdge.isInterGraph) {
      igEdges.push(cEdge);
    }
  }
};

cholaNode.prototype.getBbox = function () {
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

cholaNode.prototype.octalCode = function (node) {
  //Semi axes get octal codes 0,2,4,6; East:0; North:2; West:4; South:6
  //Quadrants get octal codes 1,3,5,7; NorthEast:1; NorthWest:3; SouthWest:5; SouthEast:7
  var thisLoc = this.getCenter();
  var o = -1;
  var dx = (this.getCenterX() - node.getCenterX()).toFixed(7);
  var dy = (this.getCenterY() - node.getCenterY()).toFixed(7);

  if (dx > 0) {
    if (dy < 0) {
      o = 7;
    } else {
      if (dy === 0) {
        o = 0;
      } else {
        o = 1;
      }
    }
  } else if (dx === 0) {
    if (dy < 0) {
      o = 6;
    } else {
      o = 2;
    }
  } else {
    if (dy < 0) {
      o = 5;
    } else {
      if (dy === 0) {
        o = 4;
      } else {
        o = 3;
      }
    }
  }
  return o;
};

cholaNode.prototype.updateBounds2 = function () {
  if (this.getChild() == null) {
    throw "assert failed";
  }
  if (this.getChild().getNodes().length != 0) {
    // wrap the children nodes by re-arranging the boundaries
    var childGraph = this.getChild();
    childGraph.updateBounds(false);

    this.rect.x = childGraph.getLeft();
    this.rect.y = childGraph.getTop();

    this.setWidth(childGraph.getRight() - childGraph.getLeft());
    this.setHeight(childGraph.getBottom() - childGraph.getTop());

    // Update compound bounds considering its label properties    
    if (LayoutConstants.NODE_DIMENSIONS_INCLUDE_LABELS) {

      var width = childGraph.getRight() - childGraph.getLeft();
      var height = childGraph.getBottom() - childGraph.getTop();

      if (this.labelWidth > width) {
        this.rect.x -= (this.labelWidth - width) / 2;
        this.setWidth(this.labelWidth);
      }

      if (this.labelHeight > height) {
        if (this.labelPos == "center") {
          this.rect.y -= (this.labelHeight - height) / 2;
        } else if (this.labelPos == "top") {
          this.rect.y -= this.labelHeight - height;
        }
        this.setHeight(this.labelHeight);
      }
    }
  }
};

cholaNode.prototype.calculatePorts = function () {
  var node = this;
  if (!this.isCompound()) return;else {
    var w = this.getWidth() - 20;
    var h = this.getHeight() - 20;

    var bbox = this.getBbox();
    var x1 = bbox.x1;
    var x2 = bbox.x2;
    var y1 = bbox.y1;
    var y2 = bbox.y2;

    var noOfEdges = this.edges.length;
    if (noOfEdges < 4) noOfEdges = 4;
    var divFactor = noOfEdges - 1;

    this.ports.top = [{ x: x1 + 10, y: y1, occupied: false }, { x: x1 + w / divFactor, y: y1, occupied: false }, { x: x2 - w / divFactor, y: y1, occupied: false }, { x: x2 - 10, y: y1, occupied: false }];
    this.ports.bottom = [{ x: x1 + 10, y: y2, occupied: false }, { x: x1 + w / divFactor, y: y2, occupied: false }, { x: x2 - w / divFactor, y: y2, occupied: false }, { x: x2 - 10, y: y2, occupied: false }];
    this.ports.left = [{ x: x1, y: y1 + 10, occupied: false }, { x: x1, y: y1 + h / divFactor, occupied: false }, { x: x1, y: y2 - h / divFactor, occupied: false }, { x: x1, y: y2 - 10, occupied: false }];
    this.ports.right = [{ x: x2, y: y1 + 10, occupied: false }, { x: x2, y: y1 + h / divFactor, occupied: false }, { x: x2, y: y2 - h / divFactor, occupied: false }, { x: x2, y: y2 - 10, occupied: false }];
  }
};

cholaNode.prototype.insertNodeToBoundary = function (node) {
  if (!this.isCompound()) return;
  var boundaryList = this.boundaryList;
  var point = node.getCenter();

  if (boundaryList.length == 1) {
    boundaryList.push(node);
    return;
  }

  //now insert the endpoint at correct location in the boundarylist 
  for (var k = 0; k < boundaryList.length; k++) {
    var value1 = boundaryList[k].getCenter();
    var value2 = void 0;
    if (k != boundaryList.length - 1) {
      value2 = boundaryList[k + 1].getCenter();
    } else {
      value2 = boundaryList[0].getCenter();
    }
    if (value1.x == value2.x && point.x == value1.x) {
      if (value1.y < point.y && point.y < value2.y || value2.y < point.y && point.y < value1.y) {
        boundaryList.splice(k + 1, 0, node);
      }
    } else if (value1.y == value2.y && point.y == value1.y) {
      if (value1.x < point.x && point.x < value2.x || value2.x < point.x && point.x < value1.x) {
        boundaryList.splice(k + 1, 0, node);
      }
    }
  }
  node.isDummy = true;
  node.dummyOwner = this;
};

cholaNode.prototype.getNeighbors = function () {
  var neighbors = [];
  for (var i = 0; i < this.edges.length; i++) {
    var nbr = this.edges[i].getOtherEnd(this);
    neighbors.push(nbr);
  }
  return neighbors;
};

cholaNode.prototype.setProcessed = function (processed) {
  this.processed = processed;
};

cholaNode.prototype.isProcessed = function () {
  return processed;
};

cholaNode.prototype.isCompound = function () {
  if (this.withChildren().size > 1) {
    return true;
  } else {
    return false;
  }
};

cholaNode.prototype.findEdgeBetween = function (node) {
  //finds if an edge exists between the current node and node and returns it
  var output = null;
  for (var i = 0; i < this.edges.length; i++) {
    var edge = this.edges[i];
    if (edge.source == this && edge.target == node) {
      output = edge;
      break;
    } else if (edge.source == node && edge.target == this) {
      output = edge;
      break;
    }
  }
  return output;
};

cholaNode.prototype.getDegree = function () {
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

cholaNode.prototype.getRelativeRatiotoNodeCenter = function (portLocation) {
  var node = this;
  return new PointD((portLocation.x - node.getCenterX()) / node.getWidth() * 100, (portLocation.y - node.getCenterY()) / node.getHeight() * 100);
};

cholaNode.prototype.findConnectivity = function (childGraphs) {
  if (!this.isCompound()) return;

  //get child graphs list of node including this nodes own graph

  var connectivityCheck = false;
  var childNodes = this.getChild().nodes;
  var cEdge = void 0;
  for (var j = 0; j < childNodes.length; j++) {
    var childNode = childNodes[j];
    if (childNode.isCompound()) {
      connectivityCheck = childNode.findConnectivity(childGraphs);
      if (connectivityCheck) break;
    }

    var childEdges = childNode.edges;
    for (var k = 0; k < childEdges.length; k++) {
      cEdge = childEdges[k];
      var otherNode = cEdge.getOtherEnd(childNode);
      if (cEdge.isInterGraph && !childGraphs.includes(otherNode.owner)) {
        connectivityCheck = true;
        break;
      }
    }
    if (connectivityCheck) break;
  }
  return connectivityCheck;
};

cholaNode.prototype.distance = function (a, b) {
  return Math.sqrt(Math.pow(a.x - b.x, 2) + Math.pow(a.y - b.y, 2));
};

cholaNode.prototype.createConnectedGraph = function (nodeDict, simpleGm, layout) {
  var compareSecondColumn = function compareSecondColumn(a, b) {
    if (a[1] === b[1]) {
      return 0;
    } else {
      return a[1] < b[1] ? -1 : 1;
    }
  };

  var nodePosList = [];

  //find the left most node
  var childNodes = this.getChild().nodes;
  for (var j = 0; j < childNodes.length; j++) {
    var child = childNodes[j];
    nodePosList.push([child, child.getLocation().x]);
  }

  nodePosList.sort(compareSecondColumn);

  var leftMostNode = nodePosList[0][0];
  var src, tgt;

  if (!leftMostNode.isCompound()) {
    //now find its distance from the top left and bottom left boundary nodes
    var d1 = this.distance(nodeDict[leftMostNode.id].getLocation(), nodeDict[this.id.concat("-tl")].getCenter());
    var d2 = this.distance(nodeDict[leftMostNode.id].getLocation(), nodeDict[this.id.concat("-bl")].getCenter());

    if (d1 <= d2) {
      src = nodeDict[this.id.concat("-tl")];
    } else {
      src = nodeDict[this.id.concat("-bl")];
    }

    tgt = nodeDict[leftMostNode.id];
  } else {
    //find distance from the topleft corner of child node to topleft corner of compound
    //find distance from the bottomleft corner of child node to bottomleft corner of compound
    //connect the ones with smaller distance
    var d1 = this.distance(nodeDict[leftMostNode.id.concat("-tl")].getCenter(), nodeDict[this.id.concat("-tl")].getCenter());
    var d2 = this.distance(nodeDict[leftMostNode.id.concat("-bl")].getCenter(), nodeDict[this.id.concat("-bl")].getCenter());

    if (d1 <= d2) {
      src = nodeDict[this.id.concat("-tl")];
      tgt = nodeDict[leftMostNode.id.concat("-tl")];
    } else {
      src = nodeDict[this.id.concat("-bl")];
      tgt = nodeDict[leftMostNode.id.concat("-bl")];
    }
  }

  var newEdge = simpleGm.add(layout.newEdge(), src, tgt);
  newEdge.id = src.id.concat("to").concat(tgt.id);

  simpleGm.connectivityEdges.push(newEdge);
};

cholaNode.prototype.createDummyCornerNodes = function (simpleGm, nodeDict, turn) {
  //storing values in clockwise direction
  var boundaryList = [];
  var bbox = this.getBbox();
  var corners = [{ x: bbox.x1, y: bbox.y1 }, { x: bbox.x2, y: bbox.y1 }, { x: bbox.x2, y: bbox.y2 }, { x: bbox.x1, y: bbox.y2 }];

  //create nodes for the corner points of the compound node in the new gm
  for (var j = 0; j < corners.length; j++) {
    var newNode = void 0,
        id = void 0;
    var point = corners[j];
    if (j == 0) id = this.id.concat("-tl");else if (j == 1) id = this.id.concat("-tr");else if (j == 2) id = this.id.concat("-br");else id = this.id.concat("-bl");

    if (turn == 1) {
      var parent = simpleGm.getRoot();
      newNode = parent.add(new cholaNode(simpleGm, point, new DimensionD(1, 1)));
      newNode.setCenter(point.x, point.y);
      newNode.isDummy = true;
      newNode.dummyOwner = this;
      newNode.isCmpdBoundaryNode = true;
      newNode.id = id;
      nodeDict[newNode.id] = newNode;
    } else {
      newNode = nodeDict[id];
      newNode.setCenter(point.x, point.y);

      while (newNode.edges.length != 0) {
        var edge = newNode.edges[0];
        var graph = simpleGm.calcLowestCommonAncestor(edge.source, edge.target);
        graph.remove(edge);
      }

      simpleGm.resetAllEdges();
      simpleGm.getAllEdges();
    }

    boundaryList.push(newNode);
  }

  this.boundaryList = boundaryList;
};

cholaNode.prototype.direction = function (node1Loc, node2Loc) {
  var x1 = node1Loc.x;
  var x2 = node2Loc.x;
  var y1 = node1Loc.y;
  var y2 = node2Loc.y;
  var dx = x2 - x1;
  var dy = y2 - y1;

  var dir;
  if (dx > 0 && dy < 0) dir = cc.NE;else if (dx > 0 && dy == 0) dir = cc.EAST;else if (dx > 0 && dy > 0) dir = cc.SE;else if (dx == 0 && dy > 0) dir = cc.SOUTH;else if (dx < 0 && dy > 0) dir = cc.SW;else if (dx < 0 && dy == 0) dir = cc.WEST;else if (dx < 0 && dy < 0) dir = cc.NW;else if (dx == 0 && dy < 0) dir = cc.NORTH;
  return dir;
};

cholaNode.prototype.getFreeDirs = function (otherNode) {
  var edges = this.edges;
  var pos = this.getCenter();
  var freeDirs = [0, 1, 2, 3];
  for (var i = 0; i < edges.length; i++) {
    var edge = edges[i];
    var node = edge.getOtherEnd(this);
    if (node.isCompound() && node.id == otherNode.id) continue;

    var dir = void 0;
    if (edge.bendpoints.length == 0) dir = this.direction(pos, node.getCenter());else {
      if (edge.source.id == this.id) dir = this.direction(pos, edge.bendpoints[0]);else dir = this.direction(pos, edge.bendpoints[edge.bendpoints.length - 1]);
    }

    if (dir == 0 || dir == 1 || dir == 2 || dir == 3) freeDirs.splice(freeDirs.indexOf(dir), 1);
  }

  console.log(this.id);
  console.log("Free directions");
  console.log(freeDirs);

  return freeDirs;
};

module.exports = cholaNode;

/***/ }),
/* 8 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var LEdge = __webpack_require__(4).layoutBase.LEdge;
var IGeometry = __webpack_require__(4).layoutBase.IGeometry;
var PointD = __webpack_require__(4).layoutBase.PointD;
var DimensionD = __webpack_require__(4).layoutBase.DimensionD;

function cholaEdge(source, target, vEdge) {
  LEdge.call(this, source, target, vEdge);
  this.weight = 0.5;
  this.distance = 0;

  //each entry in this.bendpoint contains [bendpoint, [dir1, dir2], [node1, node2]]
  this.bendpoints = [];

  //stores the location of the ports on the source or target (if any) 
  this.sourcePort = null;
  this.targetPort = null;

  //stores the other half of the edge that is split after introducing a crossing dummy node
  this.coupleEdge = null;

  this.isDummy = false;
  this.parentEdge = null;
  this.parentNode = null;

  this.sourcePoint = null;
  this.targetPoint = null;

  this.sourcePointId = null;
  this.targetPointId = null;
}

cholaEdge.prototype = Object.create(LEdge.prototype);
for (var prop in LEdge) {
  cholaEdge[prop] = LEdge[prop];
}

cholaEdge.prototype.resetBendpoints = function (gm) {
  this.weight = 0.5;
  this.distance = 0;

  this.bendpoints = [];
  this.routePoints = [];

  var edgesWithBends = gm.edgesWithBends;
  for (var i = 0; i < edgesWithBends.length; i++) {
    var edge = edgesWithBends[i];
    if (edge.id == this.id) edgesWithBends.splice(i, 1);
  }
};

cholaEdge.prototype.getLength = function () {
  var n1Pos = this.source.getCenter();
  var n2Pos = this.target.getCenter();
  var distance = Math.sqrt(Math.pow(n1Pos.x - n2Pos.x, 2) + Math.pow(n1Pos.y - n2Pos.y, 2));
  return distance;
};

cholaEdge.prototype.getEndpoint = function (node1Bbox, node2Loc) {
  var x = node2Loc.x;
  var y = node2Loc.y;

  //center of the node
  var midX = (node1Bbox.x1 + node1Bbox.x2) / 2;
  var midY = (node1Bbox.y1 + node1Bbox.y2) / 2;

  //slope of the line from source to target
  var m = (midY - y) / (midX - x);

  var endpoint = void 0;

  if (x <= midX) {
    // check "left" side
    var minXy = m * (node1Bbox.x1 - x) + y;
    if (node1Bbox.y1 <= minXy && minXy <= node1Bbox.y2) endpoint = { x: node1Bbox.x1, y: minXy };
  }

  if (x >= midX) {
    // check "right" side
    var maxXy = m * (node1Bbox.x2 - x) + y;
    if (node1Bbox.y1 <= maxXy && maxXy <= node1Bbox.y2) endpoint = { x: node1Bbox.x2, y: maxXy };
  }

  if (y <= midY) {
    // check "top" side
    var minYx = (node1Bbox.y1 - y) / m + x;
    if (node1Bbox.x1 <= minYx && minYx <= node1Bbox.x2) endpoint = { x: minYx, y: node1Bbox.y1 };
  }

  if (y >= midY) {
    // check "bottom" side
    var maxYx = (node1Bbox.y2 - y) / m + x;
    if (node1Bbox.x1 <= maxYx && maxYx <= node1Bbox.x2) endpoint = { x: maxYx, y: node1Bbox.y2 };
  }

  return endpoint;
};

cholaEdge.prototype.sourceEndpoint = function () {
  //this assumes that the source or target of the edge is a rectangular node

  var sourceEndpoint = this.getEndpoint(this.source.getBbox(), this.target.getCenter());
  return sourceEndpoint;
};

cholaEdge.prototype.targetEndpoint = function () {
  //this assumes that the source or target of the edge is a rectangular node

  var targetEndpoint = this.getEndpoint(this.target.getBbox(), this.source.getCenter());
  return targetEndpoint;
};

/*Get the other end to which an edge is connected with*/
cholaEdge.prototype.getOtherEnd = function (node) {
  if (node === this.source && node === this.target) {
    return null;
  } else if (node === this.source) {
    return this.target;
  } else if (node === this.target) {
    return this.source;
  }
};

cholaEdge.prototype.convertToRelativeBendPosition = function () {
  var srcTgtPointsAndTangents = this.getSrcTgtPointsAndTangents(this);

  var edgeWeight = "";
  var edgeDistance = "";

  for (var i = 0; i < this.bendpoints.length; i++) {
    var bendpoint = this.bendpoints[i];

    var intersectionPoint = this.getIntersection(bendpoint, srcTgtPointsAndTangents);
    var intersectX = intersectionPoint.x;
    var intersectY = intersectionPoint.y;

    var srcPoint = srcTgtPointsAndTangents.srcPoint;
    var tgtPoint = srcTgtPointsAndTangents.tgtPoint;

    var weight;

    if (intersectX != srcPoint.x) {
      weight = (intersectX - srcPoint.x) / (tgtPoint.x - srcPoint.x);
    } else if (intersectY != srcPoint.y) {
      weight = (intersectY - srcPoint.y) / (tgtPoint.y - srcPoint.y);
    } else {
      weight = 0;
    }

    var distance = Math.sqrt(Math.pow(intersectY - bendpoint.y, 2) + Math.pow(intersectX - bendpoint.x, 2));

    //Get the direction of the line form source point to target point
    var dir1 = this.getLineDirection(srcPoint, tgtPoint);
    //Get the direction of the line from intesection point to bend point
    var dir2 = this.getLineDirection(intersectionPoint, bendpoint);

    //If the difference is not -2 and not 6 then the direction of the distance is negative
    if (dir1 - dir2 != -2 && dir1 - dir2 != 6) {
      if (distance != 0) {
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

cholaEdge.prototype.getLineDirection = function (srcPoint, tgtPoint) {
  if (srcPoint.y == tgtPoint.y && srcPoint.x < tgtPoint.x) {
    return 1;
  }
  if (srcPoint.y < tgtPoint.y && srcPoint.x < tgtPoint.x) {
    return 2;
  }
  if (srcPoint.y < tgtPoint.y && srcPoint.x == tgtPoint.x) {
    return 3;
  }
  if (srcPoint.y < tgtPoint.y && srcPoint.x > tgtPoint.x) {
    return 4;
  }
  if (srcPoint.y == tgtPoint.y && srcPoint.x > tgtPoint.x) {
    return 5;
  }
  if (srcPoint.y > tgtPoint.y && srcPoint.x > tgtPoint.x) {
    return 6;
  }
  if (srcPoint.y > tgtPoint.y && srcPoint.x == tgtPoint.x) {
    return 7;
  }
  return 8; //if srcPoint.y > tgtPoint.y and srcPoint.x < tgtPoint.x
};

cholaEdge.prototype.getSrcTgtPointsAndTangents = function () {
  var srcPoint = this.source.getCenter();
  var tgtPoint = this.target.getCenter();

  //m1 is the slope of the line passing through source and target
  var m1 = (tgtPoint.y - srcPoint.y) / (tgtPoint.x - srcPoint.x);

  return {
    m1: m1,
    m2: -1 / m1,
    srcPoint: srcPoint,
    tgtPoint: tgtPoint
  };
};

cholaEdge.prototype.getIntersection = function (point, srcTgtPointsAndTangents) {
  var srcPoint = srcTgtPointsAndTangents.srcPoint;
  var tgtPoint = srcTgtPointsAndTangents.tgtPoint;
  var m1 = srcTgtPointsAndTangents.m1;
  var m2 = srcTgtPointsAndTangents.m2;

  var intersectX;
  var intersectY;

  if (m1 == Infinity || m1 == -Infinity) {
    intersectX = srcPoint.x;
    intersectY = point.y;
  } else if (m1 == 0) {
    intersectX = point.x;
    intersectY = srcPoint.y;
  } else {
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

cholaEdge.prototype.getLine = function () {
  var sourceLoc = this.source.getCenter();
  var targetLoc = this.target.getCenter();

  var slope = (sourceLoc.y - targetLoc.y) / (sourceLoc.x - targetLoc.x);

  var c = sourceLoc.y - slope * sourceLoc.x;

  return {
    m: slope,
    c: c
  };
};

module.exports = cholaEdge;

/***/ }),
/* 9 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var LGraph = __webpack_require__(10).LGraph;
var Integer = __webpack_require__(10).Integer;
var RectangleD = __webpack_require__(10).RectangleD;

function cholaGraph(parent, graphMgr, vGraph) {
    LGraph.call(this, parent, graphMgr, vGraph);
}

cholaGraph.prototype = Object.create(LGraph.prototype);

for (var prop in LGraph) {
    cholaGraph[prop] = LGraph[prop];
};

cholaGraph.prototype.updateBounds = function (recursive) {
    // calculate bounds
    var left = Number.MAX_VALUE;
    var right = -Number.MAX_VALUE;
    var top = Number.MAX_VALUE;
    var bottom = -Number.MAX_VALUE;
    var nodeLeft;
    var nodeRight;
    var nodeTop;
    var nodeBottom;
    var margin;

    var nodes = this.nodes;
    for (var i = 0; i < nodes.length; i++) {
        var lNode = nodes[i];

        if (recursive && lNode.child != null) {
            lNode.updateBounds();
        }
        nodeLeft = lNode.getLeft();
        nodeRight = lNode.getRight();
        nodeTop = lNode.getTop();
        nodeBottom = lNode.getBottom();

        if (left > nodeLeft) {
            left = nodeLeft;
        }

        if (right < nodeRight) {
            right = nodeRight;
        }

        if (top > nodeTop) {
            top = nodeTop;
        }

        if (bottom < nodeBottom) {
            bottom = nodeBottom;
        }
    }

    var boundingRect = new RectangleD(left, top, right - left, bottom - top);
    if (left == Integer.MAX_VALUE) {
        this.left = this.parent.getLeft();
        this.right = this.parent.getRight();
        this.top = this.parent.getTop();
        this.bottom = this.parent.getBottom();
    }

    if (nodes[0].getParent().paddingLeft != undefined) {
        margin = nodes[0].getParent().paddingLeft;
    } else {
        margin = this.margin;
    }

    margin = margin + this.parent.borderWidth / 2 + 1;

    this.left = boundingRect.x - margin;
    this.right = boundingRect.x + boundingRect.width + margin;
    this.top = boundingRect.y - margin;
    this.bottom = boundingRect.y + boundingRect.height + margin;
};

module.exports = cholaGraph;

/***/ }),
/* 10 */
/***/ (function(module, exports) {

module.exports = __WEBPACK_EXTERNAL_MODULE__10__;

/***/ }),
/* 11 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


// Simple, internal Object.assign() polyfill for options objects etc.

module.exports = Object.assign != null ? Object.assign.bind(Object) : function (tgt) {
  for (var _len = arguments.length, srcs = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
    srcs[_key - 1] = arguments[_key];
  }

  srcs.forEach(function (src) {
    Object.keys(src).forEach(function (k) {
      return tgt[k] = src[k];
    });
  });

  return tgt;
};

/***/ })
/******/ ]);
});