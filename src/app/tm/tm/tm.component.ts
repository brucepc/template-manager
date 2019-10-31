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
import { BehaviorSubject, Observable } from 'rxjs';
import { skip } from 'rxjs/operators';

export enum TmViewMode {
  Print = 'p',
  Editor = 'e'
}

export class PageConstrains {
  label: string;
  size?: { height: number, width: number };
  custom?: boolean;
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
  @Input() viewMode: TmViewMode = TmViewMode.Editor;
  editorBuild = DecoupledEditor;
  editorConfig: any;
  editorData = 'Testandoooooooooooo';
  documentForm: FormGroup;
  gapForm: FormGroup;
  ckComponentRef: CKEditorComponent;
  currentPageType;
  papers: PageConstrains[];
  gapProperties: any[];
  private gapNameSubject: BehaviorSubject<any>;
  private gapNameObs: Observable<any>;

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
      CustomElement: {
        items: [{
          tag: 'tmGap',
          placeholder: ' ',
          attributes: {
            name: '',
            maxChar: 1,
            underline: 'true'
          },
          onCreate: async (tagName) => {
            return await this.getGapName();
          },
          inline: true,
          editable: true
        }]
      },
      language: 'pt-br'
    };
    this.gapNameSubject = new BehaviorSubject<any>(null);
    this.gapNameObs = this.gapNameSubject.asObservable().pipe(skip(1));
    this.gapProperties = [
      { description: 'Name', value: 'user.name' },
      { description: 'Idade', value: 'user.age' }
    ];
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

  }

  onOrientationChange() {
    const swap = this.pageHeight;
    this.pageHeight = this.pageWidth;
    this.pageWidth = swap;
    this.setPageSize();
  }

  onChangeBg(event: any) {
    const mediaBg = event.target.files[0];
    const reader = new FileReader();
    reader.readAsDataURL(mediaBg);
    reader.onload = () => {
      const uri = reader.result as string;
      this.setStyleVar('--page-background-uri', `url(${uri})`);
    };

    reader.onerror = e => {
      console.log(e);
    };
  }

  onMarginChange() {
    this.setPageSize();
  }

  onCloseModal() {
    this.gapForm.reset();
    this.render.removeClass(this.modalRef.nativeElement, 'open');
    this.gapNameSubject.next(null);
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
      })
    });
  }

  onAddGap() {
    if (this.gapForm.valid) {
      let prop = this.gapForm.controls.gapName.value
      this.gapNameSubject.next({
        name: prop.value,
        maxChar: this.gapForm.controls.maxChar.value,
        underline: `${this.gapForm.controls.underline.value}`
      });
      this.onCloseModal();
    }
  }

  // onAddGap() {
  //   const model = this.editor.editorInstance.model;
  //   model.change(writer => {

  //     const elem = writer.createElement('gap', {
  //       'tmProp': 'teste'
  //     });
  //     const insertAtSelection = model.document.selection.getFirstPosition();
  //     writer.appendText('NEW PROP', elem);
  //     model.insertContent(elem, insertAtSelection);

  //     if (elem.parent) {
  //       writer.setSelection(elem, 'on');
  //     }
  //   });
  // }

  // Getters and Setters
  //region
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
  //endregion

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
    const mergemSuperior = this.margemSuperior;
    const mergemDireita = this.margemDireita;
    const mergemInferior = this.margemInferior;
    const mergemEsquerda = this.margemEsquerda;
    const stageWidth = pageWidth + 20;
    const stageHeight = pageHeight + 20;

    this.setStyleVar('--page-width', `${pageWidth}mm`);
    this.setStyleVar('--page-height', `${pageHeight}mm`);
    this.setStyleVar('--page-margem-superior', `${mergemSuperior}mm`);
    this.setStyleVar('--page-margem-direita', `${mergemDireita}mm`);
    this.setStyleVar('--page-margem-inferior', `${mergemInferior}mm`);
    this.setStyleVar('--page-margem-esquerda', `${mergemEsquerda}mm`);
    this.setStyleVar('--stage-width', `${stageWidth}mm`);
    this.setStyleVar('--stage-height', `${stageHeight}mm`);
  }
}
