import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";

@Injectable({
  providedIn: "root",
})
export class RestService {
  url: string = "http://localhost:8081/api/three";
  constructor(private http: HttpClient) {}

  async get() {
    try {
      return this.http.get(this.url).toPromise();
    } catch (e) {
      return this.onError(e);
    }
  }

  async put(json: JSON) {
    try {
      return this.http
        .put(this.url, json, { responseType: "text" })
        .toPromise();
    } catch (e) {
      return this.onError(e);
    }
  }

  async delete() {
    try {
      return this.http.delete(this.url).toPromise();
    } catch (e) {
      return this.onError(e);
    }
  }

  // TODO implement global error handing with ErrorHandler and HTTP Error Interceptor
  onError(e: any) {
    const message = e.message
      ? e.message
      : e.status
      ? `${e.status} - ${e.statusText}`
      : "Server error";
    console.error(message);
  }
}
