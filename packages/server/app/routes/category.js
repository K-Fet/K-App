const router = require('express').Router();
const validator = require('express-joi-validation').createValidator({ passError: true });
const guard = require('express-jwt-permissions')();
const am = require('../../utils/async-middleware');
const categoryController = require('../controllers/category-controller');
const { authGuard } = require('../middlewares/auth-guard');
const { ID_SCHEMA } = require('../../utils');
const { CategorySchema } = require('../models/schemas');

router.get(
  '/',
  am(categoryController.getAll),
);

router.get(
  '/:id',
  validator.params(ID_SCHEMA),
  am(categoryController.getCategoryById),
);

// AUTHENTICATION NEEDED
router.use(authGuard());

router.post(
  '/',
  guard.check('category:write'),
  validator.body(CategorySchema.requiredKeys('name')),
  am(categoryController.createCategory),
);

router.put(
  '/:id',
  guard.check('category:write'),
  validator.params(ID_SCHEMA),
  validator.body(CategorySchema.min(1)),
  am(categoryController.updateCategory),
);

router.post(
  '/:id/delete',
  guard.check('category:write'),
  validator.params(ID_SCHEMA),
  am(categoryController.deleteCategory),
);

module.exports = router;
