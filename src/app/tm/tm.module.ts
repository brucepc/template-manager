import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TmComponent } from './tm/tm.component';
import { CKEditorModule } from '@ckeditor/ckeditor5-angular';
import {
  MatRadioModule,
  MatSelectModule,
  MatInputModule,
  MatSlideToggleModule
} from '@angular/material';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { GapModule } from '../gap/gap.module';
import { NgSelectModule } from '@ng-select/ng-select';


@NgModule({
  declarations: [TmComponent],
  exports: [TmComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    CKEditorModule,
    GapModule,
    NgSelectModule,
    MatSelectModule,
    MatInputModule,
    MatSlideToggleModule,
    MatRadioModule
  ]
})
export class TmModule { }
