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
