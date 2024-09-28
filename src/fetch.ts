import { LitElement, html } from "lit";
import { customElement, property } from "lit/decorators.js";
import {  SignalWatcher } from "@lit-labs/preact-signals";
import { getSignal } from "./utils";

enum State {
  Initial = "initial",
  Loading = "loading",
  Loaded = "loaded",
  Error = "error",
}
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
  emitter: string = "";

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

  emitterSignal: any;
  triggerSignal: any;
  dataSignal: any;
  stateSignal: any;

  connectedCallback() {
    super.connectedCallback();

    if (!this.url) {
      throw new Error("url is required");
    }

    this.emitterSignal = getSignal(this.emitter);
    this.triggerSignal = getSignal(this.trigger);
    this.triggerSignal.value = 0;
    this.dataSignal = getSignal(this.data);
    this.stateSignal = getSignal(this.state);
    this.stateSignal.value = State.Loading;

    fetch(this.url).then(
      (response) => {
        if (!response.ok) {
          console.error("HTTP error on fetching", response);
          this.state = State.Error;
        } else {
          response.json().then(
            (data) => {
              this.dataSignal.value = data;
              this.stateSignal.value = State.Loaded;
              this.triggerSignal.value = this.triggerSignal.value + 1;
            },
            (error) => {
              console.error("Error on parsing", error);
              this.stateSignal.value = State.Error;
            }
          );
        }
      },
      (error) => {
        console.error("Error on fetching", error);
        this.stateSignal.value = State.Error;
      }
    );
  }

  render() {
    if (this.stateSignal.value === State.Error) {
      return html`<div>Error</div>`;
    }
    if (this.stateSignal.value === State.Loading) {
      return html`<div>Loading</div>`;
    }
    return html`<slot name="content"></slot>`;
  }
}
