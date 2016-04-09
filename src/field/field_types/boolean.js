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
    variables['fieldTypeId'] = 'boolean';
    super(variables);
  }

}

export default BooleanFieldType;