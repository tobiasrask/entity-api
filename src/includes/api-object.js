import DomainMap from 'domain-map'

/**
* Defides API object interface.
*/
class APIObject {

  /**
  * Construct.
  *
  * @param options
  */
  constructor(options) {
    this._registry = new DomainMap();
    this._debug = options.hasOwnProperty('debug') ? options.debug : false;
    this.init();
  }

  /**
  * Hook init() initializes API.
  */
  init() {

  }

  /**
  * Returns API type.
  *
  * @return api type
  */
  getType() {
    return this._registry.get('properties', 'type')
  }


  /**
  * Set property.
  *
  * @param key
  * @param value
  */
  setProperty(key, value) {
    this._registry.set('properties', key, value);
  }

  /**
  * Returns properties.
  *
  * @return properties.
  */
  getProperties() {
    return this._registry.get('properties');
  }

  /**
  * Returns property.
  *
  * @param property key
  * @param default value
  * @return property value or default, if property doesn't exists.
  */
  getProperty(key, defaultValue = null) {
    return this._registry.get('properties', key, defaultValue);
  }

  /**
  * Register listener for observer.
  *
  * @param listener identifier
  * @param types
  * @param callback
  */
  registerListener(listenerId, types, callback) {
    // TODO:
    return false;
  }

  /**
  * Unregister listener
  *
  * @param listener identifier
  * @return boolean succeed
  */
  unregisterListener(listenerId) {
    return false;
  }

  /**
  * Generic logging method. Application should extend LoggerAPI and register it
  * to handle event flow.
  *
  * @param args
  *   Arguments will be passed to logger.
  * @return boolean succeed
  *   Method returns boolean value to indicate if log exists.
  */
  log(args) {
    let logger = this.getProperty('log');
    if (logger == null)
      return false;

    logger.log.apply(logger, arguments);
    return true;
  }
}

export default APIObject;