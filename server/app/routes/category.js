const router = require('express').Router();
const guard = require('express-jwt-permissions')();
const am = require('../../utils/async-middleware');
const categoryController = require('../controllers/category-controller');

router.get('/', am(categoryController.getAll));
router.get('/:id(\\d+)', am(categoryController.getCategoryById));

// Add API specific middleware
router.use(require('../middlewares/auth-guard'));

router.post('/', guard.check('category:write'), am(categoryController.createCategory));
router.put('/:id(\\d+)', guard.check('category:write'), am(categoryController.updateCategory));
router.post('/:id(\\d+)/delete', guard.check('category:write'), am(categoryController.deleteCategory));

module.exports = router;
