const Joi = require('joi');

const AssociationChangesSchema = Joi.object().keys({
    add: Joi.array().items(Joi.number().integer()),
    remove: Joi.array().items(Joi.number().integer())
});


module.exports = {
    AssociationChangesSchema
};
