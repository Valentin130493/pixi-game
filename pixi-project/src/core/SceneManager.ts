import { Application } from "pixi.js";
import { Scene } from "./Scene";

export class SceneManager {
  public app: Application;
  private currentScene?: Scene;

  constructor(app: Application) {
    this.app = app;
  }

  public changeScene(newScene: Scene) {
    if (this.currentScene) {
      this.currentScene.onExit();
      this.app.stage.removeChild(this.currentScene);
    }

    this.currentScene = newScene;
    this.currentScene.onEnter();

    this.app.stage.addChild(this.currentScene);
  }

  public getCurrentScene(): Scene | undefined {
    return this.currentScene;
  }
}
