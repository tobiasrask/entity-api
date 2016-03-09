import FieldType from "./field-type";

/**
* Interger field type
*/
class IntegerFieldType extends FieldType {
  
  /**
  * Construct field
  *
  * @param params
  */
  constructor(variables = {}) {
    variables['fieldTypeId'] = 'integer';
    super(variables);
  }

}

export default IntegerFieldType;