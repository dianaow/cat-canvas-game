console.log('loading in main.js');

const gameEngine = new GameEngine();

const ASSET_MANAGER = new AssetManager();

ASSET_MANAGER.queueDownload("./Cats/white-sprite.png");
ASSET_MANAGER.queueDownload("./Cats/orange-sprite.png");

ASSET_MANAGER.downloadAll(() => {
	const canvas = document.getElementById("gameWorld");
	const ctx = canvas.getContext("2d");

	gameEngine.init(ctx);

	gameEngine.start();

	let white_cat = new Cat(gameEngine, 400, 400, 'white', true);
	let orange_cat = new Cat(gameEngine, 100, 100, 'orange', false);
	gameEngine.addEntity(white_cat);
	gameEngine.addEntity(orange_cat);
});