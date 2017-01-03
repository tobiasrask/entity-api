import assert from "assert"
import { BaseField, FieldType } from "./../../src/index"
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
        fieldTypeIdProbe: 'fieldTypeIdProbe:' + TestUtils.getUUID(),
        fieldNameProbe: 'fieldNameProb:' + TestUtils.getUUID(),
        fieldDescProbe: 'fieldNameProb:' + TestUtils.getUUID(),
        fieldPropertyKeyProbe: 'fieldPropertyKeyProb:' + TestUtils.getUUID(),
        fieldPropertyValueProbe: 'fieldPropertyValueProbe:' + TestUtils.getUUID(),
        fieldValueProbe: 'fieldValueProbe:' + TestUtils.getUUID(),
        fieldValue2Probe: 'fieldValue2Probe:' + TestUtils.getUUID(),
      },
      // Probe classes
      classes: {}
    }

    class ProbeField extends BaseField {

      constructor(variables = {}) {
        variables.fieldId = probe.values.fieldIdProbe;
        super(variables);
      }

      getProb() {
        return probe.values.fieldProbe;
      }
    }

    class ProbeFieldType extends FieldType {

      constructor(variables = {}) {
        variables.fieldTypeId = probe.values.fieldTypeIdProbe;
        super(variables);
      }

      getProb() {
        return probe.values.fieldProbe;
      }
    }

    probe.classes.ProbeField = ProbeField;
    probe.classes.ProbeFieldType = ProbeFieldType;
    return probe;
  }
}

describe('Base field', () => {

  describe('Base field construction', () => {
    it('Should construct with random field probes', (done) => {
      let numProbes = 2;
      let errors = [];

      for (var i = 0; i < numProbes; i++) {
        let probe = TestUtils.createProbe();

        let params = {
          fieldType: new probe.classes.ProbeFieldType()
        }

        let instance = new probe.classes.ProbeField(params);

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

  describe('Field locking', () => {
    it('Should lock field updates', (done) => {
      let numProbes = 2;
      let errors = [];

      for (var i = 0; i < numProbes; i++) {
        let probe = TestUtils.createProbe();

        let params = {
          fieldType: new probe.classes.ProbeFieldType()
        }

        let instance = new probe.classes.ProbeField(params);

        if (instance.getProb() != probe.values.fieldProbe)
          errors.push(new Error("Field probe check failed"));

        if (instance.getLockState())
          errors.push(new Error("Instance was locked before initial value"));

        if (instance.isProtected())
          errors.push(new Error("Base field protected flag was not initialized as expected"));

        instance.setProtected(true);

        if (!instance.isProtected())
          errors.push(new Error("Base field protected flag was not updated"));

        if (instance.isRequired())
          errors.push(new Error("Base field required flag was not initialized as expected"));

        instance.setRequired(true);

        if (!instance.isRequired())
          errors.push(new Error("Base field required flag was not updated"));

        if (!instance.set(probe.values.fieldValueProbe))
          errors.push(new Error("Field value update didn't return success"));

        if (!instance.getLockState())
          errors.push(new Error("Instance was not locked after initial value"));

        if (instance.get() != probe.values.fieldValueProbe)
          errors.push(new Error("Field value was not updated: " + instance.get() + ", expecting: " + probe.values.fieldValueProbe));

        // Field is now locked, so next update should not pass
        if (instance.set(probe.values.fieldValue2Probe))
          errors.push(new Error("Field updating is not locked, returns success"));

        if (instance.get() != probe.values.fieldValueProbe)
          errors.push(new Error("Protected value was updated: " + instance.get() + ", expecting: " + probe.values.fieldValueProbe));

        // Test brute force
        if (!instance.set(probe.values.fieldValue2Probe, { force: true }))
          errors.push(new Error("Unable to break protected field, didn't return success"));

        if (!instance.getLockState())
          errors.push(new Error("Instance was not locked after forced update"));

        if (instance.get() != probe.values.fieldValue2Probe)
          errors.push(new Error("Unable to force update protected value: " + instance.get() + ", expecting: " + probe.values.fieldValue2Probe));

        // Disable protected value
        instance.setProtected(false);

        if (!instance.set(probe.values.fieldValueProbe))
          errors.push(new Error("Unable to update unprotect field, didn't return success"));

        if (instance.get() != probe.values.fieldValueProbe)
          errors.push(new Error("Unable to update unprotected value: " + instance.get() + ", expecting: " + probe.values.fieldValueProbe));
      }

      if (errors.length > 0)
        return done(errors[0]);

      done();
    })
  });
});
