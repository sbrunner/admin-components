import { LitElement } from 'lit';
import { property } from 'lit/decorators.js';
import { Signal, SignalWatcher } from '@lit-labs/signals';
import { getSignal } from './utils';

export default class Element extends SignalWatcher(LitElement) {
  /**
   * The Signal name from where we get the data.
   */
  @property()
  data: string = '';
  dataSignal?: Signal.State<any>;

  connectedCallback() {
    super.connectedCallback();
    if (!this.data) {
      throw new Error('signal is required');
    }
    this.dataSignal = getSignal(this.data);
  }

  override createRenderRoot() {
    return this;
  }
}
