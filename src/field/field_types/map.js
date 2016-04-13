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

}

export default MapFieldType;