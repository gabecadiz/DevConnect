const express = require('express');
const router = express.Router();
const gravatar = require('gravatar');
const bcrypt = require('bcryptjs');
const { check, validationResult } = require('express-validator/check');

const User = require('../../models/User');

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
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const { name, email, password } = req.body;

    try {
      // See if user exists
      let user = await User.findOne({ email });
      if (user) {
        return res.status(400).json({
          errors: [{ msg: 'User already exists' }]
        });
      }
      // Get users gravatar
      const avatar = gravatar.url(email, {
        s: '200',
        r: 'pg',
        d: 'mm'
      });
      //create an instance of a new user
      user = new User({
        name,
        email,
        avatar,
        password
      });
      // Encypt Password
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(password, salt);
      await user.save();
      // Return jsonwebtoken
      res.send('User registered');
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }
  }
);

module.exports = router;
