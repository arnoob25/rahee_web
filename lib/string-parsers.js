export function splitAndGetPart(string, delimiter = "_", part = "last") {
  if (typeof string !== "string") return null;

  const parts = string?.split(delimiter) || [];

  if (part === "first") return parts[0];
  if (part === "last") return parts[parts.length - 1];
  if (typeof part === "number") return parts[part] || null;

  return null;
}

/**
 * Converts any string into a valid CSS selector by:
 * - Converting to lowercase
 * - Replacing invalid characters with hyphens
 * - Adding -id prefix if string starts with a number
 *
 * @param {string} str - The string to convert
 * @returns {string} A valid CSS selector string
 */
export const toValidSelector = (str) => {
  if (!str) return "invalid";

  const selector = str
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

  return /^\d/.test(selector) ? `id-${selector}` : selector;
};

export function matchStringsWithObjects(stringList, objectMap) {
  if (!Array.isArray(stringList)) {
    throw new Error("stringList must be an array");
  }

  if (!objectMap || typeof objectMap !== "object") {
    throw new Error("objectMap must be an object");
  }

  return stringList.reduce((acc, str) => {
    const matchedObject = objectMap[str];
    if (matchedObject) {
      acc.push({ id: str, ...matchedObject });
    }
    return acc;
  }, []);
}

export function capitalizeWord(word) {
  if (!word || typeof word !== "string") return "";
  return word.charAt(0).toUpperCase() + word.slice(1);
}
