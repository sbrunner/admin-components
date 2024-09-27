
import { SignalWatcher, signal } from "@lit-labs/preact-signals";
import { LitElement } from "lit";
import {  property } from "lit/decorators.js";
import {signal, SignalWatcher} from '@lit-labs/preact-signals';


export default class Element extends SignalWatcher(LitElement) {

  @property()
  signal: string = "";

  connectedCallback() {
    super.connectedCallback();
    if (!this.signal) {
        throw new Error("signal is required");
    }
    if (window[this.signal] === undefined) {
      window[this.signal] = signal();
    }
    }


    getSignal() {
        return window[this.signal];
    }
}
