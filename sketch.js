var rows = 50;
var cols = 50;
var start;
var end;
var w;
var h;
var path = [];



var grid = new Array(cols);
var open_set = [];
var close_set = [];



function heuristic(a,b){
  var d = dist(a.i,a.j,b.i,b.j)
  return d;
}



function removeArray(arr,elt){
  for(let i = arr.length; i>=0; i--){
    if(arr[i] == elt){
      arr.splice(i,1);
    }
  }
}



function spot(i,j){
  this.f = 0;
  this.g = 0;
  this.h = 0;
  this.i = i;
  this.j = j;

  this.show = function(col){
    fill(col);
    if(this.wall){
      fill(0);
    }
    noStroke();
    rect(this.i * w,this.j * h,w-1,h-1);
  }
  
  this.neighbors = [];
  this.previous = undefined;
  
  this.addNeighbors = function(grid){
    var i = this.i;
    var j = this.j;
    if(i<cols-1){
      this.neighbors.push(grid[i + 1][j]);
    }
    if(i>0){
      this.neighbors.push(grid[i - 1][j]);
    }
    if(j<rows-1){
      this.neighbors.push(grid[i][j + 1]);
    }
    if(j>0){
      this.neighbors.push(grid[i][j - 1]);
    }
    if(i>0 && j>0){
      this.neighbors.push(grid[i - 1][j - 1]);
    }
    if(i<cols - 1 && j>0){
      this.neighbors.push(grid[i + 1][j - 1]);
    }
    if(i>0 && j<rows - 1){
      this.neighbors.push(grid[i - 1][j + 1]);
    }
    if(i<cols - 1 && j>rows - 1){
      this.neighbors.push(grid[i + 1][j + 1]);
    }
  }
  
  this.wall = false;
  
  if(random(1) < 0.3){
    this.wall = true;
  }
}



function setup(){
  createCanvas(400,400);
  console.log("A*");

  w = width/cols;
  h = height/rows;

  for(let i = 0; i<cols; i++){
    grid[i] = new Array(rows);
  }

  for(let i = 0; i<cols; i++){
    for(let j = 0; j<rows; j++){
      grid[i][j] = new spot(i,j);
    }
  }
  
  for(let i = 0; i<cols; i++){
    for(let j = 0; j<rows; j++){
      grid[i][j].addNeighbors(grid);
    }
  }

  start = grid[0][0];
  end = grid[cols-1][rows-1];
  
  start.wall = false;
  end.wall = false;

  open_set.push(start);

  console.log(grid);
}



function draw(){

  if(open_set.length > 0){
    
    var winner = 0
    for(let i = 0; i< open_set.length; i++){
      if(open_set[i].f < open_set[winner].f){
        winner = i;
      }
    }
    
    
    var current = open_set[winner];
    
    if(current === end){
      
      noLoop();
      console.log("DONE!!!");
      
    }
    
    removeArray(open_set,current);
    close_set.push(current);
    
    
    var neighbors = current.neighbors;
    
    for(let i = 0; i<neighbors.length; i++){
      var neighbor = neighbors[i];
      
      if(!close_set.includes(neighbor) && !neighbor.wall){
        var tempG = current.g + 1;
        
        var newPath = false;
        if(open_set.includes(neighbor)){
          if(tempG<neighbor.g){
            neighbor.g = tempG;
            newPath = true;
          }
        }
        else{
          neighbor.g = tempG;
          newPath = true
          open_set.push(neighbor);
        }
        
        if(newPath){
          neighbor.h = heuristic(neighbor,end);
          neighbor.f = neighbor.h + neighbor.g;
          neighbor.previous = current;
        }
      }
    }
  }
  
  else{
    console.log("No Solution");
    noLoop();
    return;
  }
  

  background(0);

  for(let i = 0; i<cols; i++){
    for(let j = 0; j<rows; j++){
      grid[i][j].show(color(255));
    }
  }
  
  for(let i = 0;i<close_set.length;i++){
    close_set[i].show(color(225,0,0));
  }
  
  for(let i = 0;i<open_set.length;i++){
    open_set[i].show(color(255,255,50));
  }
  
  path = [];
  var temp = current;
  path.push(temp);

  while(temp.previous){
    path.push(temp.previous);
    temp = temp.previous;
  }
  
  for(let i = 0; i<path.length; i++){
    path[i].show(color(51,94,235))
  }
}