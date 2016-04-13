import FieldType from "./field-type";

/**
* Boolean field type
*/
class BooleanFieldType extends FieldType {
  
  /**
  * Construct field
  *
  * @param params
  */
  constructor(variables = {}) {
    if (!variables.hasOwnProperty('fieldTypeId'))
      variables['fieldTypeId'] = 'boolean';
    super(variables);
  }

  /**
  * Prepare field value to be boolean.
  *
  * @param value
  * @return value
  */
  prepareFieldValue(value) {
    return value ? true : false;
  }

  /**
  * Validate value.
  *
  * @param value
  */
  validateFieldValue(value) {
    return typeof (value) === "boolean";
  }
}

export default BooleanFieldType;