import { Scene } from "../core/Scene";
import { Text, Graphics, TextStyle } from "pixi.js";

export class FailScene extends Scene {
  private onRetry: () => void;

  constructor(onRetry: () => void) {
    super();
    this.onRetry = onRetry;
  }

  onEnter() {
    // Полупрозрачный фон
    const bg = new Graphics();
    bg.beginFill(0x000000, 0.7);
    bg.drawRect(0, 0, 800, 600);
    bg.endFill();
    this.addChild(bg);

    // Текст "Game Over"
    const failText = new Text("Time's up! You failed!", {
      fontSize: 48,
      fill: 0xff0000,
    });
    failText.anchor.set(0.5);
    failText.x = 400;
    failText.y = 150;
    this.addChild(failText);

    // Кнопка Replay
    const replayBtn = new Text(
      "Replay",
      new TextStyle({
        fontSize: 32,
        fill: 0xffffff,
        stroke: 0x000000,
      }),
    );
    replayBtn.anchor.set(0.5);
    replayBtn.x = 400;
    replayBtn.y = 400;
    replayBtn.eventMode = "static";
    replayBtn.cursor = "pointer";

    // Обработка клика
    replayBtn.on("pointerdown", () => {
      this.onRetry();
    });

    this.addChild(replayBtn);
  }

  onExit() {
    this.removeChildren();
  }
}
