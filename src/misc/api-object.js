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

    this._registry.set('properties', '_logger', false);
    // TODO: Turn debugging off
    this._debug = options.hasOwnProperty('debug') ? options.debug : true;
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
  * Log event.
  *
  * @param source
  * @param message
  * @param type
  */
  log(source, message, type) {
    if (type == undefined) type = 'info';
    console.log(`${source}  ${message}  ${type}`);
  }

  /**
  * Set logger.
  *
  * @param logger.
  */
  setLogger(logger) {
    this._registry.set('properties', '_logger', logger);
  }
}

export default APIObject;