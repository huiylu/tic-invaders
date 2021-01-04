let game = document.getElementById('game')
let movementDisplay = document.getElementById('movement')

// Set your Context!
var ctx = game.getContext('2d')
var direction = true;
var alien;
var player;
var playerGun;
var rightAlien;
var leftAlien;
var xEdgeRight=0;  //used as x bounds to move downwards
var xEdgeLeft=0;
var box=[];
var bullet=[];

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
    player=new Alien(30,140,15,5,'#black');
    playerGun=new Alien(player.x,player.y,5,5,'#black');
    document.addEventListener('keydown', movementHandler);
    document.addEventListener('keydown', shoot);
    var runGame = setInterval(gameLoop, 60);
  })



function gameLoop(){
    ctx.clearRect(0, 0, game.width, game.height)
    movementDisplay.textContent = `X: ${player.x} Y: ${player.y}`
    
    
    player.render();
    for(let i =0;i<bullet.length;i++){
      bullet[i].render();
    }
    moveBullet();
    for(let i =0;i<3;i++){ 
      for(let j=0;j<3;j++){
        for(let h=0;h<bullet.length;h++){
          box[(i*3)+j].shooting(bullet[h]);
        }
        box[(i*3)+j].render();
      }
    }
    xBounds();
    for(let i =0;i<3;i++){ 
      for(let j=0;j<3;j++){
        //console.log((i*3)+j);
        box[(i*3)+j].sideMove();
      }
    }
    //setTimeout(() => { console.log("World!"); }, 20000);
}

function movementHandler(e) {   //Handles movement of player
    // up (w:87): y-=1; left (a:65): x-=1; down (s:83): y+=1; right (d:68): x+=1
    switch (e.keyCode) {
      //case (87):
        //player.y -= 10
        //break
      case (65):
        player.x -= 10
        break
      //case (83):
        //player.y += 10
        //break
      //case(32):
        
        //break;
      case (68):
        player.x +=10
    } 
}

function Alien(x,y,width,height,color){
  this.x = x
  this.y = y
  this.width = width
  this.height = height
  this.color= color
  this.life=true
  this.render = function(){
    if(this.life){
      ctx.fillStyle = this.color;
      ctx.fillRect(this.x,this.y,this.width,this.height);
    }
  }

  this.shot=function(e){
    //console.log("Test");
    if((e.x>=this.x&&e.x<=this.x+width)&&
       (e.y>=this.y&&e.y<=this.y+height)){
       console.log("Test");
      this.life=false
       }
    
  }
}  

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
      /*
      else{
        return 0;
      }
      */

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
      /*
      else{
        return 0;
      }
      */

    }
    this.shooting=function(e){
      //console.log("Test");
      alien1.shot(e);
      alien2.shot(e);
      alien3.shot(e);
    }
    
}
//takes a box of aliens
//find the left most aliens and right most aliens
//obtains the x of said aliens
//uses x as the bounds for movement
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

//handle bullet movement

function Bullet(x,y){
  this.x=x
  this.y=y
  this.width= 5
  this.height = 5
  this.color='green'
  this.render= function(){
    ctx.fillStyle = this.color;
    ctx.fillRect(this.x,this.y,this.width,this.height);
  }
}
function fireBullet(){
  bullet.push(new Bullet(player.x,player.y));
}

function moveBullet(){
  for(let i=0;i<bullet.length;i++){
    bullet[i].y-=10;
  }
}

function shoot(e){
  if(e.keyCode==32){
    fireBullet();
  }
}