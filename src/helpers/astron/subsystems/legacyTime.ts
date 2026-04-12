import { SetDatetime } from "../legacyBridge";

export function setUtcInstant(d: Date): void {
  SetDatetime(d);
}
