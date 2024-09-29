import { LitElement, css, html, svg } from "lit";
import { customElement, property } from "lit/decorators.js";
import { Signal, SignalWatcher } from "@lit-labs/preact-signals";
import { getSignal, State } from "./utils";

const converter = {
  fromAttribute(value: string): string[] {
    return value.split(",").map((v) => v.trim());
  },
  toAttribute(value: string[]): string {
    return value.join(",");
  },
};

/**
 * Fetch data from a URL and store it in a signal.
 */
@customElement("admin-status")
export default class Status extends SignalWatcher(LitElement) {
  @property()
  state: string | Signal<State> = "";
  @property({
    converter,
  })
  loading: State[] = [State.Loading, State.Reloading];
  @property({
    converter,
  })
  success: State[] = [State.Success];
  @property({
    converter,
  })
  error: State[] = [State.Error];
  @property({
    attribute: "no-empty",
  })
  noEmpty: boolean = false;

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
    .svg-error {
      fill: var(--bs-danger);
    }
    .svg-success {
      fill: var(--bs-success);
    }
  `;

  loadingSvg = svg`<svg xmlns="http://www.w3.org/2000/svg"  style="overflow:hidden;fill:currentColor" viewBox="0 0 512 512" width="1em" height="1em"><circle cx="256" cy="48" r="48" class="svg" style="opacity:1;fill-opacity:1;stroke-width:0;stroke-miterlimit:4;stroke-dasharray:none;stroke-opacity:1"/><circle cx="109.17" cy="108.313" r="43" class="svg" style="opacity:1;fill-opacity:1;stroke-width:0;stroke-miterlimit:4;stroke-dasharray:none;stroke-opacity:1"/><circle cx="46.537" cy="257.328" r="38" class="svg" style="opacity:1;fill-opacity:1;stroke-width:0;stroke-miterlimit:4;stroke-dasharray:none;stroke-opacity:1"/><circle cx="108.028" cy="403.972" r="33" class="svg" style="opacity:1;fill-opacity:1;stroke-width:0;stroke-miterlimit:4;stroke-dasharray:none;stroke-opacity:1"/><circle cx="255.794" cy="463.935" r="28" class="svg" style="opacity:1;fill-opacity:1;stroke-width:0;stroke-miterlimit:4;stroke-dasharray:none;stroke-opacity:1"/><circle cx="402.894" cy="402.936" r="23" class="svg" style="opacity:1;fill-opacity:1;stroke-width:0;stroke-miterlimit:4;stroke-dasharray:none;stroke-opacity:1"/><circle cx="463.623" cy="256.106" r="18" class="svg" style="opacity:1;fill-opacity:1;stroke-width:0;stroke-miterlimit:4;stroke-dasharray:none;stroke-opacity:1"/></svg>`;
  errorSvg = svg`<svg
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
  emptySvg = svg`<?xml version="1.0" encoding="UTF-8" standalone="no"?>
<svg
class="svg"
style="overflow:hidden;fill:currentColor"
viewBox="0 0 346.45001 346.42499"
width="1em"
height="1em"
>

<circle
 style="stroke-width:1.30992"
 cx="173.22501"
     cy="240"
 r="57.713982" />
</svg>`;
  successSvg = svg`<svg class="svg"
style="overflow:hidden;fill:currentColor"
width="1em"
height="1em"
   viewBox="0 0 1024 1024"
   version="1.1"
>
  <path
     d="m 359.26491,1020.6876 c -40.96,0 -76.8,-15.36 -107.52,-46.07997 l -204.800001,-204.8 c -61.44,-61.44 -61.44,-158.72 0,-215.04 61.440001,-61.44 158.720001,-61.44 215.040001,0 l 107.52,107.52 404.48,-322.56 c 66.56,-51.2 163.84,-40.96 215.04,25.6 51.19999,66.56 40.95999,163.84 -25.6,215.04 l -512,409.6 c -25.6,20.47997 -56.32,30.71997 -92.16,30.71997"
     class="svg-success"
     style="stroke-width:2" />
</svg>`;
  render() {
    if (!this.stateSignal) {
      return html``;
    }
    if (this.loading.includes(this.stateSignal.value)) {
      return html`<span class="root"
        ><span class="loading">${this.loadingSvg}<span></span></span
      ></span>`;
    }
    if (this.error.includes(this.stateSignal.value)) {
      return html`<span class="root"><span class="error">${this.errorSvg}</span></span>`;
    }
    if (this.success.includes(this.stateSignal.value)) {
      return html`<span class="root"><span class="success">${this.successSvg}</span></span>`;
    }
    if (this.noEmpty) {
      return html``;
    }
    return html`<span class="root"><span class="empty">${this.emptySvg}</span></span>`;
  }
}
