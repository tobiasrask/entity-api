import UUID from 'uuid'

class Utils {

  /**
  * Generate uuid, read more from: https://www.npmjs.com/package/uuid.
  *
  * @return uuid
  */
  static getUUID() {
    return UUID.v4()
  }
}

export default Utils