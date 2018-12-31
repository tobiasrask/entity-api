# entity-api
[entity-api](https://www.npmjs.org/package/entity-api) provides easy to use Entity API for Node.js applications.

Creating, loading, updating and deleting entities can be messy operation behind the scenes, if there is no proper way to do it. This module aims to help you formalize these basic entity operations by defining required `Entity types`, `Entities` and specialized handlers like `View handler`, `List handler`, `Storage handler` and `Access handler`.

Field API provides tools to define, manage, view and validate entity fields.

### Supported storage backends

Entities are stored to storage backend. This module is shipped with in-memory storage backend called `ConfigStorageBackend`.

Storage backends are provided as own modules. At the moment there is support for following storage backends:
- [dynamodb](https://www.npmjs.com/package/dynamodb-storage-backend) for Amazon AWS DynamoDB
- [elasticsearch](https://www.npmjs.com/package/elasticsearch-storage-backend) for ElasticSearch

Please contribute to get more storage backends.

### Installation

Using [npm](https://www.npmjs.com/):

    $ npm install --save entity-api

### Usage example

Here is an example how to create a custom entity type called `message` to store some notes with content. See [example.js](https://github.com/tobiasrask/entity-api/blob/master/docs/examples.js) for more examples with descriptions.

```js
import {
  Entity,
  EntityAPI,
  EntityType,
  EntityStorageHandler,
  ConfigStorageBackend,
  EntityViewHandler,
  fieldAPI
} from 'entity-api'

class MessageEntity extends Entity {

  create(variables = {}, callback) {
    this.set('created', Date.now())
    callback(null)
  }

  describe() {
    return `This message says: "${this.get('body')}"`
  }
 
  static getFieldDefinitions() {
    const fields = new Map()

    fields.set('id', fieldAPI.createBasefield('text')
      .setName('ID')
      .setDescription('Entity identifier')
      .setProtected(true)
      .setProperty('view_properties', {
        full: { view_field: true },
        list: { view_field: true }
      }))

    fields.set('body', fieldAPI.createBasefield('text')
      .setName('Message')
      .setDescription('Message body')
      .setProperty('view_properties', {
        full: { view_field: true }
      }))

    fields.set('created', fieldAPI.createBasefield('integer')
      .setName('Created time')
      .setDescription('Created time for message')
      .setProperty('view_properties', {
        full: { view_field: true },
        list: { view_field: true }
      }))
    return fields
  }

  static getFieldIndexDefinitions() {
    return [
      { 'fieldName': 'id', 'indexType': 'HASH', 'auto': true }
    ]
  }
}

class MessageEntityType extends EntityType {

  constructor(variables = {}) {
    variables.entityTypeId = 'message'
    variables.entityClass = MessageEntity
    variables.handlers = {
      storage: new EntityStorageHandler({
        storageBackend: ConfigStorageBackend
      }),
      view: new EntityViewHandler(variables),
    }
    super(variables)
  }
}

const entityAPI = EntityAPI.getInstance({}, true)
entityAPI.registerEntityType(new MessageEntityType())

```

Now you can create, store and load message entities. You can also view entities using `view modes` defined within fields. Viewed entity is Data Transfer Object (DTO).

```js
const data = {
  body: 'Hi there'
}

// Create and view entity
entityAPI.getStorage('message').create(data)
  .then((entity) => {
    return entity.view({ viewMode: 'full' })
  })
  .then((viewedEntity) => {
    console.log(viewedEntity)
    // --> {id: '00112233-4455-6677-8899-aabbccddeeff', body': 'Hi there', created: 1234567890 }
  })

entityAPI.getStorage('message').createAndSave(data)
  .then((entity) => {
    console.log(entity.describe())
    // --> This message says: "Hi there"

    entity.set('body', 'Wohoo')
    return entity.save()
  })
  .then((entity) => {
    console.log(entity.describe())
    // --> This message says: "Wohoo"
  })

const entityId = {id: '00112233-4455-6677-8899-aabbccddeeff'}

entityAPI.getStorage('message').load(entityId)
  .then((entity) => {
    console.log(entity.describe())
    // --> This message says: "Wohoo"
  })
```

Error handling with entities:

```js
entityAPI.getStorage('message').create(data)
  .then((entity) => {
    if (!entity) {
      throw new Error('Unable to create entity')
    }
  })
  .catch((err) => {
    // If there was an error when creating entity, 
    console.error(err)
  })
```

## Methods and hooks

### Entity API

EntityAPI has following methods:

entityAPI.getInstance(options = {}, reset = false)
  Returns entity API instance

entityAPI.registerEntityType(entityType)
  Register new entity type

entityAPI.registerEntityTypes(entityTypes)
  Register multiple entity types at once

entityAPI.getEntityType(entitTypeName)
  Returns entity type by name
  
entityAPI.getEntityTypeHandler(entitTypeName, handlerName)
  Returns entity type handler by handler name

entityAPI.getEntityTypeIds()
  Returns list of entity types

entityAPI.getStorage(name)
  Returns storage handler for entity type

entityAPI.getViewHandler(name)
  Returns view handler for entity type

entityAPI.getListHandler(name)
  Returns list handler for entity type

entityAPI.getAccessHandler(name)
  Returns access handler for entity type

entityAPI.install(options)
  Perform install storage operation for all entity types

entityAPI.uninstall(options)
  Perform uninstall storage operation for all entity types

entityAPI.update(options)
  Perform update storage operation for all entity types

### Entity

Entity object has following methods:

entity.id()
  Returns entity id as object, {key: '...', second_key: '...'}

entity.idString(delimiter = ':')
  Returns entity id as string using delimiter: 'key:second_key'

entity.getEntityTypeId()
  Returns entity type identifier

entity.getEntityTag()
  Returns entity tag. Tag is not saved, but it's available to pass data for entity

entity.getEntityContext()
  Returns entity context

entity.isNew()
  Returns boolean flag to indicate if entity is just created

entity.getFields()
  Returns fields assosiated with this entity

entity.get(fieldName)
  Returns field by name

entity.set(fieldName, value)
  Set field value

entity.setDangerously(fieldName, value)
  Set also protected field value


Entity object has following hooks:

```js
class CustomEntity extends Entity {

  // Construct new entity
  constructor(variables = {}) {
    super(variables)
  }

  // Define list of fields for this entity
  static getFieldDefinitions() {
    const fields = new Map()
    return fields
  }

  // Entity is about to be created
  create(variables, callback) {
    callback(null)
  }

  finalize(callback) {
    callback(null)
  }

  // is called after entity is loaded
  postLoad(callback) {
    callback(null)
  }

  // is called before entity is saved
  preSave(callback) {
    callback(null)
  }

  // is called after entity is saved
  postSave(callback) {
    callback(null)
  }

  // is called before entity is deleted
  preDelete(callback) {
    callback(null)
  }

  // is called after entity is deleted
  postDelete(callback) {
    callback(null)
  }

  // Returns base DTO object for when entity is about to be viewed 
  getViewContent() {
    return {}
  }

  // Allows entity to alter viewed entity content, for example add dynamic data
  alterViewContent(container, options, callback) {
    callback(null, container)
  }
}
```

### EntityHandler

By default `Entity API` provides following special handlers: `EntityStorageHandler`, `EntityListHandler`, `EntityViewHandler` and `EntityAccessHandler` handlers.

Extend EntityHandler class to provide custom handlers for you entity type.


### EntityViewHandler

EntityViewHandler has following methods:

handler.viewEntity(entity, options, callback)

handler.view(entity, options = {})
  Returns promise

viewMultipleEntities(entities, options = {}, callback)

handler.viewMultiple(entity, options = {})
  Returns promise


### EntityAccessHandler

`EntityAccessHandler` has following hooks to manage access to given entity. You should extend EntityAccessHandler class to override this behaviour.

```js
class EntityAccessHandler extends EntityHandler {

  /**
  * Create access for entity
  *
  * @param object
  *   Source object who want's to create entity.
  * @param options
  * @return promise
  *   Resolves boolean has access
  */
  createAccess(object, _options = {}) {
    return Promise.resolve(false)
  }

  /**
  * Access check for entity.
  *
  * @param entity
  * @param op
  *   Operation to be executed for entity.
  * @param object
  *   Source object who want's to access entity.
  * @param options
  *   Options for current access check
  * @return promise
  *   Resolves boolean has access
  */
  access(entity, op, object, _options = {}) {
    return Promise.resolve(false)
  }
}
```

### EntityStorageHandler

`EntityStorageHandler` has following methods to manage storage.

Promise based methods:

storage.create(data)
  Create new entity

storage.load(id)
  Load entity by id

storage.loadMultiple(ids)
  Load multiple entities

storage.save(entity)
  Save entity

storage.createAndSave(data)
  Create and save entity

storage.delete(entity)
  Delete entity

storage.deleteMultiple(entities)
  Delete multiple entities


Storage has Following methods to manage general storage issues

storage.getSchemas()
  Retursn schema

storage.getStorageDatabaseName()
  Returns storage database name for entity

storage.getStorageDatabasePrefix()
  Returns database prefix for storage

storage.getStorageTableName()
  Returns table name for storage

storage.getStorageTablePrefix()
  Returns storage table prefix

storage.getStorageBackend()
  Returns storage backend object

storage.getEntityFieldDefinitions()
  Returns list of entity field definitions 

storage.getEntityFieldIndexDefinitions() 
  Returns list of entity field index definitions

storage.extractEntityId(indexes, data)
  Extracts entity if from indexes

storage.isValidEntityId(entityId)
  Checks if entity id is valid

storage.install(options)

storage.uninstall(options)

storage.update(options)


Callback based storage methods:

storage.createEntity(data, callback)

storage.loadEntity(id, callback)

storage.loadMultipleEntities(ids, callback) 

storage.saveEntity(entity, callback)

storage.deleteEntity(entity, callback)

storage.deleteMultipleEntities(entities, callback)

### Test
Run tests using [npm](https://www.npmjs.com/):

    $ npm run test
