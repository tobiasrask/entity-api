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
    if (!variables.hasOwnProperty('fieldTypeId'))
      variables['fieldTypeId'] = 'integer';
    super(variables);
  }

  /**
  * Validate field value before assigning it.
  *
  * @return boolean is valid
  */
  validateFieldValue(value) {
    return !isNaN(value) && (x => { return (x | 0) === x; })(parseFloat(value))
  }
}

export default IntegerFieldType;