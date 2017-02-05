import system from "./../system"
import APIObject from "./../includes/api-object"

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
  constructor(variables = {}) {
    variables.type = 'entityAPI';
    super(variables);

    if (variables.hasOwnProperty('entityTypes'))
      this.registerEntityTypes(variables.entityTypes);
  }

  /**
  * Register entity types
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
    system.log("EntityAPI", `Registering entity type: ${type}`);
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
  * Get view handler for requested entity type.
  *
  * @param entity type name
  * @return view handler or null
  */
  getViewHandler(name) {
    return this.getEntityTypeHandler(name, 'view');
  }

  /**
  * Get list handler for requested entity type.
  *
  * @param entity type name
  * @return view handler or null
  */
  getListHandler(name) {
    return this.getEntityTypeHandler(name, 'list');
  }

  /**
  * Get access handler for requested entity type.
  *
  * @param entity type name
  * @return access handler or null
  */
  getAccessHandler(name) {
    return this.getEntityTypeHandler(name, 'access');
  }

  /**
  * Perform installation manoeuvre for storage backends.
  *
  * @param options
  *   Options to be passed for storages.
  * @preturn promise
  *   Promise to be resolved when all entity types are installed
  */
  install(options = {}) {
    system.log('EntityAPI', "Executing install manoeuvre");
    return this.getEntityTypeIds().reduce((sequence, entityType) => {
      return sequence.then(() => {
        return this.getStorage(entityType).install();
      })
    }, Promise.resolve());
  }

  /**
  * Perform uninstallation manoeuvre for storage backends.
  *
  * @param options
  *   Options to be passed for storages.
  */
  uninstall(options = {}) {
    system.log('EntityAPI', "Executing uninstall manoeuvre");
    return this.getEntityTypeIds().reduce((sequence, entityType) => {
      return sequence.then(() => {
        return this.getStorage(entityType).uninstall();
      })
    }, Promise.resolve());
  }

  /**
  * Perform uninstallation manoeuvre for storage backends.
  *
  * @param options
  *   Options to be passed for storages.
  */
  update(options = {}) {
    system.log('EntityAPI', "Executing update manoeuvre");
    return this.getEntityTypeIds().reduce((sequence, entityType) => {
      return sequence.then(() => {
        return this.getStorage(entityType).update();
      })
    }, Promise.resolve());
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