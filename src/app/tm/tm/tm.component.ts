import { Component, OnInit } from '@angular/core';
import * as DecoupledEditor from '@ckeditor/ckeditor5-build-decoupled-document';

@Component({
  selector: 'blockchain-tm',
  templateUrl: './tm.component.html',
  styleUrls: ['./tm.component.scss']
})
export class TmComponent implements OnInit {
  editorBuild = DecoupledEditor;
  editorConfig = {
    language: 'pt-br'
  };
  editorData = 'Testandoooooooooooo';

  constructor() { }

  ngOnInit() {
  }

  public onReady(editor) {
    editor.ui.getEditableElement().parentElement.insertBefore(
      editor.ui.view.toolbar.element,
      editor.ui.getEditableElement()
    );
  }

}
