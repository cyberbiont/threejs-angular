import * as THREE from "three";

export default class Planet {
  private geometry: THREE.SphereGeometry;
  private material: THREE.MeshBasicMaterial;
  private texture: THREE.Texture;
  public mesh: THREE.Mesh;
  private rotationSpeed: number;

  constructor(
    public name: string,
    texturePath: string,
    {
      radius = 1,
      quality = 32,
      rotationSpeed = 0.005,
    }: {
      radius?: number;
      quality?: number;
      rotationSpeed?: number;
    } = {}
  ) {
    this.name = name;
    this.rotationSpeed = rotationSpeed;
    this.geometry = new THREE.SphereGeometry(radius, quality, quality);
    // this.material = new THREE.MeshBasicMaterial({ map: this.texture });
    const loader = new THREE.TextureLoader();
    this.texture = loader.load(texturePath);
    this.material = new THREE.MeshBasicMaterial({ map: this.texture });
    this.mesh = new THREE.Mesh(this.geometry, this.material);

    // loader.load(texturePath, (texture) => {
    //   this.texture = texture;
    //   this.material = new THREE.MeshBasicMaterial({ map: this.texture });
    //   this.mesh = new THREE.Mesh(this.geometry, this.material);
    // });
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
