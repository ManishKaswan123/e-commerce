const express = require("express");
const { registerUser, loginUser, logout, forgotPassword, resetPassword, getUserDetails, updatePassword, updateProfile, getAllUser, getUserInfo, updateUserRole, deleteUser } = require('../controllers/userController');
const { isAuth, authorizeRoles } = require("../middleware/auth");

const router = express.Router();

router
    .route("/register")
    .post(registerUser);

router
    .route("/login")
    .post(loginUser);

router
    .route("/password/forgot")
    .post(forgotPassword);

router
    .route("/password/reset/:token")
    .put(resetPassword);

router
    .route("/logout")
    .get(logout);

router
    .route("/me")
    .get(isAuth, getUserDetails);

router
    .route("/password/update")
    .put(isAuth, updatePassword);

router
    .route("/me/update")
    .put(isAuth, updateProfile);

router
    .route("/admin/users")
    .get(isAuth, authorizeRoles("admin"), getAllUser);

router
    .route("/admin/user/:id")
    .get(isAuth, authorizeRoles("admin"), getUserInfo)
    .put(isAuth, authorizeRoles("admin"), updateUserRole)
    .delete(isAuth, authorizeRoles("admin"), deleteUser);

module.exports = router;