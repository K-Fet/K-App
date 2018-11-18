const BaseValidator = require('moleculer').Validator;
const { ValidationError } = require('moleculer').Errors;

class JoiValidator extends BaseValidator {
  constructor() {
    super();
    // eslint-disable-next-line global-require
    this.validator = require('joi');
  }

  compile(schema) {
    return params => this.validate(params, schema);
  }

  validate(params, schema) {
    const { error } = this.validator.validate(params, schema);
    if (error) throw new ValidationError(error.message, null, error.details);

    return true;
  }
}

module.exports = JoiValidator;
