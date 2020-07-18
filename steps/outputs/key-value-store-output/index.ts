import { KeyValueStoreInterface } from "../../../stores/key-value-store";
import { Output } from "../output";

export class KeyValueStoreOutput<TKey, TValue> implements Output<TValue> {
  constructor(
    public readonly keyValueStore: KeyValueStoreInterface<TKey, TValue>,
    public readonly key: TKey
  ) {}

  set(value: TValue): void {
    this.keyValueStore.set(this.key, value);
  }
}
