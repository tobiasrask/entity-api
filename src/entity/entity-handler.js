import DomainMap from 'domain-map'
import Entity from './entity'

/**
* Entity handler
*/
class EntityHandler {

  /**
  * Constructor
  *
  * @param variables with following keys
  *   entityTypeId
  *     Entity type id
  *   entityClass
  *     Entity class
  */
  constructor(variables = {}) {
    this._registry = new DomainMap()

    if (!variables.hasOwnProperty('entityTypeId')) {
      throw new Error('Entity type id not defined')
    }

    this._registry.set('properties', 'entityTypeId', variables.entityTypeId)

    let entityClass = variables.hasOwnProperty('entityClass') ?
      variables.entityClass : Entity

    this._registry.set('properties', 'entityClass', entityClass)
  }

  /**
  * Returns entity type id for this handler.
  *
  * @return entityType
  */
  getEntityTypeId() {
    return this._registry.get('properties', 'entityTypeId')
  }

  /**
  * Returns entity base class
  *
  * @return base class
  */
  getEntityBaseClass() {
    return this._registry.get('properties', 'entityClass')
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
  getProperty(key, defaultValue) {
    return this._registry.get('properties', key, defaultValue)
  }
}

export default EntityHandler
