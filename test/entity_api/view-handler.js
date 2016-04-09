import assert from "assert"
import { EntityAPI, EntityType, EntityHandler,
        Entity, EntityStorageHandler, EntityViewHandler,
        ConfigStorageBackend, FieldAPI } from "./../../src/index"
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
        entityTypeProbe: 'entityTypeprob:' + TestUtils.getUUID(),
        entityHandlerProbe: 'view',
        entityProbe: 'entityProb:' + TestUtils.getUUID(),
      },
      // Probe classes
      classes: {}
    }

    class ProbeEntityViewHandler extends EntityViewHandler {
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
      static getFieldDefinitions() {
        const fields = new Map();

        fields.set('eid', fieldAPI.createBasefield('text')
          .setName('Entity id')
          .setDescription('Entity identifier')
          .setProtected(true));

        fields.set('field_string_a', fieldAPI.createBasefield('text')
          .setName('Entity field')
          .setDescription('Entity field'));

        // String field with default value
        fields.set('field_string_b', fieldAPI.createBasefield('text')
          .setName('Entity field')
          .setDescription('Entity field'));

        fields.set('field_int_a', fieldAPI.createBasefield('integer')
          .setName('Entity field')
          .setDescription('Entity field'));

        // Int field with default value
        fields.set('field_int_b', fieldAPI.createBasefield('integer')
          .setName('Entity field')
          .setDescription('Entity field')
          .setDefaultValue(123456789));

        return fields;
      }

      /**
      * Returns entity index definitions.
      *
      * @return data
      */
      static getEntityIndexDefinitions() {
        return [
          {'fieldName': 'eid', 'indexType': 'HASH', 'auto': true}
        ]
      }
    }

    class ProbeEntityType extends EntityType {
      constructor(variables) {
        if (variables === undefined) variables = {};
        // Define our entity type
        variables.entityTypeId = probe.values.entityTypeProbe;
        variables.entityClass = ProbeEntity;

        super(variables);

        // Storage
        variables.storageBackend = ConfigStorageBackend;
        this.registerHandler('storage', new EntityStorageHandler(variables));

        // View
        this.registerHandler(probe.values.entityHandlerProbe,
          new ProbeEntityViewHandler(variables));
      }
    }

    probe.classes.ProbeEntity = ProbeEntity;
    probe.classes.ProbeEntityType = ProbeEntityType;

    return probe;
  }
}

describe('Entity view handler', () => {

  describe('Construction with entity view handler', () => {
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

  describe('View interface', () => {
    it('Test viewMultiple hook', (done) => {
      let numProbes = 2;
      let counter = numProbes;
      let errors = [];
      let probes = [];
      let entityTypes = [];

      for (var i = 0; i < numProbes; i++) {
        let probe = TestUtils.createProbe();
        probes.push(probe);
        entityTypes.push(probe.classes.ProbeEntityType);
      }

      let entityAPI = EntityAPI.getInstance({entityTypes: entityTypes}, true);

      // Storage data
      // TODO: Initialize storage with given entity type data
      let storageData = [
        {
          'eid': '123',
          'field_string_a': 'A123',
          'field_string_b': 'B231',
          'field_int_a': 1234,
          'field_int_b': 5678
        },
        {
          'eid': '234',
          'field_string_a': 'A123',
          'field_string_b': 'B231',
          'field_int_a': 1234,
          'field_int_b': 5678
        }
      ];

      probes.map(probe => {
        let storage = entityAPI.getStorage(probe.values.entityTypeProbe);
        let view = entityAPI.getViewHandler(probe.values.entityTypeProbe);

        let indexes = probe.classes.ProbeEntity.getEntityIndexDefinitions();
        storage.getStorageBackend().applyStorageData(indexes, storageData);

        let entityIds = [];
        storageData.map(container => {
          entityIds.push(storage.extractEntityId(indexes, container));
        });

        storage.loadMultiple(entityIds)
          .then(entities => {
            console.log("About to view: ", entityIds, entities);
            return view.viewMultiple(entities, { viewMode: 'full' });
          })
          .then(viewedEntities => {
            console.log("VIEWED!");
            console.log(viewedEntities);
            counter--;
            if (!counter && errors) done(errors[0]); else if (!counter) done();            
          })
          .catch(err => {
            errors.push(err);
            counter--;
            if (!counter && errors) done(errors[0]);
          });
      });
    })
  });
});
