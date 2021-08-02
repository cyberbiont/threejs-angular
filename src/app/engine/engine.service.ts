import { ElementRef, Injectable, NgZone, OnDestroy } from "@angular/core";

import { RestService } from "../services/rest/rest.service";
import TJSApp from "./my_scene";

@Injectable({ providedIn: "root" })
export class EngineService implements OnDestroy {
  private frameId: number | null = null;
  public app!: TJSApp;

  public constructor(private ngZone: NgZone, private rs: RestService) {}

  public ngOnDestroy() {
    if (this.frameId != null) cancelAnimationFrame(this.frameId);
  }

  public init(canvas: ElementRef<HTMLCanvasElement>) {
    this.app = new TJSApp(canvas.nativeElement, this.rs);
    // We have to run this outside angular zones,
    // because it could trigger heavy changeDetection cycles.
    this.ngZone.runOutsideAngular(() => {
      if (document.readyState !== "loading") this.render();
      else window.addEventListener("DOMContentLoaded", this.render.bind(this));
      window.addEventListener("resize", this.resize.bind(this));
    });
  }

  public render() {
    this.frameId = requestAnimationFrame(this.render.bind(this));
    this.app.animate();
  }

  public resize() {
    this.app.onResize();
  }
}
