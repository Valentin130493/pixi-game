import { Application, Ticker } from "pixi.js";
import { SceneManager } from "./core/SceneManager";
import { MenuScene } from "./scenes/MenuScene";
import { GameScene, LevelConfig } from "./scenes/GameScene";
import { AssetLoader } from "./core/AssetLoader";

(async () => {
  const app = new Application();
  await app.init({
    background: "#1099bb",
    width: window.innerWidth,
    height: window.innerHeight,
    resizeTo: window,
  });

  document.getElementById("pixi-container")!.appendChild(app.view);

  const sceneManager = new SceneManager(app);

  const startGame = async (levelNumber: number = 1) => {
    const levels = await AssetLoader.loadJSON<LevelConfig[]>(
      "/assets/levels.json",
    );
    const levelConfig = levels[levelNumber - 1];
    sceneManager.changeScene(
      new GameScene(levelConfig, sceneManager, levelNumber, levels),
    );
  };

  const menu = new MenuScene(() => startGame(1));
  sceneManager.changeScene(menu);

  app.ticker.add((ticker: Ticker) => {
    const scene = sceneManager.getCurrentScene();
    scene?.update(ticker.deltaMS / (1000 / 60));
  });
})();
