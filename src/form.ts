import { LitElement, html } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { Signal, SignalWatcher } from '@lit-labs/preact-signals';
import { getSignal, doFetch, State } from './utils';
import { unsafeHTML, UnsafeHTMLDirective } from 'lit/directives/unsafe-html.js';
import { DirectiveResult } from 'lit/async-directive.js';

/**
 * Fetch data from a URL and store it in a signal.
 */
@customElement('admin-form')
export default class Link extends SignalWatcher(LitElement) {
  @property()
  data: string = '';
  @property()
  emit: string = '';
  @property()
  state: string = '';

  dataSignal?: Signal;
  emitSignal?: Signal<number>;
  stateSignal?: Signal<State>;

  connectedCallback() {
    super.connectedCallback();

    this.dataSignal = getSignal(this.data);
    this.emitSignal = getSignal(this.emit);
    this.stateSignal = getSignal(this.state);
  }

  override createRenderRoot() {
    return this;
  }

  getJsonData(form: HTMLFormElement): { [id: string]: any } {
    const data = new FormData(form);
    const jsonData: { [id: string]: any } = {};
    data.forEach((value, key) => {
      jsonData[key] = value;
    });
    return jsonData;
  }

  handleSubmit(event: Event) {
    event.preventDefault();
    if (this.stateSignal) {
      this.stateSignal.value = State.Loading;
    }
    const form = this.getElementsByTagName('form')[0];
    const jsonData = this.getJsonData(form);
    doFetch(
      form.getAttribute('action') || '',
      this.dataSignal,
      this.emitSignal,
      this.stateSignal,
      'POST',
      jsonData,
    );
  }
}
