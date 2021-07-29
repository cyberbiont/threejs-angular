import Loaders from "../loaders";
import { TAObject } from "../types";

export default class ObjectFactory {
  constructor(
    private scene: THREE.Scene,
    // private objectRegistry: ObjectRegistry,
    private loaders: Loaders
  ) {}

  create(ObjectConstructor: Constructor<TAObject>, addToScene: boolean = true) {
    const object = new ObjectConstructor();
    if (addToScene) this.scene.add(object.mesh);
    return object;
  }

  // addToRegistry(object) {
  //   this.objectRegistry.add();
  // }
}
