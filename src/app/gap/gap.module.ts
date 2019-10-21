import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GapComponent } from './gap.component';



@NgModule({
  declarations: [GapComponent],
  exports: [GapComponent],
  imports: [
    CommonModule
  ],
  entryComponents: [GapComponent]
})
export class GapModule { }
