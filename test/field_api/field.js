import assert from "assert"
import { Field } from "./../../src/index"
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

    class ProbeField extends Field {

      constructor(variables = {}) {
        variables.fieldId = probe.values.fieldIdProbe;
        super(variables);
      }

      getProb() {
        return probe.values.fieldProbe;
      }
    }

    probe.classes.ProbeField = ProbeField;
    return probe;
  }
}

describe('Field', () => {

  describe('Field construction', () => {
    it('Should construct with random field probes', (done) => {
      let numProbes = 2;
      let errors = [];

      for (var i = 0; i < numProbes; i++) {
        let probe = TestUtils.createProbe();

        let instance = new probe.classes.ProbeField();

        instance.setName(probe.values.fieldNameProbe)
                .setDescription(probe.values.fieldDescProbe)
                .setProperty(probe.values.fieldPropertyKeyProbe, probe.values.fieldPropertyValueProbe);

        if (instance.getProb() != probe.values.fieldProbe)
          errors.push(new Error("Field probe check failed"));

        if (instance.getFieldId() != probe.values.fieldIdProbe)
          errors.push(new Error("Field id probe check failed"));

        if (instance.getName() != probe.values.fieldNameProbe)
          errors.push(new Error("Field name probe check failed"));

        if (instance.getDescription() != probe.values.fieldDescProbe)
          errors.push(new Error("Field description probe check failed"));

        if (instance.getProperty(probe.values.fieldPropertyKeyProbe) != probe.values.fieldPropertyValueProbe)
          errors.push(new Error("Field property probe check failed"));

        instance.view({viewMode: 'random'}, (err, result) => {
          if (err)
            errors.push(err);
          else if (result)
            errors.push(new Error("Field view default value check failed"));
        });
      }

      if (errors.length > 0)
        return done(errors[0]);

      done();
    })
  });
});
