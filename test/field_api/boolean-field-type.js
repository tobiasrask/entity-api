import assert from "assert"
import { BooleanFieldType } from "./../../src/index"
import Utils from "./../../src/includes/utils"

class TestUtils extends Utils {

  /**
  * Creates probe
  *
  * @param variables
  * @return probe
  */
  static createProbe(variables) {

    let probe = {
      // Random probe values
      values: {
        fieldTypeProbe: 'fieldTypeProbe:' + TestUtils.getUUID(),
        fieldTypeIdProbe: 'fieldTypeIdProbe:' + TestUtils.getUUID(),
        testCases: [
          {
            'value': null,
            'shouldAllow': true,
            'expectedValue': false
          },
          {
            'value': undefined,
            'shouldAllow': true,
            'expectedValue': false
          },
          {
            'value': true,
            'shouldAllow': true,
            'expectedValue': true
          },
          {
            'value': false,
            'shouldAllow': true,
            'expectedValue': false
          },
          {
            'value': 0,
            'shouldAllow': true,
            'expectedValue': false
          },
          {
            'value': 1,
            'shouldAllow': true,
            'expectedValue': true
          },
          {
            'value': 2,
            'shouldAllow': true,
            'expectedValue': true
          },
          {
            'value': -1,
            'shouldAllow': true,
            'expectedValue': true
          },
          {
            'value': 'abc',
            'shouldAllow': true,
            'expectedValue': true
          },
          {
            'value': '',
            'shouldAllow': true,
            'expectedValue': false
          },
          {
            'value': [ 'test' ],
            'shouldAllow': true,
            'expectedValue': true
          },
          {
            'value': { 'test': 'test' },
            'shouldAllow': true,
            'expectedValue': true
          }
        ]
      },

      // Probe classes
      classes: {}
    }

    class ProbeFieldType extends BooleanFieldType {

      constructor(variables = {}) {
        variables.fieldTypeId = probe.values.fieldTypeIdProbe;
        super(variables);
      }

      getProb() {
        return probe.values.fieldTypeProbe;
      }
    }

    probe.classes.ProbeFieldType = ProbeFieldType;
    return probe;
  }
}

describe('Boolean - Field type', () => {

  describe('Field construction', () => {
    it('Should construct with random field probes', (done) => {
      let numProbes = 2;
      let errors = [];

      for (var i = 0; i < numProbes; i++) {
        let probe = TestUtils.createProbe();

        let instance = new probe.classes.ProbeFieldType();

        if (instance.getProb() != probe.values.fieldTypeProbe)
          errors.push(new Error("Field probe check failed"));

        if (instance.getFieldTypeId() != probe.values.fieldTypeIdProbe)
          errors.push(new Error("Field id probe check failed"));

        let valueTests = probe.values.testCases;

        valueTests.map((testCase, index) => {

          let result = instance.setValue(testCase['value']);

          if (testCase.shouldAllow && !result) {
            errors.push(new Error("Test case #" + index + " failed. Didn't allow value to be type of: " + typeof testCase['value']));

          } else if (!testCase.shouldAllow && result) {
            errors.push(new Error("Test case #" + index + " failed. Unexpected value was allowed: " + typeof testCase['value']));

          } else {
            // Test expected value
            if (instance.getValue() != testCase.expectedValue)
              errors.push(new Error("Test case #" + index + " validation failed. Returns: " + instance.getValue()) + ", expected: " + testCase.expectedValue + ", original value: " + testCase['value']);
          }
        });
      }

      if (errors.length > 0)
        return done(errors[0]);

      done();
    })
  });
});
