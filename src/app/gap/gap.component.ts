import { Component, AfterContentInit, OnDestroy, ElementRef, Renderer2, Input } from '@angular/core';

@Component({
  selector: 'tmgap',
  template: '',
  styleUrls: ['./gap.component.scss']
})
export class GapComponent implements AfterContentInit, OnDestroy {
  private _name: string;
  private _value: any;
  private _maxChar = 1;
  private _underline = true;

  constructor(
    private el: ElementRef,
    private render: Renderer2
  ) { }

  /* #region Ng Events */
  ngOnInit() {
  }

  ngAfterContentInit(): void {
    let fillChar = '&ensp;';
    let element = this.el.nativeElement;
    if (!this._value) {
      this._value = fillChar.repeat(this._maxChar);
    }

    if (this._underline) {
      this.render.addClass(element, 'underline');
    }

    this.render.setProperty(element, 'innerHTML', this._value);
  }

  ngOnDestroy(): void {
    throw new Error("Method not implemented.");
  }
  /* #endregion */

  /* #region Component Input methods */
  @Input()
  set name(v: string) {
    this._name = v;
  }

  @Input()
  set value(v: string) {
    this._value = v;
  }

  @Input()
  set maxChar(v: number) {
    this._maxChar = v;
  }

  @Input()
  set undeline(v: boolean) {
    this._underline = v;
  }
  /* #endregion */

  get name(): string {
    return this._name;
  }

  get value(): string {
    return this._value;
  }

  setConfig(data: { name: string, maxChar: number, underline: boolean }) {
    this.name = data.name;
    this.maxChar = data.maxChar;
    this.undeline = data.underline;
  }
}
