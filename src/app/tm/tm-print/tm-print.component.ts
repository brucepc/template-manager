import { Component, AfterViewInit, ElementRef, Input } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { zip } from 'rxjs';
import { DocumentFormat } from '../document-format';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

@Component({
  selector: 'blockchain-tm-print',
  templateUrl: './tm-print.component.html',
  styleUrls: ['./tm-print.component.scss']
})
export class TmPrintComponent implements AfterViewInit {
  editorData: SafeHtml;
  formatter: DocumentFormat;
  gapTags: HTMLCollection;
  private pageSettings: any;
  private template: any;

  constructor(
    private http: HttpClient,
    private sanitizer: DomSanitizer,
    private el: ElementRef
  ) {
  }

  @Input()
  set data(v: any) {
    console.log('DADOOOOOS', v);

    this.editorData = v;
  }

  @Input()
  set page(v: any) {
    this.pageSettings = v;
  }

  @Input()
  set document(v: any) {
    this.template = this.sanitizer.bypassSecurityTrustHtml(v);
  }

  ngAfterViewInit() {
    // zip(
    //   this.http.get<any>('/assets/document.json'), // Propriedades do documento
    //   this.http.get<any>('/assets/sample.html'), // Documento
    //   this.http.get<any>('/assets/data.json') // Dados para preencher o documento
    // ).subscribe((response) => {
    //   const { data } = response[1];
    //   const documentFormat = response[0];
    //   const fillData = response[2];
    //   console.log(documentFormat);


    //   this.editorData = this.sanitizer.bypassSecurityTrustHtml(atob(data));
    //   setTimeout(() => {
    //     for (const name in fillData) {
    //       if (fillData.hasOwnProperty(name)) {
    //         const tags = document.getElementsByName(name);
    //         for (let gap in tags) {
    //           if (tags.hasOwnProperty(gap)) {
    //             this.fixGapStyle(tags[gap]);
    //             this.setGapContent(tags[gap], fillData[name]);
    //           }
    //         }
    //       }
    //     }
    //   }, 100);
    // this
    this.fillGaps(this.editorData);

    this.formatter = new DocumentFormat(
      `${this.pageSettings.pageWidth}mm`,
      `${this.pageSettings.pageHeight}mm`,
      `${this.pageSettings.margemSuperior}mm`,
      `${this.pageSettings.margemDireita}mm`,
      `${this.pageSettings.margemInferior}mm`,
      `${this.pageSettings.margemEsquerda}mm`,
      `${this.pageSettings.pageWidth}mm`,
      `${this.pageSettings.pageHeight}mm`);

    if (this.pageSettings.background) {
      this.formatter.backgroundURI = this.pageSettings.background;
    }
  }

  fillGaps(data) {
    console.log(data);

    for (const name in data) {
      if (data.hasOwnProperty(name)) {
        const tags = document.getElementsByName(name);
        for (const gap in tags) {
          if (tags.hasOwnProperty(gap)) {
            this.fixGapStyle(tags[gap]);
            if (data.hasOwnProperty(name)) {
              this.setGapContent(tags[gap], data[name]);
            } else if (data.hasOwnProperty('placeholder')) {
              this.setGapContent(tags[gap], data.placeholder);
            }
          }
        }
      }
    }
  }


  fixGapStyle(gap: HTMLElement) {
    const width = gap.offsetWidth;
    gap.style.width = `${width}px`;
  }

  setGapContent(gap: HTMLElement, content: any) {
    gap.innerHTML = content;
  }

  get element(): HTMLElement {
    return this.el.nativeElement as HTMLElement;
  }
}
