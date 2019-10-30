import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TmComponent } from './tm/tm.component';
import { CKEditorModule } from '@ckeditor/ckeditor5-angular';
import {
  MatRadioModule,
  MatSelectModule,
  MatInputModule,
  MatSlideToggleModule,
  MatButtonModule
} from '@angular/material';
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
    GapModule,
    MatSelectModule,
    MatInputModule,
    MatSlideToggleModule,
    MatRadioModule,
    MatButtonModule
  ]
})
export class TmModule { }
