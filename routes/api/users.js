const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator/check');

// @route   POST api/users
// @desc    Register user
// @access  Public

//.not() is used because if the field is empty, .isEmpty() will actually return a positive result and no errors would result. .not() is used to 'flip' the value. So if the name field is filled, .not() will turn it to negative, and isEmpty() will check and return that as a positive no errors
//if the field is empty, .not() will turn it to positive, and isEmpty() will see that its "filled" and return a negative/error

router.post(
  '/',
  [
    check('name', 'Name is required')
      .not()
      .isEmpty(),
    check('email', 'Please include a valid email').isEmail(),
    check(
      'password',
      'Please enter a password with 6 or more characters'
    ).isLength({ min: 6 })
  ],
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    // See if user exists
    // Get users gravatar
    // Encypt Password
    // Return jsonwebtoken

    res.send('User Route');
  }
);

module.exports = router;
