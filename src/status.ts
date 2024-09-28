import { LitElement, css, html, svg } from "lit";
import { customElement, property } from "lit/decorators.js";
import { Signal, SignalWatcher } from "@lit-labs/preact-signals";
import { getSignal, State } from "./utils";

/**
 * Fetch data from a URL and store it in a signal.
 */
@customElement("admin-status")
export default class Status extends SignalWatcher(LitElement) {
  @property()
  state: string | Signal<State> = "";
  @property({
    converter: {
      fromAttribute(value: string): string[] {
        return value.split(",").map((v) => v.trim());
      },
      toAttribute(value: string[]): string {
        return value.join(",");
      },
    },
  })
  loading: State[] = [State.Loading, State.Reloading];
  @property({
    converter: {
      fromAttribute(value: string): string[] {
        return value.split(",").map((v) => v.trim());
      },
      toAttribute(value: string[]): string {
        return value.join(",");
      },
    },
  })
  error: State[] = [State.Error];

  stateSignal?: Signal<State>;

  connectedCallback() {
    super.connectedCallback();
    this.stateSignal = getSignal(this.state);
  }

  static styles = css`
    @keyframes rotate {
      100% {
        transform: rotate(360deg);
      }
    }
    .loading {
      display: inline-block;
      animation: rotate 2s linear infinite;
      font-size: 1em;
    }
    .loading svg {
      vertical-align: sub;
    }
    .error {
      font-size: 1em;
    }
    .error svg {
      vertical-align: sub;
    }
    .empty {
      width: 1em;
      display: inline-block;
    }
    .svg {
      fill: "black";
    }
    @media (prefers-color-scheme: dark) {
      .svg {
        fill: rgb(222, 226, 230);
      }
    }
    .svg-error {
      fill: rgb(255, 0, 0);
    }
  `;
  render() {
    if (!this.stateSignal) {
      return html``;
    }
    if (this.loading.includes(this.stateSignal.value)) {
      const loadingSvg = svg`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="1em" height="1em"><circle cx="256" cy="48" r="48" class="svg" style="opacity:1;fill-opacity:1;stroke-width:0;stroke-miterlimit:4;stroke-dasharray:none;stroke-opacity:1"/><circle cx="109.17" cy="108.313" r="43" class="svg" style="opacity:1;fill-opacity:1;stroke-width:0;stroke-miterlimit:4;stroke-dasharray:none;stroke-opacity:1"/><circle cx="46.537" cy="257.328" r="38" class="svg" style="opacity:1;fill-opacity:1;stroke-width:0;stroke-miterlimit:4;stroke-dasharray:none;stroke-opacity:1"/><circle cx="108.028" cy="403.972" r="33" class="svg" style="opacity:1;fill-opacity:1;stroke-width:0;stroke-miterlimit:4;stroke-dasharray:none;stroke-opacity:1"/><circle cx="255.794" cy="463.935" r="28" class="svg" style="opacity:1;fill-opacity:1;stroke-width:0;stroke-miterlimit:4;stroke-dasharray:none;stroke-opacity:1"/><circle cx="402.894" cy="402.936" r="23" class="svg" style="opacity:1;fill-opacity:1;stroke-width:0;stroke-miterlimit:4;stroke-dasharray:none;stroke-opacity:1"/><circle cx="463.623" cy="256.106" r="18" class="svg" style="opacity:1;fill-opacity:1;stroke-width:0;stroke-miterlimit:4;stroke-dasharray:none;stroke-opacity:1"/></svg>`;
      return html`<span class="root"
        ><span class="loading">${loadingSvg}<span></span></span
      ></span>`;
    }
    if (this.error.includes(this.stateSignal.value)) {
      const errorSvg = svg`<?xml version="1.0" encoding="UTF-8" standalone="no"?>
<svg
   class="svg" style="overflow:hidden;fill:currentColor"
   viewBox="0 0 346.45001 346.42499"
   width="1em"
   height="1em">
  <path
     d="m 301.625,346.425 c -11.5,0 -22.9,-4.4 -31.7,-13.1 l -256.7,-256.8 c -17.5,-17.5 -17.5,-45.9 0,-63.4 17.5,-17.5 45.9,-17.5 63.4,0 l 256.7,256.7 c 17.5,17.5 17.5,45.9 0,63.4 -8.8,8.8 -20.3,13.2 -31.7,13.2 z"
     class="svg-error" />
  <path
     d="m 44.825,346.425 c -11.5,0 -22.9,-4.4 -31.7,-13.1 -17.5,-17.5 -17.5,-45.9 0,-63.4 l 256.7,-256.7 c 17.5,-17.5 45.9,-17.5 63.4,0 17.5,17.5 17.5,45.9 0,63.4 l -256.7,256.6 c -8.7,8.8 -20.2,13.2 -31.7,13.2 z"
     class="svg-error" />
</svg>`;

      return html`<span class="root"><span class="error">${errorSvg}</span></span>`;
    }
    return html`<span class="root"><span class="empty"></span></span>`;
  }
}
