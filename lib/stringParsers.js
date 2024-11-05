export function splitAndGetPart(string, delimiter = "_", part = "last") {
  if (typeof string !== "string") return null;
  
  const parts = string?.split(delimiter) || [];

  if (part === "first") return parts[0];
  if (part === "last") return parts[parts.length - 1];
  if (typeof part === "number") return parts[part] || null;

  return null;
}
