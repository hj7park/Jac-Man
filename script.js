

//background music
const backgroundAudio = document.querySelector("audio");
const button = document.querySelector("button");
const icon = document.querySelector("button > i");


button.addEventListener("click", function() {
    if(backgroundAudio.paused){
        icon.classList.remove("fa-volume-up");
        icon.classList.add("fa-volume-mute");
        backgroundAudio.loop = true;
        backgroundAudio.volume =0.03;
        backgroundAudio.play();
    }else{
        backgroundAudio.pause();
        icon.classList.remove("fa-volume-mute");
        icon.classList.add("fa-volume-up");
    }
});


//sound effect
const eatSound = document.getElementById("pacEat");
eatSound.volume =0.1;
const deathSound = document.getElementById("pacDie");
deathSound.volume =0.1;



//cache
const boardD = document.getElementById("map");
let gameOver = document.getElementById("game-over");



//
let test = [[1,2,3,4,5],
["a","b","c","d","e"]];

console.log(test[0]) = [1,2,3,4,5];
console.log(test[0][2]) = 3
   x
0 1 2 3 4 5
1 
2
3
4
5
y

//map1
const mazeMap1 = 
[["A0",".",".",".","-1","-1",".",".",".","A2"],
[".","-1",".",".",".",".",".",".","-1","."],
[".","-1",".","-1",".","-1","-1","-1",".",""],
[".","-1",".","-1",".",".",".",".",".","."],
[".","-1",".",".",".","-1","-1",".",".","."],
[".",".",".","-1",".","P",".",".",".","."],
[".","-1",".",".",".","-1","-1",".",".","-1"],
[".","-1",".","-1",".",".",".",".",".","."],
[".","-1",".","-1","-1","-1",".","-1","-1","."],
["A3","-1",".",".",".",".",".","-",".","A1"]];

const mazeMap2 = [[""],[""]];
const stageMap = [mazeMap1,mazeMap2];


//controller of player and AI
const controller={
    player:{
        x : 5,
        y : 5,
        invin : false,
        lives : 3,
        speed : 1,
        direction: "RIGHT",
        score: 0
    },
    AI:[
        {
            x : 0,
            y : 0,
            speed : 0.5},
        {
            x : 9,
            y : 9,
            speed : 0.5},
        {
            x : 0,
            y : 9,
            speed : 0.5},
        {
            x : 9,
            y : 0,
            speed : 0.5}
    ]        
};

//variables
let stage = 1;
let timer = 0;
let map;
let timerInterval;
let winInterval;
let start = false;


//sketch(create grid on html) out initial board.
function sketch(row,col){
    for(i =0; i< row; i++)
    {
        let rowD = document.createElement("div");
        rowD.setAttribute("class","row");
        rowD.setAttribute("id",`row${[i]}`);
        for(j=0; j<col; j++)
        {
            let colD = document.createElement("div");
            colD.setAttribute("class","col");
            colD.setAttribute("id",`${i}${j}`);
            rowD.appendChild(colD);
        }
        boardD.appendChild(rowD);
    }
}



function render(){
    for(i=0; i < map.length; i++)
    {
        for(j=0; j< map[i].length; j++)
        {
            if(map[i][j] === "-1")
            {
                boardD.children[i].children[j].style.backgroundColor = "blue";
            }
            else if(map[i][j] === ".")
            {
                boardD.children[i].children[j].classList.add("dot");
                boardD.children[i].children[j].innerHTML = "";
            }
            else if(map[i][j].includes("A"))
            {
                let aiIndex = parseInt(map[i][j].charAt(map[i][j].indexOf("A") + 1));
                boardD.children[controller.AI[aiIndex].x].children[controller.AI[aiIndex].y].innerHTML = `<img src=img/pacman_${aiIndex}.png>`;
            }
            else if(map[i][j] === "P")
            {
                boardD.children[controller.player.x].children[controller.player.y].innerHTML = "<img src=img/pacman_player.png>";
            }
            else{
                boardD.children[i].children[j].classList.remove("dot");
                boardD.children[i].children[j].innerHTML = map[i][j];
            }
        }
    }
}

function press(x,y){
    let playX = controller.player.x + x;
    let playY = controller.player.y + y;      
    if((playX < 10 && playX >= 0) && (playY < 10 && playY >= 0))
    {
        if(map[playX][playY] === "-1")
        {
            return;
        }
        else{
            if(map[playX][playY] === ".")
            {
                eatSound.play();
                controller.player.score+= 50;
            }
            map[controller.player.x][controller.player.y] = "";
            controller.player.x = playX;
            controller.player.y = playY;
            map[playX][playY] = "P";
        }
    }
    else{
        //make some boop sound
        return;
    }
}

let found = false;
let aiMoves =[];
let next =[];
let newMap;

//moves all the AIs
//credits to DIJKSTRA https://en.wikipedia.org/wiki/Dijkstra%27s_algorithm
function aiMove(obj){
    let endNode = null;
    let arr = [obj];
    let count = 0;
    if(obj.x === controller.player.x && obj.y === controller.player.y)
    {
        return [];
    }
    while(!endNode){
        let addArr = aiCheck(arr[count].x, arr[count].y);
        for(i =0; i<addArr.length; i++)
        {
            addArr[i].parent = arr[count];
            arr.push(addArr[i]);
            if(addArr[i].x === controller.player.x && addArr[i].y === controller.player.y)
            {
                endNode = addArr[i];
            }
        }
        count++;
    }

    arr = [];
    while(endNode)
    {
        arr.push({
            x:endNode.x,
            y:endNode.y,
        })
        endNode = endNode.parent;
    }

    return(arr.reverse());
}

let count =0 ;



//returns all possible ai moves
function aiCheck(posX,posY){
    let moves = [];
    if(posX+1 < 10 && posX +1 >=0 && map[posX+1][posY] !== "-1")
    {//right
        moves.push({x:posX+1,y:posY});
    }
    if(posX -1 < 10 && posX -1 >=0 && map[posX-1][posY] !== "-1")
    {//left
        moves.push({x:posX-1,y:posY});
    }
    if(posY +1 < 10 && posY +1 >=0 && map[posX][posY+1] !== "-1")
    {//down
        moves.push({x:posX,y:posY+1});
    }
    if(posY -1 < 10 && posY -1 >=0 && map[posX][posY-1] !== "-1")
    {//up
        moves.push({x:posX,y:posY-1});
    }
    //console.log(moves);
    return moves;
}


//play
function play(){
    timerInterval = setInterval(timerADD,700);
    winInterval = setInterval(checkWin,50);
}

function timerADD(){
    timer++;
    if(timer % (1/controller.AI[0].speed) === 0)    
    {
        //found = false;
        //aiMoves =[];
        let ai0Move = aiMove({x: controller.AI[0].x, y:controller.AI[0].y, prev: null});
        let ai1Move = aiMove({x: controller.AI[1].x, y:controller.AI[1].y, prev: null});
        let ai2Move = aiMove({x: controller.AI[2].x, y:controller.AI[2].y, prev: null});
        let ai3Move = aiMove({x: controller.AI[3].x, y:controller.AI[3].y, prev: null});

        //direction of the coordinates 
        map[controller.AI[0].x][controller.AI[0].y] = map[controller.AI[0].x][controller.AI[0].y].replace("A0", "");
        controller.AI[0].x = ai0Move[1].x;
        controller.AI[0].y = ai0Move[1].y;
        map[ai0Move[1].x][ai0Move[1].y] += "A0";

        map[controller.AI[1].x][controller.AI[1].y] = map[controller.AI[1].x][controller.AI[1].y].replace("A1", "");
        controller.AI[1].x = ai1Move[1].x;
        controller.AI[1].y = ai1Move[1].y;
        map[ai1Move[1].x][ai1Move[1].y] += "A1";

        map[controller.AI[2].x][controller.AI[2].y] = map[controller.AI[2].x][controller.AI[2].y].replace("A2", "");
        controller.AI[2].x = ai2Move[1].x;
        controller.AI[2].y = ai2Move[1].y;
        map[ai2Move[1].x][ai2Move[1].y] += "A2";

        map[controller.AI[3].x][controller.AI[3].y] = map[controller.AI[3].x][controller.AI[3].y].replace("A3", "");
        controller.AI[3].x = ai3Move[1].x;
        controller.AI[3].y = ai3Move[1].y;
        map[ai3Move[1].x][ai3Move[1].y] += "A3";
    }
    console.log(map);
    render();
}


function checkWinBoard(){
    return !(map.some(row => row.includes(".")));
}

function checkWin(){
    let die =false;
    for(i=0; i< controller.AI.length;i++)
    {
        if(controller.player.x === controller.AI[i].x && controller.player.y === controller.AI[i].y)
        {
            map[controller.AI[i].x][controller.AI[i].y] = `A${i}`;
            die = true;
            render();
        }
    }
    if(die)
    {
        deathSound.play();
        document.getElementById("map").remove();
        gameOver.innerHTML = `GAME OVER with ${controller.player.score} points :(`;
        gameOver.style.fontSize = "50px";
        //highScore(controller.player.score);
        clearInterval(timerInterval);
        clearInterval(winInterval);
    }
    else if(checkWinBoard())
    {
        document.getElementById("map").remove();
        gameOver.innerHTML = `YOU WON with ${controller.player.score} points :)`;
        gameOver.style.fontSize = "50px";
        //highScore(controller.player.score);
        clearInterval(timerInterval);
        clearInterval(winInterval);
    }
    else if(!checkWinBoard())
    {
        console.log("FAlSE");
    }else{
        alert("ERROR");
    }
}

/*
function highScore(score)
{
    let scores = localStorage.getItem("scores");
    if(scores !== null){
        localStorage.setItem("scores", score);      
    }
}*/


function init(){
    sketch(10,10);
    map =mazeMap1;
    render();
}


init();


document.addEventListener("keydown",function(e){
    let key = e.code.toString();
    if(key.includes("Arrow"))
    {
        if(!start)
        {
            play();
            start = true;
        }
        let direction = key.substring(5);
        console.log(direction);
        if(direction === "Up")
        {
            controller.player.direction = "UP";
            press(0,-1);
        }
        else if(direction === "Down")
        {
            controller.player.direction = "DOWN";
            press(0,1);
        }
        else if(direction === "Left")
        {
            controller.player.direction = "LEFT";
            press(-1,0);
        }
        else if(direction === "Right")
        {
            controller.player.direction = "RIGHT";
            press(1,0);
        }
        render();
    }
    else{
        return;
    }
})

/*
## :::: Brief PseudoCode ::::

### 2.Cache grid,player position, AI position using DOM.
### 3.Init Screen will have a Play, Highscore, Exit buttons(Image possibly)
### 4.Render out the default of all the Grid(walls,dots,blanks),Player,AI
### 5.Check win condition(grid does not have any dots left) or lose condition(user and one of the AI has the same coordinates)
### 6.use DOM to get keypress event and chanage coordinates of user character.
### 7.Repeat 4-6 until wincondition or losecondition is met.
  ##### if wincondition = true, stage levels up(faster movements on AI)
  ##### if losecondition = true, lives--; player coordinate resets ramdomly inside the grid, player invincible for 3 seconds( seperate invincible timer to make it passby all the if(AICoordinate == playerCoordinate) statements.
  ##### if lives = 0 , pop out "GAME OVER" and go back to the main page.

*/