import DomainMap from 'domain-map'
import APIObject from "./../misc/api-object"
import BaseField from "./base-field";

/**
* Field api.
*
* File api contains:
*
*   keyfield
*     Field are handled 
*   basefield
*     Field values are stored withing entity table
*   complex-fields
*     Field data is stored in separate table
*   
*/
class FieldAPI extends APIObject {

  /**
  * Construct field api
  *
  * @param variables
  */
  constructor(variables = {}) {
    super(variables);

    this._registry = new DomainMap();

    if (!variables.hasOwnProperty('fieldTypes')) {
      // Apply default field typs
      variables.fieldTypes = {
        text: require('./types/text').default,
        integer: require('./types/integer').default
      }
    }

    Object.keys(variables.fieldTypes).forEach((fieldTypeId, index) => {
      this.registerFieldType(fieldTypeId, variables.fieldTypes[fieldTypeId]);
    });
  }

  /**
  * Register field type
  *
  * @param fieldTypeId
  * @param fieldType
  *   Field type class
  */
  registerFieldType(fieldTypeId, fieldType) {
    this.log("FieldAPI", "Registering field type: text");
    this._registry.set('fieldTypes', fieldTypeId, fieldType);
  }

  /**
  * Get field.
  *
  * @param name
  * @return field handler of null
  */
  getFieldType(type) {
    return this._registry.get('fieldTypes', type, null);
  }

  /**
  * Factor method to create base fields.
  * Base field contain only one field at the time.
  *
  * @param field type name
  * @return field
  */
  createBasefield(fieldTypeName) {
    let fieldType = this.getFieldType(fieldTypeName);

    if (!fieldType) {
      throw new Error(`Unable to create base field, unknown type ${fieldTypeName}`);
    }

    // Initialize new field with corresponding field type
    return new BaseField({
      'fieldItem': new fieldType()
      });
  }
}

export default FieldAPI;