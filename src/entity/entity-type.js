import DomainMap from 'domain-map'

/**
* Entity type.
*/
class EntityType {

  /**
  * Construct entity type
  *
  * @param params
  */
  constructor(variables) {
    this._registry = new DomainMap();
    this._registry.set('properties', 'entityTypeId', variables.entityTypeId);
    // Register handlers
    if (variables.hasOwnProperty('handlers')) {
      Object.keys(variables.handlers).forEach((handlerName, index) => {
        this.registerHandler(handlerName, variables.handlers[handlerName]);
      });
    }
  }

  /**
  * Set handler.
  *
  * @param key
  * @param handler
  */
  registerHandler(key, handler) {
    this._registry.set('handlers', key, handler);
  }

  /**
  * Get handler by handler machine name.
  *
  * @param key
  * @return handler or null if handler not found
  */
  getHandler(key) {
    return this._registry.get('handlers', key, null);
  }

  /**
  * Returns entity type id
  */
  getEntityTypeId() {
    return this._registry.get('properties', 'entityTypeId');
  }
}

export default EntityType;