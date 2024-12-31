export function isObject<T extends object>(input: any): input is T {
  return (
    Object.prototype.toString.call(input).slice(8, -1).toLowerCase() ===
    "object"
  );
}
