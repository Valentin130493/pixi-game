import { Scene } from "../core/Scene";
import { Text, Graphics } from "pixi.js";

export class FinalScene extends Scene {
  private elapsed = 0;
  private button!: Graphics;
  private btnLabel!: Text;

  constructor(private onRestart: () => void) {
    super();
  }

  onEnter() {
    const bg = new Graphics();
    bg.beginFill(0x333333, 0.8);
    bg.drawRect(0, 0, 800, 600);
    bg.endFill();
    this.addChild(bg);

    const label = new Text("All levels were finished! Congratulations", {
      fontSize: 36,
      fill: 0xffff00,
      fontWeight: "bold",
    });
    label.anchor.set(0.5);
    label.x = 400;
    label.y = 200;
    this.addChild(label);

    this.button = new Graphics();
    this.button.beginFill(0xff6600);
    this.button.drawRoundedRect(0, 0, 200, 60, 10);
    this.button.endFill();
    this.button.x = 300;
    this.button.y = 350;
    this.button.interactive = true;
    this.button.on("pointerdown", () => this.onRestart());
    this.addChild(this.button);

    this.btnLabel = new Text("Try again", {
      fontSize: 24,
      fill: 0xffffff,
    });
    this.btnLabel.anchor.set(0.5);
    this.btnLabel.x = this.button.x + 100;
    this.btnLabel.y = this.button.y + 30;
    this.addChild(this.btnLabel);
  }

  update(delta?: number) {
    if (!delta) return;
    this.elapsed += delta / 60;
    const scale = 1 + Math.sin(this.elapsed * 2) * 0.05;
    this.button.scale.set(scale);
    this.btnLabel.scale.set(scale);
  }

  onExit() {
    this.removeChildren();
  }
}
