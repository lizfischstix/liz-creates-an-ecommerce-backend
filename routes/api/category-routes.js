const router = require('express').Router();
const { Category, Product } = require('../../models');

// The `/api/categories` endpoint
// find all categories
  // be sure to include its associated Products
router.get('/', async (req, res) => {
  try {
    const categories = await Category.findAll({
      include: [{ model: Product }]
    });
    res.status(200).json(categories);
  } catch (err) {
    res.status(500).json(categories);
  }
});

 // find one category by its `id` value
  // be sure to include its associated Products
// router.get('/:id', async (req, res) => {
//   try {
//     const allCategories = await Category.findByPk({
//       include: [{ model: Product.belongsTo(Category)}]
//     });
//     res.status(200).json(allCategories);
//   } catch (err) {
//     res.status(200).json(allCategories);
//   }
// });

router.post('/', (req, res) => {
  // create a new category
});

router.put('/:id', (req, res) => {
  // update a category by its `id` value
});

router.delete('/:id', (req, res) => {
  // delete a category by its `id` value
});

module.exports = router;
