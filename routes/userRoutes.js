const express = require("express");
const router = express.Router();
const multer = require("multer");

const { signUp, signIn } = require("../controllers/userController");

router.post('/sign-up', signUp);
router.post('/sign-in', signIn);

module.exports = router;