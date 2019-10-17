import { Component, OnInit, ViewChild, ElementRef, AfterViewInit, Renderer2 } from '@angular/core';
import * as DecoupledEditor from '@ckeditor/ckeditor5-build-decoupled-document';
import { CKEditorComponent, CKEditor5 } from '@ckeditor/ckeditor5-angular';

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

  @ViewChild(CKEditorComponent, { static: false }) ckComponentRef: CKEditorComponent;

  constructor(
    private render: Renderer2
  ) { }

  ngOnInit() {
  }

  ngAfterViewInit() {
    this.ckComponentRef.ready.subscribe((editor: CKEditor5.Editor) => {
      this.render.setStyle(editor.sourceElement, 'height', '297mm');
      this.render.setStyle(editor.sourceElement, 'width', '210mm');
    });

    console.log(this.ckComponentRef.tagName);

    this.ckComponentRef.focus.subscribe((data: { event: any, editor: CKEditor5.Editor }) => this.setUpPage(data.editor));
    this.ckComponentRef.blur.subscribe((data: { event: any, editor: CKEditor5.Editor }) => this.setUpPage(data.editor));
  }

  private setUpPage(editor: CKEditor5.Editor) {
    this.render.setStyle(editor.sourceElement, 'height', '297mm');
    this.render.setStyle(editor.sourceElement, 'width', '210mm');
  }

  public onReady(editor) {
    editor.ui.getEditableElement().parentElement.insertBefore(
      editor.ui.view.toolbar.element,
      editor.ui.getEditableElement()
    );
  }

}
