const mongoose = require('mongoose');
const Joi = require('@hapi/joi');
const { Errors } = require('moleculer');
const JoiDbActionsMixin = require('../../mixins/joi-db-actions.mixin');
const DbMixin = require('../../mixins/db-service.mixin');
const {
  MONGO_ID, MONGOOSE_INTERNALS, JOI_STRING_OR_STRING_ARRAY, JOI_ID, getCurrentSchoolYear, createSchema,
} = require('../../../utils');

const { MoleculerClientError } = Errors;

const model = {
  mongoose: mongoose.model('Members', createSchema({
    firstName: { type: String, required: true, min: 3 },
    lastName: { type: String, required: true, min: 3 },
    school: { type: String, min: 3 },
    registrations: [new mongoose.Schema({
      year: { type: Number, min: 2017, required: true },
      createdAt: { type: Date, default: Date.now, required: true },
    })],
  }, { timestamps: true }, { textIndex: ['firstName', 'lastName', 'school'] })),
  joi: Joi.object({
    _id: MONGO_ID.strip(), // Remove _id from the object
    ...MONGOOSE_INTERNALS,
    firstName: Joi.string().min(3).required(),
    lastName: Joi.string().min(3).required(),
    school: Joi.string().min(3),
    deletedAt: Joi.strip(), // Deprecated field
    registrations: Joi.array().items(Joi.object({
      _id: MONGO_ID, // Remove _id from the object
      year: Joi.number().integer().greater(2016).required(),
      createdAt: Joi.date(),
    })),
  }),
};

module.exports = {
  name: 'core.members',
  version: 1,
  mixins: [
    JoiDbActionsMixin(model.joi), 'members',
    DbMixin(model.mongoose),
  ],

  settings: {
    rest: 'v1/members/',
  },

  actions: {
    list: {
      params: () => Joi.object({
        active: Joi.bool(),
        inactive: Joi.bool(),
        populate: JOI_STRING_OR_STRING_ARRAY,
        fields: JOI_STRING_OR_STRING_ARRAY,
        page: Joi.number().integer().min(1),
        pageSize: Joi.number().integer().min(0),
        sort: Joi.string(),
        search: Joi.string(),
        searchField: JOI_STRING_OR_STRING_ARRAY,
        // Remove query as it may be a security issue if published
        query: Joi.object().forbidden(),
      }).oxor('active', 'inactive'),
      async handler(ctx) {
        const params = this.sanitizeParams(ctx, ctx.params);

        // Add scoped query
        if (params.active) {
          params.query = { 'registrations.year': getCurrentSchoolYear() };
        }
        if (params.inactive) {
          params.query = { 'registrations.year': { $ne: getCurrentSchoolYear() } };
        }
        return this._list(ctx, params);
      },
    },

    register: {
      rest: 'POST /:id/register',
      permissions: true,
      params: () => Joi.object({
        id: JOI_ID.required(),
        newSchool: Joi.string().min(3),
      }),
      async handler(ctx) {
        const { id, newSchool } = ctx.params;
        const member = await ctx.call('v1.core.members.get', { id });

        const currentRegistration = member.registrations.find(r => r.year === getCurrentSchoolYear());

        if (currentRegistration) {
          throw new MoleculerClientError('Member is already registered for current year', null, null, { id });
        }

        if (newSchool && member.school !== newSchool) member.school = newSchool;

        member.registrations.push({ year: getCurrentSchoolYear() });

        return ctx.call('v1.core.members.update', {
          ...member,
          id,
          // Transform object ids to string for Joi validation
          registrations: member.registrations.map(r => ({ ...r, _id: r._id && r._id.toString() })),
        });
      },
    },
  },
};
