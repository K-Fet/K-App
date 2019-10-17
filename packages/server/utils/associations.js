const { createUserError } = require('./errors');

/**
 * Add and remove associations from an object.
 *
 * @param key {String} Association key, all in lowercase.
 * @param value {Object} Association value.
 * @param value.add {Array<number>} Array containing every id to add to the instance.
 * @param value.remove {Array<number>} Array containing every id to remove to the instance.
 * @param instance {Model} Sequelize model with the good associations.
 * @param transaction Sequelize transaction.
 * @param preventRemove {Boolean} When true, throw an error if the user try to remove an association.
 * @returns {Promise<void>}
 */
async function setEmbeddedAssociations(key, { add, remove }, instance, transaction, preventRemove = false) {
  const upperKey = key.charAt(0).toUpperCase() + key.slice(1);

  if (add && add.length > 0) {
    try {
      await instance[`add${upperKey}`](add, { transaction });
    } catch (err) {
      await transaction.rollback();
      throw createUserError(
        `Unknown${upperKey}`,
        `Unable to associate ${instance.name} with provided ${upperKey}`,
      );
    }
  }

  if (remove && remove.length > 0) {
    if (preventRemove) {
      throw createUserError(
        'RemovedValueProhibited',
        `When creating a ${instance.name}, impossible to add removed value`,
      );
    }

    try {
      await instance[`remove${upperKey}`](remove, { transaction });
    } catch (err) {
      await transaction.rollback();
      throw createUserError(
        `Unknown${upperKey}`,
        `Unable to associate ${instance.name} with provided ${upperKey}`,
      );
    }
  }
}

/**
 * Handle associations for an object.
 *
 * Can detect OneToOne or ManyToOne associations.
 *
 * @param embedded {Object} An _embedded object
 * @param instance {Model} Sequelize model with the good associations.
 * @param associationObj {Object.<string, Object>} A mapping of the existing relations of a model
 *                                                 (only needed for oneToOne associations)
 * @param transaction Sequelize transaction.
 * @param preventRemove {Boolean} When true, throw an error if the user try to remove an association.
 * @returns {Promise<void>}
 */
async function setAssociations(embedded, instance, associationObj, transaction, preventRemove = false) {
  if (!embedded) return;

  /* eslint-disable no-await-in-loop */
  // eslint-disable-next-line no-restricted-syntax
  for (const key of Object.keys(embedded)) {
    const value = embedded[key];

    const upperKey = key.charAt(0).toUpperCase() + key.slice(1);

    if (typeof instance[`remove${upperKey}`] === 'function') {
      // One-to-Many or Many-to-Many relation
      await setEmbeddedAssociations(key, value, instance, transaction, preventRemove);
    } else {
      // One-to-One relation
      const classObj = associationObj[key];

      const wantedRelation = await classObj.findByPk(value);

      if (!wantedRelation) {
        await transaction.rollback();
        throw createUserError(`Unknown${classObj.constructor.name}`, `Unable to find ${key} with id ${value}`);
      }

      await instance[`set${upperKey}`](wantedRelation, { transaction });
    }
  }
  /* eslint-enable no-await-in-loop */
}

module.exports = {
  setAssociations,
};
