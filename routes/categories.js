const { Category } = require("../models/category");
const { Product } = require("../models/product");
const express = require("express");
const router = express.Router();

router.get(`/`, async(req, res) => {
    const categoryList = await Category.find();

    if (!categoryList) {
        res.status(500).json({ success: false });
    }
    res.status(200).send(categoryList);
});

router.get("/:id", async(req, res) => {
    const category = await Category.findById(req.params.id);

    if (!category) {
        res
            .status(500)
            .json({ message: "The Catetogy with given ID waas not found !" });
    }
    res.status(200).send(category);
});

// Create Category
router.post("/", async(req, res) => {
    let category = new Category({
        name: req.body.name,
        icon: req.body.icon,
        color: req.body.color
    });
    category = await category.save();

    if (!category)
        return res.status(400).send("the categoory cannot be created !");

    res.send(category);
});

//Update Category
router.put("/:id", async(req, res) => {
    const category = await Category.findByIdAndUpdate(
        req.params.id, {
            name: req.body.name,
            icon: req.body.icon,
            color: req.body.color
        }, { new: true }
    );
    if (!category)
        return res.status(400).send("the categoory cannot be UPDATE !");

    res.send(category);
});

//DELETE Category
router.delete("/:id", async(req, res) => {
    const products = Product.find({});
    let isSafe = true;
    (await products).forEach((product) => {
        if (product.category._id.toString() === req.params.id) {
            isSafe = false;
            return res.status(400).json({ success: false, message: "Already product with this category!" })
        }
    });
    if (isSafe) {
        Category.findByIdAndRemove(req.params.id)
            .then((category) => {
                if (category) {
                    return res
                        .status(200)
                        .json({ success: true, message: "Delete Category Success" });
                } else {
                    return res
                        .status(404)
                        .json({ success: false, message: "Category not found !" });
                }
            })
            .catch((err) => {
                return res.status(404).json({ success: false, error: err });
            });
    }
});

module.exports = router;