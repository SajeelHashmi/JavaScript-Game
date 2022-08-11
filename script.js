/*
sound class implemented 
pause game to play sound maybe cancel the animation frame in update and set timeout before call of game over function
game pause implemented now bavkground music if wanted
*/


const INITIAL_VELOCITY=0.015
const VELOCITY_INCREASE=0.010
const showVelocity=document.getElementById("vel")
const scoreEl=document.getElementById("score")
let mySound;
const temp=e=>{
    sqmove(e)
}
class sound {
    constructor(src) {
        this.sound = document.createElement("audio")
        this.sound.src = src
        this.sound.setAttribute("preload", "auto")
        this.sound.setAttribute("controls", "none")
        this.sound.style.display = "none"
        this.sound.loop=false
        document.body.appendChild(this.sound)
        this.play = function () {
            this.sound.play()
        }
        this.stop = function () {
            this.sound.pause()
        }
    }
} 
const backgroundMusic=new sound("background 1.mp3");
class powerUp{
    constructor(powerElem)
    {
        this.powerElem=powerElem
        this.ability=0
       
    }
    get color(){
        return parseFloat(getComputedStyle(this.powerElem).getPropertyValue("--color"))
    }
    colorsetter(){
        //speed inc
            if(this.ability==1){
            this.powerElem.style.backgroundColor ="red"
        }
        //speed decrease
        else if(this.ability==2){
            this.powerElem.style.backgroundColor ="green"
        }
        //square size increase
        else if(this.ability===3){
            this.powerElem.style.backgroundColor ="yellow"
        }
        //square size decrease
        else if(this.ability===4){
            this.powerElem.style.backgroundColor ="blue"
        }
    }
   
    get visible(){
        return getComputedStyle(this.powerElem).getPropertyValue("display")
    }
    set visible(value){
        this.powerElem.style.setProperty("display",value)
    }
    get x(){
        return parseFloat(getComputedStyle(this.powerElem).getPropertyValue("--x"))
    }
    set x(value){
        this.powerElem.style.setProperty("--x",value)
         
    }
    get y(){
        return parseFloat(getComputedStyle(this.ballElem).getPropertyValue("--y"))
    }
    set y(value){
        this.powerElem.style.setProperty("--y",value)
         
    }
    get rect(){
        return this.powerElem.getBoundingClientRect()
    }
    initiate(ball,sq)
    {
        
        console.log(this.ability)
        //speed increase
        if(this.ability==1){
            ball.increaseVelocity(0.005)
            showVel(ball)
        }
        //speed decrease
        else if(this.ability==2&&ball.velocity>0.005){
            ball.increaseVelocity(-.005)
            showVel(ball)

        }
        //square size increase
        else if(this.ability===3&&sq.size<400){
            sq.size+=25
        }
        //square size decrease
        else if(this.ability===4&&sq.size>200){
            sq.size-=25
        }

        this.visible="none"

    }
}
class ball{
    
    constructor(ballElem){
        this.ballElem=ballElem;
        this.game=true
    }
    get x(){
        return parseFloat(getComputedStyle(this.ballElem).getPropertyValue("--posBallX"))
    }
    set x(value){
        this.ballElem.style.setProperty("--posBallX",value)
         
    }
    get y(){
        return parseFloat(getComputedStyle(this.ballElem).getPropertyValue("--posBallY"))
    }
    set y(value){
        this.ballElem.style.setProperty("--posBallY",value)
         
    }
    get rect(){
        return this.ballElem.getBoundingClientRect()
    }
    increaseVelocity(param=VELOCITY_INCREASE)
    {
        this.velocity+=param;
    }
    reset(){
        this.x=50
        this.y=50  
        this.velocity=INITIAL_VELOCITY
        this.updateDirection()
    }
    updateDirection()
    {
        const heading=randNumbBtw(0,2*Math.PI)
        this.direction={x:Math.cos(heading), y: Math.sin(heading)}

    }
    update(delta,sqElem,powerEl){ 
   
    this.x+=(this.direction.x*this.velocity*delta)
    this.y+=(this.direction.y*this.velocity*delta)
      if(this.rect.left<= sqElem.rect.left||this.rect.right>=sqElem.rect.right||this.rect.top<=sqElem.rect.top||this.rect.bottom>=sqElem.rect.bottom){
        this.game=false
        document.removeEventListener("mousemove",temp)
        backgroundMusic.stop()
        mySound=new sound("lose.mp3");
       mySound.sound.volume=0.5;
        mySound.play();
        clearInterval(pUpInterval)
        clearInterval(scoreInterval)
        clearInterval(velocityInterval)
        setTimeout(() => {
            gameOver(this,sqElem,powerEl);
            
        }, 5000);
     }
        
     if(this.rect.bottom>=window.innerHeight-15||this.rect.top<15){
            this.direction.y*= -1
        }
    if(this.rect.right>=window.innerWidth-15||this.rect.left<15){
            this.direction.x*= -1
        }
    if(isCollide(sqElem.rect,powerEl.rect)){
        mySound=new sound("PUP.mp3");
        mySound.sound.loop=false;
        mySound.play()
           powerEl.initiate(this,sqElem)
             }
    }

    }
class square{
    constructor(sqElem)
    {
        this.sqElem=sqElem
    }
    get size(){
        return parseFloat(getComputedStyle(this.sqElem).getPropertyValue("--size"))
    }
    set size(val){
        this.sqElem.style.setProperty("--size",val)
    }
    get x(){
        return parseFloat(getComputedStyle(this.sqElem).getPropertyValue("--posX"))
    }
    set x(value){
        this.sqElem.style.setProperty("--posX",value)
         
    }
    get y(){
        return parseFloat(getComputedStyle(this.sqElem).getPropertyValue("--posY"))
    }
    set y(value){
        this.sqElem.style.setProperty("--posY",value)
         
    }
    get rect(){
        return this.sqElem.getBoundingClientRect()
    }

}
function randNumbBtw(min,max){
    return Math.random() *(max-min)+min
    
}

const hs=document.getElementById("HS")
let pUpInterval
let lastTime
let velocityInterval
let scoreInterval
let score=0
let level
const levelDiv=document.getElementById("level")
const start=document.getElementsByClassName("start")
const resultPage=document.getElementsByClassName("result")
const game=document.getElementById("game")
start[1].addEventListener("click",startGame)
const sqElem= new square(document.getElementById("square"))
function startGame()
{       
    
    backgroundMusic.sound.loop=true;
    backgroundMusic.sound.volume=0.5;
    backgroundMusic.play()
    resultPage[0].style.display="none"
    start[0].style.display="none"
    game.style.display="block"
    const ballEl =new ball(document.getElementById("ball"))
    const powerEl=new powerUp(document.getElementById("power-up"))////////////
    pUpInterval=setInterval(spawn,10000,powerEl)
    ballEl.reset()
   let updateFrame= window.requestAnimationFrame(update)
    function update(time){ 
        if(ballEl.game){

            if(lastTime!=null){
                const delta=time-lastTime
                ballEl.update(delta,sqElem,powerEl)     
                
            }
            lastTime=time
            
            updateFrame= window.requestAnimationFrame(update)
        }
        else window.cancelAnimationFrame(updateFrame)
        
    }
    score=0
    level=1
    levelDiv.textContent="Level " + level
    showVelocity.textContent="Speed : " + ballEl.velocity*1000

       

    
    document.addEventListener("mousemove",temp)    
    scoreInterval= setInterval(incScore, 10);
   velocityInterval= setInterval(increaseVelocity, 9000,ballEl);
    setInterval(() => {
        ballEl.updateDirection()
    }, 3000);
}
let highScore=localStorage.getItem("highScore")
function gameOver(x,y,A)
{
    if(highScore<score){
        highScore=score
        localStorage.setItem("highScore",highScore)
    }
    delete A
    delete x
    delete y
    
    
   
    game.style.display="none"
    resultPage[0].style.display="block"
    resultPage[1].textContent="Score " +score
    resultPage[2].textContent="Level "+ level
    resultPage[3].addEventListener("click",function(){
       location.reload()
    })
 

}
function incScore() {
    score++
    scoreEl.textContent="Score " +score;
    
}
function showVel(ballEl){
    let x=ballEl.velocity*1000
    showVelocity.textContent="Speed : " + parseInt(x)
}
function increaseVelocity(ballEl)
{
    ballEl.increaseVelocity()
    showVel(ballEl)
    level++
    mySound=new sound("level up.mp3");
        mySound.play();
    levelDiv.textContent="Level " +level
}
function spawn(paraPowerUp){
    paraPowerUp.visible="block"
    paraPowerUp.x=randNumbBtw(5,95)
    paraPowerUp.y=randNumbBtw(5,95)
    paraPowerUp.ability=Math.ceil(randNumbBtw(0.5,4))
  paraPowerUp.colorsetter();
    setTimeout(() => {
        paraPowerUp.visible="none"
    }, 4000);
}
function isCollide(a, b) {
    return !(
        ((a.top + a.height) < (b.top)) ||
        (a.top > (b.top + b.height)) ||
        ((a.left + a.width) < b.left) ||
        (a.left > (b.left + b.width))
    );
}
function sqmove(e){
    sqElem.x=(e.x/window.innerWidth *100)
    sqElem.y=(e.y/window.innerHeight *100)
}

    hs.textContent="High Score : "+highScore
    

