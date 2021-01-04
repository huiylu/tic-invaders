let game = document.getElementById('game')
let movementDisplay = document.getElementById('movement')

// Set your Context!
var ctx = game.getContext('2d')
var direction = true;
var alien;
var player;
var rightAlien;
var leftAlien;
var xEdgeRight=0;  //used as x bounds to move downwards
var xEdgeLeft=0;
var box=[];

/*    //Primary loop for all boxes
for(let i =0;i<3;i++){ 
  for(let j=0;j<3;j++){
    
  }
}
*/ 

document.addEventListener('DOMContentLoaded', function() {
    //box1= new boxAlien(0,0);
    //box2=new boxAlien(60,0);
    for(let i =2;i>-1;i--){
      for(let j=2;j>-1;j--){
        box.push(new boxAlien(j*60,i*10));
      }
    }
    player=new Alien(30,30,15,5,'#black');
    
    document.addEventListener('keydown', movementHandler);
    var runGame = setInterval(gameLoop, 60);
  })

function Alien(x,y,width,height,color){
    this.x = x
    this.y = y
    this.width = width
    this.height = height
    this.color= color
    this.life=true
    this.render = function(){
        ctx.fillStyle = this.color;
        ctx.fillRect(this.x,this.y,this.width,this.height);
    }
}

function gameLoop(){
    ctx.clearRect(0, 0, game.width, game.height)
    movementDisplay.textContent = `X: ${player.x} Y: ${player.y}`
    
    
    player.render();
    for(let i =0;i<3;i++){ 
      for(let j=0;j<3;j++){
        box[(i*3)+j].render();
      }
    }
    xBounds();
    for(let i =0;i<3;i++){ 
      for(let j=0;j<3;j++){
        console.log((i*3)+j);
        box[(i*3)+j].sideMove();
      }
    }
    //setTimeout(() => { console.log("World!"); }, 20000);
    

}

function movementHandler(e) {   //Handles movement of player
    // up (w:87): y-=1; left (a:65): x-=1; down (s:83): y+=1; right (d:68): x+=1
    switch (e.keyCode) {
      case (87):
        player.y -= 10
        break
      case (65):
        player.x -= 10
        break
      case (83):
        player.y += 10
        break
      case (68):
        player.x +=10
    } 
  }

  /*
  function alienMoves(currentAlien){  //Handles movement of Aliens
    if(direction){
        currentAlien.x += 10;
    }
    else{
        currentAlien.x -=10;
    }
    if(currentAlien.x>=300){
        direction=false;
        currentAlien.y+=10;
    }
    else if(currentAlien.x<=0){
        direction=true;
        currentAlien.y+=10;
    }
}
*/

function boxAlien(row, column){
    var alien1=new Alien(10+row,10+column,15,5,'#black');
    var alien2=new Alien(30+row,10+column,15,5,'#black');
    var alien3=new Alien(50+row,10+column,15,5,'#black');
    this.render=function(){ //Renders Aliens in trios
        alien1.render();
        alien2.render();
        alien3.render();
    }
    /*  //Obsolete code handles instead by sideMove
    this.movement = function(){ //
        alienMoves(alien1);
        alienMoves(alien2);
        alienMoves(alien3);
    }
    */
    this.sideMove=function(){
      //console.log(xEdgeRight);
      //console.log(xEdgeLeft);
      //console.log(alien3.life);
      if(xEdgeRight>=285){
        direction=false;
        console.log(xEdgeRight);
        this.downMove();
      }
      else if(xEdgeLeft<=0){
        direction=true;
        this.downMove();
      }
      if(direction){
        alien1.x += 5;
        alien2.x += 5;
        alien3.x += 5;
      }
      else{
        alien1.x -= 5;
        alien2.x -= 5;
        alien3.x -= 5;
      }
      
    }

    this.downMove=function(){
      alien1.y+=10;
      alien2.y+=10;
      alien3.y+=10;
      
    }

    
    this.rMA=function(){  //Right Most Alien x
      if(alien3.life){
        return alien3.x;
      } else if(alien2.life){
        return alien2.x;
      } else if(alien1.life){
        return alien1.x;
      }
      else{
        return 0;
      }

    }
    this.lMA=function(){  //Left Most Alien x
      if(alien1.life){
        //console.log(alien1.x);
        return alien1.x;
      } else if(alien2.life){
        return alien2.x;
      } else if(alien3.life){
        return alien3.x;
      }
      else{
        return 0;
      }

    }
    
}

function xBounds(){
  rightAlien=box[0].rMA();
  leftAlien=box[0].lMA();
  for(let i =0;i<3;i++){ 
    for(let j=0;j<3;j++){
      if(box[(i*3)+j].rMA()>rightAlien){
        rightAlien=box[(i*3)+j].rMA();
      }
    }
  }

  for(let i =0;i<3;i++){ 
    for(let j=0;j<3;j++){
      if(box[(i*3)+j].lMA()<leftAlien){
        leftAlien=box[(i*3)+j].lMA();
      }
    }
  }
  
  xEdgeRight=rightAlien;
  xEdgeLeft=leftAlien;
}

//takes a box of aliens
//find the left most aliens and right most aliens
//obtains the x of said aliens
//uses x as the bounds for movement
