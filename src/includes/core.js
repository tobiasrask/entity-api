import APIObject from './api-object'

/**
* Core system to manage other APIs. Core system is also API by it'snature.
*/
class Core extends APIObject {

  /**
  * Initialize core.
  */
  init() {

  }

  /**
  * Register API.
  *
  * @param apiObject
  */
  registerAPI(apiObject) {
    this._registry.set('api', apiObject.getType(), apiObject)
  }

  /**
  * Returns api.
  *
  * @param type
  * @return API Object or null if not exists
  */
  api(type) {
    return this._registry.get('api', type, null)
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
  log(_args) {
    let logger = this.api('log')

    if (logger == null) {
      return false
    }

    logger.log.apply(logger, arguments)
    return true
  }
}

const core = new Core({ type: 'system' })
export default core
