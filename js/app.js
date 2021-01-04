let game = document.getElementById('game')
let movementDisplay = document.getElementById('movement')

// Set your Context!
var ctx = game.getContext('2d')
var direction = true;
var alien;
var player;
var box1;
var box2;
var box3;
var box4;
var box5;
var box6;
var box7;
var box8;
var box9;
document.addEventListener('DOMContentLoaded', function() {
    box1= new boxAlien(0,0);
    box2=new boxAlien(60,0);
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
    this.render = function(){
        ctx.fillStyle = this.color;
        ctx.fillRect(this.x,this.y,this.width,this.height);
    }
}

function gameLoop(){
    ctx.clearRect(0, 0, game.width, game.height)
    movementDisplay.textContent = `X: ${player.x} Y: ${player.y}`
    
    player.render()
    box1.render();
    box2.render();
    
    //box1.movement();

}

function movementHandler(e) {
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

  function alienMoves(currentAlien){
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

function boxAlien(row, column){
    var alien1=new Alien(10+row,10+column,15,5,'#black');
    var alien2=new Alien(30+row,10+column,15,5,'#black');
    var alien3=new Alien(50+row,10+column,15,5,'#black');
    this.render=function(){
        alien1.render();
        alien2.render();
        alien3.render();
    }
    
    this.movement = function(){
        alienMoves(alien1);
        alienMoves(alien2);
        alienMoves(alien3);
    }
}

//