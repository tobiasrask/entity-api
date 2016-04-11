import assert from "assert"
import { EntityAPI, EntityType, EntityHandler,
        Entity, EntityStorageHandler,
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
        entityHandlerProbe: 'storage',
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

        variables.storageBackend = ConfigStorageBackend;

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

describe('Config storage handler', () => {

  describe('Construction with config storage handler', () => {
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

  describe('Config storage interface', () => {
    it('Test StorageHandler.create() method', (done) => {
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
      let inputParams = {};

      // TOOD: Write test to make sure auto entity id can't be overriden

      probes.map(probe => {

        entityAPI.getEntityType(probe.values.entityTypeProbe)
          .getHandler(probe.values.entityHandlerProbe)
          .create(inputParams)
          .then(entity => {
            if (entity.getEntityTypeId() != probe.values.entityTypeProbe)
              errors.push(new Error("Entity's type check failed"));

            if (entity.getIntanceProb() != probe.values.entityProbe)
              errors.push(new Error("Entity's instance probe check failed"));

            if (!entity.isNew)
              errors.push(new Error("Entity isNew() check failed"));

            counter--;
            if (!counter && errors) done(errors[0]); else if (!counter) done();
          })
          .catch(err => {
            errors.push(err);
            counter--;
            if (!counter && errors) done(errors[0]); else if (!counter) done();
          });
      });
    })
  });

  describe('Config storage interface', () => {
    it('Test StorageHandler.load() method for unknown entity', (done) => {
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

      let entityAPI = new EntityAPI({entityTypes: entityTypes});
      let entityId = {eid: 'probe:random'};

      probes.map(probe => {
        entityAPI.getEntityType(probe.values.entityTypeProbe)
          .getHandler(probe.values.entityHandlerProbe)
          .load(entityId)
          .then(entity => {
            if (entity)
              errors.push(new Error("Storage api didn't return false"));
            counter--;
            if (!counter && errors) done(errors[0]); else if (!counter) done();
          })
          .catch(err => {
            errors.push(err);
            counter--;
            if (!counter && errors) done(errors[0]); else if (!counter) done();
          });          
      });
    })
  });

  describe('Config storage interface', () => {
    it('Test StorageHandler.loadMultiple() method for unknown ids', (done) => {
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

      let entityAPI = new EntityAPI({entityTypes: entityTypes});
      let entityIds = [ { eid: 'probe:random' } ];

      probes.map(probe => {
        entityAPI.getEntityType(probe.values.entityTypeProbe)
          .getHandler(probe.values.entityHandlerProbe)
          .loadMultiple(entityIds)
          .then(entities => {

            if (entities.size() <= 0)
              errors.push(new Error("Storage api didn't return keyed Map"));

            // Make sure every entity is marked as false
            entities.forEach((value, entityId) => {
              if (entities.get(entityId))
                errors.push(new Error("Storage returned object for unknown entity"));
            });

            counter--;
            if (!counter && errors) done(errors[0]); else if (!counter) done();
          })
          .catch(err => {
            errors.push(err);
            counter--;
            if (!counter && errors) done(errors[0]); else if (!counter) done();
          });
      });
    })
  });

  describe('Config storage interface', () => {
    it('Test StorageHandler.save() method', (done) => {
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
      let inputParams = {
        'field_string_a': 'A123',
        'field_string_b': 'B231',
        'field_int_a': 1234,
        'field_int_b': 5678
      };

      probes.map(probe => {
        let storage = entityAPI.getStorage(probe.values.entityTypeProbe);
        let entityId = {};

        storage.create(inputParams)
          .then(entityA => {
            entityId = entityA.id();
            if (!entityA.isNew())
              errors.push("Just created entity is not marked as new");
            return entityA.save();
          })
          .then(result => {
            // Load entity
            return storage.load(entityId);
          })
          .then(entityB => {
            if (entityB.isNew())
              errors.push("Just loaded entity is marked as new");

            if (!entityB) {
              errors.push("Unable to load saved entity");

            } else {
              // Validate params
              Object.keys(inputParams).forEach((fieldName, index) => {
                if (entityB.get(fieldName) != inputParams[fieldName])
                  errors.push("Entity didn't return expected field value");
              });
            }
            counter--;
            if (!counter && errors) done(errors[0]); else if (!counter) done();
          })
          .catch(err => {
            errors.push(err);
            counter--;
            if (!counter && errors) done(errors[0]); else if (!counter) done();
          });
      });
    })
  });

  describe('Config storage interface', () => {
    it('Test initialization with entities', (done) => {
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

        // Init storage
        let indexes = probe.classes.ProbeEntity.getEntityIndexDefinitions();
        storage.getStorageBackend().applyStorageData(indexes, storageData);

        // Try to load preloaded data
        let entityIds = [];

        storageData.map(container => {
          entityIds.push(storage.extractEntityId(indexes, container));
        });

        storage.loadMultiple(entityIds)
          .then(entities => {

            if (entities.size() <= 0)
              errors.push(new Error("Storage api didn't return keyed Map"));

            // Make sure every entity is marked as false


            entityIds.map(entityId => {
              if (!entities.get(entityId))
                errors.push(new Error("Storage didn't return entity"));
            });

            entities.forEach((entity, entityId) => {
              if (!entities.get(entityId))
                errors.push(new Error("Storage didn't return entity"));
              // TODO: Validate entity fields...

            });

            counter--;
            if (!counter && errors) done(errors[0]); else if (!counter) done();
          })
          .catch(err => {
            errors.push(err);
            counter--;
            if (!counter && errors) done(errors[0]); else if (!counter) done();
          });
      });
    })
  });
});
