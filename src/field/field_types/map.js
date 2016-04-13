import FieldType from "./field-type";

/**
* Map field type
*/
class MapFieldType extends FieldType {
  
  /**
  * Construct field
  *
  * @param params
  */
  constructor(variables = {}) {
    if (!variables.hasOwnProperty('fieldTypeId'))
      variables['fieldTypeId'] = 'map';
    super(variables);
  }

  /**
  * Validate value.
  *
  * @param value
  */
  validateFieldValue(value) {
    return value !== null &&
           typeof value === "object" &&
           !Array.isArray(value);
  }
}

export default MapFieldType;