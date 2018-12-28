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
  constructor(variables = {}) {
    this._registry = new DomainMap()

    if (!variables.hasOwnProperty('type')) {
      throw new Error('API type not defined.')
    }

    this._registry.set('properties', 'type', variables.type)

    let debug = variables.hasOwnProperty('debug') ? variables.debug : false
    this._registry.set('properties', 'debug', debug)

    this.init()
  }

  /**
  * Hook init() initializes API.
  */
  init() {

  }

  /**
  * Returns API type.
  *
  * @return api type
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
    this._registry.set('properties', key, value)
  }

  /**
  * Returns properties.
  *
  * @return properties.
  */
  getProperties() {
    return this._registry.get('properties')
  }

  /**
  * Returns property.
  *
  * @param property key
  * @param default value
  * @return property value or default, if property doesn't exists.
  */
  getProperty(key, defaultValue = null) {
    return this._registry.get('properties', key, defaultValue)
  }

  /**
  * Register listener for observer.
  *
  * @param listener identifier
  * @param types
  * @param callback
  */
  registerListener(_listenerId, _types, _callback) {
    // TODO:
    return false
  }

  /**
  * Unregister listener
  *
  * @param listener identifier
  * @return boolean succeed
  */
  unregisterListener(_listenerId) {
    return false
  }
}

export default APIObject