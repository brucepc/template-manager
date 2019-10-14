import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { TmModule } from './tm/tm.module';

@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    BrowserModule,
    TmModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
