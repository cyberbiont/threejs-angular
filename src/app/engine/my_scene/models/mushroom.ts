import THREE, { Object3D, Texture } from "three";

import Loaders from "../lib/loaders";

export class Mushroom {
  private capColor: number;
  private underCapColor: number;
  private stalkColor: number;

  private capTexturePath?: string;
  private underCapTexturePath?: string;
  private stalkTexturePath?: string;

  private rSeg: number = 16; //radius segments
  private hSeg: number = 2; //height segments

  private model?: Object3D;

  constructor(
    private capSize: number = 30,
    private stalkHeight: number = 30,
    private stalkTop: number = 5,
    private stalkBottom: number = 20,
    private capScaleY: number = 0.5,
    private capOffsetY: number = 0 //how far from stalk
  ) {
    this.capColor = 0xffffff;
    this.underCapColor = 0xffffff;
    this.stalkColor = 0xffffff;
  }

  setColors(c1: number, c2: number, c3: number) {
    this.capColor = c1;
    this.underCapColor = c2;
    this.stalkColor = c3;
  }

  //call setTextures before growIt to set material textures
  //pass in texture file location as string
  setTextures(t1: string, t2: string, t3: string) {
    this.capTexturePath = t1;
    this.underCapTexturePath = t2;
    this.stalkTexturePath = t3;
  }

  async create() {
    const capGeo = new THREE.SphereGeometry(
      this.capSize,
      this.rSeg,
      this.hSeg,
      0,
      Math.PI * 2,
      0,
      Math.PI / 2
    );

    const underCapGeo = new THREE.BufferGeometry();

    const stalkGeo = new THREE.CylinderGeometry(
      this.stalkTop,
      this.stalkBottom,
      this.stalkHeight,
      this.rSeg,
      4,
      false
    );

    const capMaterial = new THREE.MeshLambertMaterial();
    const underCapMaterial = new THREE.MeshLambertMaterial({
      side: THREE.DoubleSide,
    });
    const stalkMaterial = new THREE.MeshLambertMaterial();

    capMaterial.color.setHex(this.capColor);
    underCapMaterial.color.setHex(this.underCapColor);
    stalkMaterial.color.setHex(this.stalkColor);

    const loaders = new Loaders();

    if (this.capTexturePath) {
      const t1 = await loaders.loadTexture(this.capTexturePath);
      capMaterial.map = t1;
    }

    if (this.underCapTexturePath) {
      const t2 = await loaders.loadTexture(this.underCapTexturePath);
      underCapMaterial.map = t2;
    }

    if (this.stalkTexturePath) {
      const t3 = await loaders.loadTexture(this.stalkTexturePath);
      stalkMaterial.map = t3;
    }

    //create the underCap
    // const uvs: THREE.Vector2 = [];
    // for (let i = 0; i < this.rSeg; i++) {
    //   const geo = new THREE.BufferGeometry();

    //   const theta = (i * 2 * Math.PI) / this.rSeg;
    //   const thetaNext = ((i + 1) * 2 * Math.PI) / this.rSeg;

    //   const p1 = new THREE.Vector3(
    //     this.capSize * Math.cos(theta),
    //     0,
    //     this.capSize * Math.sin(theta)
    //   );
    //   const p2 = new THREE.Vector3(
    //     this.capSize * Math.cos(thetaNext),
    //     0,
    //     this.capSize * Math.sin(thetaNext)
    //   );
    //   const p3 = new THREE.Vector3(
    //     this.stalkTop * Math.cos(theta),
    //     -this.capOffsetY,
    //     this.stalkTop * Math.sin(theta)
    //   );
    //   const p4 = new THREE.Vector3(
    //     this.stalkTop * Math.cos(thetaNext),
    //     -this.capOffsetY,
    //     this.stalkTop * Math.sin(thetaNext)
    //   );

    //   geo.vertices.push(p3);
    //   geo.vertices.push(p1);
    //   geo.vertices.push(p2);
    //   geo.vertices.push(p4);

    //   geo.faces.push(new THREE.Face4(0, 1, 2, 3));

    //   //need to do assign uvs to vertices so can apply texture to undercap
    //   uvs.push(new THREE.Vector2(0.0, 0.0));
    //   uvs.push(new THREE.Vector2(1.0, 0.0));
    //   uvs.push(new THREE.Vector2(1.0, 1.0));
    //   uvs.push(new THREE.Vector2(0.0, 1.0));

    //   geo.faceVertexUvs[0].push([
    //     uvs[i * 4],
    //     uvs[i * 4 + 1],
    //     uvs[i * 4 + 2],
    //     uvs[i * 4 + 3],
    //   ]);

    //   THREE.GeometryUtils.merge(underCapGeo, geo);
    // }

    var cap = new THREE.Mesh(capGeo, capMaterial);
    var underCap = new THREE.Mesh(underCapGeo, underCapMaterial);
    var stalk = new THREE.Mesh(stalkGeo, stalkMaterial);

    cap.scale.y = this.capScaleY;
    cap.position.y = this.stalkHeight / 2 + this.capOffsetY;

    underCap.position.y = this.stalkHeight / 2 + this.capOffsetY;

    const mushroomObj = new THREE.Object3D();
    mushroomObj.add(cap);
    mushroomObj.add(underCap);
    mushroomObj.add(stalk);

    mushroomObj.position.y = this.stalkHeight / 2;
    this.model = mushroomObj;

    return mushroomObj;
  }
}
