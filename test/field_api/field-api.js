import { FieldAPI, Field, FieldType } from './../../src/index'
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
        fieldAPIProbe: 'fieldAPIProbe:' + TestUtils.getUUID(),
        fieldProbe: 'fieldProb:' + TestUtils.getUUID(),
        fieldIdProbe: 'fieldIdProb:' + TestUtils.getUUID(),
        fieldTypeIdProbe: 'fieldTypeIdProb:' + TestUtils.getUUID(),
      },
      // Probe classes
      classes: {}
    }

    class ProbeFieldAPI extends FieldAPI {
      getProb() {
        return probe.values.fieldAPIProbe
      }
    }

    class ProbeField extends Field {

      constructor(variables = {}) {
        variables.fieldId = probe.values.fieldIdProbe
        super(variables)
      }

      getProb() {
        return probe.values.fieldProbe
      }
    }

    class ProbeFieldType extends FieldType {

      constructor(variables = {}) {
        variables.fieldTypeId = probe.values.fieldTypeIdProbe
        super(variables)
      }

      getProb() {
        return probe.values.fieldProbe
      }
    }

    probe.classes.ProbeFieldAPI = ProbeFieldAPI
    probe.classes.ProbeFieldType = ProbeFieldType
    probe.classes.ProbeField = ProbeField
    return probe
  }
}

describe('Field API', () => {

  describe('Field construction with Field API', () => {
    it('Should construct with random field probes', (done) => {
      let numProbes = 2
      let errors = []

      // Field probes
      let probes = []
      for (var i = 0; i < numProbes; i++) {
        let probe = TestUtils.createProbe()
        probes.push(probe)
      }

      probes.map((probe) => {

        let params = {
          skipDefaultFields: true,
          skipDefaultFieldTypes: true,
          fields: {},
          fieldTypes: {}
        }

        params.fields[probe.values.fieldIdProbe] = probe.classes.ProbeField
        params.fieldTypes[probe.values.fieldTypeIdProbe] = probe.classes.ProbeFieldType

        let api = new probe.classes.ProbeFieldAPI(params)

        if (api.getProb() != probe.values.fieldAPIProbe) {
          return errors.push(new Error('Field API probe check failed'))
        }

        let testField = null

        // Try to create unknown field, should throw error...
        try {
          testField = api.createField('random:field:id', 'random:field:type')
          return errors.push(new Error('Field API didn\'t throw error for random field'))
        } catch (err) {
          // We expected field api to throw error, so this is ok

        }

        try {
          testField = api.createField(probe.values.fieldIdProbe, probe.values.fieldTypeIdProbe)
        } catch (err) {
          return errors.push(err)
        }

        if (!testField) {
          return errors.push(new Error(`Field API didn't create field: ${probe.values.fieldIdProbe}`))
        }

        if (testField.getProb() != probe.values.fieldProbe) {
          return errors.push(new Error(`Fieldinstance probe check failed: ${probe.values.fieldProbe}`))
        }

        if (testField.getFieldId() != probe.values.fieldIdProbe) {
          return errors.push(new Error(`Field instance constructed with illegal id: ${testField.getFieldId()},
            expecting: ${probe.values.fieldIdProbe}`))
        }

        let testFieldType = testField.getFieldTypeInstance()

        if (!testFieldType) {
          return errors.push(new Error('Field instance didn\'t return field type.'))
        }

        if (testFieldType.getProb() != probe.values.fieldProbe) {
          return errors.push(new Error(`Field type instance probe check failed: ${probe.values.fieldProbe}`))
        }

        if (testFieldType.getFieldTypeId() != probe.values.fieldTypeIdProbe) {
          return errors.push(new Error(`Field type instance constructed with illegal id: ${testFieldType.getFieldTypeId()},
            expecting: ${probe.values.fieldTypeIdProbe}`))
        }
      })

      if (errors.length > 0) {
        return done(errors[0])
      }

      done()
    })
  })
})