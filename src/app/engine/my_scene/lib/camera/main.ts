import * as THREE from "three";

export default class TACamera extends THREE.Camera {
  constructor(private scene: THREE.Scene) {
    super();
    // THREE.PerspectiveCamera
    scene.add(this);
  }
}
