const mongoose = require('mongoose');
const Joi = require('joi');
const { Errors } = require('moleculer');
const JoiDbActionsMixin = require('../../mixins/joi-db-actions.mixin');
const DbMixin = require('../../mixins/db-service.mixin');
const { MONGO_ID, groupBy } = require('../../../utils');

const { MoleculerClientError } = Errors;


const model = {
  mongoose: mongoose.model('Shelves', mongoose.Schema({
    name: {
      type: String, required: true, min: 3, text: true,
    },
  })),
  joi: Joi.object({
    _id: MONGO_ID.strip(), // Remove _id from the object
    name: Joi.string().min(3).required(),
  }, { timestamps: true }),
};

module.exports = {
  name: 'inventory-management.shelves',
  mixins: [
    JoiDbActionsMixin(model.joi),
    DbMixin(model.mongoose),
  ],

  settings: {
    rest: '/shelves',
    populates: {
      async products(ids, docs, rule, ctx) {
        // Get all corresponding products
        const { rows: products } = await ctx.call('inventory-management.products.list', {
          pageSize: 1000, query: { shelf: { $in: docs.map(d => d._id) } },
        });

        const productMap = groupBy(products, p => p.shelf.toString());

        // Assign product to each shelf accordingly
        // eslint-disable-next-line no-param-reassign,no-return-assign
        docs.forEach(doc => doc.products = productMap.get(doc._id));
      },
    },
  },
  actions: {
    remove: {
      async handler(ctx) {
        const { id } = ctx.params;
        const products = await ctx.call('inventory-management.products.find');
        if (products) {
          const productsShelf = products.map(product => product.shelf.toString());
          if (productsShelf.indexOf(id) > -1) {
            return Promise.reject(new MoleculerClientError('Entity cannot be removed', 400, null, {
              id, details: 'Some products are link to this Shelf, it can only be archived',
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
