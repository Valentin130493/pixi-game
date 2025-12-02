import { Container } from "pixi.js";

export abstract class Scene extends Container {
  abstract onEnter(): void;
  abstract onExit(): void;
  update(delta?: number) {
    delta;
  }
}
