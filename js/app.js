let game = document.getElementById('game')
let movementDisplay = document.getElementById('movement')

// Set your Context!
var ctx = game.getContext('2d')
var direction = true;
var alien;
document.addEventListener('DOMContentLoaded', function() {
    alien= new Alien(10,10,15,5,'#black');
    
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
    //movementDisplay.textContent = `X: ${alien.x} Y: ${alien.y}`
    alienMoves()
    alien.render()
}

function movementHandler(e) {
    // up (w:87): y-=1; left (a:65): x-=1; down (s:83): y+=1; right (d:68): x+=1
    switch (e.keyCode) {
      case (87):
        alien.y -= 10
        break
      case (65):
        alien.x -= 10
        break
      case (83):
        alien.y += 10
        break
      case (68):
        alien.x +=10
    } 
  }

  function alienMoves(){
    if(direction){
        alien.x += 10;
    }
    else{
        alien.x -=10;
    }
    if(alien.x>=300){
        direction=false;
        alien.y+=10;
    }
    else if(alien.x<=0){
        direction=true;
        alien.y+=10;
    }
  }