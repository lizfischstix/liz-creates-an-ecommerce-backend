const router = require('express').Router();
const { Product, Category, Tag, ProductTag } = require('../../models');

// The `/api/products` endpoint

// get all products

// find all products
// be sure to include its associated Category and Tag data
router.get('/', async (req, res) => {
  try {
    const products = await Product.findAll({
      // include: [{ model: Category }]
    });
    res.status(200).json(products);
  } catch (err) {
    res.status(500).json(err);
  }
});

// get one product
  // find a single product by its `id`
  // be sure to include its associated Category and Tag data
  router.get('/:id', async (req, res) => {
    try {
      const productByID = await Product.findOne({
        where: {
          id: req.params.id,
        },
        // include: [{ model: Product.belongsTo(Category) }]
        // include: [{ model: Product.belongsTo(Category)}]
      });
      res.status(200).json(productByID);
    } catch (err) {
      res.status(500).json(err);
    }
  });


// create new product
  /* req.body should look like this...
    {
      product_name: "Basketball",
      price: 200.00,
      stock: 3,
      tagIds: [1, 2, 3, 4]
    }
  */
    router.post('/', async (req, res) => {

      try {
        const newProduct = await Product.create(req.body)
        res.status(200).json(newProduct);
      } catch(err) {
        res.status(500).json(err);
      }
    });

// update product
router.put('/:id', (req, res) => {
  // update product data
  Product.update(req.body, {
    where: {
      id: req.params.id,
    },
  })
    .then((product) => {
      if (req.body.tagIds && req.body.tagIds.length) {

        ProductTag.findAll({
          where: { product_id: req.params.id }
        }).then((productTags) => {
          // create filtered list of new tag_ids
          const productTagIds = productTags.map(({ tag_id }) => tag_id);
          const newProductTags = req.body.tagIds
            .filter((tag_id) => !productTagIds.includes(tag_id))
            .map((tag_id) => {
              return {
                product_id: req.params.id,
                tag_id,
              };
            });

          // figure out which ones to remove
          const productTagsToRemove = productTags
            .filter(({ tag_id }) => !req.body.tagIds.includes(tag_id))
            .map(({ id }) => id);
          // run both actions
          return Promise.all([
            ProductTag.destroy({ where: { id: productTagsToRemove } }),
            ProductTag.bulkCreate(newProductTags),
          ]);
        });
      }

      return res.json(product);
    })
    .catch((err) => {
      // console.log(err);
      res.status(400).json(err);
    });
});

router.delete('/:id', async (req, res) => {
  // delete a product by its `id` value
  try {
    const deleteProduct = await Product.destroy({
      where: {
        id: req.params.id,
      }
    })
    res.status(200).json(deleteProduct);
  } catch(err) {
    res.status(500).json(err);
  }
});


module.exports = router;
