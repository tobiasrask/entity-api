import crypto from "crypto"
import uuidV4 from "uuid/v4";

class Utils {

  /**
  * Generate uuid, read more from: https://www.npmjs.com/package/uuid.
  *
  * @return uuid
  */
  static getUUID() {
    return uuidV4();
  }
}

export default Utils;