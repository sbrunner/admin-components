import { LitElement, html } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import {signal} from '@lit-labs/preact-signals';

enum State {
  Initial,
  Loading,
  Loaded,
  Error,
}
/**
 * An list element.
 */
@customElement("admin-fetch")
export default class AdminFetch extends LitElement {
  /**
   * Copy for the read the docs hint.
   */
  @property()
  url: string = "";

  @property()
  signal: string = "";

  @state()
  state: State = State.Initial;

  connectedCallback() {
    super.connectedCallback();
    if (window[this.signal] === undefined) {
      window[this.signal] = signal();
    };

    this.state = State.Loading;
    fetch(this.url).then(
      (response) => {
        if (!response.ok) {
          console.error("HTTP error on fetching", response);
          this.state = State.Error;
        } else {
          response.json().then(
            (data) => {
              window[this.signal].value = data;
              this.state = State.Loaded;
            },
            (error) => {
              console.error("Error on parsing", error);
              this.state = State.Error;
            }
          );
        }
      },
      (error) => {
        console.error("Error on fetching", error);
        this.state = State.Error;
      }
    );
  }

  render() {
    if (this.state === State.Error) {
      return html`<div>Error</div>`;
    }
    if (this.state === State.Loading) {
      return html`<div>Loading</div>`;
    }
    return html`<slot name="content"></slot>`;
  }
}
