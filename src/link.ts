import { LitElement, html } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { Signal, SignalWatcher } from '@lit-labs/signals';
import { getSignal, doFetch, State } from './utils';
import { unsafeHTML, UnsafeHTMLDirective } from 'lit/directives/unsafe-html.js';
import { DirectiveResult } from 'lit/async-directive.js';

/**
 * Fetch data from a URL and store it in a signal.
 */
@customElement('admin-link')
export default class Link extends SignalWatcher(LitElement) {
  @property({ attribute: 'admin-href' })
  href: string = '#';
  @property({ attribute: 'admin-class' })
  class: string = '';
  @property({ attribute: 'admin-role' })
  role: string = '';

  @property()
  data: string = '';
  @property()
  emit: string = '';
  @property()
  state: string = '';

  dataSignal?: Signal.State<any>;
  emitSignal?: Signal.State<number>;
  stateSignal?: Signal.State<State>;
  innerContent?: DirectiveResult<typeof UnsafeHTMLDirective> = html``;

  connectedCallback() {
    super.connectedCallback();

    this.dataSignal = getSignal(this.data);
    this.emitSignal = getSignal(this.emit);
    this.stateSignal = getSignal(this.state);
    this.innerContent = unsafeHTML(this.innerHTML);
    this.innerHTML = '';
  }

  override createRenderRoot() {
    return this;
  }

  handleClick(event: Event) {
    event.preventDefault();
    if (this.href === '#') {
      if (this.emitSignal) {
        this.emitSignal.set(this.emitSignal.get() + 1);
      }
    } else {
      if (this.stateSignal) {
        this.stateSignal.set(State.Loading);
      }
      if (this.dataSignal && this.emitSignal) {
        doFetch(this.href, this.dataSignal, this.emitSignal, this.stateSignal);
      }
    }
  }

  render() {
    const status =
      this.href === '#' ? html`` : html`<admin-status .state="${this.stateSignal}"></admin-status>`;
    return html`<a href="${this.href}" class="${this.class}" role="${this.role}" @click=${this.handleClick}
      >${status} ${this.innerContent}</a
    >`;
  }
}
