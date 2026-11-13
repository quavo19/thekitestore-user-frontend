// Keep punctuation consistent in displayed catalogue text without changing stored data.
export function displayText(value) {
  return typeof value === "string" ? value.replaceAll("\u2014", "-") : value;
}
