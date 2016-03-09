import DomainMap from 'domain-map'

/**
* Storage backend
*/
class StorageBackend {
  
  /**
  * Construct
  *
  * @param variables with following keys:
  *   storageHandler
  *     Storage handler who is using storage backend.
  */
  constructor(variables) {
    if (variables === undefined) variables = {};
    this._registry = new DomainMap();
    // Ref. to entity storage handler
    if (variables.hasOwnProperty('storageHandler'))
      this._registry.set("properties", 'handler', variables.storageHandler);
  }

  /**
  * Returns storage handler.
  *
  * @return handler
  */
  getStorageHandler() {
    return this._registry.get("properties", 'handler');
  }

  /**
  * Load entity content containers.
  *
  * @param ids
  *   Array of entity ids.  
  * @param callback
  *   Passes map of objects keyed with entity id
  */
  loadEntityContainers(ids, callback) {
    let result = new Map();
    ids.map(entityId => {
      result.set(entityId, false);
    });
    callback(null, result);
  }

  /**
  * Save entity content container.
  * 
  * @param entityId
  *   Entity id
  * @param container
  *   Container data
  * @param callback
  */
  saveEntityContainer(entityId, container, callback) {
    callback(null);
  }

  /**
  * Delete entity content container.
  * 
  * @param entityId
  *   Entity id
  * @param callback
  */
  deleteEntityContainer(entityId, callback) {
    callback(null);
  }

  /**
  * Install schema
  *
  * @param scema
  *   Install one or more schemas
  * @param callback
  */
  installSchemas(schemas, callback) {
    callback(null);
  }
}

export default StorageBackend