import FieldType from "./field-type";

/**
* List field type
*/
class ListFieldType extends FieldType {

  /**
  * Construct field
  *
  * @param params
  */
  constructor(variables = {}) {
    if (!variables.hasOwnProperty('fieldTypeId'))
      variables['fieldTypeId'] = 'list';
    super(variables);
  }

  /**
  * Validate value.
  *
  * @param value
  */
  validateFieldValue(value) {
    return Array.isArray(value);
  }
}

export default ListFieldType;