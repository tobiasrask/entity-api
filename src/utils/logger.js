import APIObject from "./../includes/api-object"

/**
* Logger API.
*/
class LoggerAPI extends APIObject {

  /**
  * Construct logger api
  *
  * @param variables
  */
  constructor(params = {}) {
    params.type = 'log';
    super(params);
  }

  /**
  * Watchdog logging.
  *
  * @param module
  * @param msg
  * @param type
  *   Log message type, defaults to 'info'
  * @param meta
  *   Context for this log event formatted as array of key value pairs.
  */
  log(module, msg, type = 'info', meta = []) {
    let time = Math.floor(Date.now() / 1000);
    let metatext = meta.reduce((build, data) => {
      return `${build} ${data.key}=${data.value}`
    }, '');
    console.log(`${time} ${module} ${msg} ${metatext} [${type}]`);
  }
}

export default LoggerAPI;