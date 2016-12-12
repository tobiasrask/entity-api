import assert from "assert"
import { EntityAPI, EntityType,
         EntityHandler, Entity } from "./../../src/index"
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
        entityProbe: 'entityProb:' + TestUtils.getUUID()
      },
      // Probe classes
      classes: {}
    }

    class ProbeEntityHandler extends EntityHandler {
      getProb() {
        return probe.values.entityHandlerProbe;
      }
    }

    class ProbeEntity extends Entity {
      static getProb() {
        return probe.values.entityProbe;
      }
    }

    class ProbeEntityType extends EntityType {
      constructor(variables = {}) {
        // Define our entity type
        variables.entityTypeId = probe.values.entityTypeProbe;
        variables.entityClass = ProbeEntity;
        super(variables);
        // Register handlers
        this.registerHandler(probe.values.entityHandlerProbe,
          new ProbeEntityHandler(variables));
      }
    }

    probe.classes.ProbeEntityHandler = ProbeEntityHandler;
    probe.classes.ProbeEntity = ProbeEntity;
    probe.classes.ProbeEntityType = ProbeEntityType;

    return probe;
  }
}

describe('Entity API', () => {

  describe('API Construction', () => {
    it('It should construct without errors', (done) => {
      let entityAPI = EntityAPI.getInstance({}, true);

      if (entityAPI.getEntityTypeIds().length > 0) {
        return done(new Error("It didn't return empty list of entity types"));
      }
      if (entityAPI.getEntityTypeHandler('probe:random', 'probe:random') != null) {
        return done(new Error("It didn't return empty entity handler"));
      }
      done();
    })
  });

  describe('Construction with entity types', () => {
    it('Shoud construct with random entity type probes', (done) => {
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
      // let entityAPI = new EntityAPI({entityTypes: entityTypes});

      let entityTypeIds = entityAPI.getEntityTypeIds();
      if (entityTypeIds.length != probes.length) {
        return done(new Error("It didn't construct with all probes"));
      }

      entityTypeIds.map((entityTypeName, index) => {
        if (entityTypeName != probes[index].values.entityTypeProbe)
          errors.push(new Error("Constructed probe check failed"));
      });

      if (errors.length > 0)
        return done(errors[0]);

      // Test entity type getter
      probes.map(probe => {
        let entityType = entityAPI.getEntityType(probe.values.entityTypeProbe);

        if (!entityType)
          return errors.push(new Error("It didn't return requested entity type"));

        if (entityType.getEntityTypeId() != probe.values.entityTypeProbe)
          return errors.push(new Error("Entity type id check failed"));

        let handler = entityType.getHandler(probe.values.entityHandlerProbe);

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
          return errors.push(new Error("Entity's probe check failed"));
      });

      if (errors.length > 0)
        return done(errors[0]);

      done();
    })
  });

});
