// Variables and Constants

var layout;
var runningCTSM = false;

// Initial Layout on opening the page
var cy = window.cy = cytoscape(
{
  container: document.getElementById('cy'),

  ready: function(){
    this.layout({name: 'cose-bilkent', animationDuration: 750}).run();
  }
});

var cyCose = cytoscape({
  container: document.getElementById('cyCose'),

  ready: function()
  {
    this.layout({name: 'cose-bilkent', animationDuration: 750}).run();
  }

});

var cyArray = [cy, cyCose];

function updateCy(contents)
{
  for (let i = 0; i < cyArray.length; i++)
  {
    let obj = cyArray[i];
    obj.startBatch();
    obj.style().clear();
    obj.remove('nodes');
    obj.remove('edges');

    obj.json({elements: JSON.parse(contents)});

    obj.style()
        .selector('node').style({
            'background-color': '#ad1a66',
            'opacity': 0.95,
            'label': "data(id)",
            'text-halign': 'center',
            'text-valign': 'center',
            'color': 'black',
            'text-opacity': 1,
            'font-weight': 'bold'
        })
        .selector('node:selected').style({
            'border-color': 'black',
            'border-width': '3px'
        })
        .selector('node:parent').style({
            'background-opacity': 0.333,
            'padding': 10
        })
        .selector('edge').style({
            'width': 3,
            'line-color': 'black',
            'edge-distances': 'node-position',
            'line-cap': 'round',
            'targetEndpoint': 'outside-to-node',
            'sourceEndpoint': 'outside-to-node',
            'curve-style': 'straight'
        })
        .selector('edge:selected').style({
            'width': 3,
            'line-color': 'black',
            'edge-distances': 'node-position',
            'line-cap': 'round'
        }).update();

    obj.endBatch();
    obj.layout({
        name: 'cose-bilkent',
        animate: false
      }).run();
  }
  
  var allNodes = cy.nodes();
  for (let i = 0; i < allNodes.length; i++)
  {
    allNodes[i].css("display", "none");
  }
 
};

document.addEventListener('DOMContentLoaded', function()
{
  /*
   *  deleting a node on "Delete" key press
   */

  if (runningCTSM == true)
      return;

  function getKey(e)
  {
    if (e.keyCode == 46)
    {
      cy.remove(cyCose.$(":selected"));
      cyCose.remove(cyCose.$(":selected"));
      cy.remove(cy.$(":selected"));
      cyCose.remove(cy.$(":selected"));
    }
  }
  document.onkeyup = getKey;
});

document.getElementById('importGraphML-input').addEventListener('change', function (evt) 
{
    if (runningCTSM == true)
      return;

    let files = evt.target.files;
    let fileExtension = files[0].name.split('.').pop();
    console.log(files[0].name);
    document.getElementById('fileName').innerHTML = "File opened: " + files[0].name;

    let reader = new FileReader();
    let contents;
    reader.readAsText(files[0]);
    reader.onload = function (event) 
    {
        // Contents is a string of the graphml
        contents = event.target.result;

        // Update Cytoscape
        updateCy(contents);
    };
});

document.getElementById("ctsmLayoutButton").addEventListener("click", function()
{
    //some edge types may have been changed to segments
    //so we convert them back to the original type haystack
    console.clear();

    runningCTSM = true;

    let start = performance.now();

    let compactOption = document.getElementById("compactOption").checked;

    var allEdges = cy.edges();
    for (let i = 0; i < allEdges.length; i++)
    {
      allEdges[i].css("curve-style", "straight");
      allEdges[i].css("targetEndpoint", "outside-to-node");
      allEdges[i].css("sourceEndpoint", "outside-to-node");
    }

    var allNodes = cy.nodes();
    for (let i = 0; i < allNodes.length; i++)
    {
      allNodes[i].css("min-width", 0);
      allNodes[i].css("min-height", 0);
      allNodes[i].css("min-width-bias-left", 0);
      allNodes[i].css("min-width-bias-right", 0);
      allNodes[i].css("min-height-bias-top", 0);
      allNodes[i].css("min-height-bias-bottom", 0);
    }

    for (let i = 0; i < cyArray.length; i++)
    {
      let obj = cyArray[i];
      var allNodes = obj.nodes();
      for (let i = 0; i < allNodes.length; i++)
      {
        allNodes[i].css("display", "element");
      }
    }

    layout = null;
    layout = cy.layout({
      name: 'c-tsm',
      animate: 'end',
      animationEasing: 'ease-out',
      animationDuration: 1000,
      compact: compactOption
    });

    layout.run();

    let end = performance.now();
    evaluate(end - start, cy);
    runningCTSM = false;

});

document.getElementById("cose").addEventListener("click", function()
{
  //some edge types may have been changed to segments
  //so we convert them back to the original type haystack

    if (runningCTSM == true)
      return;

    let start = performance.now();

    var allNodes = cy.nodes();
    for (let i = 0; i < allNodes.length; i++)
    {
      allNodes[i].css("display", "none");
    }

    var allEdges = cy.edges();
    for (let i = 0; i < allEdges.length; i++)
    {
      allEdges[i].css("curve-style", "straight");
      allEdges[i].css("targetEndpoint", "outside-to-node");
      allEdges[i].css("sourceEndpoint", "outside-to-node");
    }

    var layout2 = cyCose.layout({
      name: 'cose-bilkent',
      animate: true,
      animationDuration: 1000,
      animationEasing: 'ease-out'
    });

    layout2.run();

    let end = performance.now();
});


document.getElementById("randomize").addEventListener("click", function()
{
  //some edge types may have been changed to segments
  //so we convert them back to the original type haystack

  if (runningCTSM == true)
      return;

  var allNodes = cy.nodes();
  for (let i = 0; i < allNodes.length; i++)
  {
    allNodes[i].css("display", "none");
  }

  var allEdges = cy.edges();
  for (let i = 0; i < allEdges.length; i++)
  {
    allEdges[i].css("curve-style", "straight");
    allEdges[i].css("targetEndpoint", "outside-to-node");
    allEdges[i].css("sourceEndpoint", "outside-to-node");
  }

  var layout = cyCose.layout({
    name: 'random',
    animate: true,
    animationDuration: 1000,
    animationEasing: 'ease-out'
  });
  layout.run();
});

function evaluate(layoutTime, cyObj)
{
    let evaluate = true;
    let graphProperties;
    if(evaluate)
      graphProperties = cy.layvo("get").generalProperties();

    document.getElementById("layoutTime").innerHTML = evaluate ? Math.round(layoutTime * 10 ) / 10 + " ms" : "-"; 

    document.getElementById("numberOfEdgeCrosses").innerHTML = evaluate ? graphProperties.numberOfEdgeCrosses : "-";

    document.getElementById("numberOfNodeOverlaps").innerHTML = evaluate ? graphProperties.numberOfNodeOverlaps : "-";

    document.getElementById("averageEdgeLength").innerHTML = evaluate ? Math.round(graphProperties.averageEdgeLength * 10 ) / 10 : "-";

    document.getElementById("totalArea").innerHTML = evaluate ? Math.round(graphProperties.totalArea * 10 ) / 10 : "-";

}
