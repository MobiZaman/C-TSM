var LGraph = require('layout-base').LGraph;
var Integer = require('layout-base').Integer;
var RectangleD = require('layout-base').RectangleD;

function ctsmGraph(parent, graphMgr, vGraph) 
{
    LGraph.call(this, parent, graphMgr, vGraph);
}

ctsmGraph.prototype = Object.create(LGraph.prototype);

for (var prop in LGraph) 
{
    ctsmGraph[prop] = LGraph[prop];
};

ctsmGraph.prototype.updateBounds = function (recursive)
{
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
    for (var i = 0; i < nodes.length; i++)
    {
        var lNode = nodes[i];

        if (recursive && lNode.child != null)
        {
            lNode.updateBounds();
        }
        nodeLeft = lNode.getLeft();
        nodeRight = lNode.getRight();
        nodeTop = lNode.getTop();
        nodeBottom = lNode.getBottom();

        if (left > nodeLeft)
        {
            left = nodeLeft;
        }

        if (right < nodeRight)
        {
            right = nodeRight;
        }

        if (top > nodeTop)
        {
            top = nodeTop;
        }

        if (bottom < nodeBottom)
        {
            bottom = nodeBottom;
        }
    }

    var boundingRect = new RectangleD(left, top, right - left, bottom - top);
    if (left == Integer.MAX_VALUE)
    {
        this.left = this.parent.getLeft();
        this.right = this.parent.getRight();
        this.top = this.parent.getTop();
        this.bottom = this.parent.getBottom();
    }

    if(nodes[0].getParent().paddingLeft != undefined){
        margin = nodes[0].getParent().paddingLeft;
    }
    else{
        margin = this.margin;
    }

    margin = margin + this.parent.borderWidth/2 + 1;

    this.left = boundingRect.x - margin;
    this.right = boundingRect.x + boundingRect.width + margin;
    this.top = boundingRect.y - margin;
    this.bottom = boundingRect.y + boundingRect.height + margin;
};

module.exports = ctsmGraph;
