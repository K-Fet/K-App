const router = require('express').Router();
const validator = require('express-joi-validation').createValidator({ passError: true });
const guard = require('express-jwt-permissions')();
const { TaskSchema } = require('../models/schemas');
const am = require('../../utils/async-middleware');
const taskController = require('../controllers/task-controller');
const { ID_SCHEMA } = require('../../utils');

router.post(
  '/',
  guard.check('task:write'),
  validator.body(TaskSchema.requiredKeys('name', 'deadline', 'state', '_embedded', '_embedded.kommissionId')),
  am(taskController.createTask),
);

router.get(
  '/:id',
  guard.check('task:read'),
  validator.params(ID_SCHEMA),
  am(taskController.getTaskById),
);

router.put(
  '/:id',
  guard.check('task:write'),
  validator.params(ID_SCHEMA),
  validator.body(TaskSchema.min(1).forbiddenKeys('_embedded.kommissionId')),
  am(taskController.updateTask),
);

router.post(
  '/:id/delete',
  guard.check('task:write'),
  validator.params(ID_SCHEMA),
  am(taskController.deleteTask),
);

module.exports = router;
