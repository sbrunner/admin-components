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

function handleError(
  error: any,
  emitSignal: Signal.State<number>,
  stateSignal?: Signal.State<State>,
  options: { emitOnError?: boolean } = {},
) {
  console.error('Error on parsing', error);
  batch(() => {
    stateSignal?.set(State.Error);
    if (options.emitOnError) {
      emitSignal.set(emitSignal.get() + 1);
    }
  });
}

export function doFetch(
  url: string,
  dataSignal: Signal.State<any>,
  emitSignal: Signal.State<number>,
  stateSignal?: Signal.State<State>,
  method: string = 'GET',
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data: any = null,
  options: { emitOnError?: boolean; dataOnError?: boolean } = {},
) {
  let requestUrl = url;
  if (method === 'GET' && data !== null) {
    const urlObj = new URL(requestUrl, window.location.origin);
    urlObj.search = new URLSearchParams(data).toString();
    requestUrl = urlObj.toString();
  }

  const requestOptions: RequestInit = {
    method: method,
  };
  if (method !== 'GET' && data !== null) {
    requestOptions.headers = {
      'Content-Type': 'application/json',
    };
    requestOptions.body = JSON.stringify(data);
  }
  fetch(requestUrl, requestOptions).then(
    (response) => {
      if (!response.ok) {
        console.error('HTTP error on fetching', response);
        if (options.dataOnError) {
          response.json().then(
            (data) => {
              batch(() => {
                stateSignal?.set(State.Error);
                if (options.emitOnError) {
                  emitSignal.set(emitSignal.get() + 1);
                }
                dataSignal.set(data);
              });
            },
            (error) => {
              handleError(error, emitSignal, stateSignal, options);
            },
          );
        } else {
          batch(() => {
            stateSignal?.set(State.Error);
            if (options.emitOnError) {
              emitSignal.set(emitSignal.get() + 1);
            }
          });
        }
      } else {
        response.json().then(
          (data) => {
            batch(() => {
              dataSignal.set(data);
              stateSignal?.set(State.Success);
              emitSignal.set(emitSignal.get() + 1);
            });
          },
          (error) => {
            handleError(error, emitSignal, stateSignal, options);
          },
        );
      }
    },
    (error) => {
      console.error('Error on fetching', error);
      batch(() => {
        stateSignal?.set(State.Error);
        if (options.emitOnError) {
          emitSignal.set(emitSignal.get() + 1);
        }
      });
    },
  );
}
