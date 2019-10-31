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
import { TmPrintComponent } from './tm-print/tm-print.component';
import { HttpClientModule } from '@angular/common/http';


@NgModule({
  declarations: [TmComponent, TmPrintComponent],
  exports: [TmComponent, TmPrintComponent],
  imports: [
    CommonModule,
    HttpClientModule,
    ReactiveFormsModule,
    FormsModule,
    CKEditorModule,
    MatSelectModule,
    MatInputModule,
    MatSlideToggleModule,
    MatRadioModule,
    MatButtonModule
  ]
})
export class TmModule { }
