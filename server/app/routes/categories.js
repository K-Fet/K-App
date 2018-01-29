const router = require('express').Router();
const am = require('../../utils/async-middleware');
const categoryController = require('../controllers/category-controller');

router.get('/', am(categoryController.getAllCategories));
router.post('/', am(categoryController.createCategory));
router.get('/:id(\\d+)', am(categoryController.getCategoryById));
router.put('/:id(\\d+)', am(categoryController.updateCategory));
router.delete('/:id(\\d+)', am(categoryController.deleteCategory));

module.exports = router;
