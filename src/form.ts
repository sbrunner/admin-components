import { html, LitElement } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { Signal, SignalWatcher } from '@lit-labs/preact-signals';
import { getSignal, doFetch, State } from './utils';
import { map } from 'lit/directives/map.js';

type Field = {
  id?: string;
  name: string;
  label?: string;
  type?: string;
  placeholder?: string;
};
type FormConfig = {
  action: string;
  fields: Field[];
  submit?: string;
  type?: 'table' | 'line';
};

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
  config?: FormConfig;

  connectedCallback() {
    super.connectedCallback();

    this.dataSignal = getSignal(this.data);
    this.emitSignal = getSignal(this.emit);
    this.stateSignal = getSignal(this.state);
  }

  override createRenderRoot() {
    return this;
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  getJsonData(form: HTMLFormElement): { [id: string]: any } {
    const data = new FormData(form);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
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
    if (this.dataSignal && this.emitSignal) {
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

  render() {
    if (this.innerHTML) {
      this.config = JSON.parse(this.innerText);
      this.innerHTML = '';
    }
    if (!this.config) {
      console.error('Missing config');
      return html``;
    }
    const formType = this.config?.type ?? 'table';
    if (formType === 'table') {
      return html` <form action="${this.config.action}" @submit="${this.handleSubmit}">
        ${map(this.config.fields, (field: Field) => {
          const fieldId = field?.id ?? field.name;
          return html`<div class="mb-3">
            <label for="${fieldId}" class="form-label">${field.label}</label>
            <div class="col-sm-10">
              <input
                type="${field?.type ?? 'text'}"
                class="form-control"
                id="${fieldId}"
                name="${field.name}"
                placeholder="${field?.placeholder}"
              />
            </div>
          </div>`;
        })}
        <button type="submit" class="btn btn-primary">
          <admin-status .state="${this.stateSignal}"></admin-status> ${this.config?.submit ?? 'Submit'}
        </button>
      </form>`;
    }

    if (formType === 'line') {
      return html`<form
        class="row row-cols-lg-auto g-3 align-items-center"
        action="${this.config.action}"
        @submit="${this.handleSubmit}"
      >
        ${map(this.config.fields, (field: Field) => {
          const fieldId = field?.id ?? field.name;
          return html`<div class="col-12">
            ${field?.label
              ? html`<label class="visually-hidden" for="${fieldId}">${field.label}</label>`
              : html``}
            <div class="input-group">
              <input
                type="${field?.type ?? 'text'}"
                class="form-control"
                id="${fieldId}"
                name="${field.name}"
                placeholder="${field?.placeholder}"
              />
            </div>
          </div>`;
        })}
        <div class="col-12">
          <button type="submit" class="btn btn-primary form-control">
            <admin-status .state="${this.stateSignal}"></admin-status> ${this.config?.submit ?? 'Submit'}
          </button>
        </div>
      </form>`;
    }
  }
}
