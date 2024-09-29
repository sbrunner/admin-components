import { LitElement, css, html } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { computed, SignalWatcher, Signal } from '@lit-labs/preact-signals';
import { getSignal, State, doFetch } from './utils';
import { map } from 'lit/directives/map.js';

/**
 * Fetch data from a URL and store it in a signal.
 */
@customElement('admin-fetch')
export default class AdminFetch extends SignalWatcher(LitElement) {
  /**
   * URL to fetch data from.
   */
  @property()
  url: string = '';

  /**
   * Signal name of a counter to be notified on a successful fetch.
   */
  @property()
  emit: string = '';

  /**
   * Signal name of a counter to trigger a fetch.
   */
  @property()
  trigger: string = '';

  /**
   * Signal name of the fetched data.
   */
  @property()
  data: string = '';

  /**
   * Signal name of the state of the fetch.
   */
  @property()
  state: string = '';

  /**
   * Time interval to fetch data [milliseconds].
   */
  @property()
  interval: number = -1;

  /**
   * Number of lines to display in the loading panel.
   */
  @property()
  lines: number = 3;

  @property({
    attribute: 'line-min',
  })
  lineMin: number = 0;
  @property({
    attribute: 'line-max',
  })
  lineMax: number = 100;

  emitSignal?: Signal<number>;
  triggerSignal?: Signal<number>;
  dataSignal?: Signal;
  stateSignal?: Signal<State>;
  unused?: Signal<number>;

  lastTrigger: number = 0;
  linesLength: number[] = [];

  connectedCallback() {
    super.connectedCallback();

    if (!this.url) {
      throw new Error('url is required');
    }

    this.emitSignal = getSignal(this.emit);
    this.emitSignal.value = 0;
    this.triggerSignal = getSignal(this.trigger);
    this.triggerSignal.value = this.lastTrigger;
    this.dataSignal = getSignal(this.data);
    this.stateSignal = getSignal(this.state);
    this.stateSignal.value = State.Loading;

    this.linesLength = Array.from({ length: this.lines }, () => {
      return Math.floor(Math.random() * (this.lineMax - this.lineMin) + this.lineMin);
    });
    console.log(this.linesLength);

    doFetch(this.url, this.dataSignal, this.emitSignal, this.stateSignal);

    this.unused = computed(() => {
      if (this.triggerSignal?.value === this.lastTrigger) {
        return 0;
      }
      this.lastTrigger = this.triggerSignal?.value ?? 0;
      if (this.stateSignal) {
        if (this.stateSignal.value === State.Loading || this.stateSignal.value === State.Reloading) {
          return 0;
        }
        this.stateSignal.value = State.Reloading;
      }
      if (this.dataSignal && this.emitSignal) {
        doFetch(this.url, this.dataSignal, this.emitSignal, this.stateSignal);
      }
      return 0;
    });

    if (this.interval > 0) {
      setInterval(() => {
        if (this.stateSignal) {
          this.stateSignal.value = State.Reloading;
        }
        if (this.dataSignal && this.emitSignal) {
          doFetch(this.url, this.dataSignal, this.emitSignal, this.stateSignal);
        }
      }, this.interval);
    }
  }

  static styles = css`
    .placeholder {
      min-height: 1em;
      vertical-align: middle;
      cursor: wait;
      background-color: currentcolor;
      opacity: 0.5;
      margin-block-start: 0.3em;
      margin-block-end: 0.3em;
    }
  `;
  render() {
    if (this.unused !== undefined) {
      // Just to make the trigger working
      // eslint-disable-next-line @typescript-eslint/no-unused-expressions
      this.unused.value;
    }
    if (this.stateSignal?.value === State.Error) {
      return html`<div>Error</div>`;
    }
    if (this.stateSignal?.value === State.Loading) {
      return map(
        this.linesLength,
        (length) => html`<p aria-hidden="true" class="placeholder" style="width: ${length}%;"></p>`,
      );
    }
    return html`<slot name="content"></slot>`;
  }
}
