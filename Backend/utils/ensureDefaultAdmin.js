const bcrypt = require('bcrypt');
const Admin = require('../models/Admin');

const ensureDefaultAdmin = async () => {
  const username = (
    process.env.ADMIN_USERNAME || 'admin'
  ).toLowerCase();

  const password = process.env.ADMIN_PASSWORD || 'Admin@123';

  const existing = await Admin.findOne({ username });

  if (!existing) {
    const hash = await bcrypt.hash(password, 10);

    await Admin.create({
      username,
      password: hash,
    });

    console.log(`Default admin created: ${username}`);
  }
};

module.exports = ensureDefaultAdmin;