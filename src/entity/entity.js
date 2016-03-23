import DomainMap from "domain-map"
import Utils from "./../misc/utils"
import EntityAPI from "./entity-api"

/**
* Entity
*/
class Entity {

  /**
  * Constructor
  *
  * @param variables with following values
  *  - entityTypeId
  */
  constructor(variables) {
    this._registry = new DomainMap();
    this._registry.set('properties', 'entityTypeId', variables.entityTypeId);
    this.prepareFields();
  }

  /**
  * Prepare fields by fetching field definitions.
  */
  prepareFields() {
    this._registry.set('properties', 'fields', this.getFieldDefinitions());
  }

  /**
  * Initialize base fields with content container.
  *
  * @param container
  *   Content container to be loaded
  * @param callback
  */
  prepareFieldValues(container, callback) {
    var self = this;
    var fields = this._registry.get('properties', 'fields');
    if (!fields) return callback(null);
    fields.forEach((value, fieldName) => {
      if (container.hasOwnProperty(fieldName))
        self.set(fieldName, container[fieldName]);
    });
    callback(null);
  }

  /**
  * Export field values as content container.
  *
  * @return content container
  */
  exportFieldValues() {
    var self = this;
    var build = {};
    var fields = this._registry.get('properties', 'fields');
    if (!fields) return callback(null);
    fields.forEach((value, fieldName) => {
      build[fieldName] = self.get(fieldName);
    });
    return build;
  }

  /**
  * Returns entity identifier.
  * Note that identifier support multivalue keys.
  *
  * @return entity id
  *   Object with index keys
  */
  id() {
    let indexes = this.getEntityIndexDefinitions();
    if (!indexes)
      return false;
    let entityId = {};
    for (var i = 0; i < indexes.length; i++) {
      entityId[indexes[i].fieldName] = this.get(indexes[i].fieldName);
    }
    return entityId;
  }

  /**
  * Returns entity type id.
  *
  * @return entityType
  */
  getEntityTypeId() {
    return this._registry.get('properties', 'entityTypeId');
  }

  /**
  * Returns entity tag.
  *
  * @return tag
  */
  getEntityTag() {
    return this._registry.get('properties', 'entityTag');
  }

  /**
  * Prepare entity creation
  *
  * @param variables
  * @param callback
  */
  preCreation(variables, callback) {
    this._isNew = true;

    // Apply entity tag
    if (variables.hasOwnProperty(':tag'))
      this._registry.set('properties', 'entityTag', variables[':tag']);

    // Prepare entity identifier
    this.prepareEntityId();

    // Apply field values
    this.prepareFieldValues(variables, callback);
  }

  /**
  * Returns entity identifier.
  * Note that identifier support multivalue keys.
  *
  * @return entity id
  *   Object with index keys
  */
  prepareEntityId() {
    let indexes = this.getEntityIndexDefinitions();
    if (!indexes)
      return false;
    for (var i = 0; i < indexes.length; i++) {
      if (indexes[i].hasOwnProperty('auto') && indexes[i]['auto']) 
        this.setDangerously(indexes[i].fieldName, Utils.getUUID());
    }
  }

  /**
  * Create entity.
  *
  * @param variables
  * @param callback
  */
  create(variables, callback) {
    callback(null);
  }

  /**
  * Finalize entity creation.
  *
  * @param callback
  */
  finalize(callback) {
    callback(null);
  }

  /**
  * Load entity with data
  *
  * @param variables
  * @param callback
  */
  load(variables, callback) {
    this.prepareFieldValues(variables.container, callback);
  }

  /**
  * Hook called after entity is loaded.
  *
  * @param callback
  */
  postLoad(callback) {
    callback(null);
  }

  /**
  * Save this entity.
  *
  * @return promise
  *   Delivers promise from entity strorage.
  */
  save() {
    let entityType = this.getEntityTypeId();
    return EntityAPI.getInstance().getStorage(entityType).save(this);
  }

  /**
  * Hook called after entity is saved.
  *
  * @param callback
  */
  postSave(callback) {
    callback(null);
  }

  /**
  * Delete entity
  *
  * @param callback
  */
  delete(callback) {
    let entityType = this.getEntityTypeId();
    entityAPI.getStorage(entityType).delete(this, callback);
  }

  /**
  * Hook called before entity is deleted.
  *
  * @param callback
  */
  preDelete(callback) {
    callback(null);
  }

  /**
  * Hook called after entity is deleted.
  *
  * @param callback
  */
  postDelete(callback) {
    callback(null);
  }

  /**
  * Fetch field value.
  *
  * @param fieldName
  */
  get(fieldName) {
    let fields = this._registry.get('properties', 'fields');
    if (!fields)
      return false;

    if (fields.has(fieldName)) {
      return fields.get(fieldName).get();
    } else {
      console.log("Unable to get field value, unknown field name:", fieldName);
    }
    return false;
  }

  /**
  * Set field value
  *
  * @param fieldName
  * @param value
  */
  set(fieldName, value) {
    let fields = this._registry.get('properties', 'fields');
    if (!fields)
      return false;

    if (fields.has(fieldName)) {
      fields.get(fieldName).set(value);
    } else {
      console.log("Unable to set field value, unkown field name:", fieldName);
    }
  }

  /**
  * Set field value dangerously. Not this method passes protected field lock.
  *
  * @param fieldName
  * @param value
  */
  setDangerously(fieldName, value) {
    let fields = this._registry.get('properties', 'fields');
    if (!fields)
      return false;

    if (fields.has(fieldName)) {
      fields.get(fieldName).set(value, {force: true});
    } else {
      console.log("Unable to set field value, unkown field name:", fieldName);
    }
  }

  /**
  * Returns field definitions.
  *
  * @return data
  */
  static getFieldDefinitions() {
    const fields = new Map();
    return fields;
  }

  /**
  * Returns entity index definitions.
  *
  * @return data
  *   List of indexes
  */
  static getEntityIndexDefinitions() {
    return [];
  }
}

export default Entity;