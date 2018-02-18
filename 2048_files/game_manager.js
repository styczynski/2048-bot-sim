var cboard = new Array();
var cmove = -1;
var cdelay = 250;
var cinited = false;
var cmerged__ = 0;
var globals = new Object();
globals.up = 0;
globals.right = 1;
globals.down = 2;
globals.left = 3;

/*
0: { x: 0,  y: -1 }, // Up
1: { x: 1,  y: 0 },  // Right
2: { x: 0,  y: 1 },  // Down
3: { x: -1, y: 0 }   // Left
*/
function debug(brd) {
	var str = "";
	for(var y=0;y<4;++y) {
		str += "[ ";
		for(var x=0;x<4;++x) { 
			str += brd[x][y] + ", ";
		}
		str += " ];\n";
	}
	return str;
}
function getMergedNumber(brdmap, direction) {
	cmerged__ = 0;
	ifMoved(brdmap, direction);
	return cmerged__;
}
function ifMoved(brdmap, direction) {
	var brd = new Array();
	for(var x=0;x<4;++x) {
		brd[x] = new Array();
		for(var y=0;y<4;++y) {
			brd[x][y] = brdmap[x][y];
		}
	}
	
	cmerged__ = 0;
	
	//up
	if(direction==0) {
		for(var y=0;y<4;++y) {
			for(var x=0;x<4;++x) {
				for(var k=0;k<y;++k) {
					if(brd[x][k]== -1) {
						brd[x][k]=brd[x][y];
						brd[x][y]=-1;
						break;
					}
				}
			}	
		}
		for(var y=1;y<4;++y) {
			for(var x=0;x<4;++x) {
				if(brd[x][y-1]==brd[x][y] && brd[x][y]!=-1) {
					brd[x][y-1]*=2;
					cmerged__++;
					brd[x][y]=-1;
				}
			}
		}
		for(var y=0;y<4;++y) {
			for(var x=0;x<4;++x) {
				for(var k=0;k<y;++k) {
					if(brd[x][k]== -1) {
						brd[x][k]=brd[x][y];
						brd[x][y]=-1;
						break;
					}
				}
			}	
		}
	}
	//down
	if(direction==2) {
		for(var y=3;y>=0;--y) {
			for(var x=0;x<4;++x) {
				for(var k=3;k>y;--k) {
					if(brd[x][k]== -1) {
						brd[x][k]=brd[x][y];
						brd[x][y]=-1;
						break;
					}
				}
			}	
		}
		for(var y=2;y>=0;--y) {
			for(var x=0;x<4;++x) {
				if(brd[x][y+1]==brd[x][y] && brd[x][y]!=-1) {
					brd[x][y+1]*=2;
					cmerged__++;
					brd[x][y]=-1;
				}
			}
		}
		for(var y=3;y>=0;--y) {
			for(var x=0;x<4;++x) {
				for(var k=3;k>y;--k) {
					if(brd[x][k]== -1) {
						brd[x][k]=brd[x][y];
						brd[x][y]=-1;
						break;
					}
				}
			}	
		}
	}
	//left
	if(direction==3) {
		for(var x=0;x<4;++x) {
			for(var y=0;y<4;++y) {
				for(var k=0;k<x;++k) {
					if(brd[k][y]== -1) {
						brd[k][y]=brd[x][y];
						brd[x][y]=-1;
						break;
					}
				}
			}	
		}
		for(var x=1;x<4;++x) {
			for(var y=0;y<4;++y) {
			if(brd[x-1][y]==brd[x][y] && brd[x][y]!=-1) {
					brd[x-1][y]*=2;
					cmerged__++;
					brd[x][y]=-1;
				}
			}
		}
		for(var x=0;x<4;++x) {
			for(var y=0;y<4;++y) {
				for(var k=0;k<x;++k) {
					if(brd[k][y]== -1) {
						brd[k][y]=brd[x][y];
						brd[x][y]=-1;
						break;
					}
				}
			}	
		}
	}
	//right
	if(direction==1) {
		for(var x=3;x>=0;--x) {
			for(var y=0;y<4;++y) {
				for(var k=3;k>x;--k) {
					if(brd[k][y]== -1) {
						brd[k][y]=brd[x][y];
						brd[x][y]=-1;
						break;
					}
				}
			}	
		}
		for(var x=2;x>=0;--x) {
			for(var y=0;y<4;++y) {
			if(brd[x+1][y]==brd[x][y] && brd[x][y]!=-1) {
					brd[x+1][y]*=2;
					cmerged__++;
					brd[x][y]=-1;
				}
			}
		}
		for(var x=3;x>=0;--x) {
			for(var y=0;y<4;++y) {
				for(var k=3;k>x;--k) {
					if(brd[k][y]== -1) {
						brd[k][y]=brd[x][y];
						brd[x][y]=-1;
						break;
					}
				}
			}	
		}
	}
	return brd;
}
function atSpeed(speed) {
	cdelay = (500/speed);
}
function onInit(action) {
	if(cinited==false){ 
		cinited = true;
		action();
	}
}
function getGameBoard() {
	return cboard;
}
function couldMove(brd, direction) {
	return gameManager.checkIsMoveAvailable(brd, direction);
}
function move(direction) {
	cmove = direction;
}


function GameManager(size, InputManager, Actuator, StorageManager) {
  this.size           = size; // Size of the grid
  this.inputManager   = new InputManager;
  this.storageManager = new StorageManager;
  this.actuator       = new Actuator;
  
  this.runBot = false;
  this.botTimer = -1;

  this.startTiles     = 2;

  //this.inputManager.on("move", this.move.bind(this));
  this.inputManager.on("restart", this.restart.bind(this));
  this.inputManager.on("keepPlaying", this.keepPlaying.bind(this));

  this.setup();
}

// Restart the game
GameManager.prototype.restart = function () {
  this.actuator.moves = 0;
  this.actuator.setMovesNumber(0);
  this.stopBotSimulation();
  cinited = false;
  this.storageManager.clearGameState();
  this.actuator.continueGame(); // Clear the game won/lost message
  this.setup();
  this.runBotSimulation();
};

// Keep playing after winning (allows going over 2048)
GameManager.prototype.keepPlaying = function () {
  this.keepPlaying = true;
  this.actuator.continueGame(); // Clear the game won/lost message
};

// Return true if the game is lost, or has won and the user hasn't kept playing
GameManager.prototype.isGameTerminated = function () {
  if (this.over || (this.won && !this.keepPlaying)) {
    return true;
  } else {
    return false;
  }
};

// Set up the game
GameManager.prototype.setup = function () {
  var previousState = this.storageManager.getGameState();

  // Reload the game from a previous game if present
  if (previousState) {
    this.grid        = new Grid(previousState.grid.size,
                                previousState.grid.cells); // Reload grid
    this.score       = previousState.score;
    this.over        = previousState.over;
    this.won         = previousState.won;
    this.keepPlaying = previousState.keepPlaying;
  } else {
    this.grid        = new Grid(this.size);
    this.score       = 0;
    this.over        = false;
    this.won         = false;
    this.keepPlaying = false;

    // Add the initial tiles
    this.addStartTiles();
  }

  // Update the actuator
  this.actuate();
};

// Set up the initial tiles to start the game with
GameManager.prototype.addStartTiles = function () {
  for (var i = 0; i < this.startTiles; i++) {
    this.addRandomTile();
  }
};

// Adds a tile in a random position
GameManager.prototype.addRandomTile = function () {
  if (this.grid.cellsAvailable()) {
    var value = Math.random() < 0.9 ? 2 : 4;
    var tile = new Tile(this.grid.randomAvailableCell(), value);

    this.grid.insertTile(tile);
  }
};

// Sends the updated grid to the actuator
GameManager.prototype.actuate = function () {
  if (this.storageManager.getBestScore() < this.score) {
    this.storageManager.setBestScore(this.score);
  }

  // Clear the state when the game is over (game over only, not win)
  if (this.over) {
    this.storageManager.clearGameState();
  } else {
    this.storageManager.setGameState(this.serialize());
  }

  this.actuator.actuate(this.grid, {
    score:      this.score,
    over:       this.over,
    won:        this.won,
    bestScore:  this.storageManager.getBestScore(),
    terminated: this.isGameTerminated()
  });

};

// Represent the current game as an object
GameManager.prototype.serialize = function () {
  return {
    grid:        this.grid.serialize(),
    score:       this.score,
    over:        this.over,
    won:         this.won,
    keepPlaying: this.keepPlaying
  };
};

// Save all tile positions and remove merger info
GameManager.prototype.prepareTiles = function () {
  this.grid.eachCell(function (x, y, tile) {
    if (tile) {
      tile.mergedFrom = null;
      tile.savePosition();
    }
  });
};

// Move a tile and its representation
GameManager.prototype.moveTile = function (tile, cell) {
  this.grid.cells[tile.x][tile.y] = null;
  this.grid.cells[cell.x][cell.y] = tile;
  tile.updatePosition(cell);
};

GameManager.prototype.checkIsMoveAvailable = function(board, direction) {
	var bd = ifMoved(board, direction);
	//alert("Check move at direction ["+direction+"]:\nBEFORE = ["+debug(board)+"]\nAFTER = ["+debug(bd)+"]");
	for(var x=0;x<4;++x) {
		for(var y=0;y<4;++y) {
			if(board[x][y]!=bd[x][y]) {
				return true;
			}
		}
	}
	return false;
}

GameManager.prototype.stopBotSimulation = function() {
	this.runBot = false;
	window.clearInterval(this.botTimer);
	gameManager.actuator.setMovesNumberOff(gameManager.actuator.moves);
}

GameManager.prototype.runBotSimulation = function() {
	this.runBot = true;
	this.botTimer = setInterval(function(){gameManager.move(0);}, cdelay);
	gameManager.actuator.setMovesNumber(gameManager.actuator.moves);
}

// Move tiles on the grid in the specified direction
GameManager.prototype.move = function (direction) {
  // 0: up, 1: right, 2: down, 3: left
  var self = this;

  if (this.isGameTerminated()) return; // Don't do anything if the game's over

  var board = new Array();
  
  for(var x=0;x<4;++x) {
	board[x] = new Array();
	for(var y=0;y<4;++y) {
		if(self.grid.cells[x][y] == null) {
			board[x][y] = -1;
		} else {
			board[x][y] = self.grid.cells[x][y].value;
		}
	}
  }
  
  var code = editor.getValue();
  cboard = board;
  cmove = 0;
  //alert(code);
  try {
      eval(code);
  } catch(err) {
      this.stopBotSimulation();
	  alert("Simulation stopped. Error in code.\n"+err.message);
  }
  direction = cmove;
  
  /*var str = "Can move : ";
  
  if(this.checkIsMoveAvailable(0, board)) { str += "up; "; }
  if(this.checkIsMoveAvailable(1, board)) { str += "right; "; }
  if(this.checkIsMoveAvailable(2, board)) { str += "down; "; }
  if(this.checkIsMoveAvailable(3, board)) { str += "left; "; }*/
  
  /*if(Math.random()*100>50) {
		direction = 0;
  } else {
		direction = 1;
  }
  
  if(!this.checkIsMoveAvailable(direction, board)) {
		for(var it=0;it<4;++it) {
			direction += it;
			direction %= 4;
			if(this.checkIsMoveAvailable(direction, board)) {
				it = 4;
				break;
			}
		}
  }*/
  
  var cell, tile;

  var vector     = this.getVector(direction);
  var traversals = this.buildTraversals(vector);
  var moved      = false;

  // Save the current tile positions and remove merger information
  this.prepareTiles();

  // Traverse the grid in the right direction and move tiles
  traversals.x.forEach(function (x) {
    traversals.y.forEach(function (y) {
      cell = { x: x, y: y };
      tile = self.grid.cellContent(cell);

      if (tile) {
        var positions = self.findFarthestPosition(cell, vector);
        var next      = self.grid.cellContent(positions.next);

        // Only one merger per row traversal?
        if (next && next.value === tile.value && !next.mergedFrom) {
          var merged = new Tile(positions.next, tile.value * 2);
          merged.mergedFrom = [tile, next];

          self.grid.insertTile(merged);
          self.grid.removeTile(tile);

          // Converge the two tiles' positions
          tile.updatePosition(positions.next);

          // Update the score
          self.score += merged.value;

          // The mighty 2048 tile
          if (merged.value === 2048) self.won = true;
        } else {
          self.moveTile(tile, positions.farthest);
        }

        if (!self.positionsEqual(cell, tile)) {
          moved = true; // The tile moved from its original cell!
        }
      }
    });
  });

  if (moved) {
    gameManager.actuator.moves++;gameManager.actuator.setMovesNumber(gameManager.actuator.moves);
	
    this.addRandomTile();

    if (!this.movesAvailable()) {
      this.over = true; // Game over!
    }

    this.actuate();
  }
};

// Get the vector representing the chosen direction
GameManager.prototype.getVector = function (direction) {
  // Vectors representing tile movement
  var map = {
    0: { x: 0,  y: -1 }, // Up
    1: { x: 1,  y: 0 },  // Right
    2: { x: 0,  y: 1 },  // Down
    3: { x: -1, y: 0 }   // Left
  };

  return map[direction];
};

// Build a list of positions to traverse in the right order
GameManager.prototype.buildTraversals = function (vector) {
  var traversals = { x: [], y: [] };

  for (var pos = 0; pos < this.size; pos++) {
    traversals.x.push(pos);
    traversals.y.push(pos);
  }

  // Always traverse from the farthest cell in the chosen direction
  if (vector.x === 1) traversals.x = traversals.x.reverse();
  if (vector.y === 1) traversals.y = traversals.y.reverse();

  return traversals;
};

GameManager.prototype.findFarthestPosition = function (cell, vector) {
  var previous;

  // Progress towards the vector direction until an obstacle is found
  do {
    previous = cell;
    cell     = { x: previous.x + vector.x, y: previous.y + vector.y };
  } while (this.grid.withinBounds(cell) &&
           this.grid.cellAvailable(cell));

  return {
    farthest: previous,
    next: cell // Used to check if a merge is required
  };
};

GameManager.prototype.movesAvailable = function () {
  return this.grid.cellsAvailable() || this.tileMatchesAvailable();
};

// Check for available matches between tiles (more expensive check)
GameManager.prototype.tileMatchesAvailable = function () {
  var self = this;

  var tile;

  for (var x = 0; x < this.size; x++) {
    for (var y = 0; y < this.size; y++) {
      tile = this.grid.cellContent({ x: x, y: y });

      if (tile) {
        for (var direction = 0; direction < 4; direction++) {
          var vector = self.getVector(direction);
          var cell   = { x: x + vector.x, y: y + vector.y };

          var other  = self.grid.cellContent(cell);

          if (other && other.value === tile.value) {
            return true; // These two tiles can be merged
          }
        }
      }
    }
  }

  return false;
};

GameManager.prototype.positionsEqual = function (first, second) {
  return first.x === second.x && first.y === second.y;
};
