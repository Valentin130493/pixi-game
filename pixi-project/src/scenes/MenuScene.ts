import { Scene } from "../core/Scene";
import { Text } from "pixi.js";

export class MenuScene extends Scene {
  private onStart: () => void;

  constructor(onStart: () => void) {
    super();
    this.onStart = onStart;
  }

  onEnter(): void {
    const title = new Text("My Pixi Game", {
      fontSize: 42,
      fill: 0xffffff,
    });
    title.anchor.set(0.5);
    title.x = 400;
    title.y = 150;
    this.addChild(title);

    const startBtn = new Text("START", {
      fontSize: 36,
      fill: 0xffff00,
    });
    startBtn.anchor.set(0.5);
    startBtn.x = 400;
    startBtn.y = 350;
    startBtn.eventMode = "static";
    startBtn.cursor = "pointer";

    startBtn.on("pointerdown", () => {
      this.onStart();
    });

    this.addChild(startBtn);
  }

  onExit(): void {
    this.removeChildren();
  }
}
