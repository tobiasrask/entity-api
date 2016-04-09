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
    variables['fieldTypeId'] = 'list';
    super(variables);
  }

}

export default ListFieldType;