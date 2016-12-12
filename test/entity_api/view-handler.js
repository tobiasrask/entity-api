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
  static createProbe(variables = {}) {

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
          .setProtected(true)
          .setProperty('view_properties', {
            full: { view_field: true },
            list: { view_field: true }
          }));

        fields.set('field_string_a', fieldAPI.createBasefield('text')
          .setName('Entity field')
          .setDescription('Entity field')
          .setProperty('view_properties', {
            full: { view_field: true },
            list: { view_field: true }
          }));

        // String field with default value
        fields.set('field_string_b', fieldAPI.createBasefield('text')
          .setName('Entity field')
          .setDescription('Entity field')
          .setProperty('view_properties', {
            full: { view_field: true },
            list: { view_field: true }
          }));

        fields.set('field_int_a', fieldAPI.createBasefield('integer')
          .setName('Entity field')
          .setDescription('Entity field')
          .setProperty('view_properties', {
            full: { view_field: true },
            list: { view_field: true }
          }));

        // Int field with default value
        fields.set('field_int_b', fieldAPI.createBasefield('integer')
          .setName('Entity field')
          .setDescription('Entity field')
          .setDefaultValue(123456789)
          .setProperty('view_properties', {
            full: { view_field: true },
            list: { view_field: true }
          }));

        // View mode stealth fields
        fields.set('field_string_hidden', fieldAPI.createBasefield('text')
          .setName('Entity field')
          .setDescription('Entity field')
          .setProperty('view_properties', {
            full: { view_field: false },
            list: { view_field: false }
          }));

        // Int field with hidden value
        fields.set('field_int_hidden', fieldAPI.createBasefield('integer')
          .setName('Entity field')
          .setDescription('Entity field')
          .setDefaultValue(123456789)
          .setProperty('view_properties', {
            full: { view_field: false },
            list: { view_field: false }
          }));

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
      constructor(variables = {}) {
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
        let entityIdsData = [];

        storageData.map(container => {
          // Extract entity id
          let entityId = storage.extractEntityId(indexes, container);
          entityIds.push(entityId);
          // Keep track of entity id and expected field values
          entityIdsData.push({ entityId: entityId, data: container });
        });

        storage.loadMultiple(entityIds)
          .then(entities => {
            return view.viewMultiple(entities, { viewMode: 'full' });
          })
          .then(build => {

            entityIdsData.map(entityData => {
              let fieldValues = build.get(entityData.entityId);

              Object.keys(entityData.data).forEach((fieldName, index) => {

                if (!fieldValues.hasOwnProperty(fieldName))
                  return errors.push(new Error(`Viewing field failed: ${fieldName}`));

                else if (typeof entityData.data[fieldName] != typeof fieldValues[fieldName])
                  return errors.push(new Error(`Typeof field value failed: ${fieldName}, ${typeof entityData.data[fieldName]} vs ${typeof fieldValues[fieldName]}`));

                else if (entityData.data[fieldName] != fieldValues[fieldName])
                  return errors.push(new Error(`Rendering field value failed: ${fieldName}, ${entityData.data[fieldName]} vs ${fieldValues[fieldName]}`));
              });
            });

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
