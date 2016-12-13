import assert from "assert"
import { EntityAPI, EntityType,
         EntityHandler, Entity,
         EntityStorageHandler, ConfigStorageBackend,
         EntityViewHandler, fieldAPI } from "./../../src/index"
import util from "util"
import DomainMap from 'domain-map'

describe('Entity stack', () => {

  describe('Entity Construction', () => {
    it('It should construct entity stack without errors', (done) => {
      let entityTypeId = 'test';

      class ProbeStorageBackend extends ConfigStorageBackend {

      }

      class ProbeStorageHandler extends EntityStorageHandler {
        constructor(variables) {
          variables.storageBackend = ProbeStorageBackend;
          super(variables);
        }
      }

      class ProbeViewHandler extends EntityViewHandler {

      }

      class ProbeEntity extends Entity {
        /**
        * Implementation of hook getFieldDefinitions().
        */
        static getFieldDefinitions() {

          const fields = new Map();
          fields.set('id', fieldAPI.createBasefield('text')
            .setName('Entity id')
            .setDescription('Entity identifier')
            .setProtected(true)
            .setProperty('view_properties', {
              full: { view_field: true },
              list: { view_field: true }
            }));

          fields.set('name', fieldAPI.createBasefield('text')
            .setName('Probe name')
            .setDescription('Probe name')
            .setProperty('view_properties', {
              full: { view_field: true },
              list: { view_field: true }
            }));


          fields.set('age', fieldAPI.createBasefield('integer')
            .setName('Probe age')
            .setDescription('Probe age')
            .setProperty('view_properties', {
              full: { view_field: true },
              list: { view_field: true }
            }));

          return fields;
        }

        /**
        * Implementation of hook getEntityIndexDefinitions()
        */
        static getFieldIndexDefinitions() {
          return [
            { 'fieldName': 'id', 'indexType': 'HASH', 'auto': true }
          ]
        }
      }

      class ProbeEntityType extends EntityType {
        constructor(variables = {}) {
          variables.entityTypeId = entityTypeId;
          variables.entityClass = ProbeEntity;
          variables.handlers = {
            storage: new ProbeStorageHandler(variables),
            view: new ProbeViewHandler(variables),
          }
          super(variables);
        }
      }

      let entityAPI = EntityAPI.getInstance({}, true);
      entityAPI.registerEntityType(new ProbeEntityType());

      let entityData = {
        "name": "Test user",
        "age": 31
      }

      entityAPI.getStorage(entityTypeId).create(entityData)
      .then(entity => {
        if (!entity)
          throw new Error("Unable to create entity");

        return entity.view({ viewMode: 'full' });
      })
      .then(viewedEntity => {
        let errors = [];
        Object.keys(entityData).forEach(fieldName => {
          if (!viewedEntity.hasOwnProperty(fieldName))
            return errors.push(new Error(`Viewed entity doesn't contain value for field ${fieldName}`));

          if (viewedEntity[fieldName] != entityData[fieldName])
            return errors.push(new Error(`Field '${fieldName}' differs from original value: ${viewedEntity[fieldName]} / ${entityData[fieldName]}`));
        });

        if (errors.length > 0)
          return done(errors[0]);

        done();
      })
      .catch(err => {
        done(err);
      });
    })
  });

});
