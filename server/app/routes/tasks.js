const Joi = require('joi');
const router = require('express').Router();
const validator = require('express-joi-validation')({ passError: true });
const guard = require('express-jwt-permissions')();
const { TaskSchema } = require('../models/schemas');
const am = require('../../utils/async-middleware');
const taskController = require('../controllers/task-controller');

router.post(
  '/',
  guard.check('task:write'),
  validator.body(TaskSchema.requiredKeys('name', 'deadline', 'state', '_embedded', '_embedded.kommissionId')),
  am(taskController.createTask),
);

router.get(
  '/:id',
  guard.check('task:read'),
  validator.params(Joi.object({ id: Joi.number().integer().required() })),
  am(taskController.getTaskById),
);

router.put(
  '/:id',
  guard.check('task:write'),
  validator.params(Joi.object({ id: Joi.number().integer().required() })),
  validator.body(TaskSchema.min(1).forbiddenKeys('_embedded.kommissionId')),
  am(taskController.updateTask),
);

router.post(
  '/:id/delete',
  guard.check('task:write'),
  validator.params(Joi.object({ id: Joi.number().integer().required() })),
  am(taskController.deleteTask),
);

module.exports = router;
