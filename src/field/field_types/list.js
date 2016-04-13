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

}

export default ListFieldType;