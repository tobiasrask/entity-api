import DomainMap from 'domain-map'
import EntityHandler from './entity-handler'
import StorageBackend from './../storage/storage-backend'

/**
* Entity Storage handler.
*/
class EntityStorageHandler extends EntityHandler {

  /**
  * Construct storage
  *
  * @param variables
  */
  constructor(variables = {}) {
    super(variables)
    let backend = null

    if (variables.hasOwnProperty('storageBackend')) {
      backend = new variables['storageBackend']()

    } else if (variables.hasOwnProperty('storage')) {
      backend = variables['storage']

    } else {
      // Storage backend defaults to config storage
      backend = new StorageBackend()
    }

    if (!backend) {
      throw new Error('Storage backend is not defined')
    }

    // Apply reference to backend
    backend.setStorageHandler(this)

    this._registry.set('properties', 'storage-backend', backend)

    if (variables.hasOwnProperty('tablePrefix')) {
      this._registry.set('properties', 'tablePrefix', variables.tablePrefix)
    }
  }

  /**
  * Cleaned, ES6 Promises based storage handler.
  * This is only sugar on top of basic callback based api.
  */

  /**
  * Promise based  alias for @createEntity
  */
  create(data) {
    return new Promise((resolve, reject) => {
      this.createEntity(data, (err, result) => {
        if (err) {
          reject(err)
        } else {
          resolve(result)
        }
      })
    })
  }

  /**
  * Promise based  alias for @loadEntity
  */
  load(id) {
    return new Promise((resolve, reject) => {
      this.loadEntity(id, (err, result) => {
        if (err) {
          reject(err)
        } else {
          resolve(result)
        }
      })
    })
  }

  /**
  * Promise based  alias for @loadMultipleEntities
  */
  loadMultiple(ids) {
    return new Promise((resolve, reject) => {
      this.loadMultipleEntities(ids, (err, result) => {
        if (err) {
          reject(err)
        } else {
          resolve(result)
        }
      })
    })
  }

  /**
  * Promise based  alias for @saveEntity
  */
  save(entity) {
    return new Promise((resolve, reject) => {
      this.saveEntity(entity, (err, result) => {
        if (err) {
          reject(err)
        } else {
          resolve(result)
        }
      })
    })
  }

  /**
  * Promise based alias for @create & @save
  */
  createAndSave(data) {
    return this.create(data)
      .then((entity) => {
        if (!entity) {
          throw new Error('Entity was not created and returned')
        }
        return this.save(entity)
      })
  }

  /**
  * Promise based  alias for @delete
  */
  delete(entity) {
    return new Promise((resolve, reject) => {
      this.deleteEntity(entity, (err, result) => {
        if (err) {
          reject(err)
        } else {
          resolve(result)
        }
      })
    })
  }

  /**
  * Promise based  alias for @delete
  */
  deleteMultiple(entities) {
    return new Promise((resolve, reject) => {
      this.deleteMultipleEntities(entities, (err, result) => {
        if (err) {
          reject(err)
        } else {
          resolve(result)
        }
      })
    })
  }

  /**
  * Returns entity schemas.
  *
  * @return schemas
  *   Array of schemas. Required format depends on storage backend.
  */
  getSchemas() {
    return []
  }

  /**
  * Traditional callback based api.
  */

  /**
  * Load entity.
  *
  * @param id
  * @param callback
  */
  loadEntity(id, callback) {
    // Check if id is valid
    if (!this.isValidEntityId(id)) {
      return callback(new Error('Requested entity id is not valid.'))
    }

    this.loadMultipleEntities([id], (err, items) => {
      if (err) {
        callback(err)
      } else {
        callback(null, items.get(id, false))
      }
    })
  }

  /**
  * Load multiple entities.
  * - Note that result map is keyed with entity key objects.
  * - Unknown entities are returned as false, but keyed with entity id
  *
  * @param ids
  * @param callback
  *   Passes collection of entities keyed with entity id
  */
  loadMultipleEntities(ids, callback) {
    let self = this
    let errors = []

    if (ids.length < 1) {
      return callback(new Error('You have to provide at least one entity id'))
    }

    let build = DomainMap.createCollection({strictKeyMode: false})
    let storageBackend = this._registry.get('properties', 'storage-backend')

    // Container holds keys also for empty items
    storageBackend.loadEntityContainers(ids, (err, containers) => {
      if (err) {
        return callback(err)
      }

      let counter = containers.getSize()
      if (counter == 0) {
        return callback(null, build)
      }

      // Load entities
      containers.forEach((container, entityId) => {
        self.processLoadedEntity(entityId, container, (err, result) => {
          if (err) {
            errors.push(err)
            // system.log('storage-handler', err.toString(), 'error')
          } else {
            build.set(result.entityId, result.entity)
          }

          counter--
          if (counter == 0) {
            if (errors.length > 0) {
              callback(new Error('There was error when loading entities'))
            } else {
              callback(null, build)
            }
          }
        })
      })
    })
  }

  /**
  * Build entity from loaded content container.
  *
  * @param entityId
  * @param container
  *   Content container
  * @param callback
  */
  processLoadedEntity(entityId, container, callback) {
    let build = { entityId: entityId, entity: false }

    // Make sure we have valid container
    if (!container) {
      return callback(null, build)
    }

    let EntityBaseClass = this.getEntityBaseClass()

    build.entity = new EntityBaseClass({
      entityTypeId: this.getEntityTypeId()
    })

    // Hook entity.load()
    let params = { entityId: entityId, container: container }
    build.entity.load(params, (err) => {
      if (err) {
        return callback(err)
      }
      // Hook entity.postLoad()
      build.entity.postLoad((err) => {
        if (err) {
          callback(err)
        } else {
          callback(null, build)
        }
      })
    })
  }

  /**
  * Save entity.
  *
  * @param entity
  * @param callback
  */
  saveEntity(entity, callback) {
    let storageBackend = this._registry.get('properties', 'storage-backend')

    if (!storageBackend) {
      return callback(new Error('Storage backend doesn\'t exists for entity'))
    }

    // Hook entity.preSave()
    entity.preSave((err) => {
      if (err) {
        return callback(err)
      }

      storageBackend.saveEntityContainer(entity.id(),
        entity.exportFieldValues(), (err) => {
          if (err) {
            return callback(err)
          }
          // Hook entity.postSave()
          entity.postSave((err) => {
            if (err) {
              callback(err)
            } else {
              callback(null, entity)
            }
          })
        })
    })
  }

  /**
  * Delete entity.
  *
  * @param entity
  * @param callback
  */
  deleteEntity(entity, callback) {
    let storageBackend = this._registry.get('properties', 'storage-backend')
    // Hook entity.preDelete()
    entity.preDelete((err) => {
      if (err) {
        return callback(err)
      }
      storageBackend.deleteEntityContainer(entity.id(), (err) => {
        if (err) {
          return callback(err)
        }
        // Hook entity.postDelete()
        entity.postDelete(callback)
      })
    })
  }

  /**
  * Delete multiple entities at once.
  *
  * @param entities
  * @param callback
  */
  deleteMultipleEntities(entities, callback) {
    var self = this
    let errors = []
    let counter = entities.length

    if (counter == 0) {
      return callback(null)
    }

    entities.map((entity) => {
      self.delete(entity, (err) => {
        if (err) {
          errors.push(err)
        }

        counter--
        if (counter == 0) {
          if (errors.length > 0) {
            callback(new Error('There was an error when deleting items'))
          } else {
            callback(null)
          }
        }
      })
    })
  }

  /**
  * Create entity.
  *
  * @param data
  * @param callback
  */
  createEntity(data, callback) {
    let EntityBaseClass = this.getEntityBaseClass()
    let entity = new EntityBaseClass({
      entityTypeId: this.getEntityTypeId()
    })

    // Hook entity.preCreation()
    entity.preCreation(data, (err) => {
      if (err) {
        return callback(err)
      }
      // Hook entity.create()
      entity.create(data, (err) => {
        if (err) {
          return callback(err)
        }
        // Hook entity.finalize()
        entity.finalize((err) => {
          if (err) {
            callback(err)
          } else {
            callback(null, entity)
          }
        })
      })
    })
  }

  /**
  * Returns table name for entity data. Table name can prefixed by configuration.
  *
  * @return table name
  */
  getStorageDatabaseName() {
    return this.getStorageDatabasePrefix() + this.getEntityTypeId()
  }

  /**
  * Returns storage table prefix for storage handler.
  *
  * @return table prefix
  */
  getStorageDatabasePrefix() {
    return this._registry.get('properties', 'databasePrefix', '')
  }

  /**
  * Returns table name for entity data. Table name can prefixed by configuration.
  *
  * @return table name
  */
  getStorageTableName() {
    return this.getStorageTablePrefix() + this.getEntityTypeId()
  }

  /**
  * Returns storage table prefix for storage handler.
  *
  * @return table prefix
  */
  getStorageTablePrefix() {
    return this._registry.get('properties', 'tablePrefix', '')
  }

  /**
  * Get storage backend.
  *
  * @return storage backend
  */
  getStorageBackend() {
    return this._registry.get('properties', 'storage-backend')
  }

  /**
  * Returns entity field definitions.
  *
  * @return field definitions
  */
  getEntityFieldDefinitions() {
    return this.getEntityBaseClass().getFieldDefinitions()
  }

  /**
  * Returns entity field definitions.
  *
  * @return field definitions
  */
  getEntityFieldIndexDefinitions() {
    return this.getEntityBaseClass().getFieldIndexDefinitions()
  }

  /**
  * Helper method to extract entity id data.
  *
  * @param indexes
  *   Entity index definition
  * @param data
  *   Container
  * @return entity id
  */
  extractEntityId(indexes, data) {
    let build = {}

    if (!indexes) {
      return false
    }

    for (var i = 0; i < indexes.length; i++) {
      build[indexes[i].fieldName] = data[indexes[i].fieldName]
    }
    return build
  }

  /**
  * Check if requested entity id is valid.
  *
  * @param entityId
  *   Entity id to be tested
  * @return boolean is valid
  */
  isValidEntityId(entityId) {
    return entityId ? true : false
  }

  /**
  * Perform installation manoeuvre for storage backends.
  *
  * @param options
  *   Options to be passed for storages.
  * @preturn promise
  *   Promise to be resolved when all entity types are installed
  */
  install(options = {}) {
    return new Promise((resolve, reject) => {
      this.getStorageBackend().installSchemas(this.getSchemas(options), options, (err) => {
        if (err) {
          reject(err)
        } else {
          resolve()
        }
      })
    })
  }

  /**
  * Perform uninstallation manoeuvre for storage backends.
  *
  * @param options
  *   Options to be passed for storages.
  * @preturn promise
  *   Promise to be resolved when all entity types are uninstalled
  */
  uninstall(options = {}) {
    return new Promise((resolve, reject) => {
      this.getStorageBackend().uninstallSchemas(this.getSchemas(options), options, (err) => {
        if (err) {
          reject(err)
        } else {
          resolve()
        }
      })
    })
  }

  /**
  * Perform uninstallation manoeuvre for storage backends.
  *
  * @param options
  *   Options to be passed for storages.
  * @preturn promise
  *   Promise to be resolved when all entity types are updated
  */
  update(options = {}) {
    return new Promise((resolve, reject) => {
      this.getStorageBackend().updateSchemas(this.getSchemas(options), options, (err) => {
        if (err) {
          reject(err)
        } else {
          resolve()
        }
      })
    })
  }
}

export default EntityStorageHandler
