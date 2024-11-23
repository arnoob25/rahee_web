import { useObservable } from "@legendapp/state/react";

export function useState(initialState) {
  const state$ = useObservable(initialState);
  return [state$.get(), state$.set, state$];
}
