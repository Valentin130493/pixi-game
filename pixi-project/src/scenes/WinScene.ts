import { Scene } from "../core/Scene";
import { Text, Graphics, TextStyle } from "pixi.js";

export class WinScene extends Scene {
  private stars: number;
  private onNextLevel: () => void;

  constructor(stars: number, onNextLevel: () => void) {
    super();
    this.stars = stars;
    this.onNextLevel = onNextLevel;
  }

  onEnter() {
    const bg = new Graphics();
    bg.beginFill(0x000000, 0.7);
    bg.drawRect(0, 0, 800, 600);
    bg.endFill();
    this.addChild(bg);

    const winText = new Text("Victory!", {
      fontSize: 48,
      fill: 0x00ff00,
    });
    winText.anchor.set(0.5);
    winText.x = 400;
    winText.y = 150;
    this.addChild(winText);

    const starsText = new Text("★".repeat(this.stars), {
      fontSize: 64,
      fill: 0xffff00,
    });
    starsText.anchor.set(0.5);
    starsText.x = 400;
    starsText.y = 250;
    this.addChild(starsText);

    const nextBtn = new Text(
      "Next Level",
      new TextStyle({
        fontSize: 32,
        fill: 0xffffff,
        stroke: 0x000000,
      }),
    );
    nextBtn.anchor.set(0.5);
    nextBtn.x = 400;
    nextBtn.y = 450;
    nextBtn.eventMode = "static";
    nextBtn.cursor = "pointer";
    nextBtn.on("pointerdown", () => this.onNextLevel());
    this.addChild(nextBtn);
  }

  onExit() {
    this.removeChildren();
  }
}
