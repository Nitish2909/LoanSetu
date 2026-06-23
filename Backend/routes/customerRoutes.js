const router = require('express').Router();
const { body, query, param } = require('express-validator');
const auth = require('../middleware/auth');
const {checkValidation} = require('../middleware/validation');

const customerController = require('../controllers/customerController');



router.post(
  '/',
  [
    body('loanType').notEmpty(),
    body('name')
      .isLength({ min: 3, max: 60 })
      .matches(/^[A-Za-z\s.]+$/),
    body('email').isEmail(),
    body('phone').matches(/^[6-9]\d{9}$/),
    body('pan').matches(/^[A-Z]{5}[0-9]{4}[A-Z]$/i),
    body('dob').isISO8601(),
    body('amount').isFloat({ min: 10000 }),
    body('income').isFloat({ min: 5000 }),
    body('city').isLength({ min: 2, max: 60 }),
  ],
  checkValidation,
  customerController.createCustomer
);

router.get(
  '/',
  auth,
  [
    query('name').optional().isString(),
    query('date').optional().isISO8601(),
    query('status')
      .optional()
      .isIn(['Pending', 'Approved', 'Rejected']),
  ],
  checkValidation,
  customerController.getCustomers
);

router.get(
  '/:id',
  auth,
  [
  param('id').isMongoId().withMessage('Invalid id'),
],
  checkValidation,
  customerController.getCustomer
);

router.put(
  '/:id',
  auth,
  [
    param('id').isMongoId().withMessage('Invalid id'),
  ],
  checkValidation,
  customerController.updateCustomer
);

router.delete(
  '/:id',
  auth,
   [
    param('id').isMongoId().withMessage('Invalid id'),
  ],
  checkValidation,
  customerController.deleteCustomer
);

module.exports = router;