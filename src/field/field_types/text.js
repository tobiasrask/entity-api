import FieldType from "./field-type";

/**
* Text field type
*/
class TextFieldType extends FieldType {

  /**
  * Construct field
  *
  * @param params
  */
  constructor(variables = {}) {
    if (!variables.hasOwnProperty('fieldTypeId'))
      variables['fieldTypeId'] = 'text';
    super(variables);
  }

  /**
  * Validate field value before assigning it.
  *
  * @return boolean is valid
  */
  validateFieldValue(value) {
    return typeof value === 'string';
  }

  /**
  * Hook prepareFieldValue()
  *
  * @param value
  * @return value
  */
  prepareFieldValue(value) {
    if (value == undefined &&
        value == null ||
        typeof value === 'object')
      return null;
    return typeof value === 'string' ? value : value.toString();
  }
}

export default TextFieldType;