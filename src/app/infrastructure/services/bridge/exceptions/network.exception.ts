export class NetworkException extends Error {
  kind: string;

  constructor(message: string) {
    super(message);
    this.name = "BridgeNetworkException";
    this.kind = "bridge";

    Object.setPrototypeOf(this, NetworkException.prototype);
  }
}
