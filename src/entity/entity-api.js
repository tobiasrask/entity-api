import DomainMap from 'domain-map'
import APIObject from "./../misc/api-object"

var entityAPIInstance = false;

/**
* Entity API
*/
class EntityAPI extends APIObject {

  /**
  * Construt API
  *
  * @param options
  */
  constructor(options = {}) {
    super(options);
    
    this._registry = new DomainMap();
    
    if (options.hasOwnProperty('entityTypes'))
      this.registerEntityTypes(options.entityTypes);
  }

  /**
  * Initialize entity types
  *
  * @param entityTypes
  *   List of entity types to be registered
  */
  registerEntityTypes(entityTypes) {
    let self = this;
    entityTypes.map(entityTypeClass => {
      self.registerEntityType(new entityTypeClass());
    });
  }

  /**
  * Register entity type
  *
  * @param entityType
  */
  registerEntityType(entityType) {
    let type = entityType.getEntityTypeId();
    this.log("registerEntityType", `Registering entity type: ${type}`);
    this._registry.set('entityTypes', type, entityType)
  }

  /**
  * Returns requested entity type.
  *
  * @param entitTypeName
  *   Entity type name
  * @return handler
  */
  getEntityType(entitTypeName) {
    return this._registry.get('entityTypes', entitTypeName);
  }

  /**
  * Returns requested handler for given entity type.
  *
  * @param entitTypeName
  *   Entity type name
  * @param handlerName
  *   Handler name
  * @return handler
  */
  getEntityTypeHandler(entitTypeName, handlerName) {
    let entityType = this._registry.get('entityTypes', entitTypeName, false);
    return entityType ? entityType.getHandler(handlerName) : null;
  }

  /**
  * Returns registered entity types.
  *
  * @return entity types
  */
  getEntityTypeIds() {
    return this._registry.getDomainKeysList('entityTypes', []);
  }

  /**
  * Get storage handler for requested entity type.
  *
  * @param entity type name
  * @return storage handler or null
  */
  getStorage(name) {
    return this.getEntityTypeHandler(name, 'storage');
  }

  /**
  * Returns singleton object
  *
  * @param options
  *  If instance if not constructed yet, it will be constructed with given
  *  options
  * @param reset
  *   Boolean value to indicate if entity singleton should be re created
  *   Defaults to false.
  */
  static getInstance(options = {}, reset = false) {
    if (!entityAPIInstance || reset) {
      entityAPIInstance = new EntityAPI(options);
    }
    return entityAPIInstance;
  }
}

export default EntityAPI;