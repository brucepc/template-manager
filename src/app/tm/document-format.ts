export class DocumentFormat {
    constructor(
        private _pageWidth = '',
        private _pageHeight = '',
        private _margemSuperior = '',
        private _margemDireita = '',
        private _margemInferior = '',
        private _margemEsquerda = '',
        private _stageWidth = '',
        private _stageHeight = '',
        private _backgroundURI = ''
    ) {
        this.pageWidth = this._pageWidth;
        this.pageHeight = this._pageHeight;
        this.margemSuperior = this._margemSuperior;
        this.margemDireita = this._margemDireita;
        this.margemInferior = this._margemInferior;
        this.margemEsquerda = this._margemEsquerda;
        this.stageWidth = this._stageWidth;
        this.stageHeight = this._stageHeight;
        this.backgroundURI = this._backgroundURI;
    }

    setStyleVar(name, value) {
        console.log(name, value);

        if (value) {
            document.documentElement.style.setProperty(name, value);
        }
    }

    set pageWidth(v: string) {
        this.setStyleVar('--page-width', v);
        this._pageWidth = v;
    }

    get pageWidth(): string {
        return this._pageWidth;
    }

    set pageHeight(v: string) {
        this.setStyleVar('--page-height', v);
        this._pageHeight = v;
    }

    get pageHeight(): string {
        return this._pageHeight;
    }

    set margemSuperior(v: string) {
        this.setStyleVar('--page-margem-superior', v);
        this._margemSuperior = v;
    }

    get margemSuperior(): string {
        return this._margemSuperior;
    }

    set margemDireita(v: string) {
        this.setStyleVar('--page-margem-direita', v);
        this._margemDireita = v;
    }

    get margemDireita(): string {
        return this._margemDireita;
    }

    set margemInferior(v: string) {
        this.setStyleVar('--page-margem-inferior', v);
        this._margemInferior = v;
    }

    get margemInferior(): string {
        return this._margemInferior;
    }

    set margemEsquerda(v: string) {
        this.setStyleVar('--page-margem-esquerda', v);
        this._margemEsquerda = v;
    }

    get margemEsquerda(): string {
        return this._margemEsquerda;
    }

    set stageWidth(v: string) {
        this.setStyleVar('--stage-width', v);
        this._stageWidth = v;
    }

    get stageWidth(): string {
        return this._stageWidth;
    }

    set stageHeight(v: string) {
        this.setStyleVar('--stage-height', v);
        this._stageHeight = v;
    }

    get stageHeight(): string {
        return this._stageHeight;
    }

    set backgroundURI(v: string) {
        this.setStyleVar('--page-background-uri', v);
        this._backgroundURI = v;
    }

    get backgroundURI(): string {
        return this._backgroundURI;
    }

}