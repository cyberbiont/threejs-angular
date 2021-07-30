import * as dat from "three/examples/jsm/libs/dat.gui.module.js";
import Dat from "three/examples/jsm/libs/dat.gui.module.js";
import init from "three-dat.gui"; // Import initialization method
import * as THREE from "three";

export function getGUI() {
  init(Dat);
  const gui = new Dat.GUI();
  const material = new THREE.MeshStandardMaterial();
  gui.addMaterial("standard_material", material);
  return gui;
}
