import { LitElement, html } from "lit";
import { customElement, property } from "lit/decorators.js";
import { computed, SignalWatcher, watch, computed } from "@lit-labs/preact-signals";
import { getSignal, State, doFetch } from "./utils";

/**
 * Fetch data from a URL and store it in a signal.
 */
@customElement("admin-fetch")
export default class AdminFetch extends SignalWatcher(LitElement) {
  /**
   * URL to fetch data from.
   */
  @property()
  url: string = "";

  /**
   * Signal name of a counter to be notified on a successful fetch.
   */
  @property()
  emit: string = "";

  /**
   * Signal name of a counter to trigger a fetch.
   */
  @property()
  trigger: string = "";

  /**
   * Signal name of the fetched data.
   */
  @property()
  data: string = "";

  /**
   * Signal name of the state of the fetch.
   */
  @property()
  state: string = "";

  /**
   * Time interval to fetch data [milliseconds].
   */
  @property()
  interval: number = -1;

  emitSignal: any;
  triggerSignal: any;
  dataSignal: any;
  stateSignal: any;

  connectedCallback() {
    super.connectedCallback();

    if (!this.url) {
      throw new Error("url is required");
    }

    this.emitSignal = getSignal(this.emit);
    this.emitSignal.value = 0;
    this.triggerSignal = getSignal(this.trigger);
    this.dataSignal = getSignal(this.data);
    this.stateSignal = getSignal(this.state);
    this.stateSignal.value = State.Loading;

    doFetch(this.url, this.dataSignal, this.emitSignal, this.stateSignal);

    this.unused = computed(() => {
      this.stateSignal.value = State.Reloading;
      doFetch(this.url, this.dataSignal, this.emitSignal, this.stateSignal);
      return this.triggerSignal.value;
    });

    if (this.interval > 0) {
      setInterval(() => {
        this.stateSignal.value = State.Reloading;
        doFetch(this.url, this.dataSignal, this.emitSignal, this.stateSignal);
      }, this.interval);
    }
  }

  render() {
    watch(this.unused.value);
    if (this.stateSignal.value === State.Error) {
      return html`<div>Error</div>`;
    }
    if (this.stateSignal.value === State.Loading) {
      return html`<div>Loading</div>`;
    }
    return html`<slot name="content"></slot>`;
  }
}
