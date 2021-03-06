import {
  Entity,
  EntityAPI,
  EntityType,
  EntityStorageHandler,
  ConfigStorageBackend,
  EntityViewHandler,
  fieldAPI
} from './../../src/index'

const entityTypeId = 'test'

class ProbeStorageBackend extends ConfigStorageBackend {

}

class ProbeStorageHandler extends EntityStorageHandler {
  constructor(variables) {
    variables.storageBackend = ProbeStorageBackend
    super(variables)
  }
}

class ProbeViewHandler extends EntityViewHandler {

}

class ProbeEntity extends Entity {

  static getFieldDefinitions() {
    const fields = new Map()
    fields.set('country_code', fieldAPI.createBasefield('text')
      .setName('Entity id')
      .setDescription('Entity identifier')
      .setProtected(true)
      .setProperty('view_properties', {
        full: { view_field: true },
        list: { view_field: true }
      }))

    fields.set('postal_area', fieldAPI.createBasefield('text')
      .setName('Probe name')
      .setDescription('Probe name')
      .setProperty('view_properties', {
        full: { view_field: true },
        list: { view_field: true }
      }))

    fields.set('age', fieldAPI.createBasefield('integer')
      .setName('Probe age')
      .setDescription('Probe age')
      .setProperty('view_properties', {
        full: { view_field: true },
        list: { view_field: true }
      }))
    return fields
  }

  static getFieldIndexDefinitions() {
    return [
      { 'fieldName': 'country_code', 'indexType': 'HASH', 'auto': false },
      { 'fieldName': 'postal_area', 'indexType': 'RANGE' },
    ]
  }
}

class ProbeEntityType extends EntityType {
  constructor(variables = {}) {
    variables.entityTypeId = entityTypeId
    variables.entityClass = ProbeEntity
    variables.handlers = {
      storage: new ProbeStorageHandler(variables),
      view: new ProbeViewHandler(variables),
    }
    super(variables)
  }
}

describe('Entity stack', () => {

  describe('Entity Construction', () => {
    it('It should construct entity stack without errors', (done) => {

      let entityAPI = EntityAPI.getInstance({}, true)
      entityAPI.registerEntityType(new ProbeEntityType())

      let entityData = {
        country_code: 'fi',
        postal_area: '00001'
      }

      entityAPI.getStorage(entityTypeId).create(entityData)
        .then((entity) => {
          if (!entity) {
            throw new Error('Unable to create entity')
          }

          // Make sure entity id is generated as expected
          if (entity.idString() != 'fi:00001') {
            throw new Error(`Unexpected entity id: ${entity.idString()}`)
          }
          return entity.view({ viewMode: 'full' })
        })
        .then((viewedEntity) => {
          let errors = []
          Object.keys(entityData).forEach((fieldName) => {
            if (!viewedEntity.hasOwnProperty(fieldName)) {
              return errors.push(new Error(`Viewed entity doesn't contain value for field ${fieldName}`))
            }

            if (viewedEntity[fieldName] != entityData[fieldName]) {
              return errors.push(new Error(`Field '${fieldName}' differs from original value:
                ${viewedEntity[fieldName]} / ${entityData[fieldName]}`))
            }
          })

          if (errors.length > 0) {
            return done(errors[0])
          }

          done()
        })
        .catch((err) => {
          done(err)
        })
    })
  })
})
