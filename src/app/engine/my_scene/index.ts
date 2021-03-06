import * as THREE from "three";

import { GUI } from "dat.gui";
import Loaders from "./lib/loaders";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import Planet from "src/app/engine/my_scene/models/Planet";
import { PointLight } from "three";
import { PointerLockControls } from "three/examples/jsm/controls/PointerLockControls";
import { RestService } from "src/app/services/rest/rest.service";
import { TAAnimatable } from "./lib/types";
import TAScene from "./lib/scene";
import { getGUI } from "./lib/gui/main";

interface TJSAppOptions {
  autosave?: boolean;
  sel: {
    lockCamera: string;
    saveState: string;
    loadState: string;
  };
}

export default class TJSApp {
  private renderer!: THREE.WebGLRenderer;
  private camera!: THREE.PerspectiveCamera;
  private scene!: TAScene;

  private controls!: PointerLockControls;
  private orbitControls?: OrbitControls;
  private gui!: GUI;
  // private clock: THREE.Clock;
  private buttons: HTMLElement[] = [];

  private lights: Map<string, THREE.Light> = new Map();
  private objects: {
    [category: string]: Map<string, TAAnimatable>;
    planets: Map<string, Planet & TAAnimatable>;
  } = {
    planets: new Map(),
  };
  private o: TJSAppOptions;

  private autosaveTimer?: NodeJS.Timer;

  constructor(
    private canvas: HTMLCanvasElement,
    private rs: RestService,
    options?: TJSAppOptions
  ) {
    const defaultOptions: TJSAppOptions = {
      autosave: true,
      sel: {
        lockCamera: "#js-lockCameraControl",
        saveState: "#js-saveState",
        loadState: "#js-loadState",
      },
    };
    this.o = {
      ...defaultOptions,
      ...options,
    };
    this.init();
  }

  private async init() {
    this.initScene();

    this.loadState();

    this.createLight();
    this.createPlane();
    this.createObjects();
  }

  private initScene() {
    if (this.o.autosave) this.initAutosave();
    this.initSaveButtons();

    this.createRenderer();

    const loaders = new Loaders();
    this.scene = new TAScene(loaders);
    this.createCamera();
    // this.clock = new THREE.Clock();

    // const loaded = await this.loadState();
    // if (loaded) return;

    this.createControls();

    // this.createOrbitControls();

    // TODO: make GUI interact with objects
    // this.createGUI();

    this.scene.add(new THREE.AxesHelper(20));
  }

  animate() {
    Object.values(this.objects).forEach((category) =>
      category.forEach((obj) => obj.animate())
    );
    if (this.orbitControls) this.orbitControls.update();

    this.renderer.render(this.scene, this.camera);
  }

  onResize() {
    const width = window.innerWidth;
    const height = window.innerHeight;

    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();

    this.renderer.setSize(width, height);
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

  private createOrbitControls() {
    this.orbitControls = new OrbitControls(
      this.camera,
      this.renderer.domElement
    );
    this.orbitControls.update();
  }

  private createControls() {
    this.controls = new PointerLockControls(
      this.camera,
      this.renderer.domElement
    );
    /* this.controls.addEventListener("change", () =>
      console.log("Controls Change")
    );
    this.controls.addEventListener("lock", () => {
      console.log("Controls lock");
      console.log(this.controls);
    });
    this.controls.addEventListener("unlock", () =>
      console.log("Controls unlock")
    ); */

    const startButton = document.querySelector(
      this.o.sel.lockCamera
    ) as HTMLDivElement;
    this.buttons.push(startButton);

    startButton.addEventListener("click", () => {
      this.controls.lock();
    });

    this.controls.addEventListener("lock", () =>
      this.buttons.forEach((button) => (button.style.display = "none"))
    );
    this.controls.addEventListener("unlock", () =>
      this.buttons.forEach((button) => (button.style.display = "block"))
    );

    const onKeyDown = (event: KeyboardEvent) => {
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
      if (this.orbitControls) this.orbitControls.update();
    };
    document.addEventListener("keydown", onKeyDown.bind(this), false);
  }

  private createLight() {
    // soft white light
    const ambientLight = new THREE.AmbientLight(0x404040);
    ambientLight.position.z = 2;
    this.lights.set("ambient", ambientLight);
    this.scene.add(ambientLight);

    // directional light
    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(-1, 2, 4);
    this.lights.set("directional", directionalLight);
    this.scene.add(directionalLight);
  }

  public async createObjects() {
    this.createPlanets();
    this.createCubes();
  }

  private async createPlanets() {
    const loaders = new Loaders();

    const mars = new Planet(
      "Mars",
      await loaders.loadTexture(
        "https://raw.githubusercontent.com/dahfazz/Solar/master/textures/mars.jpg"
      ),
      {
        radius: 3,
      }
    ).addToScene(this.scene);
    mars.position.set(0, 25, 25);
    this.objects.planets.set("mars", mars);

    const earth = new Planet(
      "Earth",
      await loaders.loadTexture(
        "https://raw.githubusercontent.com/dahfazz/Solar/master/textures/earth.jpg"
      ),
      {
        radius: 6371 / 1000,
      }
    ).addToScene(this.scene);
    earth.position.set(-10, 20, -20);
    this.objects.planets.set("earth", earth);

    const moon = new Planet(
      "Moon",
      await loaders.loadTexture(
        "https://upload.wikimedia.org/wikipedia/commons/7/74/Moon_texture.jpg"
      ),
      {
        radius: 1737 / 1000,
      }
    ).addToScene(this.scene);
    moon.position.set(-10, 20, 10);
    this.objects.planets.set("moon", moon);

    const deathstar = new Planet(
      "Death Star",
      await loaders.loadTexture(
        "https://raw.githubusercontent.com/dahfazz/Solar/master/textures/deathstar.jpg"
      ),
      {
        radius: 2,
      }
    ).addToScene(this.scene);
    deathstar.position.set(0, 30, 0);
    this.objects.planets.set("deathstar", deathstar);
  }

  private createCubes() {
    const cubes: THREE.Mesh[] = [];
    for (let i = 0; i < 50; i++) {
      const geo = new THREE.BoxGeometry(
        Math.random() * 4,
        Math.random() * 16,
        Math.random() * 4
      );
      const mat = new THREE.MeshPhongMaterial({
        opacity: 0.9,
        transparent: true,
      });
      switch (i % 3) {
        case 0:
          mat.color = new THREE.Color(0xff0000);
          break;
        case 1:
          mat.color = new THREE.Color(0xffff00);
          break;
        case 2:
          mat.color = new THREE.Color(0x0000ff);
          break;
      }
      const cube = new THREE.Mesh(geo, mat);
      cubes.push(cube);
    }
    cubes.forEach((c, i) => {
      c.position.x = Math.random() * 100 - 50;
      c.position.z = Math.random() * 100 - 50;
      c.geometry.computeBoundingBox();
      c.position.y =
        ((c.geometry.boundingBox as THREE.Box3).max.y -
          (c.geometry.boundingBox as THREE.Box3).min.y) /
        2;

      this.scene.add(c);
    });
  }

  private initSaveButtons() {
    const saveButton = document.querySelector(
      this.o.sel.saveState
    ) as HTMLElement;
    this.buttons.push(saveButton);

    const loadButton = document.querySelector(
      this.o.sel.loadState
    ) as HTMLElement;
    this.buttons.push(loadButton);

    if (loadButton)
      loadButton.addEventListener("click", this.loadState.bind(this));
    if (saveButton)
      saveButton.addEventListener("click", this.saveState.bind(this));
  }

  // TODO extract methods into separate module that will use rest service
  private initAutosave() {
    if (this.autosaveTimer) clearInterval(this.autosaveTimer);
    this.autosaveTimer = setInterval(this.saveState.bind(this), 10000);
  }

  private async saveState() {
    // should be tested fir actually generating the JSON
    // this.scene.updateMatrixWorld()
    const json = this.camera.toJSON();
    this.rs.put(json);
    console.log("saved");
  }

  private async loadState() {
    // should be tested with the mock response from database for correct state loading

    const jsonArr = await this.rs.get();
    if (!jsonArr) return;

    // const sceneJSON = (json as THREE.Object3D[])[0];
    const loader = new THREE.ObjectLoader();
    const json = (jsonArr as THREE.Object3D[])[0];
    this.camera = loader.parse(json);

    if (this.controls) this.controls.dispose();
    this.createControls();
    // const camera = loader.parse(json.camera) as THREE.PerspectiveCamera;
    // this.createControls();
    // this.renderer.render(this.scene, this.camera);
    return true;
  }
}
