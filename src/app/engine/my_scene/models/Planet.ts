import * as THREE from "three";

import { TAAnimatable } from "../lib/types";

// this is an example of custom class that extends basic Mesh class
// with predefined geometry / material type and custon animation method
export default class Planet extends THREE.Mesh implements TAAnimatable  {
  private rotationSpeed: number;

  constructor(
    public name: string,
    public texture: THREE.Texture,
    {
      radius = 1,
      quality = 32,
      rotationSpeed = 0.002,
    }: {
      radius?: number;
      quality?: number;
      rotationSpeed?: number;
    } = {}
  ) {
    super(
      new THREE.SphereGeometry(radius, quality, quality),
      new THREE.MeshBasicMaterial({ map: texture })
    );
    this.name = name;
    this.rotationSpeed = rotationSpeed;
  }

  addToScene(scene: THREE.Object3D) {
    scene.add(this);
    return this;
  }

  animate() {
    this.rotation.y += this.rotationSpeed;
    return this;
  }
}
