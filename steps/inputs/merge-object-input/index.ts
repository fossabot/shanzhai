import { Input } from "../input";

export class MergeObjectInput<TValue>
  implements Input<{ readonly [key: string]: TValue }> {
  constructor(
    public readonly sources: ReadonlyArray<
      Input<{ readonly [key: string]: TValue }>
    >
  ) {}

  get(): { readonly [key: string]: TValue } {
    const output: { [key: string]: TValue } = {};

    for (const source of this.sources) {
      const data = source.get();

      for (const key in data) {
        if (Object.prototype.hasOwnProperty.call(output, key)) {
          throw new Error(
            `Unable to merge objects as key ${JSON.stringify(
              key
            )} exists in more than one source.`
          );
        }

        output[key] = data[key];
      }
    }

    return output;
  }
}