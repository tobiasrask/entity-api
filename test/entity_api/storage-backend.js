import assert from "assert"
import { EntityAPI, EntityType, EntityHandler,
        Entity, EntityStorageHandler, StorageBackend  } from "./../../src/index"
import Utils from "./../../src/includes/utils"

class TestUtils extends Utils {

  /**
  * Creates probe
  *
  * @return probe
  */
  static createProbe() {
    let probe = {
      // Random probe values
      values: {
        entityTypeProbe: 'entityTypeprob:' + TestUtils.getUUID(),
        entityHandlerProbe: 'entityHandlerProb:' + TestUtils.getUUID(),
        storageBackendProbe: 'storageBackendProb:' + TestUtils.getUUID(),
        entityProbe: 'entityProb:' + TestUtils.getUUID(),
      },
      // Probe classes
      classes: {}
    }

    class ProbeStorageBackend extends StorageBackend {

      constructor(variables) {
        super(variables);
        this._testProbe = 0;
      }

      installSchemas(schemas, options, callback) {
        this._testProbe += 1;
        callback(null);
      }

      updateSchemas(schemas, options, callback) {
        this._testProbe += 2;
        callback(null);
      }

      uninstallSchemas(schemas, options, callback) {
        this._testProbe += 4;
        callback(null);
      }

      getProb() {
        return probe.values.storageBackendProbe;
      }

      getTestProbe() {
        return this._testProbe;
      }
    }

    class ProbeEntityStorageHandler extends EntityStorageHandler {

      /**
      * Construct
      */
      constructor(variables) {
        variables.storageBackend = ProbeStorageBackend;
        super(variables);
      }

      getProb() {
        return probe.values.entityHandlerProbe;
      }
    }

    class ProbeEntity extends Entity {

      static getProb() {
        return probe.values.entityProbe;
      }

      getIntanceProb() {
        return probe.values.entityProbe;
      }

    }

    class ProbeEntityType extends EntityType {
      constructor(variables = {}) {
        variables.entityTypeId = probe.values.entityTypeProbe;
        variables.entityClass = ProbeEntity;

        if (!variables.hasOwnProperty('handlers'))
          variables.handlers = [];

        variables.handlers['storage'] = new ProbeEntityStorageHandler(variables);
        super(variables);
      }
    }

    probe.classes.ProbeEntity = ProbeEntity;
    probe.classes.ProbeEntityType = ProbeEntityType;

    return probe;
  }
}

describe('Storage backend', () => {

  describe('Construction with storage backend', () => {
    it('Should construct with random entity storage probes', (done) => {
      let numProbes = 2;
      let errors = [];

      let probes = [];
      let entityTypes = [];

      for (var i = 0; i < numProbes; i++) {
        let probe = TestUtils.createProbe();
        probes.push(probe);
        entityTypes.push(probe.classes.ProbeEntityType);
      }

      let entityAPI = EntityAPI.getInstance({entityTypes: entityTypes}, true);

      probes.map(probe => {
        // Test direct fetsing of storage handler
        let handler = entityAPI.getStorage(probe.values.entityTypeProbe);

        if (!handler)
          return errors.push(new Error("It didn't return requested handler"));

        if (handler.getProb() != probe.values.entityHandlerProbe)
          return errors.push(new Error("Entity handler probe check failed"));

        if (handler.getEntityTypeId() != probe.values.entityTypeProbe)
          return errors.push(new Error("Entity handler id check failed"));

        let entity = handler.getEntityBaseClass();

        if (!entity)
          return errors.push(new Error("It didn't return entity class"));

        if (entity.getProb() != probe.values.entityProbe)
          return errors.push(new Error("Entitys's probe check failed"));

        let storageBackend = handler.getStorageBackend();
        if (storageBackend.getProb() != probe.values.storageBackendProbe)
          return errors.push(new Error("Storage backend probe check failed"));

      });

      if (errors.length > 0)
        return done(errors[0]);

      done();
    })
  });

  describe('Install, update and delete manoeuvre', () => {
    it('It should perform manoueuvres for storage backends', (done) => {
      let numProbes = 10;
      let errors = [];

      let probes = [];
      let entityTypes = [];

      for (var i = 0; i < numProbes; i++) {
        let probe = TestUtils.createProbe();
        probes.push(probe);
        entityTypes.push(probe.classes.ProbeEntityType);
      }

      let entityAPI = EntityAPI.getInstance({entityTypes: entityTypes}, true);

      entityAPI.install({ version: "1.0" })
      .then(result => {
        return entityAPI.update()
      })
      .then(result => {
        return entityAPI.uninstall()
      })
      .then(result => {
        // Make sure all entity types are included
        probes.map(probe => {
          let probeValue = entityAPI.getStorage(probe.values.entityTypeProbe)
                                    .getStorageBackend().getTestProbe();
          if (probeValue != 7)
            errors.push(`Storage prove value check failed: ${probeValue}`)
        });
        if (errors.length > 0)
          done(errors[0])
        else
          done();
      })
      .catch(err => {
        done(err);
      })
    })
  });
});