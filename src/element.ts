import { LitElement } from "lit";
import { property } from "lit/decorators.js";
import { SignalWatcher } from "@lit-labs/preact-signals";
import { getSignal } from "./utils";

export default class Element extends SignalWatcher(LitElement) {
  /**
   * The Signal name from where we get the data.
   */
  @property()
  data: string = "";
  dataSignal: any;

  connectedCallback() {
    super.connectedCallback();
    if (!this.data) {
      throw new Error("signal is required");
    }
    this.dataSignal = getSignal(this.data);
  }

  override createRenderRoot() {
    return this;
  }
}
