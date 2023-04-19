(function(){
	//Cronometro
	const minutesEl = document.querySelector("#minutes")
	const secondsEl = document.querySelector("#seconds")
	const milisecondsEl = document.querySelector("#miliseconds")

	let minutes = 0
	let seconds = 0
	let miliseconds = 0
	let interval;
	let finishTime = false

	//Função para formatar o tempo caso for 1 -> transforma pra 01
	function formatTime(time) { 
		return time < 10 ? `0${time}` : time
	}

	function formatMiliseconds(time) {
		return time < 100 ? `${time}`.padStart(3, "0") : time
	}

	var cnv = document.querySelector("canvas");
	var ctx = cnv.getContext("2d");
	
	var WIDTH = cnv.width, HEIGHT = cnv.height;
	
	var LEFT = 37, UP = 38, RIGHT = 39, DOWN = 40;
	var mvLeft = mvUp = mvRight = mvDown = false;
	
	var tileSize = 64;
	var tileSrcSize = 96;
	
	var img = new Image();
		img.src = "Imagens/img.png";

	let menu = document.getElementById("menu")
	let btn = document.getElementById("play")
	let instrucoes = document.getElementById("instrucoes")

	//Musicas
	const mainMusic = document.getElementById("main-music")
	mainMusic.volume = 0.05

	const menuMusic = document.getElementById("menu-music")
	menuMusic.volume = 0.03
	menuMusic.play()
	menuMusic.loop = true

	const victoryMusic = document.getElementById("victory-music")
	victoryMusic.volume = 0.05

	const gameOverMusic = document.getElementById("gameOver-music")
	gameOverMusic.volume = 0.05

	//Botão Play
	btn.addEventListener("click", function() {
		requestAnimationFrame(loop,cnv);
		menu.style.visibility = "hidden"
		instrucoes.style.visibility = "visible"
		mainMusic.loop = true
		mainMusic.play()
		menuMusic.pause()

		interval = setInterval(() => {

			if(!finishTime) {
	
				miliseconds += 10
	
				if(miliseconds === 1000) {
					seconds++
					miliseconds = 0
				}
	
				if(seconds === 60) {
					minutes++
					seconds = 0
				}
	
			}
	
			minutesEl.textContent = formatTime(minutes)
			secondsEl.textContent = formatTime(seconds)
			milisecondsEl.textContent = formatMiliseconds(miliseconds)
	
		}, 10);
	})

	//Armazenando os objetos de parede, chegada e espinhos
	var walls = []
	var finish = {}
	var spikes = []
	
	//Criando o jogador
	var player = {
		x: tileSize + 2,
		y: tileSize + 2,
		width: 24,
		height: 32,
		speed: 2,
		//Atributos de animação
		srcX: 0, //Origem em x
		srcY: tileSrcSize, //Origem em y
		countAnim: 0 //Informa de quanto a quanto tempo eu tenho que mudar o sprite
	};

	//Labirinto
	var num = Math.floor(Math.random() * 4)
	console.log("Labirinto numero: " + num)
	if(num === 0) {
		var maze = [
			[1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
			[1,3,0,0,0,0,0,0,0,1,1,1,0,4,1,0,0,0,4,1],
			[1,0,0,0,4,1,0,0,0,0,0,0,0,0,1,0,0,0,0,1],
			[1,1,1,1,1,1,1,0,1,1,1,1,1,1,1,0,1,0,0,1],
			[1,4,1,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,0,1],
			[1,0,1,0,4,0,0,1,1,1,1,1,1,1,0,4,1,0,0,1],
			[1,0,1,1,1,1,0,1,0,0,1,0,0,0,0,0,1,0,1,1],
			[1,0,1,0,0,0,0,1,0,0,1,0,1,1,1,0,1,0,4,1],
			[1,0,1,0,1,1,1,1,4,0,1,0,0,0,0,0,1,0,4,1],
			[1,0,1,0,0,0,0,1,0,0,1,0,1,1,1,1,1,0,1,1],
			[1,0,0,0,0,0,0,1,0,0,1,0,0,1,0,0,0,0,0,1],
			[1,0,0,0,0,0,0,0,0,0,1,0,0,1,0,1,0,1,0,1],
			[1,0,1,1,1,1,1,1,1,0,1,0,4,1,0,0,0,1,0,1],
			[1,0,0,0,0,1,0,0,1,0,1,0,0,1,1,1,0,1,0,1],
			[1,0,1,0,0,1,4,0,0,0,1,0,0,1,0,0,0,1,0,1],
			[1,0,1,0,0,0,0,0,0,0,1,0,0,1,0,1,0,1,0,1],
			[1,0,1,1,1,1,1,1,1,0,0,0,0,1,0,0,0,1,0,1],
			[1,0,1,0,0,1,0,0,0,0,0,1,0,1,0,0,1,1,4,1],
			[1,4,1,4,0,0,0,1,0,0,0,1,0,0,0,0,0,0,2,1],
			[1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1]
		]
	}
	
	if(num === 1) {
		var maze = [
			[1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
			[1,3,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,1],
			[1,1,1,1,1,1,1,0,1,0,1,1,1,1,1,1,1,1,0,1],
			[1,0,0,0,0,0,0,0,1,0,1,0,0,0,0,0,0,1,0,1],
			[1,0,4,1,1,1,1,1,1,0,1,0,1,0,0,1,0,1,0,1],
			[1,0,0,0,0,0,0,0,1,0,1,0,1,0,0,1,4,1,0,1],
			[1,0,1,1,1,0,1,0,1,0,1,0,1,0,1,1,1,1,0,1],
			[1,0,1,0,0,0,1,0,1,0,0,0,1,0,0,0,0,4,0,1],
			[1,0,1,0,1,1,1,0,1,0,1,0,1,1,1,1,1,1,0,1],
			[1,0,1,0,1,4,1,0,1,0,1,0,1,0,0,0,0,4,0,1],
			[1,0,1,0,1,0,1,0,1,1,1,0,1,0,0,0,0,1,0,1],
			[1,0,1,0,1,0,1,0,1,0,0,0,1,1,1,1,0,1,0,1],
			[1,0,1,0,1,0,1,0,1,0,4,0,1,0,0,0,0,1,0,1],
			[1,0,1,0,1,0,1,0,0,0,0,0,1,0,1,1,1,1,0,1],
			[1,0,1,0,1,0,1,4,0,1,1,1,1,0,0,0,0,1,0,1],
			[1,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,0,1,0,1],
			[1,0,4,1,1,1,1,0,0,0,0,0,0,0,0,0,0,1,0,1],
			[1,0,0,1,0,0,0,0,1,4,1,1,1,1,1,1,1,1,0,1],
			[1,4,0,1,4,0,0,0,1,2,0,0,0,0,0,0,0,0,0,1],
			[1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1]
		]
	}

	if(num === 2) {
		var maze = [
			[1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
			[1,3,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,4,1],
			[1,0,1,1,1,1,1,0,1,0,0,4,0,0,0,0,1,1,1,1],
			[1,0,1,4,1,4,1,0,1,1,1,1,1,1,1,0,4,1,0,1],
			[1,0,1,0,1,0,1,0,1,4,0,0,0,0,0,0,0,1,0,1],
			[1,0,1,0,1,0,0,0,1,0,0,1,0,0,1,0,0,1,0,1],
			[1,0,1,0,1,1,1,0,1,0,0,1,0,0,1,1,0,1,0,1],
			[1,0,0,0,1,0,0,0,1,0,0,1,0,0,1,0,0,1,0,1],
			[1,0,1,0,1,0,1,1,1,0,0,1,0,1,1,0,1,1,0,1],
			[1,0,1,0,1,0,0,0,0,0,0,1,0,0,1,0,0,4,0,1],
			[1,0,1,0,1,0,1,0,4,4,0,1,1,0,1,0,0,0,0,1],
			[1,0,1,0,1,0,1,0,0,0,0,1,0,0,1,0,1,1,1,1],
			[1,0,0,0,0,0,1,0,1,1,0,1,0,1,1,0,0,0,0,1],
			[1,4,0,1,0,0,1,0,0,0,0,1,0,0,4,0,0,1,0,1],
			[1,0,0,1,0,4,1,0,4,0,0,1,0,0,0,0,0,1,0,1],
			[1,0,0,1,0,0,1,0,1,0,1,1,1,1,1,1,0,1,0,1],
			[1,4,0,4,1,0,1,0,1,0,0,0,0,0,1,0,0,1,0,1],
			[1,1,1,0,1,4,1,0,1,0,1,1,1,0,1,0,4,1,0,1],
			[1,2,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,1],
			[1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1]
		]
	}

	if(num === 3) {
		var maze = [
			[1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
			[1,3,1,0,0,0,0,0,0,0,0,0,0,0,0,4,0,4,2,1],
			[1,0,1,1,1,1,1,1,1,1,1,1,0,4,0,0,0,4,0,1],
			[1,0,1,0,0,4,0,0,0,0,0,0,0,1,1,1,1,1,0,1],
			[1,0,1,0,0,0,0,1,0,4,1,0,0,0,0,0,0,1,0,1],
			[1,0,1,0,1,1,1,1,1,1,1,1,1,1,1,1,0,1,0,1],
			[1,0,1,0,4,1,4,0,0,0,1,4,1,0,0,0,0,1,0,1],
			[1,0,1,0,0,1,1,1,1,0,1,0,1,0,0,0,4,1,0,1],
			[1,0,1,1,0,1,0,0,0,0,1,0,1,0,4,0,0,0,0,1],
			[1,0,1,0,0,1,0,4,0,4,1,0,1,0,1,1,1,1,1,1],
			[1,0,1,0,1,1,0,1,0,0,1,0,1,0,4,0,0,0,0,1],
			[1,0,1,0,0,1,0,1,1,0,1,0,1,0,1,1,1,1,0,1],
			[1,0,1,1,0,1,0,1,0,0,1,0,1,0,1,0,0,0,0,1],
			[1,0,1,0,0,1,0,1,0,1,1,0,1,0,0,0,4,0,4,1],
			[1,0,1,0,1,1,0,1,0,0,1,0,1,0,1,0,1,0,0,1],
			[1,0,1,0,1,1,0,1,1,0,1,0,4,1,1,0,1,0,1,1],
			[1,0,1,0,4,1,0,1,0,0,1,0,0,0,1,0,1,0,0,1],
			[1,0,0,0,4,1,0,1,0,0,1,0,1,0,1,0,1,0,1,1],
			[1,4,0,0,0,0,0,1,0,0,0,0,0,0,0,0,1,0,4,1],
			[1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1]
		]
	}

	if(num === 4) {
		var maze = [
			[1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
			[1,3,0,0,0,0,4,0,0,0,1,0,0,0,0,0,0,1,4,1],
			[1,0,0,4,0,0,0,0,0,0,1,0,0,4,1,0,4,1,0,1],
			[1,0,1,1,1,1,1,1,1,0,1,0,1,1,1,1,1,1,0,1],
			[1,0,0,1,4,0,1,4,0,0,1,0,0,0,0,0,0,1,0,1],
			[1,4,0,1,0,0,0,0,0,0,0,0,1,0,1,4,0,1,0,1],
			[1,1,0,1,1,1,1,1,1,1,1,0,1,0,0,0,0,1,0,1],
			[1,0,0,1,4,0,0,0,0,0,1,0,1,1,1,1,0,1,0,1],
			[1,0,4,1,0,0,4,1,1,4,1,0,1,0,0,0,0,1,0,1],
			[1,0,1,1,0,1,1,0,0,2,1,0,1,0,1,0,0,1,0,1],
			[1,0,0,1,0,0,0,0,1,4,1,0,1,0,1,0,0,1,0,1],
			[1,4,0,1,0,4,1,1,1,0,1,0,1,0,1,4,0,1,0,1],
			[1,0,0,1,0,0,0,0,0,0,0,0,1,0,1,0,0,1,0,1],
			[1,0,4,1,0,1,1,1,1,1,1,0,4,0,1,0,1,1,0,1],
			[1,0,1,1,0,0,1,0,0,0,0,0,0,0,1,0,4,1,0,1],
			[1,0,0,1,4,0,1,1,1,1,1,1,1,0,1,0,0,0,0,1],
			[1,0,0,4,0,0,1,4,4,4,1,0,0,0,1,0,1,0,0,1],
			[1,0,1,1,1,0,0,0,0,0,1,0,1,0,4,0,1,0,1,1],
			[1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,4,1],
			[1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1]
		]
	}

	if(num == 5) {
		var maze = [
			[1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
			[1,3,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,1],
			[1,1,1,0,1,1,1,0,0,1,0,0,0,1,0,0,0,0,0,1],
			[1,0,0,0,0,0,1,0,1,1,1,1,1,1,0,1,1,1,1,1],
			[1,1,1,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,1],
			[1,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,1],
			[1,0,0,0,0,0,1,0,0,1,1,1,1,1,1,1,1,1,0,1],
			[1,0,0,0,0,0,1,0,0,1,0,0,0,0,1,0,0,0,0,1],
			[1,0,1,1,1,1,1,0,0,1,0,0,0,0,0,0,0,0,0,1],
			[1,0,0,0,0,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1],
			[1,1,1,1,1,1,1,1,1,1,0,1,1,1,1,1,1,1,1,1],
			[1,0,0,0,0,0,1,0,0,0,0,0,1,0,0,0,0,0,0,1],
			[1,0,0,1,0,0,1,0,0,0,0,0,1,0,0,0,0,0,0,1],
			[1,0,0,1,0,0,1,0,0,0,0,0,1,0,0,0,0,0,0,1],
			[1,0,0,1,0,0,1,1,1,0,1,1,1,1,1,0,1,1,1,1],
			[1,0,0,1,0,0,1,0,0,0,0,0,1,0,0,0,0,0,0,1],
			[1,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,1],
			[1,0,0,1,0,0,1,0,0,0,0,0,1,0,0,0,0,0,0,1],
			[1,0,0,1,0,0,0,0,0,0,0,0,1,0,0,0,0,0,2,1],
			[1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1]
		]
	}
	
	var T_WIDTH = maze[0].length * tileSize,
		T_HEIGHT = maze.length * tileSize;
	
	for(var row in maze){
		for(var column in maze[row]){
			var tile = maze[row][column];
			if(tile === 1){ //Se for igual a 1 armazene uma parede na lista de array
				var wall = {
					x: tileSize*column,
					y: tileSize*row,
					width: tileSize,
					height: tileSize
				};
				walls.push(wall);
			}
			if(tile === 2) { //Se for igual a 2 armazene o objeto chegada
				finish = {
					x: tileSize*column,
					y: tileSize*row,
					width: tileSize,
					height: tileSize
				}
			}
			if(tile === 4) { //Se for igual a 4 armazene o objeto espinho
				var spike = {
					x: tileSize*column,
					y: tileSize*row,
					width: tileSize,
					height: tileSize
				}
				spikes.push(spike)
			}
		}
	}
	
	//Camera do jogador
	var cam = {
		x: 0,
		y: 0,
		width: WIDTH,
		height: HEIGHT,
		innerLeftBoundary: function(){
			return this.x + (this.width*0.25);
		},
		innerTopBoundary: function(){
			return this.y + (this.height*0.25);
		},
		innerRightBoundary: function(){
			return this.x + (this.width*0.75);
		},
		innerBottomBoundary: function(){
			return this.y + (this.height*0.75);
		}
	};

	//Mudar a visibilidade
	function toggleVisablity(id) {
		if (document.getElementById(id).style.visibility == "visible") {
		  document.getElementById(id).style.visibility = "hidden";
		} else {
		  document.getElementById(id).style.visibility = "visible";
		}
	  }
	
	//Verificar se colidiu com a parede
	function blockRectangle(objA,objB){
		var distX = (objA.x + objA.width/2) - (objB.x + objB.width/2); //distancia entre os objetos no eixo x
		var distY = (objA.y + objA.height/2) - (objB.y + objB.height/2); //distancia entre os objetos no eixo y
		
		var sumWidth = (objA.width + objB.width)/2; //Somando a largura total dos objetos
		var sumHeight = (objA.height + objB.height)/2; //Somando a altura total dos objetos
		
		if(Math.abs(distX) < sumWidth && Math.abs(distY) < sumHeight){ //O Math.abs vai retornar sempre um valor positivo(absoluto) || Se isso aqui tudo for verdade, vc teve uma situação de colisão
			var overlapX = sumWidth - Math.abs(distX); //Vai retornar o quanto o player invadiu o espaço em x
			var overlapY = sumHeight - Math.abs(distY); //Vai retornar o quanto o player invadiu o espaço em y
			
			if(overlapX > overlapY){ //Aqui vai descobrir se ele colidiu de cima para baixo ou de baixo para cima
				objA.y = distY > 0 ? objA.y + overlapY : objA.y - overlapY; //Se o muro estava em cima ou em baixo do personagem
			} else {
				//A colisão ocorreu de forma horizontal
				objA.x = distX > 0 ? objA.x + overlapX : objA.x - overlapX; //Se o muro estava a esquerda ou a direita do personagem
			}
		}
	}

	//Verificar se colidiu com a chegada
	function finishGame(objA, objB) {
		var distX = (objA.x + objA.width/2) - (objB.x + objB.width/2);
		var distY = (objA.y + objA.height/2) - (objB.y + objB.height/2);

		var sumWidth = (objA.width + objB.width)/2;
		var sumHeight = (objA.height + objB.height)/2;

		if(Math.abs(distX) < sumWidth && Math.abs(distY) < sumHeight){
			finishTime = true
			victoryMusic.play()
			document.getElementById("instrucoes").style.visibility = "hidden"
			document.getElementById("Tempo").textContent = `Tempo: ${formatTime(minutes)}min ${formatTime(seconds)}s ${formatMiliseconds(miliseconds)}ms`
			requestAnimationFrame(toggleVisablity("victory"), cnv)
		}
	}

	//Verificar se colidiu com os espinhos
	function gameOver(objA, objB) {
		var distX = (objA.x + objA.width/2) - (objB.x + objB.width/2);
		var distY = (objA.y + objA.height/2) - (objB.y + objB.height/2);

		var sumWidth = (objA.width + objB.width)/2;
		var sumHeight = (objA.height + objB.height)/2;

		if(Math.abs(distX) < sumWidth && Math.abs(distY) < sumHeight){
			finishTime = true
			gameOverMusic.play()
			document.getElementById("instrucoes").style.visibility = "hidden"
			requestAnimationFrame(toggleVisablity("gameOver"), cnv)
		}
	}
	
	window.addEventListener("keydown",keydownHandler,false);
	window.addEventListener("keyup",keyupHandler,false);
	
	//Verifica se apertou a tecla
	function keydownHandler(e){
		var key = e.keyCode;
		switch(key){
			case LEFT:
				mvLeft = true;
				break;
			case UP:
				mvUp = true;
				break;
			case RIGHT:
				mvRight = true;
				break;
			case DOWN:
				mvDown = true;
				break;
		}
	}
	
	//Verifica se soltou a tecla
	function keyupHandler(e){
		var key = e.keyCode;
		switch(key){
			case LEFT:
				mvLeft = false;
				break;
			case UP:
				mvUp = false;
				break;
			case RIGHT:
				mvRight = false;
				break;
			case DOWN:
				mvDown = false;
				break;
		}
	}
	
	function update(){

		//Mover Jogador
		if(mvLeft && !mvRight){
			player.x -= player.speed;
			//Ajuste de orientação da animação para esquerda
			player.srcY = tileSrcSize + player.height * 2;
		} else 
		if(mvRight && !mvLeft){
			player.x += player.speed;
			//Ajuste de orientação da animação para direita
			player.srcY = tileSrcSize + player.height * 3;
		}
		if(mvUp && !mvDown){
			player.y -= player.speed;
			//Ajuste de orientação da animação para cima
			player.srcY = tileSrcSize + player.height * 1;
		} else 
		if(mvDown && !mvUp){
			player.y += player.speed;
			//Ajuste de orientação da animação para baixo
			player.srcY = tileSrcSize + player.height * 0;
		}
		
		//Processo de animação
		if(mvLeft || mvRight || mvUp || mvDown){
			player.countAnim++;
			
			//Para que o valor nunca ultrapasse 7(se não captura uma imagem sem nada no img.png)
			if(player.countAnim >= 40){
				player.countAnim = 0;
			}
			
			player.srcX = Math.floor(player.countAnim/5) * player.width; //O 5 é o valor em que a frequencia da imagem vai mudar
		} else { //Parar o persongem se não estiver movimentando
			player.srcX = 0;
			player.countAnim = 0;
		}

		//Verifica se o jogador chegou na linha de chegada
		finishGame(player,finish)
		
		//Verifica todos os muros dentro do array e vai verificar um de cada vez para ver se o jogador colidiu ou não
		for(var i in walls){
			var wall = walls[i];
			blockRectangle(player,wall);
		}

		//Verifica todos os espinhos dentro do array e vai verificar um de cada vez para ver se o jogador colidiu ou não
		for(var i in spikes){
			var spike = spikes[i];
			gameOver(player,spike)
		}
		
		//Mover a camera com o jogador
		if(player.x < cam.innerLeftBoundary()){
			cam.x = player.x - (cam.width * 0.25);
		}
		if(player.y < cam.innerTopBoundary()){
			cam.y = player.y - (cam.height * 0.25);
		}
		if(player.x + player.width > cam.innerRightBoundary()){
			cam.x = player.x + player.width - (cam.width * 0.75);
		}
		if(player.y + player.height > cam.innerBottomBoundary()){
			cam.y = player.y + player.height - (cam.height * 0.75);
		}
		
		cam.x = Math.max(0,Math.min(T_WIDTH - cam.width,cam.x));
		cam.y = Math.max(0,Math.min(T_HEIGHT - cam.height,cam.y));
	}
	
	function render(){
		//Limpar sempre o canvas para não deixar rastros
		ctx.clearRect(0,0,WIDTH,HEIGHT);
		//Salvou o contexto do canvas
		ctx.save();
		//Traduziu a camera para seguir
		ctx.translate(-cam.x,-cam.y);
		//Desenhar as paredes, pontos de partida e chegada
		for(var row in maze){
			for(var column in maze[row]){
				var tile = maze[row][column];
				var x = column*tileSize;
				var y = row*tileSize;
				
				ctx.drawImage(
					img, /* primeiro pega a imagem */
					tile * tileSrcSize, /*a 1 parte pega o que vai ser desenhado em x, nesse caso queremos a parede ou chao então se o tile for 0, pega o chao, ou seja começa no x = 0pixels da imagem e se for 1 vai pegar a partir do x=96pixels da imagem */
					0, /* vai pegar o sempre o y=0 porque queremos parede ou chao, eles estao na primeira linha de 96 pixels(tileSize) da imagem */
					tileSrcSize, 
					tileSrcSize, /* dimensoes da imagem, altura e largura dentro do jogo */
					x,y,tileSize,tileSize /* dimensoes do desenho e coordenadas */
				);
				
			}
		}
		//Desenha o personagem
		ctx.drawImage(
			img,
			player.srcX,player.srcY,player.width,player.height,
			player.x,player.y,player.width,player.height
		);
		//Volta o contexto do canvas
		ctx.restore();
	}
	
	//O canvas inteiro vai gerar em um loop: update, render e chamar o loop de novo
	function loop(){
		update();
		render();
		requestAnimationFrame(loop,cnv);
	}
}());
