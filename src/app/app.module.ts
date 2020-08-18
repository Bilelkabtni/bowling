import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { BowlingFramesComponent } from './bowling-frames/bowling-frames.component';

@NgModule({
  declarations: [
    AppComponent,
    BowlingFramesComponent
  ],
  imports: [
    BrowserModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
