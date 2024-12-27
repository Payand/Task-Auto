export class CanceledException extends Error {
  kind: string;

  constructor(message: string) {
    super(message);
    this.name = "BridgeCanceledException";
    this.kind = "bridge";

    Object.setPrototypeOf(this, CanceledException.prototype);
  }
}
