import DomainMap from 'domain-map'
import StorageBackend from "./storage-backend"

/**
* Simple memory storage backend.
*/
class ConfigStorageBackend extends StorageBackend {

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
    let result = new DomainMap.createCollection({strictKeyMode: false});
    let domain = this.getStorageDomain();
    ids.map(entityId => {
      let entity = self._registry.get(domain, entityId, false);
      if (entity)
        result.set(entityId, entity);
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
}

export default ConfigStorageBackend;