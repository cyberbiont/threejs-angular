import * as THREE from "three";

export default class Loaders {
  // promisified texture loader
  loadTexture(
    url: string,
    onProgress?: (event: ProgressEvent<EventTarget>) => void
  ) {
    const loader = new THREE.TextureLoader();
    return new Promise(
      (
        resolve: (texture: THREE.Texture) => void,
        reject: (error: ErrorEvent) => void
      ) => {
        loader.load(
          url,
          (texture: THREE.Texture) => resolve(texture),
          onProgress,
          (error: ErrorEvent) => reject(error)
        );
      }
    );
  }
}
