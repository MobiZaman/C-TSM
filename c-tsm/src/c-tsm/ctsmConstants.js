var LayoutConstants = require('cose-base').layoutBase.LayoutConstants;

function ctsmConstants() 
{
}

//ctsmConstants inherits static props in FDLayoutConstants
for (var prop in LayoutConstants) 
{
  ctsmConstants[prop] = LayoutConstants[prop];
}

ctsmConstants.DEFAULT_USE_MULTI_LEVEL_SCALING = false;
ctsmConstants.DEFAULT_RADIAL_SEPARATION = LayoutConstants.DEFAULT_MIN_LENGTH;
ctsmConstants.DEFAULT_COMPONENT_SEPERATION = 60;
ctsmConstants.TILE = true;
ctsmConstants.TILING_PADDING_VERTICAL = 10;
ctsmConstants.TILING_PADDING_HORIZONTAL = 10;


ctsmConstants.EAST = 0;
ctsmConstants.SOUTH = 1;
ctsmConstants.WEST = 2;
ctsmConstants.NORTH = 3;

ctsmConstants.SE = 4;
ctsmConstants.SW = 5;
ctsmConstants.NW = 6;
ctsmConstants.NE = 7;



module.exports = ctsmConstants;
