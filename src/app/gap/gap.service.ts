import { Injectable, ComponentRef, ComponentFactoryResolver, ApplicationRef, Injector, Renderer2, EmbeddedViewRef, RendererFactory2 } from '@angular/core';
import { GapComponent } from './gap.component';
import { GapConfig } from './gap-config';
import { GapModule } from './gap.module';

@Injectable({
  providedIn: GapModule
})
export class GapService {
  private render: Renderer2;
  gapComponentRef: ComponentRef<GapComponent>;

  constructor(
    private componentFactoryResolver: ComponentFactoryResolver,
    private appRef: ApplicationRef,
    private injector: Injector,
    private renderFactory: RendererFactory2
  ) {
    this.render = this.renderFactory.createRenderer(null, null);
  }

  create(config: GapConfig) {
    const componentFactory = this.componentFactoryResolver.resolveComponentFactory(GapComponent);
    this.gapComponentRef = componentFactory.create(this.injector);
    this.gapComponentRef.instance.setConfig(config);
    this.attachView();
  }

  private attachView() {
    this.appRef.attachView(this.gapComponentRef.hostView);
  }

  private delete() {
    this.gapComponentRef.destroy();
  }

  getGapInstance(): GapComponent {
    return this.gapComponentRef.instance || null;
  }

  getDOM() {
    return (this.gapComponentRef.hostView as EmbeddedViewRef<any>).rootNodes[0] as HTMLElement;
  }

  appendTo(el: HTMLElement) {
    this.render.appendChild(el, this.getDOM());
  }
}
