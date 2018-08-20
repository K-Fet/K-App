const Joi = require('joi');
const router = require('express').Router();
const validator = require('express-joi-validation')({ passError: true });
const authController = require('../controllers/auth-controller');
const am = require('../../utils/async-middleware');
const { createUserError } = require('../../utils');

router.post(
  '/login',
  validator.body(Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
    rememberMe: Joi.number().integer().min(1).max(30)
      .default(1),
  })),
  am(authController.login),
);

router.post(
  '/reset-password',
  validator.body(Joi.object({ email: Joi.string().email().required() })),
  am(authController.resetPassword),
);
router.put(
  '/reset-password',
  validator.body(Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string()
      .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.{8,})/)
      .error(createUserError(
        'WeakPassword',
        'Password must be at least 8 characters, with at least 1 uppercase, 1 lowercase and 1 digit',
      ))
      .required(),
    oldPassword: Joi.string(),
    passwordToken: Joi.string(),
  }).xor('oldPassword', 'passwordToken')),
  am(authController.definePassword),
);

router.post(
  '/email-verification',
  validator.body(Joi.object({
    userId: Joi.number().integer().required(),
    email: Joi.string().email().required(),
    password: Joi.string().required(),
    emailToken: Joi.string().required(),
  })),
  am(authController.emailVerify),
);

router.post(
  '/cancel-email-verification',
  validator.body(Joi.object({
    userId: Joi.number().integer().required(),
    email: Joi.string().email().required(),
  })),
  am(authController.cancelEmailVerify),
);

// Add API specific middleware
router.use(require('../middlewares/auth-guard'));

router.get(
  '/logout',
  am(authController.logout),
);

module.exports = router;
