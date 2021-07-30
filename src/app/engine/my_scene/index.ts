import * as THREE from "three";

import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import Planet from "src/app/engine/my_scene/models/Planet";
import { PointerLockControls } from "three/examples/jsm/controls/PointerLockControls";
import { TAObject } from "./lib/types";
import TAScene from "./lib/scene";
import Loaders from "./lib/loaders";
import { getGUI } from "./lib/gui/main";

export default class TJSApp {
  private renderer: THREE.WebGLRenderer;
  private camera: THREE.PerspectiveCamera;
  private scene: TAScene;

  private controls: PointerLockControls;
  private gui: unknown;
  // private clock: THREE.Clock;

  private lights: Map<string, THREE.Light>;
  private objects: {
    [category: string]: Map<string, TAObject>;
  } = {};

  private textures: Map<string, THREE.Texture>;
  private geometries: Map<string, THREE.BufferGeometry>;

  constructor(private canvas: HTMLCanvasElement) {
    this.compose();
  }

  animate() {
    Object.values(this.objects).forEach((category) =>
      category.forEach((obj) => obj.animate())
    );

    this.renderer.render(this.scene, this.camera);
  }

  onResize() {
    const width = window.innerWidth;
    const height = window.innerHeight;

    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();

    this.renderer.setSize(width, height);
  }

  private async compose() {
    this.createRenderer();

    const loaders = new Loaders();
    this.scene = new TAScene(loaders);
    this.createCamera();

    this.scene.add(new THREE.AxesHelper(20));
    // this.clock = new THREE.Clock();
    this.createControls();
    this.createGUI();
    this.createLight();

    // this.createObjects();
    this.createPlane();
  }

  private createPlane() {
    const planeGeometry = new THREE.PlaneGeometry(100, 100, 50, 50);
    const material = new THREE.MeshBasicMaterial({
      color: 0x00ff00,
      wireframe: true,
    });
    const plane = new THREE.Mesh(planeGeometry, material);
    plane.rotateX(-Math.PI / 2);
    this.scene.add(plane);
  }

  private createGUI() {
    this.gui = getGUI();
  }

  private createRenderer() {
    this.renderer = new THREE.WebGLRenderer({
      canvas: this.canvas,
      alpha: true, // transparent background
      antialias: true, // smooth edges
    });

    this.renderer.setSize(window.innerWidth, window.innerHeight);
  }

  private createCamera() {
    // this.camera = new THREE.PerspectiveCamera(
    //   75,
    //   window.innerWidth / window.innerHeight,
    //   0.1,
    //   1000
    // );
    // this.camera.position.z = 50;
    // this.scene.add(this.camera);

    this.camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    this.camera.position.y = 1;
    this.camera.position.z = 2;
    this.scene.add(this.camera);
  }

  private createControls() {
    this.controls = new PointerLockControls(
      this.camera,
      this.renderer.domElement
    );
    this.controls.addEventListener("change", () =>
      console.log("Controls Change")
    );
    this.controls.addEventListener("lock", () => console.log("Controls lock"));
    this.controls.addEventListener("unlock", () =>
      console.log("Controls unlock")
    );

    const startButton = document.querySelector(
      "#startButton"
    ) as HTMLDivElement;
    startButton.addEventListener("click", () => this.controls.lock());
    this.controls.addEventListener(
      "lock",
      () => (startButton.style.display = "none")
    );
    this.controls.addEventListener(
      "unlock",
      () => (startButton.style.display = "block")
    );

    const onKeyDown = function (event: KeyboardEvent) {
      switch (event.code) {
        case "KeyW":
          this.controls.moveForward(0.25);
          break;
        case "KeyA":
          this.controls.moveRight(-0.25);
          break;
        case "KeyS":
          this.controls.moveForward(-0.25);
          break;
        case "KeyD":
          this.controls.moveRight(0.25);
          break;
      }
    };
    document.addEventListener("keydown", onKeyDown.bind(this), false);
  }

  private createLight() {
    // soft white light
    const ambientLight = new THREE.AmbientLight(0x404040);
    ambientLight.position.z = 2;
    // this.lights.set("ambient", ambientLight);
    this.scene.add(ambientLight);

    // directional light
    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(-1, 2, 4);
    // this.lights.set("directional", directionalLight);
    this.scene.add(directionalLight);
  }

  public async createObjects() {
    // const geometry = new THREE.BoxGeometry(2, 2, 2);
    // const material = new THREE.MeshPhongMaterial({ color: 0x00ff00 });

    // const cubeA = new THREE.Mesh(geometry, material);
    // cubeA.position.set(6, 6, 0);

    // const cubeB = new THREE.Mesh(geometry, material);
    // cubeB.position.set(-6, -6, 0);

    // //create a group and add the two cubes
    // //These cubes can now be rotated / scaled etc as a group
    // const group = new THREE.Group();
    // group.add(cubeA);
    // group.add(cubeB);

    // this.scene.add(group);

    // https://sbcode.net/topoearth/downloads/moon_texture.5400x2700.jpg
    // this.planets.mars = new Planet(
    //   "Mars",
    //   "https://raw.githubusercontent.com/dahfazz/Solar/master/textures/mars.jpg",
    //   {
    //     radius: 5,
    //   }
    // ).add(this.scene);
    const loaders = new Loaders();
    const texture = await loaders.loadTexture(
      "https://raw.githubusercontent.com/dahfazz/Solar/master/textures/earth.jpg"
    );

    const earth = new Planet("Earth", texture, {
      radius: 6371 / 1000,
    });
    this.scene.add(earth.mesh);

    // this.objects.planets.set('earth', earth);

    // const moon = new Planet(
    //   "Moon",
    //   "https://upload.wikimedia.org/wikipedia/commons/7/74/Moon_texture.jpg",
    //   {
    //     radius: 1737 / 1000,
    //   }
    // ).add(this.planets.earth.mesh);
    // this.planets.moon.mesh.position.x = 6;
    // this.planets.moon.mesh.position.y = 10;

    // this.planets.deathstar = new Planet(
    //   "Death Star",
    //   "https://raw.githubusercontent.com/dahfazz/Solar/master/textures/deathstar.jpg",
    //   {
    //     radius: 1,
    //   }
    // ).add(this.scene);
  }
}
