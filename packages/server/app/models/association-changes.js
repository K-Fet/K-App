const Joi = require('@hapi/joi');

const AssociationChangesSchema = Joi.object({
  add: Joi.array().items(Joi.number().integer()),
  remove: Joi.array().items(Joi.number().integer()),
});


module.exports = {
  AssociationChangesSchema,
};
