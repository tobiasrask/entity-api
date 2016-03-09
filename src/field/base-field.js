import DomainMap from 'domain-map'
import Field from "./field";

/**
* Base fields are stored withing entity table.
*/
class BaseField extends Field {
  
  /**
  * Construct field
  *
  * @param params
  */
  constructor(variables) {
    super(variables);

    // Apply protected value
    if (variables.hasOwnProperty('protected'))
      this.setProtected(variables['protected']);

    // By default field value is not locked
    this.setLockState(false);

    // Apply field item
    if (variables.hasOwnProperty('fieldItem'))
      this.setFieldItem(variables.fieldItem);
    else
      throw new Error("Basefield generation requires fielItem attribute");
  }

  /**
  * Set field item.
  *
  * @param fieldItem
  */
  setFieldItem(fieldItem) {
    this._registry.set('values', 'fieldItem', fieldItem);
  }

  /**
  * Get field item.
  *
  * @return fieldItem or null
  */
  getFieldItem() {
    return this._registry.get('values', 'fieldItem', null);
  }

  /**
  * Apply lock state
  *
  * @param value
  */
  setLockState(value) {
    this._registry.set('properties', 'locked', value);
  }

  /**
  * Get lock state
  *
  * @param value
  */
  getLockState() {
    return this._registry.set('properties', 'locked', false);
  }


  /**
  * Apply lock state
  *
  * @param value
  */
  setProtected(value) {
    this._registry.set('properties', 'protected', value);
    return this;
  }

  /**
  * Get lock state
  *
  * @return value
  */
  isProtected(value) {
    return this._registry.get('properties', 'protected', false);
  }

  /**
  * Set field value
  *
  * @param value
  * @param options
  *   force - Force locked and protected values to be updated  
  */
  set(value, options = {}) {
    const forceUpdate = options.hasOwnProperty('force') &&
      options.force ? true : false;

    // Protected fields are initialized only once
    // Second write requires force mode to be enabled
    if (this.getLockState() && !forceUpdate) {
      this.log("basefield", "Can't update locked field", "warning");
      return false;      
    }

    if (this.isProtected()) this.setLockState(true);
    return this.getFieldItem().setValue(value);
  }

  /**
  * Get field value
  *
  * @return field value
  */
  get() {
    return this.getFieldItem().getValue();    
  }

  /**
  * Set default value.
  *
  * @param value
  */
  setDefaultValue(value) {
    this.getFieldItem().setDefaultValue(value);    
    return this;
  }
}

export default BaseField;