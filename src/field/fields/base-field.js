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
  constructor(variables = {}) {
    
    if (!variables.hasOwnProperty('fieldId'))
      variables.fieldId = 'base_field';

    super(variables);

    // Apply protected value
    if (variables.hasOwnProperty('protected'))
      this.setProtected(variables['protected']);

    // By default field value is not locked
    this.setLockState(false);
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
    return this._registry.get('properties', 'locked', false);
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
    let forceUpdate = options.hasOwnProperty('force') &&
      options.force ? true : false;

    // Protected fields are initialized only once
    // Second write requires force mode to be enabled
    if (this.isProtected() && this.getLockState() && !forceUpdate) {
      // console.log("basefield", "Can't update locked field", "warning");
      return false;      
    }

    if (this.isProtected())
      this.setLockState(true);
    
    return this.getFieldTypeInstance().setValue(value);
  }

  /**
  * Get field value
  *
  * @return field value
  */
  get() {
    return this.getFieldTypeInstance().getValue();    
  }

  /**
  * Set default value.
  *
  * @param value
  */
  setDefaultValue(value) {
    this.getFieldTypeInstance().setDefaultValue(value);    
    return this;
  }

  /**
  * View field.
  *
  * @param options with following keys
  *   viewMode
  * @param callback
  *   Will return object content value - key, or false if no data available.
  */
  view(options, callback) {
    let instance = this.getFieldTypeInstance();
    return instance ? callback(null, instance.getValue()) : callback(null, null);
  }

  /**
  * Method checks if given view mode is enabled for view.
  *
  * @param viewMode
  * @return boolean is enabled
  */
  isViewModeEnabled(viewMode) {
    let property = this.getProperty('view_properties');

    if (!property || !property.hasOwnProperty(viewMode))
      return false;

    return property[viewMode].hasOwnProperty('view_field') &&
           property[viewMode]['view_field'] ? true : false;
  }
}

export default BaseField;