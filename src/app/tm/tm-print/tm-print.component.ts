import { Component, AfterViewInit, ElementRef, Input, ContentChildren, Renderer2 } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { DocumentFormat } from '../document-format';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { element } from 'protractor';

@Component({
  selector: 'blockchain-tm-print',
  templateUrl: './tm-print.component.html',
  styleUrls: ['./tm-print.component.scss'],
})
export class TmPrintComponent implements AfterViewInit {
  templateData: SafeHtml;
  formatter: DocumentFormat;
  gapTags: HTMLCollection;
  private pageSettings: any;
  private template: any;

  constructor(
    private sanitizer: DomSanitizer,
    private el: ElementRef,
    private render: Renderer2
  ) {
  }

  @Input()
  set data(v: any) {
    this.templateData = Object.assign({}, v);
  }

  get data(): any {
    return this.data;
  }

  @Input()
  set page(v: any) {
    this.pageSettings = Object.assign({}, v);
  }

  get() {
    return this.pageSettings;
  }

  @Input()
  set document(v: any) {
    this.template = this.sanitizer.bypassSecurityTrustHtml(atob(v));
  }

  get document(): any {
    return this.template;
  }

  ngAfterViewInit() {
    this.fillGaps(this.templateData);

    if (this.pageSettings) {
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
  }

  fillGaps(data) {
    setTimeout(() => {
      if (typeof data[Symbol.iterator] === 'function') {
        for (const { name, value } of data) {
          const gaps = document.getElementsByName(name);
          gaps.forEach(elmn => {
            if (elmn.classList.contains('ck-editor__editable')) { return; };
            console.log(elmn);
            const width = elmn.offsetWidth;
            this.render.setStyle(elmn, 'width', `${width}px`);
            this.setGapContent(elmn, value);
          });
        }
      }
    }, 200);
  }


  fixGapStyle(gap: any) {
    const width = gap.offsetWidth;
    gap.style.width = `${width}px`;
  }

  setGapContent(gap: HTMLElement | Element, content: any) {
    gap.innerHTML = content;
  }

  get element(): HTMLElement {
    return this.el.nativeElement as HTMLElement;
  }
}
