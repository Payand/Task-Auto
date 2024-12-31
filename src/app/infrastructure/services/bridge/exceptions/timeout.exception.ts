export class TimeoutException extends Error {
  kind: string;

  constructor(message: string) {
    super(message);
    this.name = "BridgeTimeoutException";
    this.kind = "bridge";

    Object.setPrototypeOf(this, TimeoutException.prototype);
  }
}
