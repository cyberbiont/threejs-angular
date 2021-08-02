import { AppComponent } from "./app.component";
import { BrowserModule } from "@angular/platform-browser";
import { EngineComponent } from "./engine/engine.component";
import { HttpClientModule } from "@angular/common/http";
import { NgModule } from "@angular/core";
import { UiComponent } from "./ui/ui.component";
import { UiInfobarTopComponent } from "./ui/ui-infobar-top/ui-infobar-top.component";
@NgModule({
  declarations: [
    AppComponent,
    EngineComponent,
    UiComponent,
    UiInfobarTopComponent,
  ],
  imports: [BrowserModule, HttpClientModule],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
