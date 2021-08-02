// import Dat from "three/examples/jsm/libs/dat.gui.module.js";
import * as Dat from "dat.gui";
import * as THREE from "three";

import init from "three-dat.gui"; // Import initialization method

export function getGUI() {
  init(Dat);
  const gui = new Dat.GUI();
  const material = new THREE.MeshStandardMaterial();
  gui.addMaterial("standard_material", material);
  return gui;
}
