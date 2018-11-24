const Joi = require('joi');
const BaseValidator = require('moleculer').Validator;
const { ValidationError } = require('moleculer').Errors;

class JoiValidator extends BaseValidator {
  compile(schema) {
    if (schema.isJoi) {
      return params => this.validate(params, schema);
    }
    return this.validator.compile(schema);
  }

  // eslint-disable-next-line class-methods-use-this
  validate(params, schema) {
    const { error } = Joi.validate(params, schema);
    if (error) throw new ValidationError(error.message, null, error.details);

    return true;
  }
}

module.exports = JoiValidator;
