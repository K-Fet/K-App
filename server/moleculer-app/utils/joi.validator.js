const Joi = require('joi');
const BaseValidator = require('moleculer').Validator;
const { ValidationError } = require('moleculer').Errors;

class JoiValidator extends BaseValidator {
  compile(schema) {
    // Need to use a function because Joi is not cloneable
    // The workaround might be dirty but should works
    if (typeof schema === 'function') {
      const compiledSchema = Joi.compile(schema());
      return params => this.validate(params, compiledSchema);
    }
    return this.validator.compile(schema);
  }

  // eslint-disable-next-line class-methods-use-this
  validate(params, schema) {
    const { error } = Joi.validate(params, schema);
    if (error) throw new ValidationError(error.message, null, error.details);

    return true;
  }

  /**
   * Register validator as a middleware
   *
   * @memberof ParamValidator
   */
  middleware() {
    return function validatorMiddleware(handler, action) {
      // Wrap a param validator
      if (action.params) {
        const check = this.compile(action.params);
        return function validateContextParams(ctx) {
          const res = check(ctx.params);
          if (res === true) return handler(ctx);
          return Promise.reject(new ValidationError('Parameters validation error!', null, res));
        };
      }
      return handler;
    }.bind(this);
  }
}

module.exports = JoiValidator;
