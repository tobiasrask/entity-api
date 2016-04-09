import EntityHandler from "./entity-handler";

/**
* Entity view handler
*/
class EntityViewHandler extends EntityHandler {

  /**
  * Promise based  alias for @viewEntity
  */
  view(entity, options) {
    return new Promise((resolve, reject) => {
      this.viewEntity(id, options, (err, result) => {
        if (err) reject(err);
        else resolve(result);
      });
    });
  }

  /**
  * Promise based  alias for @viewMultipleEntities
  */
  viewMultiple(entities, options) {
    return new Promise((resolve, reject) => {
      this.viewMultipleEntities(entities, options, (err, result) => {
        if (err) reject(err);
        else resolve(result);
      });
    });
  }

 /**
  * Traditional callback based api.
  */

  /**
  * View entity
  *
  * @param entity
  * @param options
  * @param callback
  */
  viewEntity(entity, options, callback) {

    let entities = DomainMap.createCollection({strictKeyMode: false});
    entities.set(entity.id(), entity);

    this.viewMultiple(entities, variables, function(err, result) {
      if (err) callback(err);
      else callback(null, result[0]);
    });
  }

  /**
  * View multiple entities
  *
  * @param entities
  *   Collection of entities
  * @param options
  *   viewMode - view mode for rendering
  * @param callback
  */
  viewMultipleEntities(entities, options, callback) {
    var self = this;
    if (options == undefined) options = {};
    if (!options.hasOwnProperty('viewMode')) options.viewMode = 'default';

    self.viewMultipleProcessFields(entities, options, function(err, result) {
      console.log("DONE!", err, result, entities);
      if (err) callback(err);
      else callback(null, result);
    });
  }

  /**
  * View entities.
  *
  * @param entities
  * @param options
  *   viewMode - view mode for rendering
  * @param callback
  *   Passes array of errors or null if everything went well.
  */
  viewMultipleProcessFields(entities, options, callback) {
    let self = this;
    let entityType = this.getEntityTypeId();
    let errors = [];
    let counter = entities.size();
    console.log("Processing entities...")
    entities.forEach((entity, entityId) => {
      console.log("Processing entity: " + counter);
      // TODO: Check scope? We reuse entities & entityID & entity
      self.processEntityFields(entityId, entity, options, err => {
        if (err) errors = errors.concat(err);        
        counter--;
        console.log("callbacked: " + counter);

        if (counter == 0) {
          if (!errors.length) callback(null);
          else callback(errors);
        }
      });
    });
  }

  /**
  * Build entity fields.
  *
  * @param entityId
  * @param entity
  * @param options
  * @param callback
  */
  processEntityFields(entityId, entity, options, callback) {
    if (!entity)
      return callback(new Error("Trying to view empty entity: ${entityId}"))    
    let errors = [];
    let fields = entity.getFields();
    let counter = fields.size;
    entity.content = {}    
    console.log("Processing entity fields...")

    fields.forEach((field, fieldName) => {
      field.view(options, (err, result) => {
        if (err)
          errors.push(err);
        else if (result.hasOwnProperty('data'))
          entity.content[fieldName] = result.data;
        // TODO: Provide hook for overriding value?
        // Maybe observer-pattern?
        counter--;
        if (counter == 0) {
          if (!errors.length) callback(null);
          else callback(errors);
        }
      });
    });
  }
}

export default EntityViewHandler;