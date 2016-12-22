import TextFieldType from "./text.js";

/**
* Email field overrides Text field, and makes sure email address doesn't contain
* empty strings. Addresses are converted lower case.
*/
class EmailFieldType extends TextFieldType {

  /**
  * Construct field.
  *
  * @param params
  */
  constructor(variables = {}) {
    if (!variables.hasOwnProperty('fieldTypeId'))
      variables['fieldTypeId'] = 'email';
    super(variables);
  }

  /**
  * Validate email field value before assigning it.
  *
  * @return boolean is valid
  */
  validateFieldValue(value) {
    return value !== undefined &&
           value !== null &&
           typeof value === 'string' &&
           /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/.test(value);
  }

  /**
  * Hook prepareFieldValue()
  *
  * @param value
  * @return value
  */
  prepareFieldValue(value) {
    return value !== undefined &&
           value !== null &&
           typeof value === 'string' ?
      value.toLowerCase().replace(/\s/g, '') : null;
  }
}

export default EmailFieldType;