export function resolveValueFromOptionalCallback(
  valueOrCallback,
  currentState
) {
  return typeof valueOrCallback === "function"
    ? valueOrCallback(currentState)
    : valueOrCallback;
}
