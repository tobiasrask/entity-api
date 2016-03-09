import DomainMap from 'domain-map'


/**
* Field.
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
    return this._registry.set('properties', 'fieldName', '');
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
    // Override this method
  }

  /**
  * Get field value
  *
  * @return field value  
  */
  get() {
    // Override this method
  }
}

export default Field