import assert from "assert"
import { FieldAPI, Field } from "./../../src/index"
import Utils from "./../../src/misc/utils"

let fieldAPI = new FieldAPI();

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
        fieldAPIProbe: 'fieldAPIProbe:' + TestUtils.getUUID(),
        fieldProbe: 'fieldProb:' + TestUtils.getUUID(),
        fieldIdProbe: 'fieldIdProb:' + TestUtils.getUUID(),
        fieldNameProbe: 'fieldNameProb:' + TestUtils.getUUID(),
        fieldDescProbe: 'fieldNameProb:' + TestUtils.getUUID(),
        fieldPropertyKeyProbe: 'fieldPropertyKeyProb:' + TestUtils.getUUID(),
        fieldPropertyValueProbe: 'fieldPropertyValueProbe:' + TestUtils.getUUID(),
      },
      // Probe classes
      classes: {}
    }

    class ProbeFieldAPI extends FieldAPI {
      getProb() {
        return probe.values.fieldAPIProbe;
      }      
    }

    class ProbeField extends Field {

      constructor(variables = {}) {
        variables.fieldId = probe.values.fieldIdProbe;
        super(variables);
      }

      getProb() {
        return probe.values.fieldProbe;
      }      
    }

    probe.classes.ProbeFieldAPI = ProbeFieldAPI;
    probe.classes.ProbeField = ProbeField;
    return probe;
  }
}

describe('Field API', () => {

  describe('Field construction with Field API', () => {
    it('Should construct with random field probes', (done) => {
      let numProbes = 2;
      let errors = [];

      // Field probes
      let probes = [];
      for (var i = 0; i < numProbes; i++) {
        let probe = TestUtils.createProbe();
        probes.push(probe);
      }

      probes.map(probe => {

        let params = {
          skipDefaultFields: true,
          skipDefaultFieldTypes: true,
          fields: [],
          fieldTypes: []
        };

        let api = new probe.classes.ProbeFieldAPI(params);

        if (api.getProb() != probe.values.fieldAPIProbe)
          return errors.push(new Error("Field API probe check failed"));
      });

      if (errors.length > 0)
        return done(errors[0]);
      
      done();
    })
  });
});