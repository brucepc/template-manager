import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { CKEditorComponent, CKEditor5 } from '@ckeditor/ckeditor5-angular';
import DecoupledEditor from 'src/assets/editor/ckeditor';
import { FormGroup, FormBuilder } from '@angular/forms';
import { GapService } from 'src/app/gap/gap.service';
import { GapConfig } from 'src/app/gap/gap-config';

@Component({
  selector: 'blockchain-tm',
  templateUrl: './tm.component.html',
  styleUrls: ['./tm.component.scss']
})
export class TmComponent implements OnInit, AfterViewInit {
  editorBuild = DecoupledEditor;
  editorConfig = {
    language: 'pt-br'
  };
  editorData = 'Testandoooooooooooo';
  gapConfigForm: FormGroup;
  @ViewChild(CKEditorComponent, { static: false })
  ckComponentRef: CKEditorComponent;

  constructor(
    private fb: FormBuilder,
    private gapService: GapService
  ) { }

  ngOnInit() {
    this.createGapConfigForm();
  }

  ngAfterViewInit() {
    this.ckComponentRef.ready.subscribe((editor: CKEditor5.Editor) => {
    });

    console.log(this.ckComponentRef.tagName);

    this.ckComponentRef.focus.subscribe((data: { event: any, editor: CKEditor5.Editor }) => this.setUpPage(data.editor));
    this.ckComponentRef.blur.subscribe((data: { event: any, editor: CKEditor5.Editor }) => this.setUpPage(data.editor));
  }

  private setUpPage(editor: CKEditor5.Editor) {
    // TODO Create programatically page setup
  }

  private createGapConfigForm() {
    this.gapConfigForm = this.fb.group({
      name: this.fb.control(''),
      maxChar: this.fb.control(''),
      underline: this.fb.control(true)
    });
  }

  onAddGapConfig(gapConfigData: any) {
    console.warn("Gap Config", gapConfigData);
    this.gapService.create(gapConfigData as GapConfig);
    const gapDOM = this.gapService.getDOM();
    const ckeditor = this.ckComponentRef.editorInstance;
    const viewFragment = ckeditor.data.processor.toView(gapDOM);
    const modelFragment = ckeditor.data.toModel(viewFragment);
    ckeditor.model.insertContent(modelFragment);

    // this.ckComponentRef.editorInstance.model.change(writer => {
    //   const position = ckeditor.model.document.selection.getFirstPosition();
    //   console.warn('Selection OBject', position);
    //   console.log(gapDOM);

    //   writer.insertContent(gapDOM, position);
    // });
    this.gapConfigForm.reset();
  }

  onReady(editor) {
    editor.ui.getEditableElement().parentElement.insertBefore(
      editor.ui.view.toolbar.element,
      editor.ui.getEditableElement()
    );
  }

}
