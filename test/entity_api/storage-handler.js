import assert from "assert"
import { EntityAPI, EntityType, EntityHandler,
        Entity, EntityStorageHandler, FieldAPI } from "./../../src/index"
import Utils from "./../../src/includes/utils"

let fieldAPI = new FieldAPI();

class TestUtils extends Utils {

  /**
  * Creates probe
  *
  * @return probe
  */
  static createProbe() {
    let probe = {
      // Random probe values
      values: {
        entityTypeProbe: 'entityTypeprob:' + TestUtils.getUUID(),
        entityHandlerProbe: 'entityHandlerProb:' + TestUtils.getUUID(),
        entityProbe: 'entityProb:' + TestUtils.getUUID(),
      },
      // Probe classes
      classes: {}
    }

    class ProbeEntityStorageHandler extends EntityStorageHandler {
      getProb() {
        return probe.values.entityHandlerProbe;
      }
    }

    class ProbeEntity extends Entity {

      static getProb() {
        return probe.values.entityProbe;
      }

      getIntanceProb() {
        return probe.values.entityProbe;
      }

      /**
      * Returns field definitions.
      *
      * @return data
      */
      getFieldDefinitions() {
        const fields = new Map();
        fields.set('entity_id', fieldAPI.createBasefield('text')
          .setName('Entity id')
          .setDescription('Entity identifier')
          .setProtected(true));
        return fields;
      }

      /**
      * Returns entity index definitions.
      *
      * @return data
      */
      getEntityIndexDefinitions() {
        return [
          {'fieldName': 'entity_id', 'indexType': 'HASH', 'auto': true}
        ]
      }
    }

    class ProbeEntityType extends EntityType {
      constructor(variables = {}) {
        // Define our entity type
        variables.entityTypeId = probe.values.entityTypeProbe;
        variables.entityClass = ProbeEntity;
        super(variables);

        // Register handlers
        this.registerHandler(probe.values.entityHandlerProbe,
          new ProbeEntityStorageHandler(variables));
      }
    }

    probe.classes.ProbeEntity = ProbeEntity;
    probe.classes.ProbeEntityType = ProbeEntityType;

    return probe;
  }
}

describe('Storage handler', () => {

  describe('Construction with storage handler', () => {
    it('Should construct with random entity type probes', (done) => {
      let numProbes = 2;
      let errors = [];

      let probes = [];
      let entityTypes = [];

      for (var i = 0; i < numProbes; i++) {
        let probe = TestUtils.createProbe();
        probes.push(probe);
        entityTypes.push(probe.classes.ProbeEntityType);
      }

      let entityAPI = EntityAPI.getInstance({entityTypes: entityTypes}, true);

      // Test entity type getter
      probes.map(probe => {
        let entityType = entityAPI.getEntityType(probe.values.entityTypeProbe);
        let handler = entityType.getHandler(probe.values.entityHandlerProbe);

        if (!handler)
          return errors.push(new Error("It didn't return requested handler"));

        if (handler.getProb() != probe.values.entityHandlerProbe)
          return errors.push(new Error("Entity handler probe check failed"));

        if (handler.getEntityTypeId() != probe.values.entityTypeProbe)
          return errors.push(new Error("Entity handler id check failed"));

        let entity = handler.getEntityBaseClass();

        if (!entity)
          return errors.push(new Error("It didn't return entity class"));

        if (entity.getProb() != probe.values.entityProbe)
          return errors.push(new Error("Entitys's probe check failed"));
      });

      if (errors.length > 0)
        return done(errors[0]);

      done();
    })
  });

});
