/**
* Defides API object interface.
*/
class APIObject {
  
  /**
  * Construct.
  *
  * @param options
  */
  construct(options) {
    this._logger = false;
    // TODO: Turn debugging off
    this._debug = options.hasOwnProperty('debug') ? options.debug : true;
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
  * Set logger
  */
  setLogger(logger) {
    this._logger = logger;
  }
}

export default APIObject;