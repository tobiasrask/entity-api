import APIObject from "./../includes/api-object"
import system from "./../system"

var fieldAPIInstance = false;

/**
* Field API.
*
* File api contains
*
*/
class FieldAPI extends APIObject {

  /**
  * Construct field api
  *
  * @param variables
  */
  constructor(params = {}) {
    params.type = 'entityAPI';
    super(params);

    // Apply default fields provided by field API
    if (!params.hasOwnProperty('fields')) params.fields = {};
    if (!params.hasOwnProperty('skipDefaultFields')) {
      params.fields['base_field'] = require('./fields/base-field').default;
      params.fields['complex_field'] = require('./fields/complex-field').default;
    }

    Object.keys(params.fields).forEach((fieldId, index) => {
      this.registerField(fieldId, params.fields[fieldId]);
    });

    // Apply default field types provided by field API
    if (!params.hasOwnProperty('fieldTypes')) params.fieldTypes = {};
    if (!params.hasOwnProperty('skipDefaultFieldTypes')) {
      params.fieldTypes['text'] = require('./field_types/text').default;
      params.fieldTypes['integer'] = require('./field_types/integer').default;
      params.fieldTypes['boolean'] = require('./field_types/boolean').default;
      params.fieldTypes['list'] = require('./field_types/list').default;
      params.fieldTypes['map'] = require('./field_types/map').default;
    }

    Object.keys(params.fieldTypes).forEach((fieldTypeId, index) => {
      this.registerFieldType(fieldTypeId, params.fieldTypes[fieldTypeId]);
    });
  }

  /**
  * Register field. Field could be something like "base_field", "image" or
  * "link" and contains formatted value.
  *
  * @param fieldId
  *   Field identifier
  * @param field
  *   Field class
  */
  registerField(fieldId, field) {
    system.log("FieldAPI", `Registering field: ${fieldId}`);
    this._registry.set('fields', fieldId, field);
  }

  /**
  * Get field.
  *
  * @param fieldId
  * @return field of null
  */
  getField(fieldId) {
    return this._registry.get('fields', fieldId, null);
  }

  /**
  * Register field type. Field type could be something like "text", "integer" or
  * "boolean" and contains formatted value.
  *
  * @param fieldTypeId
  * @param fieldType
  *   Field type class
  */
  registerFieldType(fieldTypeId, fieldType) {
    system.log("FieldAPI", `Registering field type: ${fieldTypeId}`);
    this._registry.set('fieldTypes', fieldTypeId, fieldType);
  }

  /**
  * Get field type.
  *
  * @param name
  * @return field handler of null
  */
  getFieldType(type) {
    return this._registry.get('fieldTypes', type, null);
  }

  /**
  * Factor method to create base fields.
  * Base field contain only one field at the time.
  *
  * @param field type name
  * @return field instance
  */
  createBasefield(fieldTypeId) {
    return this.createField('base_field', fieldTypeId);
  }

  /**
  * Factor method to create fields.
  *
  * @param fieldId
  *   Field id
  * @param fieldTypeId
  *   Field type id
  * @return field
  */
  createField(fieldId, fieldTypeId) {
    let field = this.getField(fieldId);

    if (!field)
      throw new Error(`Unable to create field, unknown field id: ${fieldId}`);

    let fieldType = this.getFieldType(fieldTypeId);
    if (!fieldType)
      throw new Error(`Unable to create field, unknown field type ${fieldTypeId}`);

    return new field({
      'fieldId': fieldId,
      'fieldType': new fieldType()
      });
  }

  /**
  * Returns singleton object
  *
  * @param options
  *  If instance if not constructed yet, it will be constructed with given
  *  options
  * @param reset
  *   Boolean value to indicate if entity singleton should be re created
  *   Defaults to false.
  */
  static getInstance(options = {}, reset = false) {
    if (!fieldAPIInstance || reset) {
      fieldAPIInstance = new FieldAPI(options);
    }
    return fieldAPIInstance;
  }
}

export default FieldAPI;