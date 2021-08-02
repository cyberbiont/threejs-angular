import * as THREE from "three";

import { TAObject } from "../lib/types";

export default class Planet implements TAObject {
  private geometry: THREE.SphereGeometry;
  private material: THREE.MeshBasicMaterial;
  public mesh: THREE.Mesh;
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
    this.name = name;
    this.rotationSpeed = rotationSpeed;
    this.geometry = new THREE.SphereGeometry(radius, quality, quality);
    this.material = new THREE.MeshBasicMaterial({ map: this.texture });
    this.mesh = new THREE.Mesh(this.geometry, this.material);
  }

  add(scene: THREE.Object3D) {
    scene.add(this.mesh);
    return this;
  }

  animate() {
    this.mesh.rotation.y += this.rotationSpeed;
    return this;
  }

  get() {
    return this.mesh;
  }
}
