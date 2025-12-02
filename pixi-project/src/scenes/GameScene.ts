import { Scene } from "../core/Scene";
import { AssetLoader } from "../core/AssetLoader";
import { Sprite, Text, Graphics } from "pixi.js";
import { Enemy } from "../entities/Enemy";
import { WinScene } from "./WinScene";
import { SceneManager } from "../core/SceneManager";
import { FailScene } from "./FailScene";
import { MenuScene } from "./MenuScene";
import { FinalScene } from "./FinalScene";

export interface LevelConfig {
  background: string;
  time: number;
  boosterTime: number;
  enemyCount: number;
  enemySpeed: number;
}

export class GameScene extends Scene {
  private sceneManager: SceneManager;
  private level: LevelConfig;
  private currentLevel: number;
  private enemiesKilled = 0;
  private timer = 0;
  private timerText!: Text;
  private enemyInfo!: Text;
  private elapsed = 0;
  private boosterAdded = 0;
  private allLevels: LevelConfig[];
  private boosterUsed = false;
  private boosterBtn!: Graphics;
  private boosterLabel!: Text;
  private pauseBtn!: Graphics;
  private pauseLabel!: Text;
  private isPaused = false;

  constructor(
    levelConfig: LevelConfig,
    sceneManager: SceneManager,
    currentLevel: number,
    allLevels: LevelConfig[],
  ) {
    super();
    this.level = levelConfig;
    this.sceneManager = sceneManager;
    this.currentLevel = currentLevel;
    this.allLevels = allLevels;
  }

  async onEnter() {
    this.elapsed = 0;
    this.timer = this.level.time;
    this.boosterAdded = 0;
    this.enemiesKilled = 0;
    this.boosterUsed = false;

    const bgTexture = await AssetLoader.loadTexture(this.level.background);
    const bg = new Sprite(bgTexture);
    bg.width = 800;
    bg.height = 600;
    this.addChild(bg);

    const label = new Text(`Level ${this.currentLevel}`, {
      fontSize: 32,
      fill: 0xffffff,
    });
    label.anchor.set(0.5);
    label.x = 400;
    label.y = 50;
    this.addChild(label);

    const enemyTexture = await AssetLoader.loadTexture("/assets/bunny.png");
    const enemyTextures = [enemyTexture];

    this.enemyInfo = new Text(`Enemies: 0/${this.level.enemyCount}`, {
      fontSize: 24,
      fill: 0xffcc00,
    });
    this.enemyInfo.x = 20;
    this.enemyInfo.y = 20;
    this.addChild(this.enemyInfo);

    this.timerText = new Text(`Time: ${Math.ceil(this.timer)}`, {
      fontSize: 24,
      fill: 0xffffff,
    });
    this.timerText.x = 580;
    this.timerText.y = 20;
    this.addChild(this.timerText);

    for (let i = 0; i < this.level.enemyCount; i++) {
      const x = Math.random() * 700 + 50;
      const y = Math.random() * 500 + 50;

      const enemy = new Enemy(
        enemyTextures,
        x,
        y,
        () => {
          this.enemiesKilled++;
          this.enemyInfo.text = `Enemies: ${this.enemiesKilled}/${this.level.enemyCount}`;
          if (this.enemiesKilled === this.level.enemyCount) this.onLevelWin();
        },
        this.level.enemySpeed,
      );

      this.addChild(enemy);
    }

    this.createBoosterButton();
    this.createPauseButton();
  }

  createBoosterButton() {
    this.boosterBtn = new Graphics();
    this.boosterBtn.beginFill(0x00ccff);
    this.boosterBtn?.drawRoundedRect(0, 0, 70, 40, 10);
    this.boosterBtn?.endFill();
    this.boosterBtn.x = 700;
    this.boosterBtn.y = 15;
    this.boosterBtn.interactive = true;
    this.boosterBtn.cursor = "pointer";
    this.boosterBtn.on("pointerdown", () => this.useBooster());
    this.addChild(this.boosterBtn);

    this.boosterLabel = new Text(`+${this.level.boosterTime}s`, {
      fontSize: 20,
      fill: 0xffffff,
    });
    this.boosterLabel.anchor.set(0.5);
    this.boosterLabel.x = this.boosterBtn.x + 35;
    this.boosterLabel.y = this.boosterBtn.y + 20;
    this.addChild(this.boosterLabel);
  }

  createPauseButton() {
    this.pauseBtn = new Graphics();
    this.pauseBtn.beginFill(0x00ffcc);
    this.pauseBtn.drawRoundedRect(0, 0, 70, 40, 10);
    this.pauseBtn.endFill();
    this.pauseBtn.x = 500;
    this.pauseBtn.y = 15;
    this.pauseBtn.interactive = true;
    this.pauseBtn.cursor = "pointer";
    this.pauseBtn.on("pointerdown", () => this.togglePause());
    this.addChild(this.pauseBtn);

    this.pauseLabel = new Text("⏸", { fontSize: 24, fill: 0xffffff });
    this.pauseLabel.anchor.set(0.5);
    this.pauseLabel.x = this.pauseBtn.x + 35;
    this.pauseLabel.y = this.pauseBtn.y + 20;
    this.addChild(this.pauseLabel);
  }

  useBooster() {
    if (this.boosterUsed) return;
    this.boosterUsed = true;
    this.boosterAdded += this.level.boosterTime;
    this.boosterBtn.alpha = 0.5;
    this.boosterLabel.text = "Used";
    this.boosterBtn.cursor = "not-allowed";
  }

  togglePause() {
    this.isPaused = !this.isPaused;
    this.pauseLabel.text = this.isPaused ? "▶" : "⏸";
    this.pauseBtn.clear();
    this.pauseBtn.beginFill(this.isPaused ? 0xff6600 : 0x00ffcc);
    this.pauseBtn.drawRoundedRect(0, 0, 70, 40, 10);
    this.pauseBtn.endFill();
  }

  update(delta?: number) {
    if (!delta) return;
    if (this.isPaused) return;

    this.elapsed += delta / 60;
    this.timer = this.level.time - this.elapsed;
    if (this.boosterAdded) {
      this.timer = this.level.time - this.elapsed + this.boosterAdded;
    }
    if (this.timer < 0) this.timer = 0;

    if (this.timerText) this.timerText.text = `Time: ${Math.ceil(this.timer)}`;
    if (this.enemyInfo)
      this.enemyInfo.text = `Enemies: ${this.enemiesKilled}/${this.level.enemyCount}`;

    this.children.forEach((child) => {
      if (child instanceof Enemy) child.move(delta);
    });

    if (this.timer <= 0) this.onLevelFail();
  }

  onLevelWin() {
    const stars = this.calculateStars();
    this.sceneManager.changeScene(
      new WinScene(stars, () => {
        const nextLevel = this.currentLevel + 1;
        if (nextLevel > this.allLevels.length) {
          this.sceneManager.changeScene(
            new FinalScene(() => {
              this.sceneManager.changeScene(
                new MenuScene(() => {
                  this.sceneManager.changeScene(
                    new GameScene(
                      this.allLevels[0],
                      this.sceneManager,
                      1,
                      this.allLevels,
                    ),
                  );
                }),
              );
            }),
          );
        } else {
          const nextConfig = this.allLevels[nextLevel - 1];
          this.sceneManager.changeScene(
            new GameScene(
              nextConfig,
              this.sceneManager,
              nextLevel,
              this.allLevels,
            ),
          );
        }
      }),
    );
  }

  calculateStars(): number {
    const totalTime = this.level.time;
    const remainingTime = this.timer;
    if (remainingTime >= (totalTime * 2) / 3) return 3;
    if (remainingTime >= totalTime / 3) return 2;
    return 1;
  }

  onLevelFail() {
    this.sceneManager.changeScene(
      new FailScene(() => {
        this.sceneManager.changeScene(
          new GameScene(
            this.level,
            this.sceneManager,
            this.currentLevel,
            this.allLevels,
          ),
        );
      }),
    );
  }

  onExit() {
    this.removeChildren();
  }
}
