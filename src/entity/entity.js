import DomainMap from "domain-map"
import APIObject from "./../includes/api-object"
import Utils from "./../includes/utils"
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
  constructor(variables = {}) {
    this._registry = new DomainMap();
    this._registry.set('properties', 'entityTypeId', variables.entityTypeId);
    this.prepareFields();
  }

  /**
  * Prepare fields by fetching field definitions.
  */
  prepareFields() {
    let fields = this.constructor.getFieldDefinitions();
    this._registry.set('properties', 'fields', fields);
  }

  /**
  * Initialize base fields with content container. Method will verify required
  * fields.
  *
  * @param container
  *   Content container to be loaded
  * @param callback
  */
  prepareFieldValues(container, callback) {
    let self = this;
    let errors = null;
    this.getFields().forEach((field, fieldName) => {
      if (container.hasOwnProperty(fieldName))
        self.set(fieldName, container[fieldName]);
      else if (field.isRequired())
        errors = new Error(`Field ${fieldName} is required.`);
    });
    callback(errors);
  }

  /**
  * Export field values as content container.
  *
  * @return content container
  */
  exportFieldValues() {
    var self = this;
    var build = {};
    var fields = this.getFields();
    fields.forEach((field, fieldName) => {
      build[fieldName] = field.get();
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
    let indexes = this.constructor.getFieldIndexDefinitions();
    if (!indexes)
      return false;
    let entityId = {};
    for (var i = 0; i < indexes.length; i++)
      entityId[indexes[i].fieldName] = this.get(indexes[i].fieldName);
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
    this._registry.set('properties', 'isNew', true);

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
    let indexes = this.constructor.getFieldIndexDefinitions();
    if (!indexes)
      return false;
    for (var i = 0; i < indexes.length; i++)
      if (indexes[i].hasOwnProperty('auto') && indexes[i]['auto'])
        this.setDangerously(indexes[i].fieldName, Utils.getUUID());
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
  * Method returns boolean value to indicate if entity is new.
  *
  * @return boolean is new
  */
  isNew() {
    return this._registry.get('properties', 'isNew', false);
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
    return EntityAPI.getInstance().getStorage(this.getEntityTypeId()).save(this);
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
    entityAPI.getStorage(this.getEntityTypeId()).delete(this, callback);
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
  * View entity.
  *
  * @param options
  * @return promise
  */
  view(options) {
    return EntityAPI.getInstance().getViewHandler(this.getEntityTypeId()).view(this, options);
  }

  /**
  * Return fields
  *
  * @return collection fields
  */
  getFields() {
    return this._registry.get('properties', 'fields');
  }

  /**
  * Fetch field value.
  *
  * @param fieldName
  */
  get(fieldName) {
    let fields = this._registry.get('properties', 'fields');
    if (!fields)
      return null;
    return fields.has(fieldName) ? fields.get(fieldName).get() : null;
  }

  /**
  * Set field value
  *
  * @param fieldName
  * @param value
  * @return boolean succeed
  */
  set(fieldName, value) {
    let fields = this._registry.get('properties', 'fields');

    if (!fields)
      return false;

    if (!fields.has(fieldName))
      throw new Error(`Unable to set value for unkown field : ${fieldName}`);
    return fields.get(fieldName).set(value);
  }

  /**
  * Set field value dangerously.
  * Note that this method passes protected fields lock.
  *
  * @param fieldName
  * @param value
  */
  setDangerously(fieldName, value) {
    let fields = this._registry.get('properties', 'fields');

    if (!fields)
      return false;

    if (!fields.has(fieldName))
      throw new Error(`Unable to set value for unkown field : ${fieldName}`);

    return fields.get(fieldName).set(value, {force: true});
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
  static getFieldIndexDefinitions() {
    return [];
  }
}

export default Entity;