var canvas = document.querySelector("canvas");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
var c = canvas.getContext('2d');
window.score = 0;
window.gameOver = false;
var highscoreStart = localStorage['highscore'];
document.getElementById("highscoreNow").textContent="Highscore: "+highscoreStart;
var flag = false; //flag to make sure game over alert only appears once

window.pX = canvas.width/2,window.pY = 420;
window.pWidth = 20,window.pHeight = 80;
window.pDx = 5,window.pDy = 2;
var Player1 = new Player(pX,pY,pWidth,pHeight);
var left,right,up;
var count = 0;

window.dX, window.dY;
window.dWidth = 10, window.dHeight=36;
window.dDx = 5,window.dDy=5;

var dropArray = [];
for(var i=0; i<18; i++)
{
    var randomX = Math.floor(Math.random()*window.innerWidth);
    var randomDdy = Math.floor(Math.random()*18);
    var randomDw = randomDwidth();
    while(randomDdy<0.5==true) //don't cling to wall
    {
        randomDdy = Math.floor(Math.random()*3);
    }
    //var dx = (Math.random() - 0.5) * 20; //velocity x, random + or -
    //var dy = (Math.random() - 0.5) * 8; //velocity y, random + or -
    dropArray.push(new Drop(randomX,0,randomDdy,randomDw,dHeight));
}

function Player(pX, pY, pWidth, pHeight)
{
    console.log(pX+" "+pY+" "+pWidth+" "+pHeight);
    this.draw = function()
    {
        c.clearRect(0,0,innerWidth,innerHeight); //clear frame
        c.fillStyle = "rgba(222,47,81,1)";
        c.fillRect(pX,pY,pWidth,pHeight);
        //console.log("px in draw is "+pX);
        //background
        c.fillStyle = "rgba(255,252,226,1)";
        c.fillRect(0,500,canvas.width,canvas.height);
    }
    this.update = function()
    {
        document.onkeydown = function(event) 
        {
            event = event || window.event;
            if(event.keyCode) 
            {
                if(event.keyCode==37) //left
                {
                    left=true;
                    right=false;
                    //pX = pX-1;
                }
                else if(event.keyCode==39) //right
                {
                    left=false;
                    right=true;
                }
                else if(event.keyCode==38) //up
                {
                    up=true;

                    //no moving and jumping at same time
                    //left=false;
                    //right=false;
                }
            }
        };
        document.onkeyup = function(event)
        {
            event = event || window.event;;
            if(event.keyCode==37) //left
            {
                left=false;
            }
            else if(event.keyCode==39) //right
            {
                right=false;
            }
            /*else if(event.keyCode==38) //up
            {
                up=false;
            }*/
        };
        
        if(left==true && pX>0) //move left, wall collision
        {
            console.log("Left "+pX);
            pX = pX-pDx;
        }
        if(right==true && pX<innerWidth-pWidth) //move right, wall collision
        {
            console.log("Right "+pX)
            pX = pX+pDx;
        }
        if(up==true)
        {   
            for(var faster = 0; faster<4; faster++)
            {
                //console.log("count "+count);
                if(pY<300==false)
                {
                    count++;
                    console.log("going up");
                    pY = pY-1;
                    this.draw();
                }
                else if(pY>=420==false)
                {
                    count++;
                    console.log("going down");
                    pY = pY+10;
                    this.draw();
                }
                if(count>120)
                {
                    up=false;
                    count=0;
                    pY=420;
                    this.draw();
                }
            }
        }
        this.draw();
    }
    this.getX = function()
    {
        return pX;
    }
    this.getY = function()
    {
        return pY;
    }
}
function randomDwidth()
{
    var ranDwidth = Math.random()*12;
    while(ranDwidth<6)
    {
        ranDwidth = Math.random()*12;
    }
    return ranDwidth;
}
function Drop(dX,dY,dDy,dWidth,dHeight)
{
    //console.log(dX+" "+dY+" "+dWidth+" "+dHeight);
    var colourArray = ["#c1dbdb","#8f3b48","#8ea3bd","#66b266","#b26666"]
    var colour = colourArray[Math.floor(Math.random()*colourArray.length)];

    this.draw = function()
    {
        c.fillStyle = colour;
        c.fillRect(dX,dY,dWidth,dHeight);
    }
    this.update = function()
    {
        if(dY>=462) //respawn
        {
            dY=0;
            dX = Math.floor(Math.random()*window.innerWidth);
            randomDdy = Math.floor(Math.random()*18);
            dWidth = randomDwidth();
        }
        else if(dY<=462)
        {
           dY+=dDy; 
           if(dY>pHeight+30) //simulate gravity
           {
               dY+=0.5;
           }
        }

        //hit character
        //----PLAYER
        pX = Player1.getX();
        pY = Player1.getY();
        if(dX>pX-pWidth && dX<pX+pWidth && dY>pY-20 && gameOver==false)
        {
            console.log("Dw: "+dWidth+". Pw: "+pWidth+". Py: "+pY+". Dy: "+(dY+dHeight-1)+". Px: "+pX+". Dx: "+dX);
            gameOver = true;
            //alert("collision");
            colour = "#ff0000";
        }
        this.draw();
    }
}

//increase score every second survived
window.setInterval(function()
{
    if(gameOver==false)
    {
      score+=1;
      document.getElementById("score").textContent="Score: "+score;  
    }
}, 1000);

function animate()
{
    if(gameOver==false)
    {
        requestAnimationFrame(animate);
        Player1.update();

        for(var i=0; i<dropArray.length;i++)
        {
            dropArray[i].update();
        }
    }
    if(gameOver==true)
    {
        document.getElementById('end_score').style.display = 'block';
        document.getElementById('refreshButton').style.display = 'block';
        document.getElementById('clearHsButton').style.display = 'block';
        document.getElementById("end_score").textContent="Game Over, Score: "+score;
        var highscore = localStorage['highscore'];
        if(highscore==null)
        {
            highscoreInt=0;
        }
        var highscoreInt = Number(highscore);
        if(flag==false)
        {
            if(score>highscoreInt)
            {
                localStorage['highscore'] = ""+score; // only strings
                document.getElementById("end_score").textContent="New Highscore: "+score;
            }
            else
            {
                document.getElementById("end_score").textContent="Score: "+score;
            }
            flag=true;
        }
        document.onkeydown = function(event) 
        {
            event = event || window.event;
            if(event.keyCode) 
            {
                if(event.keyCode==82) //r
                {
                    window.location.reload();
                }
                if(event.keyCode==72) //h
                {
                    localStorage['highscore'] = "0";
                    document.getElementById("highscoreNow").textContent="Highscore: "+0;
                }
            }
        }
    }
}
animate();