import { Assets, Texture } from "pixi.js";

export class AssetLoader {
  static async loadTexture(path: string): Promise<Texture> {
    const texture = await Assets.load(path);
    console.log(texture, "ttttt");
    return texture as Texture;
  }

  static async loadJSON<T>(path: string): Promise<T> {
    const response = await fetch(path);
    const data = await response.json();
    return data as T;
  }
}
