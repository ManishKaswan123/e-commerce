const express = require("express");
const { getAllProducts, createProduct, updateProduct, deleteProduct, getProductDetails } = require("../controllers/productController");
const { isAuth, authorizeRoles } = require("../middleware/auth");

const router = express.Router();

router
    .route("/products").get(getAllProducts);

router
    .route("/admin/product/new")
    .post(isAuth, authorizeRoles("admin"), createProduct);

router
    .route("/admin/product/:id")
    .put(isAuth, authorizeRoles("admin"), updateProduct)
    .delete(isAuth, authorizeRoles("admin"), deleteProduct);

router
    .route("/product/:id")
    .get(getProductDetails);

module.exports = router;