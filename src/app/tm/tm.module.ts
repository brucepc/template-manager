import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TmComponent } from './tm/tm.component';
import { CKEditorModule } from '@ckeditor/ckeditor5-angular';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';



@NgModule({
  declarations: [TmComponent],
  exports: [TmComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    CKEditorModule
  ]
})
export class TmModule { }
