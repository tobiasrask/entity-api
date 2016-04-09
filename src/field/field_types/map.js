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
    variables['fieldTypeId'] = 'map';
    super(variables);
  }

}

export default MapFieldType;