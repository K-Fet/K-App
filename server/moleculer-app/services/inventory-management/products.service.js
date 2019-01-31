const mongoose = require('mongoose');
const Joi = require('joi');
const { Errors } = require('moleculer');
const JoiDbActionsMixin = require('../../mixins/joi-db-actions.mixin');
const DbMixin = require('../../mixins/db-service.mixin');
const { BASE_UNIT } = require('../../constants');
const { MONGO_ID, UNIT_SCHEMA } = require('../../../utils');

const { MoleculerClientError } = Errors;
const { ObjectId } = mongoose.Types;

const model = {
  mongoose: mongoose.model('Products', mongoose.Schema({
    name: {
      type: String, required: true, min: 3, text: true,
    },
    image: { type: String },
    used: { type: Boolean, default: false },
    conversions: [new mongoose.Schema({
      displayName: { type: String },
      preferred: { type: Boolean, default: false },
      unit: {
        type: String, minlength: 1, maxlength: 3, required: true,
      },
      coef: { type: Number, required: true },
    })],
    provider: { type: ObjectId, require: true, index: true },
    shelf: { type: ObjectId, index: true },
  })),
  joi: Joi.object({
    _id: MONGO_ID.strip(), // Remove _id from the object
    name: Joi.string().min(3).required(),
    image: Joi.string().uri(),
    conversions: Joi.array().unique('unit').items(Joi.object({
      displayName: Joi.string(),
      preferred: Joi.bool(),
      unit: UNIT_SCHEMA.invalid(BASE_UNIT),
      coef: Joi.number().required(),
    })),
    provider: MONGO_ID.required(),
    shelf: MONGO_ID,
  }),
};

module.exports = {
  name: 'inventory-management.products',
  mixins: [
    JoiDbActionsMixin(model.joi),
    DbMixin(model.mongoose),
  ],

  settings: {
    populates: {
      provider: 'inventory-management.providers.get',
      shelf: 'inventory-management.shelves.get',
    },
  },

  events: {
    // eslint-disable-next-line object-shorthand
    'inventory-management.stock-events.added'(insertedEvents) {
      const idsToSetUsed = insertedEvents.map(e => ObjectId(e.product));
      this.logger.debug(`Updating ${insertedEvents.length} products to be set as used`);
      return this.adapter.updateMany({ _id: { $in: idsToSetUsed } }, { $set: { used: true } });
    },
  },

  actions: {
    update: {
      async handler(ctx) {
        const { id } = ctx.params;

        const product = await this.getById(id, true);
        if (!product) return Promise.reject(new MoleculerClientError('Entity not found', 404, null, { id }));
        if (!this.isProductAllowedToUpdate(product, ctx.params)) {
          return Promise.reject(new MoleculerClientError('Entity cannot be updated', 400, null, {
            id, details: 'Some updated fields cannot be changed as it will cause inconsistency',
          }));
        }
        const doc = await this.adapter.updateById(id, { $set: ctx.params });

        const json = await this.transformDocuments(ctx, ctx.params, doc);
        this.entityChanged('updated', json, ctx);

        return json;
      },
    },
    remove: {
      async handler(ctx) {
        const { id } = ctx.params;

        const product = await this.getById(id, true);
        if (!product) return Promise.reject(new MoleculerClientError('Entity not found', 404, null, { id }));
        if (product.used) {
          return Promise.reject(new MoleculerClientError('Entity cannot be removed', 400, null, {
            id, details: 'This product has already received events/orders, it can only be archived',
          }));
        }
        const doc = await this.adapter.removeById(id);

        const json = await this.transformDocuments(ctx, ctx.params, doc);
        this.entityChanged('removed', json, ctx);

        return json;
      },
    },
  },

  methods: {
    /**
     * This function checks if a product can be updated.
     * This is to prevent data inconsistency in stock events.
     *
     * Only a few fields prevent changes.
     *
     * @param before
     * @param after
     * @return {boolean}
     */
    isProductAllowedToUpdate(before, after) {
      if (!before.used) return true;

      const bConv = this.mapConversions(before.conversions);
      const aConv = this.mapConversions(after.conversions);

      return before.provider === after.provider
        // Check if every conversions from before still exists and did not change coef
        && Object.entries(bConv).every(([key, value]) => aConv[key] && aConv[key].coef === value.coef);
    },

    /**
     * Map an array of conversions to an object with unit as key.
     * @param conversions
     * @return {*}
     */
    mapConversions(conversions) {
      if (!Array.isArray(conversions)) return {};
      return conversions.reduce((acc, curr) => ({ ...acc, [curr.unit]: curr }), {});
    },
  },
};
