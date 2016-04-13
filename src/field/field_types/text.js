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

}

export default TextFieldType;