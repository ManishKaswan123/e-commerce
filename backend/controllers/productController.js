const Product = require("../models/productModel");
const ErrorHandler = require("../utils/errorhandler");
// const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const ApiFeature = require("../utils/apifeatures");

// Create Product--Admin Route
const createProduct = catchAsyncErrors(async (req, res, next) => {

    req.body.user = req.user.id;

    const product = await Product.create(req.body);

    res.status(201).json({
        success: true,
        product
    })
});

// Get all products
const getAllProducts = catchAsyncErrors(async (req, res) => {

    const resultPerPage = 5;
    const productCount = await Product.countDocuments();
    const apiFeature = new ApiFeature(Product.find(), req.query)
        .search()
        .filter()
        .pagination(resultPerPage);
    const products = await apiFeature.query;

    res.status(201).json({
        success: true,
        products,
        productCount
    })
});

// Update Products -- Admin Route
const updateProduct = catchAsyncErrors(async (req, res, next) => {

    let product = await Product.findById(req.params.id);

    if (!product)
        return next(new ErrorHandler("Product not found", 404));

    product = await Product.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true,
        useFindAndModify: false
    })

    res.status(200).json({
        success: true,
        product
    })


});

// Delete Product
const deleteProduct = catchAsyncErrors(async (req, res, next) => {

    const product = await Product.findById(req.params.id);

    if (!product)
        return next(new ErrorHandler("Product not found", 404));

    await product.remove();

    res.status(200).json({

        success: true,
        message: "Product Deleted Successfully"

    })
});

// Get Product Details
const getProductDetails = catchAsyncErrors(async (req, res, next) => {

    const product = await Product.findById(req.params.id);

    if (!product)
        return next(new ErrorHandler("Product not found", 404));

    res.status(200).json({

        success: true,
        product

    })
});

// Create New Review or Update review
const createProductReview = catchAsyncErrors(async (req, res, next) => {

    const { rating, comment, productId } = req.body;

    const review = {

        user: req.user._id,
        name: req.user.name,
        rating: Number(rating),
        comment

    };

    const product = await Product.findById(productId);

    const isReviewes = product.reviews.find(
        (rev) => rev.user.toString() === req.user._id.toString()
    );

    if (isReviewes) {
        product.reviews.forEach(rev => {
            if (rev.user.toString() === req.user._id.toString()) {
                rev.rating = rating,
                rev.comment = comment
            }
        });
    }
    else {
        product.reviews.push(review);
        product.numOfReviews = product.reviews.length;
    }

    let avg = 0;

    product.reviews.forEach(rev => {
        avg += rev.rating;
    });

    product.ratings = avg / product.numOfReviews;

    await product.save({ validateBeforeSave: false });

    res.status(200).json({
        success: true
    });
});

// Get all Review of a Product
const getProductReviews = catchAsyncErrors(async (req, res, next) => {

    const product = await Product.findById(req.query.id);

    if (!product)
        return next(new ErrorHandler("Product not Found", 404));

    res.status(200).json({
        success: true,
        reviews: product.reviews
    });
});

// Delete Review
const deleteReviews = catchAsyncErrors(async (req, res, next) => {

    const product = await Product.findById(req.query.productId);

    if (!product)
        return next(new ErrorHandler("Product not Found", 404));

    const reviews = await product.reviews.filter((rev) =>
        rev._id.toString() !== req.query.id.toString()
    );

    let avg = 0;

    reviews.forEach((rev) =>
        avg += rev.rating
    );

    const ratings = avg / reviews.length;

    const numOfReviews = reviews.length;

    await Product.findByIdAndUpdate(req.query.productId, {
        reviews,
        ratings,
        numOfReviews
    },
        {
            new: true,
            runValidators: true,
            useFindAndModify: false
        }
    );

    res.status(200).json({
        success: true
    });
});

module.exports = { getAllProducts, createProduct, updateProduct, deleteProduct, getProductDetails, createProductReview, getProductReviews, deleteReviews };