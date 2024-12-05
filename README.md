# Admin components

## Introduction

Provide some component to build admin or technical interface, where we don't want to setup a JavaScript build,
to add some interactivity to the page.

## Examples

StroyBook available in [Chromatic](https://66f96ae1df9a2e46226b9fe8-nxwnsqmwzm.chromatic.com).

## Components

### `<admin-fetch>`

This component is used to fetch data from an API.

#### Attributes

- `url`: the URL to fetch data from.
- `emit`: the signal name to emit when the data is fetched (counter).
- `trigger`: the signal name to listen to trigger to fetch the data (counter).
- `data`: the signal name to listen to to get the data.
- `state`: the signal name to listen to to get the state of the fetch.
- `interval`: the interval in milliseconds to fetch the data (disabled by default).
- `lines`: the number of lines to display as placeholder during the first fetch (3 by default).
- `line-min`: the minimum number line width in percent to display as placeholder (0 by default).
- `line-max`: the maximum number line width in percent to display as placeholder (100 by default).

#### Slots

- `content`: the content to display when the data is fetched.

### `<admin-status>`

This component is used to display the status of a fetch.

#### Attributes

- `state`: the signal name to listen to to get the state.
- `loading`: the state values to consider as loading (`loading,reloading` by default).
- `success`: the state values to consider as success (`success` by default).
- `error`: the state values to consider as error (`error` by default).
- `no-empty`: if set to `true`, the component will not display anything by default.

### `<admin-link>`

This component is used to create a link to an admin page.

#### Attributes

- `admin-href`: the URL to link to.
- `admin-class`: the class to apply to the link.
- `admin-role`: the role to apply to the link.
- `data`: the signal name to listen to to get the data.
- `emit`: the signal name to emit when we successfully get the data (counter).
- `state` the signal name to listen to to get the state of the fetch.

### `<admin-form>`

This component is used to create a form to send data to an API.

#### Attributes

- `data`: the signal name to listen to to get the data.
- `emit`: the signal name to emit when we successfully send the data (counter).
- `state` the signal name to listen to to get the state of the fetch.

#### `innerText`

The content of the component is used to create the form is parsed as JSON.

Example of table form:

```json
{
  "action": "src/data/action.json",
  "fields": [
    {
      "name": "name",
      "label": "Name"
    },
    {
      "type": "email",
      "name": "email",
      "label": "Email"
    },
    {
      "type": "password",
      "name": "password",
      "label": "Password"
    }
  ]
}
```

Example of one line form:

```json
{
  "action": "src/data/action.json",
  "type": "line",
  "fields": [
    {
      "name": "name",
      "placeholder": "Name"
    },
    {
      "type": "email",
      "name": "email",
      "placeholder": "Email"
    },
    {
      "type": "password",
      "name": "password",
      "placeholder": "Password"
    }
  ]
}
```

### Component to exploit the fetched content

```javascript
class MyElement extends window.admin.Element {
  render() {
    const data = this.dataSignal.value;

    return window.lit.map(data.attribute, (item) => window.lit.html\` <p>\${item?.name}: \${item?.value}</p> \`);
  }
}
window.customElements.define('my-element', MyElement);
```

```html
<admin-fetch url="src/data/list.json" data="data" line-min="10" line-max="25">
  <my-element slot="content" data="data"></my-element> </admin-fetch
>`;
```
