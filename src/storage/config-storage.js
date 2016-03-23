import DomainMap from 'domain-map'
import StorageBackend from "./storage-backend"

/**
* Simple memory storage backend.
*/
class ConfigStorageBackend extends StorageBackend {

  /**
  * Construct
  *
  * @param variables with following keys:
  *   storageHandler
  *     Storage handler who is using storage backend.
  *   lockUpdates
  *     Lock entity updates.
  */
  constructor(variables) {
    super(variables);
    if (variables.hasOwnProperty('lockUpdates'))
      this.setStorageLock(variables.lockUpdates);
  }

  /**
  * Load entity content container for entity data.
  *
  * @param ids
  *   Array of entity ids.
  * @param callback
  *   Passes map of objects keyed with existing entity id. If entity doesn't
  *   exists, it will not be indexed.
  */
  loadEntityContainers(ids, callback) {
    var self = this;
    let result = DomainMap.createCollection({strictKeyMode: false});
    let domain = this.getStorageDomain();
    ids.map(entityId => {
      result.set(entityId, self._registry.get(domain, entityId, false));
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
  * @param caallback
  */
  saveEntityContainer(entityId, container, callback) {
    if (this.isStorageLocked())
      return callback(new Error("Storage updates are locked"));
    let domain = this.getStorageDomain();
    this._registry.set(domain, entityId, container);
    callback(null);
  }

  /**
  * Return storege domain.
  *
  * @return storage domain                  
  */
  getStorageDomain() {
    return "_entities:" + this.getStorageHandler().getStorageTableName();
  }

  /**
  * Method checks if storage is locked.
  *
  * @return boolean is locked
  */
  isStorageLocked() {
    return this._registry.get("properties", 'lockUpdates', false);
  }

  /**
  * Set storage lock status.
  *
  * @param status
  *   New lock status.
  */
  setStorageLock(status) {
    this._registry.set("properties", 'lockUpdates', status);
  }
}

export default ConfigStorageBackend;