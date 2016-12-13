import DomainMap from 'domain-map'
import EntityHandler from "./entity-handler"

/**
* Entity access handler
*/
class EntityAccessHandler extends EntityHandler {

  /**
  * Create access for entity
  *
  * @param object
  *   Source object who want's to create entity.
  * @param options
  * @return boolean has access
  */
  createAccess(object, options = {}) {
    return false;
  }

  /**
  * Access check for entity.
  *
  * @param entity
  * @param op
  *   Operation to be executed for entity.
  * @param object
  *   Source object who want's to access entity.
  * @param options
  * @return boolean has access
  */
  access(entity, op, object, options = {}) {
    return false;
  }
}

export default EntityAccessHandler;