import * as jsonschema from "jsonschema";
import { ValidateJsonSchemaStep } from ".";
import { Input, Output, Json } from "@shanzhai/interfaces";

describe(`ValidateJsonSchemaStep`, () => {
  type TestValue = { readonly keyA: { readonly keyB: `Test Valid` } };

  describe(`on construction`, () => {
    let schema: jsonschema.Schema;
    let inputGet: jasmine.Spy;
    let input: Input<Json>;
    let outputSet: jasmine.Spy;
    let output: Output<TestValue>;
    let validateJsonSchemaStep: ValidateJsonSchemaStep<TestValue>;

    beforeAll(() => {
      schema = {
        type: `object`,
        properties: {
          keyA: {
            type: `object`,
            properties: { keyB: { type: `string`, enum: [`Test Valid`] } },
          },
        },
      };
      inputGet = jasmine.createSpy(`inputGet`);
      input = { get: inputGet };
      outputSet = jasmine.createSpy(`outputSet`);
      output = { set: outputSet };

      validateJsonSchemaStep = new ValidateJsonSchemaStep(
        `Test Name`,
        schema,
        input,
        output
      );
    });

    it(`exposes its name`, () => {
      expect(validateJsonSchemaStep.name).toEqual(`Test Name`);
    });

    it(`exposes the schema`, () => {
      expect(validateJsonSchemaStep.schema).toBe(schema);
    });

    it(`exposes the input`, () => {
      expect(validateJsonSchemaStep.input).toBe(input);
    });

    it(`does not read from the input`, () => {
      expect(inputGet).not.toHaveBeenCalled();
    });

    it(`exposes the output`, () => {
      expect(validateJsonSchemaStep.output).toBe(output);
    });

    it(`does not write to the output`, () => {
      expect(outputSet).not.toHaveBeenCalled();
    });
  });

  describe(`on execution`, () => {
    describe(`when valid`, () => {
      let schema: jsonschema.Schema;
      let inputGet: jasmine.Spy;
      let input: Input<Json>;
      let outputSet: jasmine.Spy;
      let output: Output<TestValue>;
      let validateJsonSchemaStep: ValidateJsonSchemaStep<TestValue>;

      beforeAll(async () => {
        schema = {
          type: `object`,
          properties: {
            keyA: {
              type: `object`,
              properties: { keyB: { type: `string`, enum: [`Test Valid`] } },
            },
          },
        };
        inputGet = jasmine
          .createSpy(`inputGet`)
          .and.returnValue({ keyA: { keyB: `Test Valid` } });
        input = { get: inputGet };
        outputSet = jasmine.createSpy(`outputSet`);
        output = { set: outputSet };

        validateJsonSchemaStep = new ValidateJsonSchemaStep(
          `Test Name`,
          schema,
          input,
          output
        );

        await validateJsonSchemaStep.execute();
      });

      it(`continues to expose its name`, () => {
        expect(validateJsonSchemaStep.name).toEqual(`Test Name`);
      });

      it(`continues to expose the schema`, () => {
        expect(validateJsonSchemaStep.schema).toBe(schema);
      });

      it(`continues to expose the input`, () => {
        expect(validateJsonSchemaStep.input).toBe(input);
      });

      it(`reads from the input once`, () => {
        expect(inputGet).toHaveBeenCalledTimes(1);
      });

      it(`continues to expose the output`, () => {
        expect(validateJsonSchemaStep.output).toBe(output);
      });

      it(`writes to the output once`, () => {
        expect(outputSet).toHaveBeenCalledTimes(1);
      });

      it(`writes the input to the output`, () => {
        expect(outputSet).toHaveBeenCalledWith({
          keyA: { keyB: `Test Valid` },
        });
      });
    });

    describe(`when invalid`, () => {
      let schema: jsonschema.Schema;
      let inputGet: jasmine.Spy;
      let input: Input<Json>;
      let outputSet: jasmine.Spy;
      let output: Output<TestValue>;
      let validateJsonSchemaStep: ValidateJsonSchemaStep<TestValue>;
      let error: null | Error = null;

      beforeAll(async () => {
        schema = {
          type: `object`,
          properties: {
            keyA: {
              type: `object`,
              properties: { keyB: { type: `string`, enum: [`Test Valid`] } },
            },
          },
        };
        inputGet = jasmine
          .createSpy(`inputGet`)
          .and.returnValue({ keyA: { keyB: 123 } });
        input = { get: inputGet };
        outputSet = jasmine.createSpy(`outputSet`);
        output = { set: outputSet };

        validateJsonSchemaStep = new ValidateJsonSchemaStep(
          `Test Name`,
          schema,
          input,
          output
        );

        try {
          await validateJsonSchemaStep.execute();
        } catch (e) {
          error = e;
        }
      });

      it(`continues to expose its name`, () => {
        expect(validateJsonSchemaStep.name).toEqual(`Test Name`);
      });

      it(`continues to expose the schema`, () => {
        expect(validateJsonSchemaStep.schema).toBe(schema);
      });

      it(`continues to expose the input`, () => {
        expect(validateJsonSchemaStep.input).toBe(input);
      });

      it(`reads from the input once`, () => {
        expect(inputGet).toHaveBeenCalledTimes(1);
      });

      it(`continues to expose the output`, () => {
        expect(validateJsonSchemaStep.output).toBe(output);
      });

      it(`does not write to the output`, () => {
        expect(outputSet).not.toHaveBeenCalled();
      });

      it(`throws the expected error`, () => {
        expect(error).toEqual(
          new Error(`JSON schema validation failed:
\tinstance.keyA.keyB - is not of a type(s) string
\tinstance.keyA.keyB - is not one of enum values: Test Valid`)
        );
      });
    });
  });
});
