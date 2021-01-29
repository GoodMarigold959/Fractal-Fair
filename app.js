const GRID_COLOR = "rgb(50, 50, 50)";
const GRID_THICKNESS = 1;
const GRID_SIZE = 8;
const GRID_REFRESH = 1; // ms 
var bgCanvas;
var gridCanvas;
var bgCon;
var gridCon;
var bcr;
var numCols;
var numRows;
var edgeLeft;
var edgeTop;
var edgeRight;
var edgeBottom;
var systemActive;
var systemInactive;

window.onload = start;

/*
Any live cell with fewer than two live neighbors dies, as if by under population.
Any live cell with two or three live neighbors lives on to the next generation.
Any live cell with more than three live neighbors dies, as if by overpopulation.
Any dead cell with exactly three live neighbors becomes a live cell, as if by reproduction.
*/

function start() {
    setTimeout(init, 0);
};
function animate() {
    console.log("animate");
    bgCon.fillStyle = "rgb(255, 0, 0)";
    bgCon.clearRect(0, 0, bcr.width, bcr.height);
    for (var y = 0; y < numRows; y++)
    {
    	var row = systemActive[y];
        for (var x = 0; x < numCols; x++)
        {
            var livingFriends = 0;
            var xm1, xp1, ym1, yp1;
            if (x === 0) 
            {
                xm1 = numCols - 1;
                xp1 = x + 1;
            } 
            else if (x === numCols - 1) 
            {
                xp1 = 0;
                xm1 = x - 1;
            } else {
                xm1 = x - 1;
                xp1 = x + 1;
            }

            if (y === 0)
            {
                ym1 = numRows - 1;
                yp1 = y + 1;
            }
            else if (y ===numRows - 1)
            {
                yp1 = 0;
                ym1 = y - 1;
            } else 
            {
                ym1 = y - 1;
                yp1 = y + 1;
            }
            if (systemActive[ym1][xm1])
            {
                livingFriends++;
            }

            if (systemActive[y][xm1])
            {
                livingFriends++;
            }

            if (systemActive[yp1][xm1])
            {
                livingFriends++;
            }

            if (systemActive[ym1][x])
            {
                livingFriends++;
            }

            if (systemActive[yp1][x])
            {
                livingFriends++;
            }

            if (systemActive[ym1][xp1])
            {
                livingFriends++;
            }

            if (systemActive[y][xp1])
            {
                livingFriends++;
            }

            if (systemActive[yp1][xp1])
            {
                livingFriends++;
            }
            if (row[x])
            {
                bgCon.fillRect(edgeLeft + x * GRID_SIZE, edgeTop + y * GRID_SIZE, GRID_SIZE, GRID_SIZE);
                

                
                // this is the place for the test!!!
                
                // x-1, y-1
                // x-1, y
                // x-1, y+1
                // x  , y-1
                                 // x  , y
                // x  , y+1
                // x+1, y-1
                // x+1, y
                // x+1, y+1
                
                if (livingFriends === 2 || livingFriends === 3)
                {
                    systemInactive[y][x] = true;	
                }
                else
                {
                    systemInactive[y][x] = false;
                }
            }
            else
            {
            	// apply rule when cell is dead already
                if (livingFriends === 3) {
                    systemInactive[y][x] = true;
                } else {
                    systemInactive[y][x] = false;
                }
            }    
        }   
    }
    var temp = systemActive;
    systemActive = systemInactive;
    systemInactive = temp;
    setTimeout(function () {
        requestAnimationFrame(animate);
    }, 50)
    // update!
    
    
    
}

function init()
{
    bgCanvas = document.getElementById("background");
    gridCanvas = document.getElementById("grid");
    bgCon = bgCanvas.getContext("2d");
    gridCon = gridCanvas.getContext("2d");
    window.onresize = resize;
    resize();
}

function resize()
{
    bcr = document.body.getBoundingClientRect();
    bgCanvas.width = gridCanvas.width = bcr.width;
    bgCanvas.height = gridCanvas.height = bcr.height;
    //alert(bcr.width + "," + bcr.height)
    restart();
}

function restart()
{
    numCols = Math.floor(bcr.width/GRID_SIZE);
    numRows = Math.floor(bcr.height/GRID_SIZE);
    edgeLeft = (bcr.width - numCols * GRID_SIZE) / 2;
    edgeTop = (bcr.height - numRows * GRID_SIZE) / 2;
    edgeRight = bcr.width - edgeLeft;
    edgeBottom = bcr.height - edgeTop;
		seedSystem();
    drawGrid();
    requestAnimationFrame(animate);
}

function drawGrid()
{
    gridCon.clearRect(0, 0, bcr.width, bcr.height);
    gridCon.strokeStyle = GRID_COLOR;
    gridCon.lineWidth = GRID_THICKNESS;
    gridCon.beginPath();
    for (var x = 0; x <= numCols; x++)
    {
        gridCon.moveTo(edgeLeft + x*GRID_SIZE, edgeTop);
        gridCon.lineTo(edgeLeft + x*GRID_SIZE, edgeBottom);
    }
    for (var y = 0; y<= numRows; y++)
    {
    		gridCon.moveTo(edgeLeft, edgeTop + y*GRID_SIZE);
      	gridCon.lineTo(edgeRight, edgeTop + y*GRID_SIZE);
    }
    gridCon.stroke();
}

function seedSystem()
{
    systemActive = [];
    systemInactive = [];
      
    for (var y = 0; y < numRows; y++)
    {
        var row = [];
        var newRow = [];
        for (var x = 0; x < numCols; x++)
        {
            row.push(Math.random() < .5);
            newRow.push(false);
        }
        systemActive.push(row);
        systemInactive.push(newRow);
    }
    //systemActive[10][10] = true;
    //systemActive[10][11] = true;
    //systemActive[11][10] = true;
    //systemActive[11][11] = true;
} 
