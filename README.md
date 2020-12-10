# Jac-Man
Jay's Pac-Man

Classic game of Pac-man.
#
##### User is able to move around the pac-man all directions: up,down,left,right. 
##### 4 individual computer(AI) pacs will calculate the User's coordinates and follow the User. 
##### Each Map(grid style board) will be mazed and walled(blocked so user or the AI cannot go through).
#
##### Winning condition for every stage would be collecting all the dots(points) on the map.
##### Losing condition would be dying out of lives given(3 at default).***ONLY IMPLEMENTED 1 LIFE YET
#
##### Clearing the whole set of stages will be the ultimate win condition for the whole game.









## :::: Brief PseudoCode ::::
### 1.declare const variable => 
  ##### mazeMap(2D array),stageMap(array of mazeMap)
  ##### controller(object with player,AI : considering coordinates and status in object),
  ##### direction(object with up,down,left,right :ex) up : x+0y+1 to coordinates),
  ##### score object = {points = 0,
  ##### lives =3,stage=1(default) goes up to 10}
  ##### AISpeed = 0.5(moves 1 block per 1 seconds)
  ##### timer(increments every second for calculating movements with AIspeed)
### 2.Cache grid,player position, AI position using DOM.
### 3.Init Screen will have a Play, Highscore, Exit buttons(Image possibly)
### 4.Render out the default of all the Grid(walls,dots,blanks),Player,AI
### 5.Check win condition(grid does not have any dots left) or lose condition(user and one of the AI has the same coordinates)
### 6.use DOM to get keypress event and chanage coordinates of user character.
### 7.Repeat 4-6 until wincondition or losecondition is met.
  ##### if wincondition = true, stage levels up(faster movements on AI)
  ##### if losecondition = true, lives--; player coordinate resets ramdomly inside the grid, player invincible for 3 seconds( seperate invincible timer to make it passby all the if(AICoordinate == playerCoordinate) statements.
  ##### if lives = 0 , pop out "GAME OVER" and go back to the main page.







## CLICK THIS LINK TO PLAY
https://pages.git.generalassemb.ly/bhj0308/Jac-Man/



  

