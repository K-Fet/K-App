const mongoose = require('mongoose');
const Joi = require('joi');
const { Errors } = require('moleculer');
const JoiDbActionsMixin = require('../../mixins/joi-db-actions.mixin');
const DbMixin = require('../../mixins/db-service.mixin');
const { MONGO_ID } = require('../../../utils');

const { MoleculerClientError } = Errors;


const model = {
  mongoose: mongoose.model('Providers', mongoose.Schema({
    name: {
      type: String, required: true, min: 3, text: true,
    },
    link: { type: String, text: true },
  }, { timestamps: true })),
  joi: Joi.object({
    _id: MONGO_ID.strip(), // Remove _id from the object
    name: Joi.string().min(3).required(),
    link: Joi.string().uri().allow(null),
  }),
};

module.exports = {
  name: 'inventory-management.providers',
  mixins: [
    JoiDbActionsMixin(model.joi),
    DbMixin(model.mongoose),
  ],

  settings: {
    rest: '/providers',
  },

  actions: {
    remove: {
      async handler(ctx) {
        const { id } = ctx.params;
        const products = await ctx.call('inventory-management.products.find');
        if (products) {
          const productsProviders = products.map(product => product.provider.toString());
          if (productsProviders.indexOf(id) > -1) {
            return Promise.reject(new MoleculerClientError('Entity cannot be removed', 400, null, {
              id, details: 'Some products are link to this provider, it can only be archived',
            }));
          }
        }

        const doc = await this.adapter.removeById(id);

        const json = await this.transformDocuments(ctx, ctx.params, doc);
        this.entityChanged('removed', json, ctx);

        return json;
      },
    },
  },
};
