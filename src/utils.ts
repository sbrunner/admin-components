import { Signal, signal } from '@lit-labs/signals';
import { batch } from 'signal-utils/subtle/batched-effect';

const signaux: { [key: string]: Signal.State<any> } = {};

export function getSignal(signalName: string | Signal.State<any>): Signal.State<any> {
  if (signalName instanceof Signal.State) {
    return signalName;
  }
  if (!signalName) {
    return signal(undefined);
  }
  if (!signaux[signalName]) {
    signaux[signalName] = signal(undefined);
  }
  return signaux[signalName];
}

export enum State {
  Initial = 'initial',
  Loading = 'loading',
  Reloading = 'reloading',
  Success = 'success',
  Error = 'error',
}

export function doFetch(
  url: string,
  dataSignal: Signal.State<any>,
  emitSignal: Signal.State<number>,
  stateSignal?: Signal.State<State>,
  method: string = 'GET',
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data: any = null,
) {
  let requestUrl = url;
  if (method === 'GET' && data !== null) {
    const urlObj = new URL(requestUrl, window.location.origin);
    urlObj.search = new URLSearchParams(data).toString();
    requestUrl = urlObj.toString();
  }

  const options: RequestInit = {
    method: method,
  };
  if (method !== 'GET' && data !== null) {
    options.headers = {
      'Content-Type': 'application/json',
    };
    options.body = JSON.stringify(data);
  }
  fetch(requestUrl, options).then(
    (response) => {
      if (!response.ok) {
        console.error('HTTP error on fetching', response);
        if (stateSignal != undefined) {
          stateSignal.set(State.Error);
        }
      } else {
        response.json().then(
          (data) => {
            batch(() => {
              dataSignal.set(data);
              if (stateSignal != undefined) {
                stateSignal.set(State.Success);
              }
              emitSignal.set(emitSignal.get() + 1);
            });
          },
          (error) => {
            console.error('Error on parsing', error);
            if (stateSignal != undefined) {
              stateSignal.set(State.Error);
            }
          },
        );
      }
    },
    (error) => {
      console.error('Error on fetching', error);
      if (stateSignal != undefined) {
        stateSignal.set(State.Error);
      }
    },
  );
}
