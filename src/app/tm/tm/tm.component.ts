import {
  Component,
  OnInit,
  ViewChild,
  AfterViewInit,
  ElementRef,
  Renderer2,
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
import { BehaviorSubject, Observable } from 'rxjs';
import { skip } from 'rxjs/operators';
import { DocumentFormat } from '../document-format';
import { TmPrintComponent } from '../tm-print/tm-print.component';
import { SafeHtml, DomSanitizer } from '@angular/platform-browser';

export class PageConstrains {
  label: string;
  size?: { height: number, width: number };
  custom?: boolean;
}

export class GapConstrains {
  name: string;
  maxChar: number;
  customStyle?: string;
  placeholder?: string;
  get value(): string {
    return this.placeholder;
  }
}


function generatePtSetting(size) {
  return {
    model: size,
    title: `${size} pt`,
    view: {
      name: 'span',
      styles: {
        'font-size': `${size}pt`
      }
    }
  };
}

@Component({
  selector: 'blockchain-tm',
  templateUrl: './tm.component.html',
  styleUrls: ['./tm.component.scss']
})
export class TmComponent implements OnInit, AfterViewInit {
  @ViewChild('toolbar', { static: false })
  toolbarRef: ElementRef;
  @ViewChild(CKEditorComponent, { static: false })
  editor: CKEditorComponent;
  @ViewChild('modalRef', { static: false })
  modalRef: ElementRef;
  @ViewChild('editorContainer', { static: false })
  editorContainer: ElementRef;
  @ViewChild(TmPrintComponent, { static: false })
  preview: TmPrintComponent;
  editorBuild = DecoupledEditor;
  editorConfig: any;
  editorData: any;
  documentForm: FormGroup;
  gapForm: FormGroup;
  ckComponentRef: CKEditorComponent;
  currentPageType;
  papers: PageConstrains[];
  gapProperties: any[];
  template: SafeHtml;
  private _background: string;
  private gapNameSubject: BehaviorSubject<any>;
  private gapNameObs: Observable<any>;
  private formatter: DocumentFormat;
  private gaps = [];

  constructor(
    private fb: FormBuilder,
    private render: Renderer2,
  ) {
    /*******************************
     * AVAILABLE PAGE SIZES        *
     *******************************/
    this.papers = [
      { label: 'A4', size: { height: 297, width: 210 } } as PageConstrains,
      { label: 'A3', size: { height: 420, width: 297 } } as PageConstrains,
      { label: 'A5', size: { height: 210, width: 148 } } as PageConstrains,
      { label: 'Customizado', custom: true } as PageConstrains
    ];
    this.currentPageType = this.papers[0];
    this.editorConfig = {
      placeholder: 'CRIE AQUI SEU NOVO DOCUMENTO',
      fontSize: {
        options: Array.from({ length: 20 }, (v, k) => generatePtSetting((k + 4) * 2))
      },
      CustomElement: {
        items: [{
          tag: 'tmGap',
          placeholder: ' ',
          attributes: {
            name: '',
            maxChar: 1,
            customStyle: true,
            placeholder: ''
          },
          onCreate: async t => {
            return await this.getGapName();
          },
          inline: true,
          editable: false
        }]
      },
      language: 'pt-br',
    };
    this.gapNameSubject = new BehaviorSubject<any>(null);
    this.gapNameObs = this.gapNameSubject.asObservable().pipe(skip(1));
    // TODO Fetch data to fill gapProperties
    this.gapProperties = [
      { description: 'Name', value: 'user.name', placeholder: 'João Ribeiro Silva' },
      { description: 'Idade', value: 'user.age', placeholder: '26' },
      { description: 'RG', value: 'user.rg', placeholder: '21005823' }
    ];
    this.editorData = ''; // Initial data
    this.formatter = new DocumentFormat();
  }

  ngOnInit() {
    this.createDocumentForm();
    this.createGapForm();
  }

  ngAfterViewInit() {
    this.setPage(this.papers[0]);
    this.setPageSize();
  }

  onPageChange({ value }) {
    const found = this.papers.find(p => p.label === value.label);

    if (found) {
      this.setPage(found);
      this.setPageSize();
    }
  }

  onPageSizeChange() {
    if (!this.currentPageType.custom) {
      this.documentForm.controls.pageType
        .setValue(this.papers.find(p => p.custom));
    }
    this.setPageSize();
  }

  onReady(editor: CKEditor5.Editor) {
    this.render.appendChild(
      this.toolbarRef.nativeElement,
      editor.ui.view.toolbar.element
    );

    // editor.commands.add('indentList', new IndentListCommand());
    const plugins = Array.from(editor.ui.componentFactory.names());
  
    console.log('PLUGINS', plugins);

  }

  onOrientationChange() {
    const swap = this.pageHeight;
    this.pageHeight = this.pageWidth;
    this.pageWidth = swap;
    this.setPageSize();
  }

  onChangeBg(event: any) {
    const { target } = event;
    const mediaBg = target.files[0];
    const removerBtn = this.render.nextSibling(target);
    const reader = new FileReader();
    reader.readAsDataURL(mediaBg);
    reader.onload = () => {
      const uri = reader.result as string;
      this.background = uri;
      this.render.removeClass(removerBtn, 'disabled');
    };

    reader.onerror = e => {
      console.log(e);
    };
  }

  onRemoveBG(event) {
    const { target } = event;
    this.documentForm.controls.background.setValue(null);
    this.background = null;
    this.render.addClass(target, 'disabled');
  }

  onMarginChange() {
    this.setPageSize();
  }

  onCloseModal() {
    this.gapForm.reset();
    this.gapForm.markAsPristine();
    this.gapForm.markAllAsTouched();
    this.render.removeClass(this.modalRef.nativeElement, 'open');
    this.gapNameSubject.next('');
  }

  onOpenModal() {
    this.render.addClass(this.modalRef.nativeElement, 'open');
  }

  getGapName() {
    this.onOpenModal();
    return new Promise((res, rej) => {
      this.gapNameObs.subscribe(gapName => {
        if (gapName === null) {
          rej(null);
        } else {
          res(gapName);
        }
      });
    });
  }

  onAddGap() {
    if (this.gapForm.valid) {
      const prop = this.gapForm.controls.gapName.value;
      const gapConfig = {
        name: prop.value,
        maxChar: this.gapForm.controls.maxChar.value,
        placeholder: prop.placeholder
      } as GapConstrains;

      this.gaps.push(gapConfig);

      if (this.gapForm.controls.underline.value) {
        gapConfig.customStyle = 'underline';
      }

      this.gapNameSubject.next(gapConfig);
      this.onCloseModal();
    }
  }

  onSave() {
    const document = {
      format: this.documentForm.value,
      data: this.editorData,
      background: this.background
    };
    console.log('Data', btoa(this.editorData));
    console.log('Document', document);
  }

  openPreview() {
    this.render.addClass(this.editorContainer.nativeElement, 'show-preview');
    this.preview.document = this.document;
    this.preview.page = this.pageSettings;
    setTimeout(() => {
      this.preview.fillGaps(
        this.gaps.map(v => Object.assign(new GapConstrains(), v))
      );
    }, 100);
  }

  closePreview() {
    this.render.removeClass(this.editorContainer.nativeElement, 'show-preview');
  }

  // #region Getters and Setters
  get background(): string {
    return this._background;
  }

  set background(v: string) {
    this._background = v;
    if (this._background !== null) {
      this.formatter.backgroundURI = `url(${v})`;
    } else {
      this.formatter.backgroundURI = 'none';
    }
  }

  get sampleData(): any {
    return this.gaps;
  }

  get document(): any {
    return btoa(this.editorData);
  }

  get pageSettings(): any {
    console.log(this.documentForm.value);

    return {
      ...this.documentForm.value,
      background: this.background
    };
  }

  get pageWidth(): number {
    return this.documentForm.controls.pageWidth.value;
  }

  set pageWidth(w: number) {
    this.documentForm.controls.pageWidth.setValue(w);
  }

  get pageHeight(): number {
    return this.documentForm.controls.pageHeight.value;
  }

  set pageHeight(h: number) {
    this.documentForm.controls.pageHeight.setValue(h);
  }

  get margemSuperior(): number {
    return this.documentForm.controls.margemSuperior.value;
  }

  set mergemSuperior(m: number) {
    this.documentForm.controls.margemSuperior.setValue(m);
  }

  get margemDireita(): number {
    return this.documentForm.controls.margemDireita.value;
  }

  set mergemDireita(m: number) {
    this.documentForm.controls.margemDireita.setValue(m);
  }

  get margemInferior(): number {
    return this.documentForm.controls.margemInferior.value;
  }

  set mergemInferior(m: number) {
    this.documentForm.controls.margemInferior.setValue(m);
  }

  get margemEsquerda(): number {
    return this.documentForm.controls.margemEsquerda.value;
  }

  set mergemEsquerda(m: number) {
    this.documentForm.controls.margemEsquerda.setValue(m);
  }
  // #endregion

  // #region Private Methods
  private setPage(page: PageConstrains) {
    this.currentPageType = page;
    if (page.custom !== true) {
      this.pageWidth = page.size.width;
      this.pageHeight = page.size.height;
    }
  }

  private setStyleVar(name: string, value: string) {
    document.documentElement.style.setProperty(name, value);
  }

  private createDocumentForm() {
    const defaultPage = this.papers[0];
    this.documentForm = this.fb.group({
      pageType: this.fb.control(defaultPage),
      pageWidth: this.fb.control(''),
      pageHeight: this.fb.control(''),
      margemSuperior: this.fb.control('30'),
      margemEsquerda: this.fb.control('30'),
      margemDireita: this.fb.control('20'),
      margemInferior: this.fb.control('20'),
      background: this.fb.control(''),
      orientation: this.fb.control('portrait'),
    });
  }

  private createGapForm() {
    this.gapForm = this.fb.group({
      gapName: this.fb.control(''),
      maxChar: this.fb.control(1),
      underline: this.fb.control(true)
    });
  }

  private setPageSize() {
    const pageWidth = this.pageWidth;
    const pageHeight = this.pageHeight;
    const margemSuperior = this.margemSuperior;
    const margemDireita = this.margemDireita;
    const margemInferior = this.margemInferior;
    const margemEsquerda = this.margemEsquerda;
    const stageWidth = pageWidth + 20;
    const stageHeight = pageHeight + 20;

    this.formatter.pageWidth = `${pageWidth}mm`;
    this.formatter.pageHeight = `${pageHeight}mm`;
    this.formatter.margemSuperior = `${margemSuperior}mm`;
    this.formatter.margemDireita = `${margemDireita}mm`;
    this.formatter.margemInferior = `${margemInferior}mm`;
    this.formatter.margemEsquerda = `${margemEsquerda}mm`;
    this.formatter.stageWidth = `${stageWidth}mm`;
    this.formatter.stageHeight = `${stageHeight}mm`;
  }
  // #endregion
}
