const ErrorHandler = require("../utils/errorhandler");
const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const User = require("../models/userModel");
const sendToken = require("../utils/jwsToken");
const sendEmail = require("../utils/sendEmail");
const crypto = require("crypto");

// Register a User
const registerUser = catchAsyncErrors(async (req, res, next) => {

    const { name, email, password } = req.body;

    const user = await User.create({
        name,
        email,
        password,
        avatar: {
            public_id: "This is a sample id",
            url: "profilepricUrl"
        }
    });

    sendToken(user, 201, res);

});

// Login the User
const loginUser = catchAsyncErrors(async (req, res, next) => {

    const { email, password } = req.body;

    // Checking if user has given password and email both

    if (!email || !password) {
        return next(new ErrorHandler("Please Enter Email and Password", 400));
    }

    const user = await User.findOne({ email }).select("+password");

    if (!user) {
        return next(new ErrorHandler("Invalid email or Password", 401));
    }

    const isPasswordMatched = user.comparePassword(password);

    if (!isPasswordMatched) {
        return next(new ErrorHandler("Invalid email or password", 401));
    }

    sendToken(user, 200, res);

});

// Logout User
const logout = catchAsyncErrors(async (req, res, next) => {

    res.cookie("token", null, { expires: new Date(Date.now()), httpOnly: true });
    res.status(200).json({

        success: true,
        message: "Logged Out"

    })
});

//Forgot Password
const forgotPassword = catchAsyncErrors(async (req, res, next) => {

    const user = await User.findOne({ email: req.body.email });

    if (!user)
        return next(new ErrorHandler("User not found yet", 404));

    // Get ResetPassword Token
    const resetToken = user.getResetPasswordToken();

    await user.save({ validateBeforeSave: false });

    const resetpasswordUrl = `${req.protocol}://${req.get("host")}/api/v1/password/reset/${resetToken}`;

    const message = `Your password reset token is :- \n\n ${resetpasswordUrl} \n\nIf you have not requested this email then, please ignore it`;

    try {

        await sendEmail({

            email: user.email,
            subject: `Ecommerce Password Recovery`,
            message

        });

        res.status(200).json({
            success: true,
            message: `Email send to ${user.email} successfully`
        });

    } catch (error) {

        user.resetPasswordToken = undefined;
        user.resetPasswordExpire = undefined;

        await user.save({ validateBeforeSave: false });

        return next(new ErrorHandler(error.message, 500));
    }

});

// Reset Password
const resetPassword = catchAsyncErrors(async (req, res, next) => {

    // Creating token hash
    const resetPasswordToken = crypto
        .createHash("sha256")
        .update(req.params.token)
        .digest("hex");

    const user = await User.findOne({
        resetPasswordToken,
        resetPasswordExpire: { $gt: Date.now() }
    });

    if (!user)
        return next(new ErrorHandler("Reset Password Token is invalid or has been expired", 404));

    if (req.body.password !== req.body.confirmPassword)
        return next(new ErrorHandler("Password does not match", 400));

    user.password = req.body.password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save();

    sendToken(user, 200, res);

});

// Get User Details
const getUserDetails = catchAsyncErrors(async (req, res, next) => {

    const user = await User.findById(req.user.id);
    res.status(200).json({
        success: true,
        user
    });
});

// Update User Password
const updatePassword = catchAsyncErrors(async (req, res, next) => {

    const user = await User.findById(req.user.id).select("+password");

    const isPasswordMatched = await user.comparePassword(req.body.oldPassword);

    if (!isPasswordMatched)
        return next(new ErrorHandler("Old password is incorrect", 400));

    if (req.body.newPassword !== req.body.confirmPassword)
        return next(new ErrorHandler("password dose not match", 400));

    user.password = req.body.newPassword;

    await user.save;

    sendToken(user, 200, res);

});

// Update User Profile
const updateProfile = catchAsyncErrors(async (req, res, next) => {

    const newUserData = {
        name: req.body.name,
        email: req.body.email
    };

    // We will add cloudiary later

    const user = await User.findByIdAndUpdate(req.user.id, newUserData, {
        new: true,
        runValidators: true,
        useFindAndModify: false
    });

    res.status(200).json({
        success: true
    });
});

// Get all Users (Admin):- How many users are registered
const getAllUser = catchAsyncErrors(async (req, res, next) => {

    const users = await User.find();

    res.status(200).json({
        success: true,
        users
    });

});

// Get single user Info (Admin):- If admin want Info about User
const getUserInfo = catchAsyncErrors(async (req, res, next) => {

    const user = await User.findById(req.params.id);

    if (!user)
        return next(new ErrorHandler(`User does not exist with ID: ${req.params.id}`));

    res.status(200).json({
        success: true,
        user
    });
});

// Update User Role (Admin)
const updateUserRole = catchAsyncErrors(async (req, res, next) => {

    const newUserData = {
        name: req.body.name,
        email: req.body.email,
        role: req.body.role
    };

    const user = await User.findByIdAndUpdate(req.params.id, newUserData, {
        new: true,
        runValidators: true,
        useFindAndModify: false
    });

    res.status(200).json({
        success: true
    });
});

// Delete User -- Admin
const deleteUser = catchAsyncErrors(async (req, res, next) => {

    const user = await User.findById(req.params.id);

    // We will remove cloudinary later

    if (!user)
        return next(new ErrorHandler(`user does not exist with id: ${req.params.id}`));

    await user.remove();

    res.status(200).json({
        success: true,
        message: "user deleted successfully"
    });

});

module.exports = { registerUser, loginUser, logout, forgotPassword, resetPassword, getUserDetails, updatePassword, updateProfile, getAllUser, getUserInfo, updateUserRole, deleteUser };