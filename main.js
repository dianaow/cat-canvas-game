console.log('loading in main.js');

const gameEngine = new GameEngine();

const ASSET_MANAGER = new AssetManager();

ASSET_MANAGER.queueDownload("./Cats/white-sprite.png");
ASSET_MANAGER.queueDownload("./Cats/orange-sprite.png");
ASSET_MANAGER.queueDownload("./Cats/food.png");
ASSET_MANAGER.queueDownload("./Cats/yarn.png");

ASSET_MANAGER.downloadAll(() => {
	const canvas = document.getElementById("gameWorld");
	const ctx = canvas.getContext("2d");

	function resizeCanvas() {
		canvas.width = window.innerWidth;
		canvas.height = window.innerHeight;
	}
	
	resizeCanvas();
	//window.addEventListener("resize", resizeCanvas);

	document.getElementById("start-btn").onclick = function() { 
		document.getElementById("menu").style.display = "none";

		gameEngine.init(ctx);

		for (let id = 0; id < 6; id++) {
			let white_cat = new Cat(gameEngine, getCoordsX(Math.random() * canvas.width), getCoordsY(Math.random() * canvas.height), 'white', id + '-white');
			let orange_cat = new Cat(gameEngine, getCoordsX(Math.random() * canvas.width), getCoordsY(Math.random() * canvas.height), 'orange', id + '-orange');
			gameEngine.addEntity(white_cat);
			gameEngine.addEntity(orange_cat);
		}
	
		let food_bowl = new Food(gameEngine, canvas.width/2 - 50, canvas.height/2);
		let toy = new Toy(gameEngine, canvas.width/2 + 50, canvas.height/2);
		gameEngine.addEntity(food_bowl);
		gameEngine.addEntity(toy);
	
		gameEngine.addEntity(new Cage(gameEngine, canvas.width * 0.4, canvas.height * 0.4, canvas.width * 0.2, 10));
		gameEngine.addEntity(new Cage(gameEngine, canvas.width * 0.6, canvas.height * 0.4, 10, canvas.height * 0.2));
		gameEngine.addEntity(new Cage(gameEngine, canvas.width * 0.4, canvas.height * 0.6, canvas.width * 0.2, 10));
		gameEngine.addEntity(new Cage(gameEngine, canvas.width * 0.4, canvas.height * 0.4, 10, canvas.height * 0.2));
	
		gameEngine.start();
	}

	function getCoordsX(x){
		if(x >= canvas.width * 0.4 && x <= canvas.width* 0.6){
			return canvas.width * 0.4 - 90
		} else if (x < 64 || x > (canvas.width - 64)){
			return 90
		} else {
			return x
		}
	}
	
	function getCoordsY(y){
		if(y >= canvas.height * 0.4 && y <= canvas.height * 0.6){
			return canvas.height * 0.4 - 90
		} else if (y < 64 || y > (canvas.height - 64)){
			return canvas.height - 90
		} else {
			return y
		}
	}
});
