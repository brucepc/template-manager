import {
  Component,
  OnInit,
  ViewChild,
  AfterViewInit,
  ElementRef,
  Renderer2,
  Input
} from '@angular/core';
import {
  CKEditorComponent,
  CKEditor5
} from '@ckeditor/ckeditor5-angular';
import DecoupledEditor from 'src/assets/editor/ckeditor';
import {
  FormGroup,
  FormBuilder
} from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';

export enum TmViewMode {
  Print = 'p',
  Editor = 'e'
};

@Component({
  selector: 'blockchain-tm',
  templateUrl: './tm.component.html',
  styleUrls: ['./tm.component.scss']
})
export class TmComponent implements OnInit, AfterViewInit {
  @ViewChild('toolbar', { static: false }) toolbarRef: ElementRef;
  @ViewChild(CKEditorComponent, { static: false }) editor: CKEditorComponent;
  @Input() viewMode: TmViewMode = TmViewMode.Editor;
  editorBuild = DecoupledEditor;
  editorConfig: any;
  editorData = 'Testandoooooooooooo';
  documentForm: FormGroup;
  ckComponentRef: CKEditorComponent;
  currentPageType;
  papers: any[]

  constructor(
    private fb: FormBuilder,
    private render: Renderer2,
    private sanitizer: DomSanitizer
  ) {
    this.papers = [
      { label: 'A4', height: 297, width: 210 },
      { label: 'A3', height: 420, width: 297 },
      { label: 'A5', height: 210, width: 148 },
      { label: 'Customizado', custom: true }
    ];
    this.currentPageType = this.papers[0];
    this.editorConfig = {
      language: 'pt-br'
    };
  }

  ngOnInit() {
    this.createGapConfigForm();
  }

  ngAfterViewInit() {
    this.setUpPage();
  }

  onPageChange({ value }) {
    const found = this.papers.find(p => p.label === value);

    if (found) {
      this.currentPageType = found;
      this.setUpPage();
    }
  }

  setUpPage() {
    const pageWidth = this.currentPageType.width;
    const pageHeight = this.currentPageType.height;
    const stageWidth = pageWidth + 20;
    const stageHeight = pageHeight + 20;

    this.setStyleVar('--page-width', `${pageWidth}mm`);
    this.setStyleVar('--page-height', `${pageHeight}mm`);
    this.setStyleVar('--stage-width', `${stageWidth}mm`);
    this.setStyleVar('--stage-height', `${stageHeight}mm`);
  }

  private createGapConfigForm() {
    this.documentForm = this.fb.group({
      pageType: this.fb.control('A4'),
      pageWidth: this.fb.control(this.currentPageType.pageWidth),
      pageHeight: this.fb.control(this.currentPageType.pageHeight),
      background: this.fb.control(''),
      orientation: this.fb.control('portrait'),
    })
  }

  onReady(editor: CKEditor5.Editor) {
    this.render.appendChild(
      this.toolbarRef.nativeElement,
      editor.ui.view.toolbar.element
    );
    editor.setData(this.editorData);
    // editor.plugins.get('FileRepository').createUploadAdapter = loader => {
    // console.log(loader);
    // }
  }
  onOrientationChange(event) {
    console.log(event);
    const swap = this.currentPageType.height;
    this.currentPageType.height = this.currentPageType.width;
    this.currentPageType.width = swap;
    this.setUpPage();
  }
  onChangeBg(event: any) {
    // const editorRef = this.render.selectRootElement('ckeditor.custom-editor') as HTMLElement;
    const mediaBg = event.target.files[0];
    const reader = new FileReader();
    reader.readAsDataURL(mediaBg);
    reader.onload = () => {
      const uri = reader.result as string;
      this.setStyleVar('--page-background-uri', `url(${uri})`);
    };

    reader.onerror = e => {
      console.log(e);
    }
  }

  private setStyleVar(name: string, value: string) {
    document.documentElement.style.setProperty(name, value);
  }

}
