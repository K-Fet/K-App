const mongoose = require('mongoose');
const Joi = require('@hapi/joi');
const { Errors } = require('moleculer');
const JoiDbActionsMixin = require('../../mixins/joi-db-actions.mixin');
const DbMixin = require('../../mixins/db-service.mixin');
const { BASE_UNIT } = require('../../constants');
const { MONGO_ID, UNIT_SCHEMA, JOI_STRING_OR_STRING_ARRAY } = require('../../../utils');

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
  }, { timestamps: true })),
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
  version: 1,
  mixins: [
    JoiDbActionsMixin(model.joi, 'inventory-products'),
    DbMixin(model.mongoose),
  ],

  settings: {
    rest: '/v1/products',
    populates: {
      provider: 'inventory-management.providers.get',
      shelf: 'inventory-management.shelves.get',
    },
  },

  events: {
    // eslint-disable-next-line object-shorthand
    'inventory-management.stock-events.added'(ctx) {
      const idsToSetUsed = ctx.params.map(e => ObjectId(e.product));
      this.logger.debug(`Updating ${idsToSetUsed.length} products to be set as used`);
      return this.adapter.updateMany({ _id: { $in: idsToSetUsed } }, { $set: { used: true } });
    },
  },

  hooks: {
    before: {
      update: (ctx) => {
        const { id } = ctx.params;
        const product = ctx.locals.entity;

        if (!this.isProductAllowedToUpdate(product, ctx.params)) {
          throw new MoleculerClientError('Entity cannot be updated', 400, null, {
            id, details: 'Some updated fields cannot be changed as it will cause inconsistency',
          });
        }
      },
      remove: (ctx) => {
        const { id } = ctx.params;
        const product = ctx.locals.entity;

        if (product.used) {
          throw new MoleculerClientError('Entity cannot be removed', 400, null, {
            id, details: 'This product has already received events/orders, it can only be archived',
          });
        }
      },
    },
  },

  actions: {
    getFromShelf: {
      rest: false,
      permissions: ['inventory-products.read'],
      params: () => Joi.object({
        id: JOI_STRING_OR_STRING_ARRAY.required(),
        populate: JOI_STRING_OR_STRING_ARRAY,
        fields: JOI_STRING_OR_STRING_ARRAY,
      }),
      async handler(ctx) {
        const { id } = ctx.params;

        const shelfIds = Array.isArray(id) ? id : [id];

        return this._find(ctx, { query: { shelf: { $in: shelfIds } } });
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
