import DomainMap from 'domain-map'
import APIObject from "./../../misc/api-object"

/**
* Field type.
*/
class FieldType extends APIObject {
  
  /**
  * Construct field type
  *
  * @param params
  */
  constructor(variables) {
    super(variables);
    this._registry = new DomainMap();
    this._registry.set('properties', 'fieldTypeId', variables.fieldTypeId);
  }

  /**
  * Get field type id.
  *
  * @return field type id
  */
  getFieldTypeId() {
    return this._registry.get('properties', 'fieldTypeId');
  }

  /**
  * Set value.
  *
  * @param value
  * @return boolean succeed
  */
  setValue(value) {
    if (this.validateFieldValue(value)) {
      this._registry.set('properties', 'value', value);
      return true;
    } else {
      this._registry.set('log', 'error', `Field validation failed: ${value}`);
      return false;
    }
  }

  /**
  * Get value.
  *
  * @return value
  */
  getValue() {
    return this._registry.get('properties', 'value', null);
  }

  /**
  * Set value.
  *
  * @param value
  */
  setDefaultValue(value) {
    this._registry.set('properties', 'defaultValue', value);
  }

  /**
  * Get value.
  *
  * @return value
  */
  getDefaultValue() {
    return this._registry.get('properties', 'defaultValue', null);
  }

  /**
  * Validate field value before assigning it.
  *
  * @return boolean is valid
  */
  validateFieldValue(value) {
    return true;
  }

  /**
  * Method checks if value is empty
  *
  * @return boolean is empty
  */
  isEmpty() {
    return true;
  }
}

export default FieldType;