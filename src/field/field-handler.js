/**
* Field handler
*/
class FieldHandler {

  /**
  * Constructor
  */
  constructor(variables) {
    // Apply field type
    this._fieldTypeId = variables.hasOwnProperty('fieldType') ?
      variables.fieldType : false;
  }

  /**
  * Returns field type id
  *
  * @return fieldType
  */
  getFieldType() {
    return this._fieldTypeId;
  }

}

export default FieldHandler;