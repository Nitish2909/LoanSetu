const router = require('express').Router();

const { body } = require('express-validator');
const { adminLogin } = require('../controllers/authController');
const { checkValidation } = require('../middleware/validation');

router.post(
  '/login',
  [
    body('username').isString().trim().notEmpty().withMessage('Username is required'),
    body('password').isString().notEmpty().withMessage('Password is required'),
  ],
  checkValidation,
  adminLogin
);

module.exports = router;