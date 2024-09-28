import { signal } from "@lit-labs/preact-signals";

const signaux: any = {};

export function getSignal(signalName: string) {
  if (!signalName) {
    return signal();
  }
  if (!signaux[signalName]) {
    signaux[signalName] = signal();
  }
  return signaux[signalName];
}

export enum State {
    Initial = "initial",
    Loading = "loading",
    Reloading = "reloading",
    Loaded = "loaded",
    Error = "error",
  }

  export function doFetch(url: string, dataSignal: any, emitSignal: any, stateSignal?: any) {
    fetch(url).then(
        (response) => {
          if (!response.ok) {
            console.error("HTTP error on fetching", response);
            if (stateSignal != undefined) {
                stateSignal.value = State.Error;
        }
          } else {
            response.json().then(
              (data) => {
                dataSignal.value = data;
                if (stateSignal != undefined) {
                stateSignal.value = State.Loaded;
                }
                emitSignal.value = emitSignal.value + 1;
              },
              (error) => {
                console.error("Error on parsing", error);
                if (stateSignal != undefined) {
                stateSignal.value = State.Error;
                }
              }
            );
          }
        },
        (error) => {
          console.error("Error on fetching", error);
          if (stateSignal != undefined) {
          stateSignal.value = State.Error;
          }
        }
      );
    }

