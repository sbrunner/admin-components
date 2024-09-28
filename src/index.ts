import { LitElement, css, html } from "lit";
import { classMap } from "lit/directives/class-map.js";
import { styleMap } from "lit/directives/style-map.js";
import { when } from "lit/directives/when.js";
import { choose } from "lit/directives/choose.js";
import { map } from "lit/directives/map.js";
import { repeat } from "lit/directives/repeat.js";
import { join } from "lit/directives/join.js";
import { range } from "lit/directives/range.js";
import { ifDefined } from "lit/directives/if-defined.js";
import { cache } from "lit/directives/cache.js";
import { keyed } from "lit/directives/keyed.js";
import { guard } from "lit/directives/guard.js";
import { live } from "lit/directives/live.js";
import { ref } from "lit/directives/ref.js";
import { templateContent } from "lit/directives/template-content.js";
import { unsafeHTML } from "lit/directives/unsafe-html.js";
import { unsafeSVG } from "lit/directives/unsafe-svg.js";
import { until } from "lit/directives/until.js";
import { asyncAppend } from "lit/directives/async-append.js";
import { asyncReplace } from "lit/directives/async-replace.js";
import list from "./fetch.js";
import Element from "./element.js";

import { SignalWatcher, signal } from "@lit-labs/preact-signals";

// To force to be included in the bundle
console.log(list);

window.admin = {
  Element,
};
window.lit = {
  LitElement,
  css,
  html,
  classMap,
  styleMap,
  when,
  choose,
  map,
  repeat,
  join,
  range,
  ifDefined,
  cache,
  keyed,
  guard,
  live,
  ref,
  templateContent,
  unsafeHTML,
  unsafeSVG,
  until,
  asyncAppend,
  asyncReplace,
  signal: {
    SignalWatcher,
    signal,
  },
};
