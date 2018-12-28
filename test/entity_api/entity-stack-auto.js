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
    fields.set('eid', fieldAPI.createBasefield('text')
      .setName('Entity id')
      .setDescription('Entity identifier')
      .setProtected(true)
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
      { 'fieldName': 'eid', 'indexType': 'HASH', 'auto': true }
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
        age: 35
      }

      entityAPI.getStorage(entityTypeId).create(entityData)
        .then((entity) => {
          if (!entity) {
            throw new Error('Unable to create entity')
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
  
  describe('Entity Construction with random entity id', () => {
    it('It should construct entity with random id, event if we provide value', (done) => {

      let entityAPI = EntityAPI.getInstance({}, true)
      entityAPI.registerEntityType(new ProbeEntityType())

      let entityData = {
        eid: 'random-hard-coded'
      }

      entityAPI.getStorage(entityTypeId).create(entityData)
        .then((entity) => {
          if (!entity) {
            throw new Error('Unable to create entity')
          }

          if (entity.idString() === entityData.eid) {
            throw new Error(`Unexpected entity id: ${entity.idString()}`)
          }

          if (entity.idString().length !== 36) {
            throw new Error(`Unexpected entity id length: ${entity.idString().length}`)
          }

          done()
        })
        .catch((err) => {
          done(err)
        })
    })
  })

  describe('Entity Construction with random field values', () => {
    it('It should construct entity only with known fields', (done) => {

      let entityAPI = EntityAPI.getInstance({}, true)
      entityAPI.registerEntityType(new ProbeEntityType())

      let entityData = {
        age: 52,
        random_field: 123
      }

      entityAPI.getStorage(entityTypeId).create(entityData)
        .then((entity) => {
          if (!entity) {
            throw new Error('Unable to create entity')
          }

          if (entity.get('age') != entityData.age) {
            throw new Error('Known field not accepted')
          }

          if (entity.get('random_field') != null) {
            throw new Error('Random field name accepted')
          }

          done()
        })
        .catch((err) => {
          done(err)
        })
    })
  })
})
