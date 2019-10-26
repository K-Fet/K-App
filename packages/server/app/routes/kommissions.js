const router = require('express').Router();
const guard = require('express-jwt-permissions')();
const validator = require('express-joi-validation').createValidator({ passError: true });
const am = require('../../utils/async-middleware');
const { ID_SCHEMA } = require('../../utils');
const { KommissionSchema } = require('../models/schemas');
const kommissionController = require('../controllers/kommission-controller');

router.get(
  '/',
  guard.check('kommission:read'),
  am(kommissionController.getAllKommissions),
);

router.post(
  '/',
  guard.check('kommission:write'),
  validator.body(KommissionSchema.requiredKeys('name', 'description')),
  am(kommissionController.createKommission),
);

router.get(
  '/:id',
  guard.check('kommission:read'),
  validator.params(ID_SCHEMA),
  am(kommissionController.getKommissionById),
);

router.put(
  '/:id',
  guard.check('kommission:write'),
  validator.params(ID_SCHEMA),
  validator.body(KommissionSchema.min(1)),
  am(kommissionController.updateKommission),
);

router.post(
  '/:id/delete',
  guard.check('kommission:write'),
  validator.params(ID_SCHEMA),
  am(kommissionController.deleteKommission),
);

router.get(
  '/:id/tasks',
  guard.check('task:read'),
  validator.params(ID_SCHEMA),
  am(kommissionController.getTasks),
);

module.exports = router;
