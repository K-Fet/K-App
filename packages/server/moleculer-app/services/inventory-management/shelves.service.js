const mongoose = require('mongoose');
const Joi = require('@hapi/joi');
const JoiDbActionsMixin = require('../../mixins/joi-db-actions.mixin');
const DbMixin = require('../../mixins/db-service.mixin');
const { MONGO_ID, groupBy } = require('../../../utils');

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
  version: 1,
  mixins: [
    JoiDbActionsMixin(model.joi, 'inventory-shelves'),
    DbMixin(model.mongoose),
  ],

  settings: {
    rest: '/v1/shelves',
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

  actions: {},
};
