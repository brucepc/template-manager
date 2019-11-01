import { Component, ViewChild, AfterViewInit, ViewChildren, ElementRef } from '@angular/core';
import DecoupledEditor from 'src/assets/editor/ckeditor';
import { HttpClient } from '@angular/common/http';
import { zip } from 'rxjs';
import { DocumentFormat } from '../document-format';
import { CKEditorComponent } from '@ckeditor/ckeditor5-angular';
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

  constructor(
    private http: HttpClient,
    private sanitizer: DomSanitizer,
    private el: ElementRef
  ) {
  }

  ngAfterViewInit() {
    zip(
      this.http.get<any>('/assets/document.json'), // Propriedades do documento
      this.http.get<any>('/assets/sample.html'), // Documento
      this.http.get<any>('/assets/data.json') // Dados para preencher o documento
    ).subscribe((response) => {
      const { data } = response[1];
      const documentFormat = response[0];
      const fillData = response[2];
      console.log(documentFormat);


      this.editorData = this.sanitizer.bypassSecurityTrustHtml(atob(data));
      setTimeout(() => {
        // const tags: HTMLCollection<HTMLElement | HTMLCollection> = this.element.getElementsByTagName('tmgap');
        for (const name in fillData) {
          if (fillData.hasOwnProperty(name)) {
            const tags = document.getElementsByName(name);
            for (let gap in tags) {
              if (tags.hasOwnProperty(gap)) {
                this.fixGapStyle(tags[gap]);
                this.setGapContent(tags[gap], fillData[name]);
              }
            }
            //   const tag: any = tags[name];
            //   if (tag instanceof HTMLCollection) {
            //     console.log(tag.length);

            //     for (const item in tag) {
            //       this.fixGapStyle(tag[item]);
            //       this.setGapContent(tag[item], fillData[name]);
            //     }
            //   } else {
            //     this.fixGapStyle(tag);
            //     this.setGapContent(tag, fillData[name]);
            //   }
          }
        }
      }, 100);

      this.formatter = new DocumentFormat(
        `${documentFormat.format.pageWidth}mm`,
        `${documentFormat.format.pageHeight}mm`,
        `${documentFormat.format.margemSuperior}mm`,
        `${documentFormat.format.margemDireita}mm`,
        `${documentFormat.format.margemInferior}mm`,
        `${documentFormat.format.margemEsquerda}mm`,
        `${documentFormat.format.pageWidth}mm`,
        `${documentFormat.format.pageHeight}mm`,
        `url(${documentFormat.background})`
      );
    });
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
