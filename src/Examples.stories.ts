import index from './index';
import { common, createLowlight } from 'lowlight';
import { toHtml } from 'hast-util-to-html';

/* For dark mode */
if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
  document.documentElement.setAttribute('data-bs-theme', 'dark');
}

// Just for including in bundle
console.log(index);

const lowlight = createLowlight(common);

function highlight(unsafe: string): string {
  const tree = lowlight.highlight('html', unsafe);
  return toHtml(tree);
}

// More on how to set up stories at: https://storybook.js.org/docs/writing-stories
export default {
  title: 'Examples',
};

const myElementString = `
  /**
   * An example element.
   */
  class MyElement extends window.admin.Element {
    render() {
      if (!this.dataSignal) {
        return window.lit.html\`<p>No data</p>\`;
      }
      const data = this.dataSignal.value;

      return data ? window.lit.map(data.attribute, (item) => window.lit.html\` <p>\${item?.name}: \${item?.value}</p> \`) : window.lit.html\`\`;
    }
  }
  window.customElements.define('my-element', MyElement);
`;
eval(myElementString);

const myFormSring = `
  /**
   * A form element.
   */
  class MyForm extends window.admin.Form {
    render() {
      return window.lit.html\`
        <form action="src/data/action.json" @submit="\${this.handleSubmit}">
          <input type="text" class="form-control" name="name" placeholder="Name" />
          <input type="text" class="form-control" name="value" placeholder="Value" />
          <button type="submit" class="btn btn-primary">
            <admin-status .state="\${this.stateSignal}"></admin-status> Submit
          </button>
        </form>
      \`;
    }
  }
  window.customElements.define('my-form', MyForm);
`;
eval(myFormSring);

const myFormErrorString = `
  /**
   * A form element error.
   */
  class MyFormError extends window.admin.Form {
    render() {
      return window.lit.html\`
        <form action="src/data/error.json" @submit="\${this.handleSubmit}">
          <input type="text" class="form-control" name="name" placeholder="Name" />
          <input type="text" class="form-control" name="value" placeholder="Value" />
          <button type="submit" class="btn btn-primary">
            <admin-status .state="\${this.stateSignal}"></admin-status> Submit
          </button>
        </form>
      \`;
    }
  }
  window.customElements.define('my-form-error', MyFormError);
`;
eval(myFormErrorString);

const header = `
<link
  rel="stylesheet"
  href="https://cdnjs.cloudflare.com/ajax/libs/bootstrap/5.3.3/css/bootstrap.min.css"
  integrity="sha512-jnSuA4Ss2PkkikSOLtYs8BlYIeeIK1h99ty4YfvRPAlzr377vr3CXDb7sb7eEEBYjDtcYj+AjBH3FLv5uSJuXg=="
  crossorigin="anonymous"
  referrerpolicy="no-referrer"
/>
<style>
  a {
    text-decoration: none;
  }
  a:hover {
    text-decoration: underline;
  }
  a:hover[role='button'] {
    text-decoration: none;
  }
  .form-control {
    margin-bottom: 0.5rem;
  }
</style>
`;
const head_hide = `
<link
  rel="stylesheet"
  href="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.8.0/styles/github-dark.min.css"
  crossorigin="anonymous"
  referrerpolicy="no-referrer"
/>
`;

const justFetchString = `
<admin-status state="state1"></admin-status>
<admin-fetch url="src/data/list.json" data="data1" state="state1" line-min="10" line-max="25">
  <my-element slot="content" data="data1"></my-element>
</admin-fetch>`;
export function JustFetch(): string {
  return `
${header}
${head_hide}
<h2>Just fetch</h2>
<p>Just fetch an URL and display the content.</p>
${justFetchString}
<h3>Code</h3>
<pre><code>${highlight(`<script>
window.onload = () => {${myElementString}</script>`)}
${highlight(justFetchString)}</code></pre>

<h3>Head</h3>
<pre><code>${highlight(header)}</code></pre>`;
}

const regularlyFetchString = `
<admin-status state="state2"></admin-status>
<admin-fetch
  url="src/data/list.json"
  data="data2"
  interval="1000"
  state="state2"
  line-min="10"
  line-max="25"
>
  <my-element slot="content" data="data2"></my-element>
</admin-fetch>`;

export function RegularlyFetch(): string {
  return `
${header}
${head_hide}
<h2>Regularly fetch</h2>
Fetch an URL every 1s and display the content.
${regularlyFetchString}
<h3>Code</h3>
<pre><code>${highlight(`<script>
window.onload = () => {${myElementString}</script>`)}
${highlight(regularlyFetchString)}</code></pre>

<h3>Head</h3>
<pre><code>${highlight(header)}</code></pre>`;
}

const refreshString = `
<admin-link emit="event3" admin-class="btn btn-primary" admin-role="button">Reload</admin-link>
<div style="width: 20rem; position: relative">
  <div style="position: absolute; top: 0; right: 0; font-size: 2em">
    <admin-status state="state3" no-empty="true" loading="reloading" success=""></admin-status>
  </div>
  <admin-fetch url="src/data/list.json" trigger="event3" data="data3" state="state3">
    <my-element slot="content" data="data3"></my-element>
  </admin-fetch>
</div>`;
export function Refresh(): string {
  return `
${header}
${head_hide}
<h2>With a refresh button</h2>
<p>Click on the button to reload the content.</p>
${refreshString}
<h3>Code</h3>
<pre><code>${highlight(`<script>
window.onload = () => {${myElementString}</script>`)}
${highlight(refreshString)}</code></pre>

<h3>Head</h3>
<pre><code>${highlight(header)}</code></pre>`;
}

const actionLinkString = `
<admin-link
  emit="event4"
  admin-class="btn btn-primary"
  admin-href="src/data/action.json"
  admin-role="button"
  >Do <b>an</b> action</admin-link
>
Loading: <admin-status state="state4d" loading="loading" success="success,reloading"></admin-status>,
Reloading:
<admin-status state="state4d" loading="reloading" success="success,loading"></admin-status>
<admin-fetch
  url="src/data/list.json"
  trigger="event4"
  data="data4"
  state="state4d"
  line-min="10"
  line-max="25"
>
  <my-element slot="content" data="data4"></my-element>
</admin-fetch>`;
export function ActionLink(): string {
  return `
${header}
${head_hide}
<h2>With an link that do an action and trigger a refresh</h2>
${actionLinkString}
<h3>Code</h3>
<pre><code>${highlight(`<script>
window.onload = () => {${myElementString}</script>`)}
${highlight(actionLinkString)}</code></pre>

<h3>Head</h3>
<pre><code>${highlight(header)}</code></pre>`;
}

const customFormString = `
<my-form emit="event5"></my-form>
<admin-fetch url="src/data/list.json" trigger="event5" data="data5" line-min="10" line-max="25">
  <my-element slot="content" data="data5"></my-element>
</admin-fetch>`;
export function CustomForm(): string {
  return `
${header}
${head_hide}
<h2>With a form that do an action and trigger a refresh</h2>
${customFormString}
<h3>Code</h3>
<pre><code>${highlight(`<script>
window.onload = () => {${myFormSring}${myElementString}</script>`)}
${highlight(customFormString)}</code></pre>

<h3>Head</h3>
<pre><code>${highlight(header)}</code></pre>`;
}

const customFormErrorString = `
<my-form-error></my-form-error>`;
export function CustomFormError(): string {
  return `
${header}
${head_hide}
<h2>With a form that do an error</h2>
${customFormErrorString}
<h3>Code</h3>
<pre><code>${highlight(`<script>
window.onload = () => {${myFormErrorString}</script>`)}
${highlight(myFormErrorString)}</code></pre>

<h3>Head</h3>
<pre><code>${highlight(header)}</code></pre>`;
}

const errorString = `
<admin-link admin-class="btn btn-primary" admin-href="src/data/error.json" admin-role="button"
  >Do an error</admin-link
>`;
export function Error(): string {
  return `
${header}
${head_hide}
<h2>With an link on error</h2>
${errorString}
<h3>Code</h3>
<pre><code>${highlight(`<script>
window.onload = () => {${myElementString}</script>`)}
${highlight(errorString)}</code></pre>

<h3>Head</h3>
<pre><code>${highlight(header)}</code></pre>`;
}

const simpleTableFormString = `
<admin-form>
  {
    "action": "src/data/action.json",
    "fields": [
      {
        "name": "name",
        "label": "Name"
      },
      {
        "name": "value",
        "label": "Value"
      }
    ]
  }
</admin-form>`;
export function SimpleTableForm(): string {
  return `
${header}
${head_hide}
<h2>Simple form</h2>
${simpleTableFormString}
<h3>Code</h3>
<pre><code>${highlight(`<script>
window.onload = () => {${myElementString}</script>`)}
${highlight(simpleTableFormString)}</code></pre>

<h3>Head</h3>
<pre><code>${highlight(header)}</code></pre>`;
}

const simpleLineFormString = `
<admin-form>
  <pre>
  {
    "action": "src/data/action.json",
    "type": "line",
    "fields": [
      {
        "name": "name",
        "placeholder": "Name"
      },
      {
        "name": "value",
        "placeholder": "Value"
      }
    ]
  }
  </pre>
</admin-form>`;
export function SimpleLineForm(): string {
  return `
${header}
${head_hide}
<h2>Simple one line form</h2>
${simpleLineFormString}
<h3>Code</h3>
<pre><code>${highlight(`<script>
window.onload = () => {${myElementString}</script>`)}
${highlight(simpleLineFormString)}</code></pre>

<h3>Head</h3>
<pre><code>${highlight(header)}</code></pre>`;
}
