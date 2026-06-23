const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
dotenv.config();

const signToken = (admin) => {
  return jwt.sign(
    {
      id: admin._id.toString(),
      username: admin.username,
    },
    process.env.JWT_SECRET,
    { expiresIn: '7d' }
  );
};

module.exports = signToken;