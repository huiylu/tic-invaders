let game = document.getElementById('game')
let movementDisplay = document.getElementById('movement')

// Set your Context!
var ctx = game.getContext('2d')
var direction = true; //True for right, False for left
var player;
var playerGun;
var xEdgeRight;  //used as x bounds to move downwards
var xEdgeLeft;
var box=[]; //trio of aliens
var bullet=[];  //shot by the player to kill aliens
var downMove=false; //move aliens down
var bulletRateTime=null;
var bulletRate=3;
var gameState=true;
var laser=[]; //shot by aliens to kill player
var laserRate=5;
var laserRateTime = null;
//var runGame = setInterval(gameLoop, 1);



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
    if(gameState){
      var runGame = setInterval(function (){
        
          ctx.clearRect(0, 0, game.width, game.height)
          movementDisplay.textContent = `X: ${player.x} Y: ${player.y}`
          
          
          player.render();
          for(let i =0;i<bullet.length;i++){
            bullet[i].render();
          }
          for(let i =0;i<laser.length;i++){
            laser[i].render();
          }
          
          for(let i =0;i<box.length;i++){ 
            
              for(let h=0;h<bullet.length;h++){
                if(box[i].shooting(bullet[h])){
                  //console.log(box[i].shooting(bullet[h]));
                  bullet.splice(h--,1);
                }
              }
              box[i].render();
            
          }
          xBounds();
          alienDown();
          for(let i =0;i<box.length;i++){ 
            
              //console.log((i*3)+j);
              box[i].sideMove();
              box[i].boxKill(player);
            
          }
          moveBullet();
          
          if(downMove){
            downMove=false;
          }
          if(!gameState){
            ctx.clearRect(0, 0, game.width, game.height)
            ctx.font="30px Arial";
            ctx.fillText("Game Over", 10, 50);
            clearInterval(runGame);
          }
          //setTimeout(() => { console.log("World!"); }, 20000);
      
      }, 60);
    }
})

function movementHandler(e) {   //Handles movement of player
    // up (w:87): y-=1; left (a:65): x-=1; down (s:83): y+=1; right (d:68): x+=1
    switch (e.keyCode) {
      case (65):
        player.x -= 10
        break
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
       (e.y>=this.y&&e.y<=this.y+height)&&this.life){
          //console.log("Test");
          this.life=false;
          
          return this.life;
       }else{
          return true;
       }
    
  }

  this.kill=function(e){
    //console.log('ded');
    if((e.x>=this.x&&e.x<=this.x+width)&&
       (e.y>=this.y&&e.y<=this.y+height)&&this.life){
          gameState=false;
          //console.log('ded');
         
       }
  }

  this.alienShoots=function(){
    if(((laserRateTime === null)||((new Date()).valueOf() - laserRateTime)>=(1000 / laserRate))&&Math.random()*100<=5&&this.life){
      laser.push(new Bullet(this.x,this.y));
      laserRateTime=(new Date()).valueOf();
      //console.log('Test');
  }
  }
}  

function boxAlien(row, column){
    var alien1=new Alien(10+row,10+column,15,5,'#black');
    var alien2=new Alien(30+row,10+column,15,5,'#black');
    var alien3=new Alien(50+row,10+column,15,5,'#black');
    var exist=true;
    this.render=function(){ //Renders Aliens in trios
        alien1.render();
        alien2.render();
        alien3.render();
    }
    
    this.sideMove=function(){
      this.boxShoot();
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
      alien1.y+=5;
      alien2.y+=5;
      alien3.y+=5;
      
    }

    this.rMA=function(){  //Right Most Alien x
      if(alien3.life){
        return alien3.x;
      } else if(alien2.life){
        return alien2.x;
      } else if(alien1.life){
        return alien1.x;
      } else{
        exist=false
        return 1;
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
      } else{
        exist=false
        return 1;
      }
      

    }
    this.shooting=function(e){  //run the shot function for each trio of aliens
      
      if((!alien1.shot(e)||!alien2.shot(e)||!alien3.shot(e))){
        return true;
      } else{
        return false;
      }
    }   
    this.boxKill=function(e){
      alien1.kill(e);
      alien2.kill(e);
      alien3.kill(e);
    }

    this.boxShoot=function(){
      alien1.alienShoots();
      alien2.alienShoots();
      alien3.alienShoots();
    }
}

function xBounds(){
  
  for(let i =0;i<box.length;i++){ 
    if(box[i].rMA()>=285){
      //console.log(box[i].rMA())
        xEdgeRight=true;
        break;
    } else if(box[i].lMA()<=0){
        xEdgeLeft=true;
        break;
    }
  }

}

function alienDown(){
  for(let i=0;i<box.length;i++){
    if(xEdgeRight){
      box[i].downMove();
      direction=false;
    }
    else if(xEdgeLeft){
      box[i].downMove();
      direction=true;
    }
  }
  xEdgeRight=false;
  xEdgeLeft=false;
}

//handle bullet movement

function Bullet(x,y){
  this.x=x
  this.y=y
  this.width= 1
  this.height = 3
  this.color='#green'
  this.render= function(){
    ctx.fillStyle = this.color;
    ctx.fillRect(this.x,this.y,this.width,this.height);
  }
}
function fireBullet(){
  
  if((bulletRateTime === null)||((new Date()).valueOf() - bulletRateTime)>=(1000 / bulletRate)){
      bullet.push(new Bullet(player.x,player.y));
      bulletRateTime=(new Date()).valueOf();
      //console.log('Test');
  }
  //console.log((new Date()).valueOf());
}

function moveBullet(){
  for(let i=0;i<bullet.length;i++){
    bullet[i].y-=10;
    if(bullet[i].y<=0){
      bullet.splice(i--,1);
    }
  }

  for(let i=0;i<laser.length;i++){
    laser[i].y+=10;
    console.log(laser[i].length);
    if(laser[i].y>=150){
      laser.splice(i--,1);
    }
  }
}

function shoot(e){ 
  if(e.keyCode==32){
    fireBullet();
  }
}

function Laser(x,y){
  this.x=x
  this.y=y
  this.width= 1
  this.height = 3
  this.color='#green'
  this.render= function(){
    ctx.fillStyle = this.color;
    ctx.fillRect(this.x,this.y,this.width,this.height);
  }
}

