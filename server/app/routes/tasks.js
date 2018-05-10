const router = require('express').Router();
const guard = require('express-jwt-permissions')();
const am = require('../../utils/async-middleware');
const taskController = require('../controllers/task-controller');

router.post('/', guard.check('task:write'), am(taskController.createTask));
router.get('/:id(\\d+)', guard.check('task:read'), am(taskController.getTaskById));
router.put('/:id(\\d+)', guard.check('task:write'), am(taskController.updateTask));
router.post('/:id(\\d+)/delete', guard.check('task:write'), am(taskController.deleteTask));

module.exports = router;
