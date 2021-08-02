import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";

@Injectable({
  providedIn: "root",
})
export class RestService {
  threeJSApiURL: string = "http://localhost:8081/api/three";
  constructor(private http: HttpClient) {}

  async getStoredScene() {
    try {
      return this.http.get(this.threeJSApiURL).toPromise();
    } catch (e) {
      return this.onError(e);
    }
  }

  async storeScene(sceneJSON: JSON) {
    try {
      return this.http
        .put(this.threeJSApiURL, sceneJSON, { responseType: "text" })
        .toPromise();
    } catch (e) {
      return this.onError(e);
    }
  }

  async deleteStoredScene() {
    try {
      return this.http.delete(this.threeJSApiURL).toPromise();
    } catch (e) {
      return this.onError(e);
    }
  }

  onError(e: any) {
    const message = e.message
      ? e.message
      : e.status
      ? `${e.status} - ${e.statusText}`
      : "Server error";
    console.error(message);
  }
}
