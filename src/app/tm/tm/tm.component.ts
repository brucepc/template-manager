import { Component, OnInit, ViewChild, AfterViewInit, ViewChildren, QueryList, ChangeDetectorRef } from '@angular/core';
import { CKEditorComponent, CKEditor5 } from '@ckeditor/ckeditor5-angular';
import DecoupledEditor from 'src/assets/editor/ckeditor';
import { FormGroup, FormBuilder } from '@angular/forms';
import { GapService } from 'src/app/gap/gap.service';
import { GapConfig } from 'src/app/gap/gap-config';
import { GapComponent } from 'src/app/gap/gap.component';

@Component({
  selector: 'blockchain-tm',
  templateUrl: './tm.component.html',
  styleUrls: ['./tm.component.scss'],
  entryComponents: [GapComponent]
})
export class TmComponent implements OnInit, AfterViewInit {
  @ViewChildren(GapComponent) gaps: QueryList<GapComponent>;
  editorBuild = DecoupledEditor;
  editorConfig = {
    language: 'pt-br'
  };
  editorData = 'Testandoooooooooooo';
  gapConfigForm: FormGroup;
  @ViewChild(CKEditorComponent, { static: false })
  ckComponentRef: CKEditorComponent;
  papers = [
    { label: 'A4', height: '297mm', width: '210mm' },
    { label: 'A3', height: '420mm', width: '297mm' },
    { label: 'A5', height: '210mm', width: '148mm' }
  ];
  currentPageType = this.papers[0];

  constructor(
    private fb: FormBuilder,
    private gapService: GapService,
    private ref: ChangeDetectorRef
  ) { }

  ngOnInit() {
    this.createGapConfigForm();
    this.setUpPage();
  }

  ngAfterViewInit() {
    this.ckComponentRef.ready.subscribe((editor: CKEditor5.Editor) => {
    });

    this.ckComponentRef.change.subscribe(editor => {
      setTimeout(() => {
        this.ref.markForCheck();
        console.log(this.gaps);
      }, 300);
    });

    console.log(this.ckComponentRef.tagName);

    this.ckComponentRef.focus.subscribe((data: { event: any, editor: CKEditor5.Editor }) => this.setUpPage(data.editor));
    this.ckComponentRef.blur.subscribe((data: { event: any, editor: CKEditor5.Editor }) => this.setUpPage(data.editor));
  }

  onPageChange(value) {
    this.currentPageType = value;
    this.setUpPage();
  }

  setUpPage() {
    console.log(this.currentPageType);
    
    document.documentElement.style.setProperty('--page-width', this.currentPageType.width);
    document.documentElement.style.setProperty('--page-height', this.currentPageType.height);
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
