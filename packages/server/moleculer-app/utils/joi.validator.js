const Joi = require('joi');
const BaseValidator = require('moleculer').Validator;
const { ValidationError } = require('moleculer').Errors;

class JoiValidator extends BaseValidator {
  compile(schema) {
    // Need to use a function because Joi is not cloneable
    // The workaround might be dirty but should works
    if (typeof schema === 'function') {
      const compiledSchema = Joi.compile(schema());
      const checkFn = params => this.validate(params, compiledSchema);
      // Add this identifier to convert parameters
      checkFn.isJoi = true;
      return checkFn;
    }
    return this.validator.compile(schema);
  }

  // eslint-disable-next-line class-methods-use-this
  validate(params, schema) {
    const { error, value } = Joi.validate(params, schema);
    if (error) throw new ValidationError(error.message, null, error.details);

    return value;
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

          // Save new params auto converted by joi
          // If there was an error, it would already have failed
          if (check.isJoi) {
            ctx.params = res;
            return handler(ctx);
          }
          // Error may be thrown by fastest-validator
          return Promise.reject(new ValidationError('Parameters validation error!', null, res));
        };
      }
      return handler;
    }.bind(this);
  }
}

module.exports = JoiValidator;
