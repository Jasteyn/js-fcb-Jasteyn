// variables are storage of values
// variables - resuable names that represent values

let board;
let score = 0;
let rows = 4;
let columns = 4;

// This variables will be used to assure that the player, will be congratualted only one time after reaching 2048, 4096, 8192
let is2048Exist = false;
let is4096Exist = false;
let is8192Exist = false;

let startX = 0;
let startY = 0;
// function - reusable tasks
function setGame(){
// Goal, we will use this backend board to create our fronted board.
	board = [
		[0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0]
    ];

// loop are code to repeat the taks inside it, until it fulfill/completed the whole taks (in our context, until our board will have a tile with there proper colors)
	for (let r=0; r < rows; r++){

		for (let c=0; c < columns; c++){
			// create and design a title

// Created tile using div
			let tile = document.createElement ("div");
// each tile will have an invisible id
			tile.id = r.toString() + "-" + c.toString();

// Number of the tile 
			let num = board [r][c];

			updateTile (tile, num);

			document.getElementById("board").append(tile)
		}
	}                  

		setTwo();
		setTwo();
}


// updatetile() - updates the appearance of the tile (that it should have a tile number and background color)
function updateTile (tile, num)
{

	tile.innerText = "";
	tile.classList.value = "";

	tile.classList.add ("tile");

// updateTile() uses our prepared styles in style.css
if (num>0){
	tile.innerText = num.toString();

if (num<=4096){
	//class ->x2, class ->x4, class ->x8, class ->x16, 
	tile.classList.add("x"+ num.toString());
	}
	else{
		tile.classList.add("x8192");
	}
}
}
window.onload = function(){
	setGame();
}

function handleSlide(event){
// event.code - is the pressed key in our keyboard
	console.log(event.code); 	

	if (["ArrowLeft","ArrowRight", "ArrowUp", "ArrowDown"].includes(event.code)){

		event.preventDefault(); //prevents the default behavior in our browser, when pressing arrow keys (default behavior to prevent: whenever pressing arrow keys, the wole game also joins in sliding);

		if (event.code == "ArrowLeft"){
			slideLeft();
			setTwo();
		}
		else if (event.code == "ArrowRight"){
			slideRight();
			setTwo();
		}
		else if (event.code == "ArrowUp"){
			slideUp();
			setTwo();
		}
		else if (event.code == "ArrowDown"){
			slideDown();
			setTwo();
		}

	}
 		checkWin ();

 		if(hasLost() == true){
 			alert ("WA NA PILDI NAKA!!");
 			restartGame();
 			alert("Click any arrow key to restart");
 		}

 		document.getElementById("score").innerText = score;
}
document.addEventListener("keydown", handleSlide);

function slideLeft(){
//SLiding the row
for(let r=0; r<rows; r++){
	let row = board[r];
	let originalRow = row.slice();
	row = slide(row); //slideLeft() function uses slide () function to merge tiles with the same values.


	board[r] = row;
	

	for(let c = 0; c<columns; c++){

		//this code is to retrieve our tile element
		let tile = document.getElementById(r.toString() + "-" + c.toString());

			let num = board[r][c];

			//Animation code
			if(originalRow[c]!==num&&num!==0){
				tile.style.animation = "slide-from-right 0.3s";
				setTimeout(()=> {tile.style.animation ="";}, 300);
			}
		//updates the appearance of the tile
		updateTile(tile, num);

		}
	}
}

function slideRight(){
//SLiding the row
for (let r=0; r < rows; r++){
	let row = board [r];
	let originalRow = row.slice();
	row.reverse();
	row = slide(row); 
	row.reverse();

	board [r]=row;

	for (let c=0; c < columns; c++){

		//this code is to retrieve our tile element
		let tile = document.getElementById(r.toString() + "-" + c.toString());

		let num = board [r][c];

		//Animation code
			if(originalRow[c]!==num&&num!==0){
				tile.style.animation = "slide-from-right 0.3s";
				setTimeout(()=> {tile.style.animation ="";}, 300);
			}
		//updates the appearance of the tile
		updateTile(tile, num);
		}
	}
}
function slideUp(){

	for(let c=0; c<columns; c++){

		let col = [ board[0][c], board[1][c], board[2][c], board[3][c] ];

		let originalCol = col.slice();
		col = slide(col); // slideUp() function uses slide() function to merge tiles with the same values.

		let changeIndices = [];
		for(let r=0; r<rows; r++){
			if(originalCol[r] !== col[r]){
				changeIndices.push(r);
			}
		}
		
		for(let r = 0; r<rows; r++){

			board[r][c] = col[r];

			// this code is the retrieve our tile element
			let tile = document.getElementById(r.toString() + "-" + c.toString());

			let num = board[r][c];

			if(changeIndices.includes(r) && num!==0){
				tile.style.animation = "slide-from-bottom 0.3s";
				setTimeout(()=>{
					tile.style.animation = "";
				}, 300)
			}


			// Updates the appearance of the tile
			updateTile(tile, num);
		}
	}
}
function slideDown(){

	for(let c=0; c<columns; c++){

		let col = [ board[0][c], board[1][c], board[2][c], board[3][c] ];

		let originalCol = col.slice();

		col.reverse();
		col = slide(col);
		col.reverse(); // slideDown() function uses slide() function to merge tiles with the same values.

		let changedIndices = [];
		for(let r=0; r<rows; r++){
			if(originalCol[r] !== col[r]){
				changedIndices.push(r);
			}
		}

		for(let r = 0; r<rows; r++){

			board[r][c] = col[r];

			// this code is the retrieve our tile element
			let tile = document.getElementById(r.toString() + "-" + c.toString());

			let num = board[r][c];

			// Animation Code:
			if(changedIndices.includes(r) && num!==0){
				tile.style.animation = "slide-from-top 0.3s";
				setTimeout(()=>{
					tile.style.animation = "";
				}, 300)
			}

      //updates the appearance of the tile
		updateTile(tile, num);
		}
	}
}
//filterZero - removes the zeroes
function filterZero(row){
	return row.filter(num=>num !=0);
}
// slide function merges the same adjacent tile
// Core function for sliding and merging tiles 
function slide(row){
	row=filterZero(row);
	for (let i=0; i<row.length - 1; i++){
		if (row [i] == row[i+1]){
			row[i]*=2;
			row[i+1]=0;
			score += row[i];
		}
	}
	// Add zeroes back
	while(row.length < columns){
		row.push(0)
	}
	return row;
}

//hasEmptyTile checks the game board if it contains any empty (zero) tiles.
function hasEmptyTile(){

	// Whenever we want to create changes in each tiles use this code
	// Whenever we want to evaulate each tiles use this code
	for(let r=0; r<rows; r++){
		for(let c=0; c<rows; c++){
			if (board [r][c]==0){
				return true;
			}

		}

	}
	return false;
}

function setTwo(){

	//if hasEmptuTile() function returns flase, the setTwo() function will not generate a new tile
	if(hasEmptyTile()==false){
		return; //will not generate a new tile
	}
//the codes below will be working once the condition above is not satisfied
let found = false;

while(!found){

	// This code is to generate a random row and column position to generate a random #2.
	let r = Math.floor(Math.random() *rows);
	let c = Math.floor(Math.random() *columns);

	// if the random tile is an empty tile, the program will make it a tile with #2
	if(board[r][c]==0){

		//the random vacant tile becomes 2
		board[r][c]=2;

		let tile = document.getElementById(r.toString()+ "-" + c.toString());
		tile.innerText = "2";
		tile.classList.add("x2");

		found = true;
	}
}
}

function checkWin(){
	for (let r=0; r < rows; r++){
		for (let c=0; c < columns; c++){

			if(board[r][c]==2048 && is2048Exist == false){
				alert("NAKS 2048 NA!");
				is2048Exist = true;
			}
			else if (board [r][c] == 4096 && is4096Exist == false){
				alert ("AH GARAA! DULA PA");
				is4096Exist = true;
			}
			else if (board [r][c] == 48198 && is8192Exist == false){
				alert ("AH GARAA! DULA PA");
				is8192Exist = true;
			}
		}
	}

}

function hasLost(){
	for (let r=0; r < rows; r++){
		for (let c=0; c < columns; c++){

//If there is an empty tile, the player has not yet lose the game 
			if(board[r][c]==0){
				return false;
			}
			const currentTile = board [r][c];

			if(
				//Check the current tile if it has a possible merge in its upper tile.
				r > 0 && board[r-1][c] === currentTile ||
				//Check the current tile if it has a possible merge in its lower tile.
				r < rows - 1 && board[r+1][c] === currentTile ||
				//Check the current tile if it has a possible merge in its left tile.
				c > 0 && board[r][c-1] === currentTile ||
				//Check the current tile if it has a possible merge in its right tile.
				c < columns - 1 && board[r][c+1] === currentTile
			){
				return false;
			}
		}
	}
			return true;
}

function restartGame(){

	//This loop is responsible to change each tile values to zero.
	for (let r=0; r < rows; r++){
		for (let c=0; c < columns; c++){
			board [r][c]=0;
		}
	}
	score = 0;
	setTwo();	//New Tile
}

document.addEventListener('touchstart', (event) =>{
	startX = event.touches[0].clientX;
	StartY = event.touches[0].clientY;
})

document.addEventListener('touchstart', (event) =>{
	startX = event.touches[0].clientX;
	startY = event.touches[0].clientY;
})

document.addEventListener('touchend', (event) => {

	if(!event.target.className.includes("tile")){
		return; // "I will do nothing, since you haven't touched a tile"
	}

	// touchstart - touchend
	let diffX = startX - event.changedTouches[0].clientX;
	let diffY = startY - event.changedTouches[0].clientY;

	if(Math.abs(diffX) > Math.abs(diffY)){
		if(diffX > 0 ){
			slideLeft();
			setTwo();
		}
		else{
			slideRight();
			setTwo();
		}
	}
	else{

		if(diffY > 0 ){
			slideUp();
			setTwo();
		}
		else{
			slideDown();
			setTwo();
	}

	document.getElementById('score').innerText = score;

	checkWin ();

 		if(hasLost() == true){
 			alert ("WA NA PILDI NAKA!!");
 			restartGame();
 			alert("Click any arrow key to restart");
 	}	}

});

document.addEventListener('touchmove', (event)=>{
	if(!event.target.className.includes("tile")){
		return; // "I will do nothing, since the player/user does not touch a tile"
	}

	event.preventDefault();

}, {passive: false}); // Use passive: false, to make preventDefault() work
