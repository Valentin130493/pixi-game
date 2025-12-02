import { AnimatedSprite, Texture } from "pixi.js";

export class Enemy extends AnimatedSprite {
  private vx: number;
  private vy: number;
  private onKill: () => void;

  constructor(
    textures: Texture[],
    x: number,
    y: number,
    onKill: () => void,
    speed: number = 1,
  ) {
    super(textures);

    this.x = x;
    this.y = y;

    const angle = Math.random() * Math.PI * 2;
    this.vx = Math.cos(angle) * speed * 2;
    this.vy = Math.sin(angle) * speed * 2;

    this.onKill = onKill;

    this.interactive = true;
    this.cursor = "pointer";

    this.on("pointerdown", () => this.kill());

    this.animationSpeed = 0.2;
    this.play();
  }

  kill() {
    this.parent?.removeChild(this);
    this.onKill();
  }

  move(delta: number) {
    this.x += this.vx * delta * 0.2;
    this.y += this.vy * delta * 0.2;

    if (this.x < 0) {
      this.x = 0;
      this.vx *= -1;
    }
    if (this.x > 800 - this.width) {
      this.x = 800 - this.width;
      this.vx *= -1;
    }
    if (this.y < 0) {
      this.y = 0;
      this.vy *= -1;
    }
    if (this.y > 600 - this.height) {
      this.y = 600 - this.height;
      this.vy *= -1;
    }
  }
}
