import DomainMap from 'domain-map'


/**
* Field @API.
*/
class Field {
  
  /**
  * Construct field
  *
  * @param variables
  *   Every field construction requires field_name and field_type
  */
  constructor(variables) {
    this._registry = new DomainMap();

    if (variables.hasOwnProperty('fieldId'))
      this._registry.set('properties', 'fieldId', variables.fieldId);

    // Apply field item
    if (variables.hasOwnProperty('fieldType'))
      this.setFieldTypeInstance(variables.fieldType);
    //  else
    //    throw new Error("Field generation requires fielItem attribute");
  }

  /**
  * Get field id.
  *
  * @return value
  */
  getFieldId() {
    return this._registry.get('properties', 'fieldId', '');
  }

  /**
  * Set field name.
  *
  * @param value
  */
  setName(value) {
    this._registry.set('properties', 'fieldName', value);
    return this;
  }

  /**
  * Get field name.
  *
  * @return value
  */
  getName() {
    return this._registry.get('properties', 'fieldName', '');
  }

  /**
  * Set field description
  *
  * @param value
  */
  setDescription(value) {
    this._registry.set('properties', 'description', value);
    return this;
  }

  /**
  * Get field description
  *
  * @return value
  */
  getDescription() {
    return this._registry.get('properties', 'description', '');
  }

  /**
  * Set field type item.
  *
  * @param fieldType
  */
  setFieldTypeInstance(fieldType) {
    this._registry.set('values', 'fieldType', fieldType);
  }

  /**
  * Get field item.
  *
  * @return fieldType or null
  */
  getFieldTypeInstance() {
    return this._registry.get('values', 'fieldType', null);
  }

  /**
  * Set default value
  *
  * @param value
  */
  setDefaultValue(value) {
    // Override this method
    return this;
  }

  /**
  * Set field value
  *
  * @param value
  * @param options
  */
  set(value, options) {
    return false;
  }

  /**
  * Get field value
  *
  * @return field value  
  */
  get() {
    return false;
  }

  /**
  * View field.
  *
  * @param options with following keys
  *   viewMode
  * @param callback
  *   Will return object with data - key, or false if no data available.
  */
  view(options, callback) {
    callback(null, false);
  }

  /**
  * Set field property value.
  *
  * @param property key
  * @param value
  */
  setProperty(propertyKey, value) {
    this._registry.set('field_property', propertyKey, value);
    return this;
  }

  /**
  * Get field property
  *
  * @param propertyKey
  * @return value
  */
  getProperty(propertyKey) {
    return this._registry.get('field_property', propertyKey);
  }  
}

export default Field