import * as THREE from "three";

import Loaders from "../loaders";
export default class TAScene extends THREE.Scene {
  constructor(private loaders: Loaders) {
    super();
    this.addTexture();
  }

  async addTexture() {
    this.background = await this.loaders.loadTexture(
      "https://raw.githubusercontent.com/dahfazz/Solar/master/textures/space.jpg"
    );
  }
}
