import { ListFieldType } from './../../src/index'
import Utils from './../../src/includes/utils'

class TestUtils extends Utils {

  /**
  * Creates probe
  *
  * @param variables
  * @return probe
  */
  static createProbe(_variables) {

    let probe = {
      // Random probe values
      values: {
        fieldTypeProbe: 'fieldTypeProbe:' + TestUtils.getUUID(),
        fieldTypeIdProbe: 'fieldTypeIdProbe:' + TestUtils.getUUID(),
        testCases: [
          {
            'value': null,
            'shouldAllow': false
          },
          {
            'value': undefined,
            'shouldAllow': false
          },
          {
            'value': true,
            'shouldAllow': false
          },
          {
            'value': false,
            'shouldAllow': false
          },
          {
            'value': 0,
            'shouldAllow': false
          },
          {
            'value': 1,
            'shouldAllow': false,
            'expectedValue': 1
          },
          {
            'value': 'abc',
            'shouldAllow': false
          },
          {
            'value': '',
            'shouldAllow': false
          },
          {
            'value': [ 'test' ],
            'shouldAllow': true,
            'expectedValue': [ 'test' ]
          },
          {
            'value': { 'test': 'test' },
            'shouldAllow': false
          }
        ]
      },

      // Probe classes
      classes: {}
    }

    class ProbeFieldType extends ListFieldType {

      constructor(variables = {}) {
        variables.fieldTypeId = probe.values.fieldTypeIdProbe
        super(variables)
      }

      getProb() {
        return probe.values.fieldTypeProbe
      }
    }

    probe.classes.ProbeFieldType = ProbeFieldType
    return probe
  }
}

describe('List - Field type', () => {

  describe('Field construction', () => {
    it('Should construct with random field probes', (done) => {
      let numProbes = 2
      let errors = []

      for (var i = 0; i < numProbes; i++) {
        let probe = TestUtils.createProbe()

        let instance = new probe.classes.ProbeFieldType()

        if (instance.getProb() != probe.values.fieldTypeProbe) {
          errors.push(new Error('Field probe check failed'))
        }

        if (instance.getFieldTypeId() != probe.values.fieldTypeIdProbe) {
          errors.push(new Error('Field id probe check failed'))
        }

        let valueTests = probe.values.testCases

        valueTests.map((testCase, index) => {

          let result = instance.setValue(testCase['value'])

          if (testCase.shouldAllow && !result) {
            errors.push(new Error(`Test case # ${index} failed. It didn't allow value to be type of: ${typeof testCase['value']},
              original value: ${testCase['value']}`))

          } else if (!testCase.shouldAllow && result) {
            errors.push(new Error(`Test case # ${index} failed. Unexpected value was allowed: ${typeof testCase['value']}`))

          } else if (!testCase.shouldAllow && !result) {
            // Ok

          } else {
            // Test expected value
            if (JSON.stringify(instance.getValue()) != JSON.stringify(testCase.expectedValue)) {
              errors.push(new Error(`Test case # ${index} validation failed. Returns: ${instance.getValue()},
                expected: ${testCase.expectedValue}, original value: ${testCase['value']}`))
            }
          }
        })
      }

      if (errors.length > 0) {
        return done(errors[0])
      }

      done()
    })
  })
})
