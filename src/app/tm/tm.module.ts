import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TmComponent } from './tm/tm.component';
import { CKEditorModule } from '@ckeditor/ckeditor5-angular';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { GapModule } from '../gap/gap.module';



@NgModule({
  declarations: [TmComponent],
  exports: [TmComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    CKEditorModule,
    GapModule
  ]
})
export class TmModule { }
