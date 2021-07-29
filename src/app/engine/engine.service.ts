import * as THREE from "three";

import { ElementRef, Injectable, NgZone, OnDestroy } from "@angular/core";

import Planet from "src/app/engine/models/Planet";
// import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { PointerLockControls } from "three/examples/jsm/controls/PointerLockControls";
import Stats from "three/examples/jsm/libs/stats.module";

// import * as dat from 'three/examples/jsm/libs/dat.gui.module.js';
// import Dat from 'dat.gui';
// import init from 'three-dat.gui'; // Import initialization method
// init(Dat); // Init three-dat.gui with Dat

@Injectable({ providedIn: "root" })
export class EngineService implements OnDestroy {
  private canvas: HTMLCanvasElement;
  private renderer: THREE.WebGLRenderer;
  private camera: THREE.PerspectiveCamera;
  private scene: THREE.Scene;
  private controls: PointerLockControls;
  // private clock: THREE.Clock;

  private lightAmb: THREE.AmbientLight;
  private lightDir: THREE.DirectionalLight;
  private sun: THREE.PointLight;

  private frameId: number = null;

  private planets: {
    [name: string]: Planet;
  } = {};

  public constructor(private ngZone: NgZone) {}

  public ngOnDestroy(): void {
    if (this.frameId != null) {
      cancelAnimationFrame(this.frameId);
    }
  }

  public createScene(canvas: ElementRef<HTMLCanvasElement>): void {
    // The first step is to get the reference of the canvas element from our HTML document
    this.canvas = canvas.nativeElement;

    this.renderer = new THREE.WebGLRenderer({
      canvas: this.canvas,
      alpha: true, // transparent background
      antialias: true, // smooth edges
    });
    this.renderer.setSize(window.innerWidth, window.innerHeight);

    // create the scene
    this.scene = new THREE.Scene();
    const loader = new THREE.TextureLoader();
    loader.load(
      "https://raw.githubusercontent.com/dahfazz/Solar/master/textures/space.jpg",
      (texture) => {
        this.scene.background = texture;
      }
    );

    this.camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    this.camera.position.z = 50;
    this.scene.add(this.camera);

    this.scene.add(new THREE.AxesHelper(5));
    // this.clock = new THREE.Clock();
    this.controls = new PointerLockControls(
      this.camera,
      this.renderer.domElement
    );

    // soft white light
    this.lightAmb = new THREE.AmbientLight(0x404040);
    this.lightAmb.position.z = 2;
    this.scene.add(this.lightAmb);

    const color = 0xffffff;
    const intensity = 1;
    this.lightDir = new THREE.DirectionalLight(color, intensity);
    this.lightDir.position.set(-1, 2, 4);
    this.scene.add(this.lightDir);
    // https://sbcode.net/topoearth/downloads/moon_texture.5400x2700.jpg
    // this.planets.mars = new Planet(
    //   "Mars",
    //   "https://raw.githubusercontent.com/dahfazz/Solar/master/textures/mars.jpg",
    //   {
    //     radius: 5,
    //   }
    // ).add(this.scene);

    this.planets.earth = new Planet(
      "Earth",
      "https://raw.githubusercontent.com/dahfazz/Solar/master/textures/earth.jpg",
      {
        radius: 6371 / 1000,
      }
    ).add(this.scene);

    this.planets.moon = new Planet(
      "Moon",
      "https://upload.wikimedia.org/wikipedia/commons/7/74/Moon_texture.jpg",
      {
        radius: 1737 / 1000,
      }
    ).add(this.planets.earth.mesh);
    this.planets.moon.mesh.position.x = 6;
    this.planets.moon.mesh.position.y = 10;

    this.planets.deathstar = new Planet(
      "Death Star",
      "https://raw.githubusercontent.com/dahfazz/Solar/master/textures/deathstar.jpg",
      {
        radius: 1,
      }
    ).add(this.scene);

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
  }

  public animate(): void {
    // We have to run this outside angular zones,
    // because it could trigger heavy changeDetection cycles.
    this.ngZone.runOutsideAngular(() => {
      if (document.readyState !== "loading") this.render();
      else window.addEventListener("DOMContentLoaded", this.render.bind(this));
      window.addEventListener("resize", this.resize.bind(this));
    });
  }

  public render(): void {
    this.frameId = requestAnimationFrame(this.render.bind(this));
    Object.values(this.planets).forEach((planet) => planet.animate());

    this.renderer.render(this.scene, this.camera);
  }

  public resize(): void {
    const width = window.innerWidth;
    const height = window.innerHeight;

    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();

    this.renderer.setSize(width, height);
  }
}
